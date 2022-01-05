import { generateSelector as selector } from '../../lib/generate-selector'
import mockLayersetData from '../../mock/layerset.json'
import mockFeaturesData from '../../mock/featureCollection.json'

const url = '#/scenarios/7'

describe('Scenarios: marker selection', () => {
  before(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)
  })

  it('Changes marker image on click', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .invoke('attr', 'src')
      .then((srcVal) => {
        cy.get('.leaflet-marker-icon')
          .eq(3)
          .click()
          .invoke('attr', 'src')
          .should('not.eq', srcVal)
      })
  })

  it('Opens correct layers in panel', () => {
    const name = mockFeaturesData.features[0].properties.name

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    cy.contains(name)
      .parentsUntil(selector('layer-panel'))
      .contains('Waterdiepte')
  })
})
