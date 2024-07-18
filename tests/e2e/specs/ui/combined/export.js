import path from 'path'
import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayerSetData from '../../../mock/layerset.json'

const url = '/#/combined/7/19422,19428/waterdepth?center=52.00010,5.29816&zoom=8'

describe('Combined: export', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')

    cy.visit(url)

    cy.wait('@layerset', { timeout: 4000 })
  })

  // test is disabled due to it taking 5min+, making the test suite exceed timeout
  it.skip('should output a .zip file', () => {
    const fileName = 'export.zip'
    const downloadsFolder = Cypress.config('downloadsFolder')

    cy.wait(2000)
      .then(() => {
        cy.get(selector('init-export-button'))
          .click()

        cy.get(selector('export-combined-button'))
          .click()

        cy.readFile(path.join(downloadsFolder, fileName))
          .then(($res) => {
            // length is equal bytes
            expect($res.length).to.be.greaterThan(5000)
          })
          .should('exist')
      })
  })
})
