const fs = require('fs')
const path = require('path')
const csv2json = require('./csv-to-json')

module.exports = function getLayers () {
  const layersCsv = fs.readFileSync(path.join(__dirname, '../data/Kaartlagen_LIWO.csv'), 'utf8')
  const layersJSon = csv2json(layersCsv)
  return layersJSon
}
