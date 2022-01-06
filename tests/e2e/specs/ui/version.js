// https://docs.cypress.io/api/introduction/api.html
const version = require('../../../package.json').version

describe('Version', () => {
  it('Renders correct version on ', () => {
    const mockData = {
      VERSION: '1.0.0',
      BACKEND_VERSION: '1.1.0',
      DATASET_VERSION: '1.2.0'
    }

    cy.intercept('webconfig', mockData).as('webconfig')

    cy.visit('/#/about')

    cy.contains('p', `Applicatie versie: ${mockData.VERSION}`)
    cy.contains('p', `Backend versie: ${mockData.BACKEND_VERSION}`)
    cy.contains('p', `Dataset versie: ${mockData.DATASET_VERSION}`)
    cy.contains('p', `User interface versie: ${version}`)
  })
})
