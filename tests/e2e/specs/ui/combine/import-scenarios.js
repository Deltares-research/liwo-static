import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import mockScenarioData from '../../../mock/scenarios.json'

const url = '/#/combine/7'
const importUrl = 'http://127.0.0.1:5173/#/combine/7/20932,21498'

describe('Combine: Import combined scenarios', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept("POST", new RegExp(/GetScenariosPerBreachGeneric/), (req) => {
      const { body } = req

      req.continue((res) => {
        if (body.breachid === 3408) {
          return res.send(mockScenarioData['3408'])
        }

        if (body.breachid === 1782) {
          return res.send(mockScenarioData['1782'])
        }
      })
    })
    .as('scenario')

    cy.visit(url)

    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@layerset', { timeout: 4000 })

    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(importUrl)

    cy.get(selector('import-url-button'))
      .click()
  })

  it('Imports scenario', () => {
    cy.url()
      .should('contain', '/combine/7/20932,21498', { timeout: 4000 })
      .then(() => {
        cy.contains(selector('layer-panel'), 'Overstroming Maas kans 1/5 per jaar', { timeout: 4000 })
        cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

        cy.contains(selector('layer-panel'), 'Buitendijkse gebieden Zeeuwse Delta 1:10.000', { timeout: 4000 })
        cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })
      })
  })

  it('Imports scenario and deselects a location', () => {
    cy.url()
      .should('contain', '/combine/7/20932,21498', { timeout: 4000 })
      .then(() => {

        cy.get('.leaflet-marker-icon')
          .eq(6)
          .invoke('attr', 'src')
          .then((srcVal) => {
            cy.get('.leaflet-marker-icon')
              .eq(6)
              .click({ force: true })
              .invoke('attr', 'src')
              .should('not.eq', srcVal)
          })
      })

    cy.url().should('contain', '/combine/7/21498', { timeout: 4000 })
  })
})
