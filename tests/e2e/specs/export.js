import path from 'path'
import { skipOn } from '@cypress/skip-test'
import { generateSelector as selector } from '../lib/generate-selector'

const url = '#/viewer/34'

describe('Maps export', () => {
  before(() => {
    cy.visit(url)
  })

  it('Prints map', () => {
    cy.window().then(win => {
      cy.stub(win, 'print')
    })

    // use specific selector because class is generated by plugin
    cy.get('.leaflet-browser-print').click()

    cy.window().its('print').should('be.called')
  })

  it('exports zip file', () => {
    const fileName = 'test-filename'

    cy.intercept(new RegExp(/DownloadZipFileDataLayers/))
      .as('apiCheck')

    cy.get(selector('init-export-button'))
      .click()

    cy.get(selector('name-input'))
      .type(fileName)

    cy.get(selector('export-button'))
      .click()
      .wait('@apiCheck')
      .should((xhr) => {
        const body = xhr.request.body
        expect(body.name).to.equal(fileName)
      })
      .its('response')
      .should('deep.include', {
        statusCode: 200,
        statusMessage: 'OK'
      })

    cy.get(selector('close-button')).click()
  })

  // checking for specific file does not work in firefox
  skipOn('firefox', () => {
    it('Exports as image', () => {
      const fileName = `test-filename-${new Date().getTime()}`
      const downloadsFolder = Cypress.config('downloadsFolder')

      // use specific selector because class is generated by plugin
      cy.get('.leaflet-control-image')
        .click()

      cy.get(selector('name-input'))
        .type(fileName)

      cy.wait(1000)

      cy.get(selector('export-button'))
        .click()

      cy.readFile(path.join(downloadsFolder, `${fileName}.png`))
        .should('exist')
    })
  })
})
