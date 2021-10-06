import { generateSelector as selector } from '../../lib/generate-selector'

const url = '#/combine/7'

describe('Combine: filters', () => {
  it('Changes marker image on click', () => {
    cy.intercept(new RegExp(/getFeature/)).as('features')

    cy.visit(url)

    cy.wait('@features', {
      timeout: 20000
    })

    cy.get(selector('filter-toggle'))
      .click()

    cy.get('.leaflet-marker-icon').then($element => {
      const initCount = $element.length

      cy.get(selector('filter-item')).each(($el, index) => {
        if (index === 0) return

        cy.wait(500).then(() => {
          $el.click()

          cy.get('.leaflet-marker-icon').should('not.have.length', initCount)
        })
      })
    })
  })
})
