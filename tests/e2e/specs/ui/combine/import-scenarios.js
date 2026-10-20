import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import { testVariants, variantIds } from '../../../support/constants'

const url = '/#/combine/7'
const importUrl = `http://127.0.0.1:5173/#/combine/7/${variantIds.join(',')}`

describe('Combine: Import combined scenarios', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept("POST", new RegExp(/GetBreachLocationId/)).as('location')
    cy.intercept("POST", new RegExp(/GetScenariosPerBreachGeneric/)).as('scenario')

    cy.visit(url)

    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@layerset', { timeout: 4000 })

    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(importUrl)

    cy.get(selector('import-url-button'))
      .click()
    cy.wait('@scenario', { timeout: 4000 })
  })

  it('Imports scenario', () => {
    cy.url()
      .should('contain', `/combine/7/${variantIds.join(',')}`, { timeout: 4000 })
      .then(() => {
        cy.contains(selector('layer-panel'), `${testVariants[0].variantName}`, { timeout: 4000 })
        cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

        cy.contains(selector('layer-panel'), `${testVariants[1].variantName}`, { timeout: 4000 })
        cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })
      })
  })
})
