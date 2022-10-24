import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayerSetData from '../../../mock/layerset.json'
import mockDoubleFeaturesData from '../../../mock/doubleFeatureCollection.json'

const url = '/#/combine/7?center=52.32401,5.35995&zoom=10'
const exportUrl = 'http://localhost:8081/#/combine/7/19422,19428'
const location1 = mockDoubleFeaturesData.features[0].properties.name
const location2 = mockDoubleFeaturesData.features[1].properties.name

describe('Combine: Import combined scenarios', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData)
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('features')
    cy.visit(url)

    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(exportUrl)
      .then(() => {
        cy.get(selector('import-url-button'))
          .click()
      })
  })

  it('Imports scenario', () => {
    cy.url()
      .should('contain', '/combine/7/19422,19428', { timeout: 30000 })
      .then(() => {
        cy.contains(location1, {
          timeout: 20000
        })
          .parentsUntil(selector('layer-panel'))

        cy.contains(location2, {
          timeout: 20000
        })
          .parentsUntil(selector('layer-panel'))
      })
  })

  it('Imports scenario and deselects a location', () => {
    cy.url()
      .should('contain', '/combine/7/19422,19428', { timeout: 30000 })
      .then(() => {
        cy.wait(5000)

        cy.get('.leaflet-marker-icon')
          .eq(1)
          .invoke('attr', 'src')
          .then((srcVal) => {
            cy.get('.leaflet-marker-icon')
              .eq(1)
              .click({ force: true })
              .invoke('attr', 'src')
              .should('not.eq', srcVal)
          })
      })
  })
})
