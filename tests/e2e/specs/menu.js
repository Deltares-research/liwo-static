const pages = [
  ['Home', '#/'],
  ['Kaarten', '#/maps'],
  ['Over LIWO', '#/about']
]

describe('Menu', () => {
  it('Contains correct pages', () => {
    cy.visit('/')

    cy.get('nav').within(() => {
      pages.forEach(([title]) => {
        cy.get('a').contains(title).should('be.visible')
      })
    })
  })

  it('Navigates to the correct pages', () => {
    cy.visit('/')

    cy.get('nav').within(() => {
      pages.forEach(([title, url]) => {
        cy.get('a').contains(title).click()
        cy.location().should((loc) => {
          expect(loc.hash).to.eq(url)
        })
      })
    })
  })

  it('Has correct page titles', () => {
    pages.forEach(([title, url]) => {
      cy.visit(url)
      cy.get('header h1').contains(title)
    })
  })
})
