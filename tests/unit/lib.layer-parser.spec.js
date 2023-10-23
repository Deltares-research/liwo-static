
import { flattenLayerSet, normalizeLayerSet, cleanLayerSet } from '@/lib/layer-parser'
import layerSet from './data/layerSet.json'
import { expect, it } from 'vitest'

it('normalizes layerSets', () => {
  const normalizedLayerSet = normalizeLayerSet(layerSet)

  expect(normalizedLayerSet).to.have.property('layers')
  expect(normalizedLayerSet).to.have.property('id')
  expect(normalizedLayerSet).toHaveProperty(['layers', '0', 'properties'])
  expect(normalizedLayerSet).toHaveProperty(['layers', '0', 'variants'])
  expect(normalizedLayerSet).toHaveProperty(['layers', '0', 'legend'])
})

it('cleans a layerSet', () => {
  const normalizedLayerSet = normalizeLayerSet(layerSet)
  const cleanedLayerSet = cleanLayerSet(normalizedLayerSet)

  expect(cleanedLayerSet).toHaveProperty(['layers', '0', 'properties', 'title'])
})

it('flattens a layerSet', () => {
  const normalizedLayerSet = normalizeLayerSet(layerSet)
  const cleanedLayerSet = cleanLayerSet(normalizedLayerSet)
  const flatLayers = flattenLayerSet(cleanedLayerSet)

  expect(flatLayers).toHaveProperty(['0', 'layerObj', 'properties', 'title'])
  expect(flatLayers).toHaveProperty(['0', 'layerObj', 'id'])
  expect(flatLayers).toHaveProperty(['0', 'metadata', 'id'])
  expect(flatLayers).toHaveProperty(['0', 'layerSet', 'id'])
  expect(flatLayers).toHaveProperty(['0', 'title'])
})
