const url = '#/combined/7/14179,20944/arrivaltime?center=52.53669,4.87244&zoom=10'

describe('Combine: combine selection', () => {
  it('combines results', () => {
    cy.intercept(new RegExp(/get_liwo_scenarios_info/)).as('info')

    cy.visit(url)

    cy.wait('@info', {
      timeout: 10000
    })

    cy.wait(500)

    cy.get('.leaflet-marker-icon')
      .eq(0)
      .invoke('attr', 'src')
      .then((srcVal) => {
        console.log(srcVal)
        cy.get('.leaflet-marker-icon')
          .eq(1)
          .invoke('attr', 'src')
          .should('not.eq', srcVal)
      })
  })
})
