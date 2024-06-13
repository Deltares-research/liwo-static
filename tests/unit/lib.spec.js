import L from 'leaflet'

import { legendControlPrint } from '@/lib/leaflet-utils/legend'
import { expect, it } from 'vitest'

it('creates a leaflet control on print', () => {
  const control = legendControlPrint()
  expect(control).to.be.an.instanceof(L.Control)
})
