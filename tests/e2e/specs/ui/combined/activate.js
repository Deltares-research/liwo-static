import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'

const url = '/#/combine/7'

describe('Combine: combine selection', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')

    cy.visit(url)

    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@layerset', { timeout: 4000 })
  })

  it('Triggers combine popup', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get(selector('combine-button'))
      .click()

    cy.get(selector('combine-form'))
      .contains('waterdiepte')

    // check if input is disabled when n=0
    cy.get('input[disabled]')
      .next()
      .contains('n=0')
  })

  it('Combines results', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get(selector('combine-button'))
      .click()

    cy.get(selector('combine-form'))
      .contains('waterdiepte')

    cy.get(selector('combine-trigger'))
      .invoke('removeAttr', 'target')
      .click({ timeout: 4000 })

    cy.get(selector('page-title'))
      .contains('Gecombineerd scenario')
  })
})
