import { generateSelector as selector } from '../../lib/generate-selector'
import mockLayerSetData from '../../mock/layerset.json'
import mockDoubleFeaturesData from '../../mock/doubleFeatureCollection.json'
import mockMultipleFeaturesData from '../../mock/multipleFeatureCollection.json'

const url = '#/combine/7?center=52.32401,5.35995&zoom=10'
const exportUrl = 'http://localhost:8081/#/combine/7/19422,19428'
const importUrl = 'http://localhost:8081/#/combine/7/19431,19435'

describe('Combine: Export and import combined scenarios', () => {
  beforeEach(() => {
    cy.visit(url)
  })

  it('Exports scenario', () => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('twoFeatures')

    cy.wait('@twoFeatures')

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.url()
      .should('contain', '#/combine/7/19422,19428', { timeout: 30000 })
      .then(() => {
        cy.get(selector('export-selection-button'))
          .click()
      })

    cy.get(selector('export-selection-url'))
      .then(($el) => {
        expect($el[0].value).to.equal(exportUrl)
      })
  })

  it('Imports scenario', () => {
    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(exportUrl)
      .then(() => {
        cy.get(selector('import-url-button'))
          .click()
      })
  })

  it('Replaces selection with import', () => {
    const location1 = mockDoubleFeaturesData.features[0].properties.name
    const location2 = mockDoubleFeaturesData.features[1].properties.name

    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('twoFeatures')

    cy.wait('@twoFeatures')

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.url()
      .should('contain', '#/combine/7/19422,19428', { timeout: 30000 })
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
      .should('contain', '#/combine/7/19422,19428', { timeout: 30000 })
      .then(() => {
        cy.contains(location1)
          .parentsUntil(selector('layer-panel'))

        cy.contains(location2)
          .parentsUntil(selector('layer-panel'))
      })
  })

  it('Combines import with selection', () => {
    const location1 = mockDoubleFeaturesData.features[0].properties.name
    const location2 = mockDoubleFeaturesData.features[1].properties.name

    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockMultipleFeaturesData).as('multipleFeatures')

    cy.wait('@multipleFeatures')

    cy.get('.leaflet-marker-icon')
      .eq(0)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.url()
      .should('contain', '#/combine/7/19428,19422', { timeout: 30000 })
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
      .should('contain', '#/combine/7/19428,19422,19431,19435', { timeout: 30000 })
  })
})
