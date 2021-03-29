import chai, { expect } from 'chai'
import { flattenLayerSet, normalizeLayerSet, cleanLayerSet } from '@/lib/layer-parser'
import layerSet from './data/layerSet.json'
import chaiThings from 'chai-things'

chai.should()

chai.use(chaiThings)

describe('the layer parser', () => {
  it('normalizes layerSets', () => {
    const normalizedLayerSet = normalizeLayerSet(layerSet)
    expect(normalizedLayerSet).to.have.property('layers')
    expect(normalizedLayerSet).to.have.property('id')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].properties')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].variants')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].legend')
  })
  it('cleans a layerSet', () => {
    const normalizedLayerSet = normalizeLayerSet(layerSet)
    const cleanedLayerSet = cleanLayerSet(normalizedLayerSet)
    expect(cleanedLayerSet.layers).to.all.have.nested.property('properties.title')
  })
  it('flattens a layerSet', () => {
    const normalizedLayerSet = normalizeLayerSet(layerSet)
    const cleanedLayerSet = cleanLayerSet(normalizedLayerSet)
    const flatLayers = flattenLayerSet(cleanedLayerSet)
    // the original layer
    expect(flatLayers).to.all.have.nested.property('layerObj.properties.title')
    // the layer id
    expect(flatLayers).to.all.have.nested.property('layerObj.id')
    // the metadata  from the variant
    expect(flatLayers).to.all.have.nested.property('metadata.id')
    // the layerSet
    expect(flatLayers).to.all.have.nested.property('layerSet.id')
    // a title
    expect(flatLayers).to.all.have.nested.property('title')
  })
})
