import { mount } from '@vue/test-utils'
import LayerControlList from '@/components/LayerControlList.vue'
import { createStore } from 'vuex'
import { expect, beforeEach, it } from 'vitest'

let store
let getters
let actions

beforeEach(() => {
  getters = {
    variantFilterPropertiesIndex: () => () => []
  }
  actions = {
    loadLayerSetById: () => {}
  }
  store = createStore({
    getters,
    actions,
  })
})

it('should have the layer-control-list class', () => {
  const propsData = { layers: [] }
  const { vm } = mount(LayerControlList, {
    store,
    propsData

  })

  expect(vm.$el.className).toContain('layer-control-list')
})

// Test should be changed as UI has changed
it.skip('should have load layers', () => {
  const layers = [
    { id: 3, properties: {}, variants: [] },
    { id: 5, properties: {}, variants: [] }
  ]
  const propsData = { layers }
  const { vm } = mount(LayerControlList, { store, propsData: propsData })

  vm.$nextTick(() => {
    expect(vm.$el.querySelector('.layer-control').className).toContain('layer-control--active')
  })
})
