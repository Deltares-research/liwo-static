import { generateSelector as selector } from '../../../lib/generate-selector'
import { getLayerInfoValue } from '../../../../../src/lib/leaflet-utils/get-layer-info-value'

// selects specified layer in layer list
// should at least be called on first test for layer
function selectLayer (cy, layer) {
  cy.intercept(new RegExp(/GetLayerSet/)).as('layerset')

  cy.visit('/#/maps')

  cy.wait(500)

  cy.contains('li.layerset-list__list-item a', layer.kaartenset)
    .click({ force: true })

  cy.wait('@layerset', { timeout: 20000 })
    .its('response.statusCode')
    .should('eq', 200)

  // disable all layers
  cy.get('.layer-control__vis-checkbox').each(el => {
    if (el[0].checked) {
      el[0].click({ force: true })
    }
  })

  cy.wait(200)

  // enable one specific layer that we want to test
  cy.get(`[data-name="${layer.kaartlaag}"] input[type="checkbox"]`)
    .click({ force: true })

  cy.wait(4000)

  if (layer.variant) {
    cy.get(`[data-name="${layer.kaartlaag}"]`)
      .then(() => {
        cy.wait(200)

        // trick to conditionally check for existence of element
        cy.get('body')
          .then($body => {
            const layerHasVariantSelect = $body.find(`[data-name="${layer.kaartlaag}"] ${selector('variant-select')}`).length
            return Boolean(layerHasVariantSelect)
          })
          .then(layerHasVariantSelect => {
            // only continue if variant select exists
            if (layerHasVariantSelect) {
              cy.get(selector('variant-select'))
                .then(($el) => {
                  const hasOptions = $el[0].options.length
                  return Boolean(hasOptions)
                })
                .then(hasOptions => {
                  // only continue if variant select has options
                  if (hasOptions) {
                    cy.get(selector('variant-select'))
                      .eq(0)
                      .select(layer.variant.trim(), { force: true })
                      .then($el => {
                        const selected = $el[0].selectedOptions[0]
                        expect(selected.label).to.equal(layer.variant.trim())
                      })
                  }
                })
            }
          })
      })
  }
}

describe('Layer functionalities', () => {
  Cypress.env('MAP_LAYERS').forEach((layer, index) => {
    it('exports zip file', () => {
      selectLayer(cy, layer)

      const fileName = 'test-filename-' + (index + 1)

      cy.get('body').then($body => {
        // only run if export button exists
        if ($body.find(selector('init-export-button')).length) {
          cy.intercept(new RegExp(/DownloadZipFileDataLayers/)).as('apiCheck')

          cy.get(selector('init-export-button'))
            .click({ force: true })

          cy.wait(500)

          cy.get(selector('name-input'))
            .type(fileName)

          cy.wait(500)

          cy.get(selector('export-file-button'))
            .click({ force: true })

          cy.wait(500)

          cy.wait('@apiCheck', { timeout: 100000 })
            .then((xhr) => {
              const body = xhr.request.body
              expect(body.name).to.equal(fileName)
            })
            .then(({ response }) => {
              // size in bytes
              const size = Number(response.headers['content-length'])

              expect(size).to.be.greaterThan(5000)
            })

          cy.get(selector('close-button'))
            .click({ force: true })
        }
      })
    })

    it('renders legend', () => {
      cy.wait(500)
      cy.get(selector('legend')).should('exist')
    })

    it('shows popup on click', () => {
      cy.intercept(new RegExp(/GetFeatureInfo/)).as('info')

      cy.wait(1000)

      cy.get(selector('map'))
        .click('center', { force: true })

      cy.wait('@info', { timeout: 20000 })
        .then((res) => {
          const value = getLayerInfoValue(res.response.body, layer.id)

          if (value) {
            cy.get('.leaflet-popup').should('exist')
          }
        })
    })

    it('shows metadata modal', () => {
      cy.wait(1000)

      cy.get(`[data-name="${layer.kaartlaag}"]`)
        .within(() => {
          cy.get(selector('info-toggle'))
            .first()
            .click({ force: true })

          cy.wait(1000)

          cy.get(selector('meta-table'))
            .contains('Title')
            .next()
            .should(($el) => {
              expect($el.text().trim()).not.equal('')
            })

          cy.get(selector('close-button'))
            .click({ force: true })
        })
    })

    it('renders layer correctly', () => {
      cy.wait(100)

      cy.screenshot(`${layer.kaartenset}__${layer.kaartlaag}__${layer.variant}`)
    })
  })
})
