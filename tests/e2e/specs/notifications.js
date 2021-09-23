import { generateSelector as selector } from '../lib/generate-selector'

describe('Notifications', () => {
  it('Allows to export maps', () => {
    cy.visit('#/scenarios/6/18310')
    cy.intercept('GetScenariosPerBreachGeneric').as('scenarios')

    cy.wait('@scenarios', {
      timeout: 20000
    }).then(() => {
      cy.get(selector('notification')).should('exist')
    })
  })
})
