import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import mockMultipleFeaturesData from '../../../mock/multipleFeatureCollection.json'

const url = '/#/scenarios/7?center=52.32401,5.35995&zoom=10'

describe('Scenarios: shows correct popup value', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockMultipleFeaturesData).as('features')

    cy.visit(url)

    cy.wait('@layerset', { timeout: 20000 })
    cy.wait('@features', { timeout: 20000 })
  })

  it('Opens correct layers in panel', () => {
    cy.get('.leaflet-marker-icon')
      .eq(0)
      .click({ force: true })

    cy.wait(1000)

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .trigger('mouseover', { force: true })

    cy.wait(500)

    cy.get('.leaflet-tooltip')
      .then($tooltipEl => {
        const text = $tooltipEl.text()

        const variant = text.split(' - ')[1]
        const number = variant.split('.')[0]

        cy.get(selector('variant-select')).then($selectEl => {
          const selected = $selectEl[0].selectedOptions[0]

          expect(selected.label).to.equal(number)
        })
      })
  })

  it('Changes tooltip on variant select', () => {
    cy.get('.leaflet-marker-icon')
      .eq(0)
      .click({ force: true })

    cy.wait(500)

    cy.get(selector('variant-select'))
      .eq(0)
      .select('1')

    cy.wait(500)

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .trigger('mouseover', { force: true })

    cy.wait(500)

    cy.get('.leaflet-tooltip')
      .then($tooltipEl => {
        const text = $tooltipEl.text()

        const variant = text.split(' - ')[1]
        const number = variant.split('.')[0]

        cy.get(selector('variant-select')).then($selectEl => {
          const selected = $selectEl[0].selectedOptions[0]

          expect(selected.label).to.equal(number)
        })
      })
  })
})
