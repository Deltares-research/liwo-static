import _ from 'lodash'

import store from '@/store'

import { BREACH_PRIMARY, BREACH_REGIONAL, getLayerType } from '@/lib/liwo-identifiers'
import mapConfig from '../map.config'

const BREACHES_BASE_URL = mapConfig.services.WEBSERVICE_URL
const BREACHES_API_URL = `${BREACHES_BASE_URL}/Tools/FloodImage.asmx/GetScenariosPerBreachGeneric`

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export async function loadBreach (feature) {
  // Load breach data from the geoserver

  // the breach id is hidden here
  let breachId = feature.properties.id

  // TODO: there's also a code PRIM, should we not use that?
  let layerType = getLayerType(feature)

  // we have different breach layers, depending on the type
  let breachLayers = []
  if (layerType === BREACH_REGIONAL) {
    breachLayers = [`${BREACH_REGIONAL}.${breachId}`]
  } else if (layerType === BREACH_PRIMARY) {
    breachLayers = [
      'waterdiepte',
      'stroomsnelheid',
      'stijgsnelheid',
      'schade',
      'slachtoffers'
    ]
  }

  let promises = breachLayers.map(
    layerName => loadBreachLayer(breachId, layerName)
  )

  // the layers are a bit out of order, so restructure them
  // TODO: consider making this async, otherwise we lock the browser
  let bands = await Promise.all(promises)
  // remove undefined/null bands
  bands = _.filter(bands)

  // merge layers of all unorganized sets
  // and use the feature name
  let layers = _.flatten(_.map(bands, 'layers'))
  let layerSet = {
    id: breachId,
    feature: feature,
    name: feature.properties.naam,
    title: feature.properties.naam,
    layers: layers
  }
  return layerSet
}

export async function computeBreaches (features) {
  // Load combined breaches map, computed by the backend
  // The computation is done in Google Earth Engine / HydroEngine
  // the breach id is hidden here
  let breachIds = _.map(features, 'properties.id')

  let breachLayersEn = {
    'waterdepth': 'waterdiepte',
    'velocity': 'stroomsnelheid',
    'riserate': 'stijgsnelheid',
    'damage': 'schade',
    'fatalities': 'slachtoffers'
  }

  // load  all the variants
  let promises = _.keys(breachLayersEn).map(
    bandName => loadBreachesLayer(breachIds, bandName)
  )
  // the layers are a bit out of order, so restructure them
  // TODO: consider making this async, otherwise we lock the browser
  let bands = await Promise.all(promises)

  // remove undefined/null bands
  bands = _.filter(bands)

  // convert bands to layerlike objects
  let layers = _.map(bands, (band) => {
    // if it looks like a layer, then it is a layer
    let bandNl = _.get(breachLayersEn, band.band)
    let title = bandNl
    band.title = title
    band.metadata = _.clone(band)
    band.map = {
      type: 'tile',
      url: band.url
    }
    let layer = {
      id: band.mapid,
      variants: [band],
      title: title,
      legend: {
        layer: 'geo_maximale_waterdiepte_2015_nederland',
        title: 'Gecombineerd Scenario [-]',
        geojson_style: '',
        namespace: 'LIWO_MEGO',
        // we get the band from the default  scenario
        style: `LIWO_Basis_${bandNl}`
      }
    }
    return layer
  })
  let layerSet = {
    id: breachIds.join(','),
    features,
    name: 'Combined scenario',
    title: 'Combined scenario',
    layers
  }
  return layerSet
}

function loadBreachLayer (breachId, layerName) {
  // Load the dataset  for a breach
  return fetch(BREACHES_API_URL, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers,
    body: JSON.stringify({
      breachid: breachId,
      layername: layerName
    })
  })
    .then(res => res.json())
  // get rid of some ASP  fluff
    .then(data => JSON.parse(data.d))
    .then(data => ({ ...data[0].layerset[0] }))
    .catch(() => null)
}

export default function loadBreachesLayer (breachIds, band) {
  // TODO: choose appropriate reducer for the band
  // The band here relates to  quantitites
  let reducer = 'max'
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liwo_ids: breachIds, band, reducer })
  }

  return fetch('https://hydro-engine.appspot.com/get_liwo_scenarios', requestOptions)
    .then(text => text.json())
    .then(response => ({ ...response, type: 'tile' }))
    .catch((resp) => {
      let notification = `failed to load ${band} for breachIDs ${breachIds}`
      // notifiy of failure
      store.commit('addNotificationById', {id: breachIds.join(','), notification})
      return null
    })
}
