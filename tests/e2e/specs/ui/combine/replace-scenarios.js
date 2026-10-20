import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import { testVariants, variantIds } from '../../../support/constants'

const url = '/#/combine/7'
const defaultIds = variantIds.slice(0,2).join(',')
const importedIds = variantIds.slice(2,4).join(',')
const importUrl = `http://127.0.0.1:5173/#/combine/7/${importedIds}`

describe('Combine: Export and import combined scenarios', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept("POST", new RegExp(/GetBreachLocationId/)).as('location')
    cy.intercept("POST", new RegExp(/GetScenariosPerBreachGeneric/)).as('scenario')

    cy.visit(url)

    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@layerset', { timeout: 4000 })

    cy.get('.leaflet-marker-icon')
      .eq(1)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.get('.leaflet-marker-icon')
      .eq(2)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })
  })

  it('Replaces selection with import', () => {
    cy.url()
      .should('contain', `/#/combine/7/${defaultIds}`, { timeout: 4000 })

    cy.contains(selector('layer-panel'), `${testVariants[0].variantName}`, { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.contains(selector('layer-panel'), `${testVariants[1].variantName}`, { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(importUrl)
      .then(() => {
        cy.get(selector('import-url-checkbox'))
          .click()

        cy.get(selector('import-url-button'))
          .click()
        cy.wait('@scenario', { timeout: 4000 })
      })

    cy.url()
      .should('contain', `/combine/7/${importedIds}`, { timeout: 4000 })

    cy.contains(selector('layer-panel'), `${testVariants[2].variantName}`, { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.contains(selector('layer-panel'), `${testVariants[3].variantName}`, { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })
  })

  it('Combines import with selection', () => {
    cy.url()
      .should('contain', `/#/combine/7/${defaultIds}`, { timeout: 4000 })

    cy.contains(selector('layer-panel'), `${testVariants[0].variantName}`, { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.contains(selector('layer-panel'), `${testVariants[1].variantName}`, { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(importUrl)
      .then(() => {
        cy.get(selector('import-url-button'))
          .click()
        cy.wait('@scenario', { timeout: 4000 })
      })

    cy.url()
      .should('contain', `${defaultIds}`, { timeout: 4000 })
  })
})
