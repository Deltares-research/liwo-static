const mockData = {
  mode: 'open',
  layersets: [
    {
      name: 'test-title',
      id: 1,
      layerset: [
        {
          id: 1,
          name: 'test-map-name',
          route: 'viewer'
        }
      ]
    }
  ]
}

describe('Maps list', () => {
  it('Renders list of links retrieved from API', () => {
    cy.intercept('Login', {
      d: JSON.stringify(mockData)
    }).as('maps')

    cy.visit('/#/maps')

    cy.wait('@maps').then(() => {
      cy.contains('h3', mockData.layersets[0].name)
      cy.contains('li', mockData.layersets[0].layerset[0].name)
    })
  })
})
