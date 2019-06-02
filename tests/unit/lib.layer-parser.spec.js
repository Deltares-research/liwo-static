import { expect } from 'chai'
import { normalizeLayerSet } from '@/lib/layer-parser'
import layerSet from './data/layerSet.json'

describe('the layer parser', () => {
  it('normalizes layerSets', () => {
    let normalizedLayerSet = normalizeLayerSet(layerSet)
    expect(normalizedLayerSet).to.have.property('layers')
    expect(normalizedLayerSet).to.have.property('id')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].properties')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].variants')
    expect(normalizedLayerSet).to.have.nested.property('layers[0].legend')
  })
})
