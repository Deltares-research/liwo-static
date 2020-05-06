import downloadBlob from './download-blob'
import mapConfig from '../map.config'

const headers = { 'Accept': '*/*', 'Content-Type': 'application/json' }

export default async function ({ layers, name }) {
  // There is a service available in the backend to download a zipe file
  // get the url, prepare the request and download the zipfile
  let services = await mapConfig.getServices()
  const apiBase = services.WEBSERVICE_URL
  const body = JSON.stringify({ layers, name })
  return fetch(`${apiBase}/Maps.asmx/DownloadZipFileDataLayers`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body
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
    .catch(error => console.warn(error))
}
