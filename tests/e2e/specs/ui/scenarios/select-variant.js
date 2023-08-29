import { generateSelector as selector } from '../../../lib/generate-selector'

// Use Papendrecht as starting point, because it has more than 2 variants
const url = '/#/scenarios/6/13535?center=51.83468,4.68206&zoom=15'

describe('Scenarios: select variant', () => {
  it('Can select a new variant from the select variant popup', () => {
    cy.intercept(new RegExp(/GetLayerSet/)).as('layerset')
    cy.intercept(new RegExp(/getFeature/)).as('features')
    cy.intercept(new RegExp(/GetBreachLocationId/)).as('breachLocation')
    cy.intercept(new RegExp(/GetScenariosPerBreachGeneric/)).as('scenarios')

    cy.visit(url)

    cy.wait('@features', { timeout: 20000 })
    cy.wait('@layerset', { timeout: 20000 })
    cy.wait('@scenarios', { timeout: 20000 })
    cy.wait('@breachLocation', { timeout: 20000 })

    cy.wait(5000)

    cy.get('button').contains('Wijzig variant').click()

    cy.get('.pop-up__title').contains('Selecteer variant voor Noord km 977.7 (dkr16 AW112)')

    cy.get(selector('resultItem')).should('have.length.above', 0)

    cy.get(`${selector('resultItem')}:first-child > input[type=radio]`).should('be.checked')

    let title = ''

    cy.get(`${selector('resultItem')}:nth-child(2)`).within((item) => {
      title = item.find(selector('variantName')).text()

      cy.wrap(item).find('input[type=radio]').check({ force: true })

      cy.wrap(item).type('{enter}')
    }).then(() => {
      cy.get(selector('variantProperties')).contains(title)
    })
  })
})
