import { expect } from 'chai'
import { generateSelector as selector } from '../../lib/generate-selector'

const url = '/#/viewer/1?center=52,5&zoom=4'

function getParams (url) {
  const params = new URLSearchParams(url.split('?')[1])
  return params
}

describe('Map', () => {
  beforeEach(() => {
    // skip loading of map layers since we can't rely on their loading times
    // and are they not relevant for these tests
    cy.intercept(new RegExp(/GetMap/), '').as('map')

    cy.visit(url)

    cy.get(selector('layerpanel')).should('be.visible')
    cy.wait('@map', { timeout: 4000 })
  })

  it('Zooms out', () => {
    // use specific selector because class is generated by plugin
    cy.get('.leaflet-control-zoom-out').should('be.visible')
    cy.get('.leaflet-control-zoom-out').click()

    cy.location().should(($loc) => {
      const params = getParams($loc.hash)
      expect(params.get('zoom')).to.equal('3')
    })

    cy.get('.leaflet-control-zoom-out').click()

    cy.location().should(($loc) => {
      const params = getParams($loc.hash)
      expect(params.get('zoom')).to.equal('2')
    })
  })

  it('Zooms in', () => {
    // use specific selector because class is generated by plugin
    cy.get('.leaflet-control-zoom-in').should('be.visible')
    cy.get('.leaflet-control-zoom-in').click()

    cy.location().should(($loc) => {
      const params = getParams($loc.hash)
      expect(params.get('zoom')).to.equal('5')
    })

    cy.get('.leaflet-control-zoom-in').click()

    cy.location().should(($loc) => {
      const params = getParams($loc.hash)
      expect(params.get('zoom')).to.equal('6')
    })
  })

  it('Renders legend', () => {
    cy.get(selector('legend')).should('be.visible')
  })

  it('Renders north indicator', () => {
    cy.get('.leaflet-control-map-rose').should('be.visible')
  })

  it('Renders scale indicator', () => {
    cy.visit('/#/viewer/1?center=52,5&zoom=3')
    cy.get(selector('layerpanel')).should('be.visible')
    cy.get('.leaflet-control-scale-line').contains('30 km')

    cy.visit('/#/viewer/1?center=52,5&zoom=7')
    cy.get(selector('layerpanel')).should('be.visible')
    cy.get('.leaflet-control-scale-line').contains('2 km')
  })

  it('Toggles full screen', () => {

    cy.get('.leaflet-control-fill-window').click()

    const windowWidth = Cypress.config().viewportWidth
    const windowHeight = Cypress.config().viewportHeight

    cy.get('.leaflet-container')
      .invoke('outerWidth')
      .should('be.eq', windowWidth)

    cy.get('.leaflet-container')
      .invoke('outerHeight')
      .should('be.eq', windowHeight)
  })

  it('Searches for location', () => {
    cy.get('.leaflet-control-geocoder button').click()
    cy.get('.leaflet-control-geocoder-form input')
      .type('Amsterdam')
      .trigger('keydown', { keyCode: 13 })
      .then(() => {
        cy.get('.leaflet-control-geocoder-alternatives li a')
          .first()
          .click()
      })

    cy.location().should((loc) => {
      const params = getParams(loc.hash)

      const [lat, lng] = params.get('center').split(',')

      expect(parseFloat(lat, 10)).to.be.within(52, 53)
      expect(parseFloat(lng, 10)).to.be.within(4, 5)
    })
  })

  it('Can change base layer of map', () => {
    cy.viewport(800, 1000)
    // turn off layer so background is visible
    cy.get(selector('layer-control')).click()

    cy.get('.leaflet-control-layers-toggle').click()
    cy.get('.leaflet-control-layers-list input').each($input => {
      cy.wrap($input).click()
      $input[0].checked = true
      const name = $input.parent().find('span').text()

      cy.wait(2000).then(() => {
        cy.screenshot(name)
      })
    })
  })

  it('Retrieves info about specific point on map', () => {
    const mockData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: '',
          geometry: null,
          properties: {
            GRAY_INDEX: 2.4
          }
        }
      ],
      totalFeatures: 'unknown',
      numberReturned: 1,
      timeStamp: '2021-09-22T14:41:36.468Z',
      crs: null
    }

    cy.intercept(new RegExp(/GetFeatureInfo/), mockData).as('geoserver')

    cy.visit(url)

    cy.get(selector('map'))
      .click('center')

    cy.wait(['@geoserver']).then(() => {
      cy.get('.leaflet-popup-content').then($el => {
        expect($el.text()).to.include(mockData.features[0].properties.GRAY_INDEX)
      })
    })
  })
})
