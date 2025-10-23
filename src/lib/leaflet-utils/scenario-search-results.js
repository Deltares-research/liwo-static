import sanitizeValue from '../../lib/sanitize-value'
import { getFeatureIdByScenarioId } from "../load-breach";

export async function getScenarioSearchResults(query, { selectFeatureMode, mapId }) {
  const queries = query.split(',')
  if (queries && queries.every(q => isNaN(q)) || selectFeatureMode === 'disabled') return []
  return Promise.all(
    queries.map(id => {
      const trimmedId = id.trim()
      if (isNaN(trimmedId)) return;
      return getFeatureIdByScenarioId(Number(trimmedId)).then((result) => ({
        name: result.breachlocationname,
        id: result.scenarioId,
        link: `/${selectFeatureMode === 'single' ? 'scenarios' : 'combine'}/${mapId}/${result.scenarioId}`,
        html: sanitizeValue(`<span>${result.breachlocationname}</span><br/><span class="leaflet-control-geocoder-address-context">Scenario id: ${result.scenarioId}</span>`),
        })).catch(() => undefined)
    })
  )
  .then(results => results.filter(r => r))
  .then(results => {
    if (selectFeatureMode === 'multiple' && results.length > 1) {
      const commaSeparatedIds = results.map(r => r.id).join(',')
      return [...results, {
        name: `Combineer ${commaSeparatedIds}`,
        id: commaSeparatedIds,
        link: `/combine/${mapId}/${commaSeparatedIds}`,
        html: sanitizeValue(`<span>Combineer scenario ids: ${commaSeparatedIds}</span><br/><span class="leaflet-control-geocoder-address-context">${results.map(r => r.name).join(', ')}</span>`),
      }]
    }

    if (results.length === 1) {
      return [...results, { name: '' }]
    }

    return results
  }).catch(() => [])
}
