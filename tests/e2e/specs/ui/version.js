describe('Version', () => {
  it('Renders correct version on', () => {
    cy.visit('/#/about')
    cy.get('[data-test="page-title"]').should('be.visible')
    cy.contains('p', 'Applicatie versie: v2.9.0-w1')
  })
})
