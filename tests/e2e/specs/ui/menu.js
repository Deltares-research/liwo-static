const pages = [
  ['Contact', '/#/contact'],
  ['Cookies', 'https://www.rijkswaterstaat.nl/cookies'],
  ['Kaarten', '/#/maps'],
  ['Over LIWO', '/#/about'],
  ['Toegankelijkheid', '/#/accessibility']
]

describe('Menu', () => {
  it('Contains correct pages', () => {
    cy.visit('/')

    cy.get('nav')
      .within(() => {
        pages.forEach(([title]) => {
          cy.get('a').contains(title).should('be.visible')
        })
      })
  })

  it('Navigates to the correct pages', () => {
    cy.visit('/')

    cy.get('nav')
      .within(() => {
        cy.get('a').each($a => {
          const anchor = new URL($a[0].href)
          const path = anchor.hash ? `/${anchor.hash}` : anchor.href
          const hasCorrectHref = pages.find(([title, url]) => url === path)
          const url = anchor.hash ? window.location.origin + path : anchor.href

          cy.request(url)
            .its('status')
            .should('eq', 200)

          expect(hasCorrectHref)
            .to.not.eq(undefined)
        })
      })
  })

  it('Has correct page titles', () => {
    cy.visit('/')

    cy.get('nav')
      .within(() => {
        cy.get('a').each($a => {
          const hasCorrectTitle = pages.find(([title]) => $a[0].innerHTML === title)

          expect(hasCorrectTitle)
            .to.not.eq(undefined)
        })
      })
  })
})
