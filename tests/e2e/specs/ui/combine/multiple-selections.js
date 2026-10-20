import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import { testVariants } from '../../../support/constants'

const url = '/#/combine/7'

describe('Combine multiple selections: marker selection', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept("POST", new RegExp(/GetScenariosPerBreachGeneric/)).as('scenario')

    cy.visit(url)

    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@layerset', { timeout: 4000 })
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
    cy.get('.leaflet-marker-icon')
      .eq(1)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.get('.leaflet-marker-icon')
      .eq(2)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.contains(selector('layer-panel'), `${testVariants[0].variantName}`, { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.contains(selector('layer-panel'), `${testVariants[1].variantName}`, { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })
  })

  it('Changes legend graphic', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.get(`${selector('legend-button')}`).click()
      .then(() => {
        cy.get(`${selector('legend')} img`).invoke('attr', 'src').then(initSrc => {
        cy.get(`${selector('legend')} img`).eq(1).invoke('attr', 'src').then(newSrc => {
          expect(initSrc).to.not.equal(newSrc)
        })
      })
    })
  })
})
