import { generateSelector as selector } from '../../lib/generate-selector'

const topMenuPages = [
  ['Contact', '/#/contact'],
  ['Cookies', 'https://www.rijkswaterstaat.nl/cookies'],
  ['Toegankelijkheid', '/#/accessibility']
]

const mainMenuPages = [
  ['Kaarten', '/#/maps'],
  ['Over LIWO', '/#/about'],
]

describe('Nav', () => {
  it('Top menu contains correct pages', () => {
    cy.visit('/')

    cy.get(selector('top-menu'))
      .within(() => {
        topMenuPages.forEach(([title]) => {
          cy.get('a').contains(title).should('be.visible')
        })
      })
  })

  it('Main menu contains', () => {
    cy.visit('/')

    cy.get(selector('main-menu'))
      .within(() => {
        mainMenuPages.forEach(([title]) => {
          cy.get('a').contains(title).should('be.visible')
        })
      })
  })

  it('Navigates to the correct pages', () => {
    cy.visit('/')

    cy.get(selector('top-menu'))
      .within(() => {
        cy.get('a').each($a => {
          const anchor = new URL($a[0].href)
          const path = anchor.hash ? `/${anchor.hash}` : anchor.href
          const hasCorrectHref = topMenuPages.find(([, url]) => url === path)
          const url = anchor.hash ? window.location.origin + path : anchor.href

          cy.request(url)
            .its('status')
            .should('eq', 200)

          expect(hasCorrectHref)
            .to.not.eq(undefined)
        })
      })

    cy.get(selector('main-menu'))
      .within(() => {
        cy.get('a').each($a => {
          const anchor = new URL($a[0].href)
          const path = anchor.hash ? `/${anchor.hash}` : anchor.href
          const hasCorrectHref = mainMenuPages.find(([, url]) => url === path)
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

    cy.get(selector('top-menu'))
      .within(() => {
        cy.get('a').each($a => {
          const hasCorrectTitle = topMenuPages.find(([title]) => $a[0].innerHTML === title)

          expect(hasCorrectTitle)
            .to.not.eq(undefined)
        })
      })

      cy.get(selector('main-menu'))
      .within(() => {
        cy.get('a').each($a => {
          const hasCorrectTitle = mainMenuPages.find(([title]) => $a[0].innerHTML === title)

          expect(hasCorrectTitle)
            .to.not.eq(undefined)
        })
      })
  })
})
