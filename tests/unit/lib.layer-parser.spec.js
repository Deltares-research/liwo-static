import chai, { expect } from 'chai'
import { normalizeLayerSet, cleanLayerSet } from '@/lib/layer-parser'
import layerSet from './data/layerSet.json'
import chaiThings from 'chai-things'

chai.should()

chai.use(chaiThings)

describe('the layer parser', () => {
  it('normalizes layerSets', () => {
    let normalizedLayerSet = normalizeLayerSet(layerSet)
    expect(normalizedLayerSet).to.have.property('layers')
    expect(normalizedLayerSet).to.have.property('id')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].properties')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].variants')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].legend')
  })
  it('cleans a layerSet', () => {
    let normalizedLayerSet = normalizeLayerSet(layerSet)
    let cleanedLayerSet = cleanLayerSet(normalizedLayerSet)
    expect(cleanedLayerSet.layers).to.all.have.nested.property('properties.title')
  })
})
