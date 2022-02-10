import { skipOn } from '@cypress/skip-test'
import { generateSelector as selector } from '../../../lib/generate-selector'
const url = '#/scenarios/7/19422?center=52.36134,5.38055&zoom=11'

describe('Scenarios: click for value', () => {
  skipOn('firefox', () => {
    it('Shows info popup for specific point on different layers', () => {
      cy.viewport(1500, 1000)
      cy.visit(url)
      cy.intercept(new RegExp(/getFeature/)).as('features')

      cy.wait('@features', { timeout: 20000 })

      cy.wait(8000)

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

        cy.wait(500)

        cy.get('.leaflet-popup-content').invoke('text').should('not.equal', value)
      })
    })
  })
})
