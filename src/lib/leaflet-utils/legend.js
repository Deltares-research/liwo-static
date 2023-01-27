import L from '@/lib/leaflet-utils/leaf'

const LegendControl = L.Control.extend({
  onAdd: function () {
    var div = L.DomUtil.create('div', 'info legend')
    // make a copy of the legend and add it to the print map
    div.appendChild(this.options.el.cloneNode(true))
    return div
  }
})

function legendControl (options) {
  return new LegendControl(options)
}

export {
  legendControl
}
