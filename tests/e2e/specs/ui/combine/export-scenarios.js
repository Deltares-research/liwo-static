import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import mockScenarioData from '../../../mock/scenarios.json'

const url = '/#/combine/7'
const exportUrl = '/#/combine/7/21498,20932'

describe('Combine: Export combined scenarios', () => {
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
  })

  it('Exports scenario', () => {
    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.url().should('contain', exportUrl, )

    cy.get(selector('export-selection-button')).click()

    cy.get(selector('export-selection-url')).then(($el) => {
      expect($el[0].value).to.contain(exportUrl)
    })
  })
})
