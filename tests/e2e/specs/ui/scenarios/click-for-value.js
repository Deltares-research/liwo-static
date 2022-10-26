import { skipOn } from '@cypress/skip-test'
import { generateSelector as selector } from '../../../lib/generate-selector'
import mockDoubleFeaturesData from '../../../mock/doubleFeatureCollection.json'

const url = '/#/scenarios/7/19422?center=52.36134,5.38055&zoom=10'

describe('Scenarios: click for value', () => {
  skipOn('firefox', () => {
    it('Shows info popup for specific point on different layers', () => {
      cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('features')
      cy.visit(url)

      cy.wait('@features', { timeout: 20000 })

      cy.wait(500)

      cy.get(selector('map'))
        .click('center')

      cy.wait(500)

      cy.get('.leaflet-popup').should('exist')

      cy.wait(500)

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
