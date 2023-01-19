const getUrl = (variantId) => `#/scenarios/6/${variantId}?center=51.84278,4.66138&zoom=13`

const variants = [
  {
    id: '19784',
    values: {
      0: '0'
    }
  },
  {
    id: '13535',
    values: {
      0: '1'
    }
  },
  {
    id: '13537',
    values: {
      0: '0'
    }
  },
  {
    id: '13538',
    values: {
      0: '2'
    }
  }
]

describe('Scenarios: marker selection', () => {
  variants.forEach((variant) => {
    it(`Should show the correct input value for variant (${variant.id})`, () => {
      cy.intercept(new RegExp(/GetLayerSet/)).as('layerset')
      cy.intercept(new RegExp(/getFeature/)).as('features')

      cy.reload()

      cy.visit(getUrl(variant.id))

      cy.wait('@layerset', { timeout: 20000 })
      cy.wait('@features', { timeout: 20000 })

      Object.entries(variant.values).forEach(([key, value]) => {
        cy.get('.layer-control__options select').eq(key).should('have.value', value)
      })
    })
  })
})
