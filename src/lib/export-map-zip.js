import mapConfig from '../map.config'

const apiBase = mapConfig.services.WEBSERVICE_URL
const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export default function ({ layers, name }) {
  const body = JSON.stringify({ layers: layers.join(' '), name })
  return fetch(`${apiBase}/Maps.asmx/DownloadZipFileDataLayers`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body
  })
    .then(res => res.blob())
    .then((blob) => {
      let anchor = document.createElement('a')
      let windowUrl = window.URL || window.webkitURL
      let blobject = new Blob([blob], { type: 'application/zip' })
      let url = windowUrl.createObjectURL(blobject)
      anchor.setAttribute('href', url)
      anchor.setAttribute('download', name + '.zip')
      anchor.click()
      windowUrl.revokeObjectURL(url)
    })
    .catch(error => console.log('ERROR', error))
}
