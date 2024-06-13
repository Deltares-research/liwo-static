import mockLayerSetData from '../../../mock/layerset.json'
import { generateSelector as selector } from '../../../lib/generate-selector'

const url = '/#/scenarios/7'

let initialMarkerCount = 0
let updatedMarkerCount = 0

describe('Scenarios: filters', () => {
  it('Changes marker count when filtering', () => {
    cy.intercept(new RegExp(/GetMap/), '').as('map')
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.visit(url)

    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@layerset', { timeout: 4000 })
    cy.wait('@map', { timeout: 4000 })

    cy.get(selector('filter-toggle'))
      .click()

    cy.get('.leaflet-marker-icon').then($element => {
      initialMarkerCount = $element.length
    })

    cy.get(selector('filter-item'))
      .eq(1)
      .click()

    cy.get('.leaflet-marker-icon').then($element => {
      updatedMarkerCount = $element.length
    }).then(() => {
      cy.get('.leaflet-marker-icon').should('have.length', updatedMarkerCount)
      cy.get('.leaflet-marker-icon').should('not.have.length', initialMarkerCount)
    })
  })
})
