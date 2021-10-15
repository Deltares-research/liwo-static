import { generateSelector as selector } from '../../lib/generate-selector'
import mockLayerSetData from '../../mock/layerset.json'
import mockDoubleFeaturesData from '../../mock/doubleFeatureCollection.json'

const url = '#/combine/7?center=52.32401,5.35995&zoom=10'
const exportUrl = 'http://localhost:8081/#/combine/7/19422,19428'

describe('Combine: Export and import combined scenarios', () => {
  it('Imports scenario', () => {
    const location1 = mockDoubleFeaturesData.features[0].properties.name
    const location2 = mockDoubleFeaturesData.features[1].properties.name

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

    cy.url()
      .should('contain', '/combine/7/19422,19428', { timeout: 30000 })
      .then(() => {
        cy.contains(location1)
          .parentsUntil(selector('layer-panel'))

        cy.contains(location2)
          .parentsUntil(selector('layer-panel'))
      })
  })
})
