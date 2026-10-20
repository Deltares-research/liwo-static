import { generateSelector as selector } from '../../../lib/generate-selector'
import mockLayersetData from '../../../mock/layerset.json'
import { variantIds } from '../../../support/constants'

const url = '/#/combine/7'
const exportUrl = `/#/combine/7/${variantIds.slice(0,2).join(',')}`
console.log(exportUrl)
describe('Combine: Export combined scenarios', () => {
  beforeEach(() => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayersetData).as('layerset')
    cy.intercept("POST", new RegExp(/GetScenariosPerBreachGeneric/)).as('scenario')

    cy.visit(url)

    cy.get(selector('layer-panel')).should('be.visible')
    cy.wait('@layerset', { timeout: 4000 })
  })

  it('Exports scenario', () => {
    cy.get('.leaflet-marker-icon')
      .eq(1)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.get('.leaflet-marker-icon')
      .eq(2)
      .click({ force: true })
    cy.wait('@scenario', { timeout: 4000 })

    cy.url().should('contain', exportUrl, )

    cy.get(selector('export-selection-button')).click()

    cy.get(selector('export-selection-url')).then(($el) => {
      expect($el[0].value).to.contain(exportUrl)
    })
  })
})
