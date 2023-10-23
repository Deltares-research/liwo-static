import mockLayerSetData from '../../mock/layerset.json'
import mockDoubleFeaturesData from '../../mock/doubleFeatureCollection.json'

const url = '/#/viewer/1?center=52,5&zoom=4'

function getParams (url) {
  const params = new URLSearchParams(url.split('?')[1])
  return params
}

describe('URL', () => {
  it('Parameter changes when center point is changed', () => {
    cy.intercept(new RegExp(/GetMap/), '').as('map')

    cy.visit(url)

    cy.wait('@map', { timeout: 20000 })

    cy.wait(1000)

    cy.window()
      .then(($win) => {
        expect(typeof $win.liwoMap).to.eq('object')
        // Move view to lat/long, keep zoom level to 4.
        $win.liwoMap.setView([52.3, 5.3], 4)
      })

    cy.wait(500)

    cy.location().should(($loc) => {
      const params = getParams($loc.hash)
      expect(params.get('center')).to.equal('52.30009,5.29893')
    })
  })

  it('Parameter changes when zoom level is increased', () => {
    cy.intercept(new RegExp(/GetMap/), '').as('map')

    cy.visit(url)

    cy.wait('@map', { timeout: 20000 })

    cy.wait(1000)

    // use specific selector because class is generated by plugin
    cy.get('.leaflet-control-zoom-in').should('be.visible')
    cy.get('.leaflet-control-zoom-in').click()

    cy.wait(500)

    cy.get('.leaflet-control-zoom-in').click()

    cy.location().should(($loc) => {
      const params = getParams($loc.hash)
      expect(params.get('zoom')).to.equal('6')
    })
  })

  it('Parameter changes when zoom level is decreased', () => {
    cy.intercept(new RegExp(/GetMap/), '').as('map')

    cy.visit(url)

    cy.wait('@map', { timeout: 20000 })

    cy.wait(1000)

    // use specific selector because class is generated by plugin
    cy.get('.leaflet-control-zoom-out').should('be.visible')
    cy.get('.leaflet-control-zoom-out').click()

    cy.wait(500)

    cy.get('.leaflet-control-zoom-out').click()

    cy.location().should(($loc) => {
      const params = getParams($loc.hash)
      expect(params.get('zoom')).to.equal('2')
    })
  })

  it('Changes when scenario ID is changed', () => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('features')

    cy.visit('/#/combine/7/19422,19428?center=52.38608,5.34897&zoom=10')

    cy.wait('@layerset', { timeout: 20000 })
    cy.wait('@features', { timeout: 20000 })

    cy.wait(5000)

    cy.get('.leaflet-marker-icon')
      .eq(0)
      .click({ force: true })

    cy.wait(10000)

    cy.url()
      .should('contain', '/combine/7/19428', { timeout: 30000 })
  })
})
