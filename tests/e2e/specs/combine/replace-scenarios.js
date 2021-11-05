import { generateSelector as selector } from '../../lib/generate-selector'
import mockLayerSetData from '../../mock/layerset.json'
import mockDoubleFeaturesData from '../../mock/doubleFeatureCollection.json'
import mockMultipleFeaturesData from '../../mock/multipleFeatureCollection.json'

const url = '#/combine/7?center=52.32401,5.35995&zoom=10'
const exportUrl = 'http://localhost:8081/#/combine/7/19422,19428'
const importUrl = 'http://localhost:8081/#/combine/7/19431,19435'
const location1 = mockDoubleFeaturesData.features[0].properties.name
const location2 = mockDoubleFeaturesData.features[1].properties.name

describe('Combine: Export and import combined scenarios', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData)
    cy.intercept(new RegExp(/getFeature/), mockMultipleFeaturesData).as('features')

    cy.visit(url)

    cy.wait('@features')

    cy.get('.leaflet-marker-icon')
      .eq(0)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })
  })

  it('Replaces selection with import', () => {
    cy.url()
      .should('contain', '/combine/7/19428,19422', { timeout: 30000 })
      .then(() => {
        cy.contains(location1)
          .parentsUntil(selector('layer-panel'))

        cy.contains(location2)
          .parentsUntil(selector('layer-panel'))

        cy.get(selector('import-selection-button'))
          .click()
      })

    cy.get(selector('import-selection-url'))
      .type(exportUrl)
      .then(() => {
        cy.get(selector('import-url-checkbox'))
          .click()

        cy.get(selector('import-url-button'))
          .click()
      })

    cy.url()
      .should('contain', '/combine/7/19428,19422', { timeout: 30000 })
      .then(() => {
        cy.contains(location1)
          .parentsUntil(selector('layer-panel'))

        cy.contains(location2)
          .parentsUntil(selector('layer-panel'))
      })
  })

  it('Combines import with selection', () => {
    cy.url()
      .should('contain', '/combine/7/19428,19422', { timeout: 30000 })
      .then(() => {
        cy.contains(location1)
          .parentsUntil(selector('layer-panel'))

        cy.contains(location2)
          .parentsUntil(selector('layer-panel'))

        cy.get(selector('import-selection-button'))
          .click()
      })

    cy.get(selector('import-selection-url'))
      .type(importUrl)
      .then(() => {
        cy.get(selector('import-url-button'))
          .click()
      })

    cy.url()
      .should('contain', '/combine/7/19428,19422,19431,19435', { timeout: 30000 })
  })
})