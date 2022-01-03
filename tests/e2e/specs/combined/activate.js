import { generateSelector as selector } from '../../lib/generate-selector'
import mockLayersetData from '../../mock/layerset.json'
import mockFeaturesData from '../../mock/featureCollection.json'

const url = '#/combine/7'

describe('Combine: combine selection', () => {
  before(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')
  })

  it('triggers combine popup', () => {
    cy.visit(url)

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    cy.get(selector('combine-button'))
      .click()

    cy.get(selector('combine-form'))
      .contains('waterdiepte')
  })

  it('combines results', () => {
    cy.visit(url)

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    cy.get(selector('combine-button'))
      .click()

    cy.contains('waterdiepte')
      .click()

    cy.wait(500)

    cy.get(selector('combine-trigger'))
      .invoke('removeAttr', 'target')
      .click()

    cy.get(selector('page-title'))
      .contains('Gecombineerd scenario')
  })
})
