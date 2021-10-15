import { generateSelector as selector } from '../../lib/generate-selector'
import mockLayerSetData from '../../mock/layerset.json'
import mockFeaturesData from '../../mock/multipleFeatureCollection.json'

const url = '#/combine/7?center=52.32401,5.35995&zoom=10'

describe('Combine multiple selections: marker selection', () => {
  before(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)
  })

  it('Changes marker image on click', () => {
    cy.get('.leaflet-marker-icon')
      .eq(0)
      .invoke('attr', 'src')
      .then((srcVal) => {
        cy.get('.leaflet-marker-icon')
          .eq(0)
          .click({ force: true })
          .invoke('attr', 'src')
          .should('not.eq', srcVal)
      })

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .invoke('attr', 'src')
      .then((srcVal) => {
        cy.get('.leaflet-marker-icon')
          .eq(3)
          .click({ force: true })
          .invoke('attr', 'src')
          .should('not.eq', srcVal)
      })
  })

  it('Opens correct layers in panel', () => {
    const location1 = mockFeaturesData.features[0].properties.name
    const location2 = mockFeaturesData.features[1].properties.name

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.get(selector('layer-panel'))
      .parent()
      .children()
      .should('have.length', 3)

    cy.contains(location1)
      .parentsUntil(selector('layer-panel'))
      .next()
      .contains('Waterdiepte')

    cy.contains(location2)
      .parentsUntil(selector('layer-panel'))
      .next()
      .contains('Waterdiepte')
  })

  it('Closes correct layers in panel', () => {
    const location1 = mockFeaturesData.features[0].properties.name
    const location2 = mockFeaturesData.features[1].properties.name

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.contains(location1)
      .parentsUntil(selector('layer-panel'))
      .next()
      .contains('Waterdiepte')

    cy.contains(location2)
      .parentsUntil(selector('layer-panel'))
      .next()
      .contains('Waterdiepte')

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get(selector('layer-panel'))
      .parent()
      .children()
      .should('have.length', 2)
  })

  it('Changes legend graphic', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.wait(5000)

    cy.get(`${selector('legend')} img`)
      .invoke('attr', 'src')
      .then(initSrc => {
        cy.get('.leaflet-marker-icon')
          .eq(4)
          .click({ force: true })

        cy.wait(5000)

        cy.get(`${selector('legend')} img`)
          .invoke('attr', 'src')
          .then(newSrc => {
            expect(initSrc).to.not.equal(newSrc)
          })
      })
  })
})
