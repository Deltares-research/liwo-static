import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import mockScenarioData from '../../../mock/scenarios.json'
import mockLocationsData from '../../../mock/locations.json'

const url = '/#/combine/7'
const importUrl = 'http://127.0.0.1:5173/#/combine/7/19422,19428'

describe('Combine: Export and import combined scenarios', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept("POST", new RegExp(/GetBreachLocationId/), (req) => {
      const { body } = req
      req.continue((res) => {
        if (body.floodsimulationid === 21498) {
          return res.send(mockLocationsData['21498'])
        }

        if (body.floodsimulationid === 20932) {
          return res.send(mockLocationsData['20932'])
        }
      })
    })
    .as('location')
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

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })
  })

  it('Replaces selection with import', () => {
    cy.url()
      .should('contain', '/combine/7/21498,20932', { timeout: 4000 })

    cy.contains(selector('layer-panel'), 'Overstroming Maas kans 1/5 per jaar', { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.contains(selector('layer-panel'), 'Buitendijkse gebieden Zeeuwse Delta 1:10.000', { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(importUrl)
      .then(() => {
        cy.get(selector('import-url-checkbox'))
          .click()

        cy.get(selector('import-url-button'))
          .click()
        cy.wait('@scenario', { timeout: 4000 })
      })

    cy.url()
      .should('contain', '/combine/7/19422,19428', { timeout: 4000 })

    cy.contains(selector('layer-panel'), 'Overstroming Maas kans 1/5 per jaar', { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.contains(selector('layer-panel'), 'Buitendijkse gebieden Zeeuwse Delta 1:10.000', { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })
  })

  it('Combines import with selection', () => {
    cy.url()
      .should('contain', '/combine/7/21498,20932', { timeout: 4000 })

    cy.contains(selector('layer-panel'), 'Overstroming Maas kans 1/5 per jaar', { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.contains(selector('layer-panel'), 'Buitendijkse gebieden Zeeuwse Delta 1:10.000', { timeout: 4000 })
    cy.contains(selector('layer-panel'), 'Waterdiepte', { timeout: 4000 })

    cy.get(selector('import-selection-button'))
      .click()

    cy.get(selector('import-selection-url'))
      .type(importUrl)
      .then(() => {
        cy.get(selector('import-url-button'))
          .click()
        cy.wait('@scenario', { timeout: 4000 })
      })

    cy.url()
      .should('contain', '/combine/7/21498,20932,19422,19428', { timeout: 4000 })
  })
})
