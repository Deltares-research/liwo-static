// https://docs.cypress.io/api/introduction/api.html

describe('Content of the page', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'LIWO')
    cy.get('.landing-body a')
      .should('have.prop', 'href')
      .and('equal', 'https://www.overstroomik.nl/')

  })
})

describe('Maps', () => {
  it('Opens the Bekijk Overstromingsscenario\'s map', () => {
    cy.visit('#/scenarios/6')
    cy.contains('h1', "Bekijken overstromingsscenario's")

    cy.get('#gebiedsindeling_doorbraaklocaties_regionaal__LIWO_Basis_Doorbraaklocaties_Regionaal > .layer-control__main > .layer-control__vis-label')
      .click()

    cy.get('#gebiedsindeling_doorbraaklocaties_primair__LIWO_Basis_Doorbraaklocaties_Primair .layer-control__title')
      .click()

    cy.screenshot()

  })
})
