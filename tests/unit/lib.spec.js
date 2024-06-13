import L from 'leaflet'

import { legendControl } from '@/lib/leaflet-utils/legend'
import { expect, it } from 'vitest'

it('creates a leaflet control on print', () => {
  const control = legendControl()
  expect(control).to.be.an.instanceof(L.Control)
})
