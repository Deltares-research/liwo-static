import { generateSelector as selector } from '../../../lib/generate-selector'

const url = '/#/scenarios/7'

let initialMarkerCount = 0
let updatedMarkerCount = 0

describe('Scenarios: filters', () => {
  it('Changes marker count when filtering', () => {
    cy.intercept(new RegExp(/getFeature/)).as('features')
    cy.visit(url)

    cy.wait('@features', { timeout: 20000 }).its('response.statusCode').should('eq', 200)

    cy.get(selector('filter-toggle'))
      .click()

    cy.get('.leaflet-marker-icon').then($element => {
      initialMarkerCount = $element.length
    })

    cy.wait(500)

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
