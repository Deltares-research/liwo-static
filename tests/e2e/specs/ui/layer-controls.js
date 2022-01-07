import { generateSelector as selector } from '../../lib/generate-selector'

describe('Layers', () => {
  beforeEach(() => {
    // skip loading of map layers since we can't rely on their loading times
    // and are they not relevant for these tests
    cy.intercept(new RegExp(/GetMap/), '')
  })

  it('Changes opacity of layer', () => {
    const url = '#/viewer/1?center=52.15382,4.88242&zoom=2'

    cy.intercept('GetLayerSet').as('layerSet')

    cy.visit(url)

    cy.wait('@layerSet')

    cy.get(`${selector('transparancy-input')} input`)
      .invoke('val', 0.5)
      .trigger('change')

    const opacityValues = []

    cy.get('.leaflet-layer').each(layer => {
      cy.get(layer).invoke('css', 'opacity').then(value => opacityValues.push(value))
    })

    cy.wait(100).then(() => {
      // eslint-disable-next-line no-unused-expressions
      expect(opacityValues.some(value => value === '0.5')).to.be.true
    })
  })

  it('Changes visibility of layer', () => {
    const url = '#/viewer/18?center=52.15382,4.88242&zoom=2'
    cy.visit(url)

    cy.get(`${selector('legend')} img`).invoke('attr', 'src').then(initSrc => {
      cy.get(`${selector('layer-toggle')} label`)
        .eq(2)
        .click()

      cy.get(`${selector('legend')} img`).invoke('attr', 'src').then(newSrc => {
        expect(initSrc).to.not.equal(newSrc)
      })
    })
  })
})
