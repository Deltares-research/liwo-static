import { getLayers } from '../../lib/get-layers'
import { generateSelector as selector } from '../../lib/generate-selector'
import { getLayerInfoValue } from '../../../../src/lib/leaflet-utils/get-layer-info-value'

const layers = getLayers()

// selects specified layer in layer list
// should at least be called on first test for layer
function selectLayer (cy, layer) {
  cy.url().then((currentUrl) => {
    if (!currentUrl.includes(`${layer.url}?`)) {
      cy.intercept(new RegExp(/GetLayerSet/)).as('layerset')

      cy.visit(layer.url)

      cy.wait('@layerset')
    }

    // disable all layers
    cy.get('.layer-control__vis-checkbox').each(el => {
      if (el[0].checked) {
        el[0].click({ force: true })
      }
    })

    // enable one specific layer that we want to test
    cy.get(`[data-id="${layer.id}"] input[type="checkbox"]`).click({ force: true })
  })
}

describe('Layer functionalities', () => {
  layers.forEach(layer => {
    it('exports zip file', () => {
      selectLayer(cy, layer)

      const fileName = 'test-filename'

      cy.intercept(new RegExp(/DownloadZipFileDataLayers/))
        .as('apiCheck')

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
    })

    it('renders legend', () => {
      cy.get(selector('legend')).should('exist')
    })

    it('shows popup on click', () => {
      cy.intercept(new RegExp(/GetFeatureInfo/)).as('info')

      cy.get(selector('map'))
        .click('center')
        .wait('@info', (res) => {
          const value = getLayerInfoValue(res.response.body, layer.id)

          if (value) {
            cy.get('.leaflet-popup').should('exist')
          }
        })
    })
  })
})
