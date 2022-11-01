import { generateSelector as selector } from '../../../lib/generate-selector'

const url = '/#/combine/7/20947?center=52.00010,5.29816&zoom=8'

describe('Combine: combine selection', () => {
  it('Combines results', () => {
    cy.visit(url)

    cy.get(selector('combine-button'), { timeout: 20000 })
      .click()

    cy.wait(500)

    cy.contains('waterdiepte')
      .click({ force: true })

    cy.wait(4000)

    cy.get(selector('combine-trigger'))
      .invoke('removeAttr', 'target')
      .click()

    cy.wait(4000)

    cy.url()
      .should('contain', '/combined/7/20947')
  })
})
