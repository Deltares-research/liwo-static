import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../mock/layerset.json'
import mockFeaturesData from '../../mock/featureCollection.json'

const url = '#/scenarios/7'

describe('Scenarios: shows correct popup value', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)
  })

  it('Opens correct layers in panel', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    cy.wait(1000)

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .trigger('mouseover')

    cy.wait(500)

    cy.get('.leaflet-tooltip')
      .then($tooltipEl => {
        const text = $tooltipEl.text()

        const variant = text.split(' - ')[1]

        cy.get(selector('variant-select')).then($selectEl => {
          const selected = $selectEl[0].selectedOptions[0]

          expect(selected.label).to.equal(variant)
        })
      })
  })

  it('Changes tooltip on variant select', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click()

    cy.wait(500)

    cy.get(selector('variant-select'))
      .select('1')

    cy.wait(500)

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .trigger('mouseover')

    cy.wait(500)

    cy.get('.leaflet-tooltip')
      .then($tooltipEl => {
        const text = $tooltipEl.text()

        const variant = text.split(' - ')[1]

        cy.get(selector('variant-select')).then($selectEl => {
          const selected = $selectEl[0].selectedOptions[0]

          expect(selected.label).to.equal(variant)
        })
      })
  })
})
