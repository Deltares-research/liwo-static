import { skipOn } from '@cypress/skip-test'
import mockLayerSetData from '../../../mock/layerset.json'
import { generateSelector as selector } from '../../../lib/generate-selector'

const url = '/#/scenarios/7/19422'

describe('Scenarios: metadata is available', () => {
  skipOn('firefox', () => {
    it('Shows modal when toggle is clicked', () => {
      cy.intercept(new RegExp(/GetMap/), '').as('map')
      cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
      cy.visit(url)

      cy.get(selector('layer-panel')).should('be.visible')
      cy.wait('@layerset', { timeout: 4000 })
      cy.wait('@map', { timeout: 4000 })

      cy.get(selector('info-toggle')).first().click()
      cy.contains(selector('meta-table'), 'Scenarionaam')
      cy.contains(selector('meta-table'), 'Scenario ID')
    })
  })
})
