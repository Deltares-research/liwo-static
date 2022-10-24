const layerSets = Cypress.env('MAP_LAYERS').reduce((acc, layer) => {
  const existing = acc.find(item => item.name === layer.categorie)
  if (existing) {
    if (!existing.layers.includes(layer.kaartenset)) {
      existing.layers.push(layer.kaartenset)
    }
  } else {
    acc.push({
      name: layer.categorie,
      layers: [layer.kaartenset]
    })
  }

  return acc
}, [])

describe('Maps list', () => {
  it('Renders list of links retrieved from API', () => {
    cy.visit('/#/maps')

    layerSets.forEach((layerSet) => {
      layerSet.layers.forEach(layer => {
        cy.contains('h3', layerSet.name)
          .parent()
          .contains('li', layer)
      })
    })
  })
})
