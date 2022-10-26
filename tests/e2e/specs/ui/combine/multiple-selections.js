import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayerSetData from '../../../mock/layerset.json'
import mockDoubleFeaturesData from '../../../mock/doubleFeatureCollection.json'

const url = '/#/combine/7?center=52.32401,5.35995&zoom=10'

const location1 = mockDoubleFeaturesData.features[0].properties.name
const location2 = mockDoubleFeaturesData.features[1].properties.name

describe('Combine multiple selections: marker selection', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('features')

    cy.visit(url)

    cy.wait('@layerset', { timeout: 20000 })
    cy.wait('@features', { timeout: 20000 })
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

    cy.wait(10000)

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
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.wait(400)

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.wait(400)

    cy.contains(selector('layer-panel'), location1, { timeout: 20000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 20000 })

    cy.wait(400)

    cy.contains(selector('layer-panel'), location2, { timeout: 20000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 20000 })
  })

  it('Changes legend graphic', () => {
    cy.get('.leaflet-marker-icon')
      .eq(2)
      .click({ force: true })

    cy.get(`${selector('legend')} img`)
      .invoke('attr', 'src')
      .then(initSrc => {
        cy.get('.leaflet-marker-icon')
          .eq(4)
          .click({ force: true })

        cy.wait(10000)

        cy.get(`${selector('legend')} img`)
          .invoke('attr', 'src')
          .then(newSrc => {
            expect(initSrc, {
              timeout: 20000
            }).to.not.equal(newSrc)
          })
      })
  })
})
