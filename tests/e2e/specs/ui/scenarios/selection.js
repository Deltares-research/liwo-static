import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayerSetData from '../../../mock/layerset.json'

const url = '/#/scenarios/7?center=52.32401,5.35995&zoom=10'

describe('Scenarios: marker selection', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetMap/), '').as('map')
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.visit(url)

    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@layerset', { timeout: 4000 })
    cy.wait('@map', { timeout: 4000 })
  })

  it('Changes marker image on click', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .invoke('attr', 'src')
      .then((srcVal) => {
        cy.get('.leaflet-marker-icon')
          .eq(3)
          .click()
          .invoke('attr', 'src')
          .should('not.eq', srcVal)
      })
  })

  it('Opens correct layers in panel', () => {
    const name = "Rijntakken"

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    cy.contains(selector('layer-panel'), name)

    cy.contains(selector('layer-panel'), 'Waterdiepte')
  })
})
