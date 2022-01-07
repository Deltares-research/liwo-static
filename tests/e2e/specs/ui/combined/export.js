import path from 'path'
import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import mockDoubleFeaturesData from '../../../mock/doubleFeatureCollection.json'

const url = '#/combined/7/19422,19428/waterdepth'

describe('Combined: export', () => {
  beforeEach(() => {
    cy.viewport(1500, 1000)
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockDoubleFeaturesData).as('features')

    cy.visit(url)

    cy.wait('@features')

    cy.wait(2000)
  })

  it('should output a .zip file', () => {
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
