import { mount } from '@vue/test-utils'
import LayerControlList from '@/components/LayerControlList'
import chai from 'chai'
import chaiDom from 'chai-dom'

chai.use(chaiDom)

const expect = chai.expect

describe('the LayerControlList', () => {
  it('should have the layer-control-list class', () => {
    let propsData = {layers: []}
    let {vm} = mount(LayerControlList, {
      propsData
    })
    expect(vm.$el).to.have.class('layer-control-list')
  })
  it('should have load layers', () => {
    let layers = [
      {id: 3, properties: {}, variants: []},
      {id: 5, properties: {}, variants: []}
    ]
    let propsData = { layers }
    const {vm} = mount(LayerControlList, { propsData: propsData })

    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.layer-control')).to.have.class('layer-control--active')
    })
  })
})
