import { generateSelector as selector } from '../../../lib/generate-selector'
const url = '#/scenarios/7/19422'

describe('Scenarios: metadata is available', () => {
  it('Shows modal when toggle is clicked', () => {
    cy.viewport(1500, 1000)
    cy.visit(url)
    cy.intercept(new RegExp(/getFeature/)).as('features')

    cy.wait('@features', { timeout: 20000 })

    cy.wait(8000)

    cy.get(selector('layer-panel')).eq(1)
      .within(() => {
        cy.get(selector('info-toggle')).first().click()

        cy.get(selector('meta-table'))
          .contains('Scenarionaam')
          .contains('ScenarioID')
      })
  })
})
