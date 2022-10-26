import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayerSetData from '../../../mock/layerset.json'
import mockDoubleFeaturesData from '../../../mock/doubleFeatureCollection.json'

const url = '/#/combine/7?center=52.32401,5.35995&zoom=10'
const exportUrl = '/#/combine/7/19422'

describe('Combine: Export combined scenarios', () => {
  it('Exports scenario', () => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData)
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('features')
    cy.visit(url)

    cy.wait('@features', { timeout: 20000 })

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.wait(1000)

    cy.url().should('contain', exportUrl, { timeout: 30000 })

    cy.get(selector('export-selection-button')).click()

    cy.wait(1000)

    cy.get(selector('export-selection-url'))
      .then(($el) => {
        expect($el[0].value).to.contain(exportUrl)
      })
  })
})
