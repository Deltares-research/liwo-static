import { mount, createLocalVue } from '@vue/test-utils'
import LayerControlList from '@/components/LayerControlList'
import chai from 'chai'
import chaiDom from 'chai-dom'
import Vuex from 'vuex'

chai.use(chaiDom)
const localVue = createLocalVue()

localVue.use(Vuex)
const expect = chai.expect

describe('the LayerControlList', () => {
  let store
  let getters
  let mutations
  let actions
  beforeEach(() => {
    getters = {
      variantFilterPropertiesIndex: () => () => []
    }
    actions = {
      loadLayerSetById: () => {}
    }
    mutations = {
      setLayerSetId: () => {}
    }
    store = new Vuex.Store({
      getters,
      actions,
      mutations
    })
  })

  it('should have the layer-control-list class', () => {
    const propsData = { layers: [] }
    const { vm } = mount(LayerControlList, {
      store,
      propsData
    })
    expect(vm.$el).to.have.class('layer-control-list')
  })
  it('should have load layers', () => {
    const layers = [
      { id: 3, properties: {}, variants: [] },
      { id: 5, properties: {}, variants: [] }
    ]
    const propsData = { layers }
    const { vm } = mount(LayerControlList, { store, propsData: propsData })

    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.layer-control')).to.have.class('layer-control--active')
    })
  })
})
