import { expect } from 'chai'
import L from 'leaflet'

import renderVue from '@/lib/render-vue'
import { legendControl } from '@/lib/leaflet-utils/legend'

describe('the lib utlities contains a render vue', () => {
  it('renders component', () => {
    const element = renderVue(
      {
        render (createElement) { return createElement('div', this.$slots.default) }
      },
      {}
    )
    expect(element.outerHTML).to.include('<div>')
  })
})

describe('the lib utlities contains a utility to create a legend', () => {
  it('creates a leaflet control', () => {
    const control = legendControl()
    expect(control).to.be.an.instanceof(L.Control)
  })
})
