import { expect } from 'chai'
import renderVue from '@/lib/render-vue'

describe('the lib utlities contains a render vue', () => {
  it('renders component', () => {
    let element = renderVue(
      {
        render (createElement) { return createElement('div', this.$slots.default) }
      },
      {}
    )
    expect(element.outerHTML).to.include('<div>')
  })
})
