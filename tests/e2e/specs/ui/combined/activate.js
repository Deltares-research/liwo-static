import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import mockFeaturesData from '../../../mock/featureCollection.json'

const url = '/#/combine/7'

describe('Combine: combine selection', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)

    cy.wait('@layerset', { timeout: 20000 })
    cy.wait('@features', { timeout: 20000 })
  })

  it('Triggers combine popup', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    cy.get(selector('combine-button'))
      .click()

    cy.get(selector('combine-form'))
      .contains('waterdiepte')

    // check if input is disabled when n=0
    cy.get('input[disabled="disabled"]')
      .next()
      .contains('n=0')
  })

  it('Combines results', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    cy.get(selector('combine-button'))
      .click()

    cy.contains('waterdiepte')
      .click({ force: true })

    cy.wait(500)

    cy.get(selector('combine-trigger'))
      .invoke('removeAttr', 'target')
      .click()

    cy.get(selector('page-title'))
      .contains('Gecombineerd scenario')
  })
})
