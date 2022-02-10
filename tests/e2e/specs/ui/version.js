// https://docs.cypress.io/api/introduction/api.html
const version = require('../../../../package.json').version

describe('Version', () => {
  it('Renders correct version on ', () => {

    cy.visit('/#/about')

    cy.contains('p', `User interface versie: ${version}`)
  })
})
