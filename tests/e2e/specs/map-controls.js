import { expect } from 'chai'
import queryString from 'query-string'
import { generateSelector as selector } from '../lib/generate-selector'

const url = '#/viewer/1?center=52,5&zoom=4'

function getParams (url) {
  return queryString.parse('?' + url.split('?')[1])
}

describe('Map', () => {
  beforeEach(() => {
    // skip loading of map layers since we can't rely on their loading times
    // and are they not relevant for these tests
    cy.intercept(new RegExp(/GetMap/), '')
  })

  it('Zooms out', () => {
    cy.visit(url)

    cy.get('.leaflet-control-zoom-out').should('be.visible')
    cy.get('.leaflet-control-zoom-out').click()

    cy.location().should((loc) => {
      const params = getParams(loc.hash)

      expect(params.zoom).to.equal('3')
    })
  })

  it('Zooms in', () => {
    cy.visit(url)

    // use specific selector because class is generated by plugin
    cy.get('.leaflet-control-zoom-in').should('be.visible')
    cy.get('.leaflet-control-zoom-in').click()
    cy.get('.leaflet-control-zoom-in').click()

    cy.location().should((loc) => {
      const params = getParams(loc.hash)

      expect(params.zoom).to.equal('5')
    })
  })

  it('Renders legend', () => {
    cy.visit(url)
    cy.get(selector('legend')).should('exist')
  })

  it('Renders north indicator', () => {
    cy.visit(url)
    cy.get('.leaflet-control-map-rose').should('exist')
  })

  it('Renders scale indicator', () => {
    cy.visit('#/viewer/34?center=52.00245,5.29952&zoom=3')

    cy.get('.leaflet-control-scale-line').contains('30 km')

    cy.visit('#/viewer/34?center=51.87501,4.43046&zoom=7')

    cy.get('.leaflet-control-scale-line').contains('2 km')
  })

  it('Toggles full screen', () => {
    cy.visit(url)

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
    cy.visit(url)

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

      const [lat, lng] = params.center.split(',')

      expect(parseFloat(lat, 10)).to.be.within(52, 53)
      expect(parseFloat(lng, 10)).to.be.within(4, 5)
    })
  })

  it('Can change base layer of map', () => {
    cy.visit(url)

    cy.viewport(800, 1000)

    // turn off layer so background is visible
    cy.get(selector('layer-control')).click()

    cy.get('.leaflet-control-layers-toggle').click()
    cy.get('.leaflet-control-layers-list input').each($input => {
      cy.wait(1000).then(() => {
        $input.click()
        $input[0].checked = true

        const name = $input.parent().find('span').text()

        cy.wait(2000).then(() => {
          cy.screenshot(name)
        })
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
