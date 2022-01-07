import { generateSelector as selector } from '../../../lib/generate-selector'
const url = '#/combined/7/19422,19428/waterdepth'

describe('Combined: metadata is available', () => {
  beforeEach(() => {
    cy.viewport(1500, 1000)
    cy.visit(url)
    cy.intercept(new RegExp(/getFeature/)).as('features')

    cy.wait('@features', { timeout: 20000 })

    cy.wait(5000)
  })

  it('Shows modal when toggle is clicked', () => {
    cy.get(selector('layer-panel')).eq(1)
      .within(() => {
        cy.get(selector('info-toggle')).first().click()

        cy.get(selector('meta-table'))
          .contains('Mapid')

        cy.get(selector('meta-table'))
          .contains('Title')
      })
  })

  it('Modal describes which combined scenario is shown', () => {
    cy.get(selector('layer-panel')).eq(1)
      .within(() => {
        cy.get(selector('info-toggle')).first().click()

        cy.get(`${selector('meta-table')} td`)
          .contains('[ 19422, 19428 ]')
      })
  })
})
