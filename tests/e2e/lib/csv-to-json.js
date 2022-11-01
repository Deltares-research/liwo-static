// converts a CSV string to JSON
module.exports = function csv2json (csv) {
  const lines = csv.split('\n')
  const result = []
  const headers = lines[0].split(';')

  for (var i = 1; i < lines.length; i++) {
    if (lines[i].length) {
      const currentline = lines[i].split(';')
      const obj = {}

      if (currentline.length) {
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j]
        }

        result.push(obj)
      }
    }
  }

  return result
}
