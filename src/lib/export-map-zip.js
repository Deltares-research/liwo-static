import downloadBlob from './download-blob'
import mapConfig from '../map.config'

const apiBase = mapConfig.services.WEBSERVICE_URL
const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export default function ({ layers, name }) {
  const body = JSON.stringify({ layers, name })
  return fetch(`${apiBase}Maps.asmx/DownloadZipFileDataLayers`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body
  })
    .then(res => res.blob())
    .then((blob) => {
      downloadBlob({
        blob,
        filename: `${name}.zip`,
        type: 'application/zip'
      })
    })
    .catch(error => console.log('ERROR', error))
}
