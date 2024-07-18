import { generateSelector as selector } from '../../../lib/generate-selector'

const url = '/#/combine/7/20947?center=52.00010,5.29816&zoom=8'

describe('Combine: combine selection', () => {
  it('Combines results', () => {
    cy.visit(url)
    cy.get(selector('layer-panel')).should('be.visible')

    cy.get(selector('combine-button'))
      .click()

    cy.get(selector('combine-form'))
      .contains('waterdiepte')

    cy.get(selector('combine-trigger'))
      .invoke('removeAttr', 'target')
      .click({ timeout: 4000 })

    cy.url()
      .should('contain', '/combined/7/20947/waterdepth')
  })
})
