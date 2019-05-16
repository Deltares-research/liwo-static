export default function loadCombinedScenario ({ layerIds, band }) {
  // TODO: check what a liwo_id is??
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liwo_ids: layerIds, band, reducer: 'max' })
  }

  return fetch('https://hydro-engine.appspot.com/get_liwo_scenarios', requestOptions)
    .then(text => text.json())
    .then(response => ({ ...response, type: 'tile' }))
}
