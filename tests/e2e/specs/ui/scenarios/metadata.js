import { skipOn } from '@cypress/skip-test'
import { generateSelector as selector } from '../../../lib/generate-selector'

const url = '/#/scenarios/7/19422'

describe('Scenarios: metadata is available', () => {
  skipOn('firefox', () => {
    it('Shows modal when toggle is clicked', () => {
      cy.intercept(new RegExp(/getFeature/)).as('features')
      cy.visit(url)

      cy.wait('@features', { timeout: 20000 }).its('response.statusCode').should('eq', 200)

      cy.wait(8000)

      cy.get(selector('layer-panel')).eq(1)

      cy.wait(100)

      cy.get(selector('info-toggle')).first().click()

      cy.wait(100)

      cy.contains(selector('meta-table'), 'Scenarionaam')
      cy.contains(selector('meta-table'), 'Scenario ID')
    })
  })
})
