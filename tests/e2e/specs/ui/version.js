describe('Version', () => {
  it('Renders correct version on', () => {
    cy.visit('/#/about')

    cy.wait(1000)

    cy.contains('p', 'Applicatie versie: v2.9.0-w1')
  })
})
