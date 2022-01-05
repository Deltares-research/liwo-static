import mockLayersetData from '../../mock/layerset.json'
import mockDoubleFeaturesData from '../../mock/doubleFeatureCollection.json'

const url = '#/combined/7/19422,19428/waterdepth'

describe('Combined: popup', () => {
  beforeEach(() => {
    cy.viewport(1500, 1000)
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('features')

    cy.visit(url)

    cy.wait('@features')

    cy.wait(2000)
  })

  it('Shows location tooltip on hover', () => {
    cy.get('.leaflet-marker-icon')
      .eq(6)
      .trigger('mouseover')

    cy.get('.leaflet-marker-icon')
      .eq(7)
      .trigger('mouseover')

    cy.get('.leaflet-tooltip')
      .then($tooltipEl => {
        const text = $tooltipEl[0].innerText
        expect(text).to.equal('OOSTVAARDERSDIJK_16.0')
      })

    cy.get('.leaflet-tooltip')
      .then($tooltipEl => {
        const text = $tooltipEl[1].innerText
        expect(text).to.equal('GOOIMEERDIJK_15.5')
      })
  })
})
