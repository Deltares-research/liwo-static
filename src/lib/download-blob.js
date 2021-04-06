export default function ({ blob, filename, type }) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
    window.navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    const windowUrl = window.URL || window.webkitURL
    const blobject = new Blob([blob], { type })
    const url = windowUrl.createObjectURL(blobject)
    const anchor = document.createElement('a')

    anchor.style = 'display: none'
    anchor.setAttribute('href', url)
    anchor.setAttribute('download', filename)
    anchor.click()
  }
}
