import mockLayerSetData from '../../mock/layerset.json'
import { generateSelector as selector } from '../../lib/generate-selector'

const url = '/#/viewer/1?center=52,5&zoom=4'

function getParams (url) {
  const params = new URLSearchParams(url.split('?')[1])
  return params
}

describe('URL', () => {
  it('Parameter changes when center point is changed', () => {
    cy.intercept(new RegExp(/GetMap/), '').as('map')

    cy.visit(url)

    cy.get(selector('layerpanel')).should('be.visible')
    cy.wait('@map', { timeout: 20000 })

    cy.window()
      .then(($win) => {
        expect(typeof $win.liwoMap).to.eq('object')
        // Move view to lat/long, keep zoom level to 4.
        $win.liwoMap.setView([52.3, 5.3], 4)
      })

    cy.location().should(($loc) => {
      const params = getParams($loc.hash)
      expect(params.get('center')).to.equal('52.30009,5.29893')
    })
  })

  it('Changes when scenario ID is changed', () => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.visit('/#/combine/7/19422,19428?center=52.38608,5.34897&zoom=10')

    cy.get(selector('layerpanel')).should('be.visible')
    cy.wait('@layerset', { timeout: 20000 })
    cy.get(selector('layerpanel-info')).should('be.visible')

    // Get active leaflet marker icon
    cy.get('.leaflet-marker-icon[src*="yellow"]')
      .eq(0)
      .click({ force: true })

    cy.url()
      .should('contain', '/combine/7/19428', { timeout: 30000 })
  })
})
