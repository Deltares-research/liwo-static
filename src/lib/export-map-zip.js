import downloadBlob from './download-blob'
import mapConfig from '../map.config'

const headers = { Accept: '*/*', 'Content-Type': 'application/json' }

export let controller = null;

export async function downloadZipFileDataLayers({ layers, name }) {
  if (controller) {
    controller.abort()
  }
  controller = new AbortController()
  // There is a service available in the backend to download a zipe file
  // get the url, prepare the request and download the zipfile
  const services = await mapConfig.getServices()
  const apiBase = services.WEBSERVICE_URL
  const body = JSON.stringify({ layers, name })
  return fetch(`${apiBase}/Maps.asmx/DownloadZipFileDataLayers`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body,
    signal: controller.signal
  })
    .then(res => res.blob())
  // TODO: don't download a blob when an error page is  returned.
    .then((blob) => {
      downloadBlob({
        blob,
        filename: `${name}.zip`,
        type: 'application/zip'
      })
    })
    .catch(error => { console.warn(error); throw error })
}

export async function downloadLiwoScenarios({ scale, band, liwoIds }) {
  if (controller) {
    controller.abort()
  }
  controller = new AbortController()
  const services = await mapConfig.getServices()
  const apiBase = services.HYDRO_ENGINE_URL
  const body = JSON.stringify({
    liwo_ids: liwoIds,
    band,
    scale,
    export: true
  })
  return fetch(`${apiBase}/get_liwo_scenarios`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body,
    signal: controller.signal
  })
    .then(resp => resp.json())
    .catch(error => { console.warn(error); throw error })
}
