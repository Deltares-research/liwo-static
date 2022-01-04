import { generateSelector as selector } from '../../lib/generate-selector'

const id = '20947'

const url = `#/combine/7/${id}`

describe('Combine: combine selection', () => {
  it('combines results', () => {
    cy.visit(url)

    cy.get(selector('combine-button'))
      .click()

    cy.contains('waterdiepte')
      .click()

    cy.wait(500)

    cy.get(selector('combine-trigger'))
      .invoke('removeAttr', 'target')
      .click()

    cy.url().should('include', `/combined/7/${id}`)
  })
})
