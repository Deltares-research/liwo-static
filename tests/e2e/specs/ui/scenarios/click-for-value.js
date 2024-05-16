import { generateSelector as selector } from '../../../lib/generate-selector'

const url = '/#/scenarios/7/19422?center=52.36134,5.38055&zoom=10'

describe('Scenarios: click for value', () => {
  it('Shows info popup for specific point on different layers', () => {
    cy.intercept(new RegExp(/GetMap/), '').as('map')
    cy.visit(url)
    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@map', { timeout: 4000 })

    cy.get(selector('map'))
      .click('center')

    cy.get('.leaflet-popup').should('exist')

    cy.get('.leaflet-popup-content').then($el => {
      const value = $el.text()

      cy.get(selector('layer-panel')).eq(1)
        .within(() => {
          cy.get(selector('layer-control')).eq(1).click()
        })

      cy.get(selector('map'))
        .click('center')

      cy.get('.leaflet-popup').should('exist')
      cy.get('.leaflet-popup-content').invoke('text').should('not.equal', value)
    })
  })
})
