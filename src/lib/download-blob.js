export default function ({ blob, filename, type }) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
    window.navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    let windowUrl = window.URL || window.webkitURL
    let blobject = new Blob([blob], { type })
    let url = windowUrl.createObjectURL(blobject)
    let anchor = document.createElement('a')

    anchor.style = 'display: none'
    anchor.setAttribute('href', url)
    anchor.setAttribute('download', filename)
    anchor.click()
  }
}
