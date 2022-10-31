import { generateSelector as selector } from '../../../lib/generate-selector'
import { getLayerInfoValue } from '../../../../../src/lib/leaflet-utils/get-layer-info-value'

// selects specified layer in layer list
// should at least be called on first test for layer
function selectLayer (cy, layer) {
  cy.intercept(new RegExp(/GetLayerSet/)).as('layerset')

  cy.visit('/#/maps')

  cy.wait(100)

  cy.contains('li.layerset-list__list-item a', layer.kaartenset)
    .click()

  cy.wait('@layerset', { timeout: 20000 })
    .its('response.statusCode')
    .should('eq', 200)

  cy.wait(100)

  // disable all layers
  cy.get('.layer-control__vis-checkbox').each($el => {
    if ($el[0].checked) {
      $el[0].click({ force: true })
    }
  })

  cy.wait(100)

  // enable one specific layer that we want to test
  cy.get(`[data-name="${layer.kaartlaag}"] input[type="checkbox"]`).click({ force: true })

  cy.wait(100)

  if (layer.variant) {
    cy.get(`[data-name="${layer.kaartlaag}"]`)
      .within(() => {
        cy.get(selector('variant-select')).select(layer.variant.trim())
      })
  }
}

describe('Layer functionalities', () => {
  Cypress.env('MAP_LAYERS').forEach(layer => {
    it('exports zip file', () => {
      selectLayer(cy, layer)

      const fileName = 'test-filename'

      cy.intercept(new RegExp(/DownloadZipFileDataLayers/)).as('apiCheck')

      cy.get('body').then($body => {
        // only run if export button exists
        if ($body.find(selector('init-export-button')).length) {
          cy.get(selector('init-export-button'))
            .click()

          cy.get(selector('name-input'))
            .type(fileName)

          cy.get(selector('export-file-button'))
            .click()
            .wait('@apiCheck')
            .should((xhr) => {
              const body = xhr.request.body
              expect(body.name).to.equal(fileName)
            })
            .then(({ response }) => {
              // size in bytes
              const size = Number(response.headers['content-length'])

              expect(size).to.be.greaterThan(5000)
            })

          cy.get(selector('close-button')).click()
        }
      })
    })

    it('renders legend', () => {
      cy.wait(100)
      cy.get(selector('legend')).should('exist')
    })

    it('shows popup on click', () => {
      cy.intercept(new RegExp(/GetFeatureInfo/)).as('info')

      cy.wait(100)

      cy.get(selector('map'))
        .click('center')

      cy.wait(100)

      cy.wait('@info', { timeout: 20000 })
        .then((res) => {
          const value = getLayerInfoValue(res.response.body, layer.id)

          if (value) {
            cy.get('.leaflet-popup').should('exist')
          }
        })
    })

    it('shows metadata modal', () => {
      cy.wait(100)

      cy.get(`[data-name="${layer.kaartlaag}"]`)
        .within(() => {
          cy.get(selector('info-toggle')).first().click({ force: true })

          cy.wait(100)

          cy.get(selector('meta-table'))
            .contains('Title')
            .next()
            .should(($el) => {
              expect($el.text().trim()).not.equal('')
            })

          cy.wait(100)

          cy.get(selector('close-button')).click()
        })
    })

    it('renders layer correctly', () => {
      cy.wait(100)

      cy.screenshot(`${layer.kaartenset}__${layer.kaartlaag}__${layer.variant}`)
    })
  })
})
