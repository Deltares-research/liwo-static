import Vue from 'vue'
import LayerControlList from '@/components/LayerControlList'
import chai from 'chai'
import chaiDom from 'chai-dom'

chai.use(chaiDom)

const expect = chai.expect

describe('the LayerControlList', () => {
  it('should have the layer-control-list class', () => {
    const Constructor = Vue.extend(LayerControlList)
    let propsData = {layers: []}
    const vm = new Constructor({ propsData: propsData }).$mount()
    expect(vm.$el).to.have.class('layer-control-list')
  })
  it('should have load layers', () => {
    const Constructor = Vue.extend(LayerControlList)
    let layers = [
      {id: 3, properties: {}, variants: []},
      {id: 5, properties: {}, variants: []}
    ]
    let propsData = { layers }
    const vm = new Constructor({ propsData: propsData }).$mount()

    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.layer-control')).to.have.class('layer-control--active')
    })
  })
})
