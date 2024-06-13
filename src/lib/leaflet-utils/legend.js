import L from '@/lib/leaflet-utils/leaf'

const legendControlPrint = L.Control.extend({
  onAdd: function () {
    const div = L.DomUtil.create('div', 'info legend')
    // make a copy of the legend and add it to the print map
    div.appendChild(this.options.el.cloneNode(true))
    return div
  }
})

const addLegendControl = (options) => {
  L.DomEvent.disableScrollPropagation(options.el);
}

export {
  legendControlPrint,
  addLegendControl,
}
