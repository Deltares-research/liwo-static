import { generateSelector as selector } from '../../lib/generate-selector'
import mockLayerSetData from '../../mock/layerset.json'
import mockFeaturesData from '../../mock/multipleFeatureCollection.json'

const url = '#/combine/7?center=52.32401,5.35995&zoom=10'
const exportUrl = 'http://localhost:8081/#/combine/7/19422,19428'

describe('Combine: Export and import combined selection', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)
  })

  it('Exports combined selection', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.wait(5000)

    cy.get(selector('export-selection-button'))
      .click()

    cy.wait(1000)

    cy.get(selector('export-selection-url'))
      .then(($el) => {
        expect($el[0].value).to.equal(exportUrl)
      })
  })

  it('Imports combined selection', () => {
    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(exportUrl)
      .then(() => {
        cy.get(selector('import-url-button'))
          .click()
      })
  })
})
