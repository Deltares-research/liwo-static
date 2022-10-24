import { generateSelector as selector } from '../../../lib/generate-selector'

const url = '/#/scenarios/7'
const filterMarkerCounts = {
  'probability-lt30': 36,
  'probability-f30t300': 64,
  'probability-f300t3000': 60,
  'probability-f3000t30k': 37,
  'probability-gt30k': 24
}

describe('Scenarios: filters', () => {
  it('Changes marker count when filtering', () => {
    cy.intercept(new RegExp(/getFeature/)).as('features')

    cy.visit(url)

    cy.wait('@features', { timeout: 20000 })

    cy.get(selector('filter-toggle'))
      .click()

    cy.get('.leaflet-marker-icon').then($element => {
      const initCount = $element.length

      cy.get(selector('filter-item')).each(($el, index) => {
        if (index === 0) return

        const id = $el[0].getAttribute('for')

        cy.wait(500).then(() => {
          $el.click()

          cy.get('.leaflet-marker-icon')
            .should('not.have.length', initCount)
            .should('have.length', filterMarkerCounts[id])
        })
      })
    })
  })
})
