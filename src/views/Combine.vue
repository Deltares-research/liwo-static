<template>
<div class="viewer" :class="{'viewer--has-notificaton': currentNotifications.length}">
  <div class="viewer__map-wrapper">
    <liwo-map
      :projection="projection"
      :clusterMarkers="true"
      :layers="selectedLayers"
      @click="selectFeature"
      @initMap="setMapObject"
      />
    <notification-bar :notifications="currentNotifications"/>
    <layer-panel>
      <template v-slot:title>
        <button @click="showFilter = true" class="layer-control__button">
          <!-- icons are 32x32 but other icons don't fill up the space... -->
          <svg class="icon" width="27" height="27" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="black" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path></svg>
        </button>
      </template>
      <template v-slot:default>
        <!-- These layers are set through the store, TODO: make consistent -->
        <!-- layers can be updated in the panel item -->
        <!-- possible updates: opacity, visiblity -->
        <layer-panel-item
          v-if="layerSet"
          :layers="layerSet.layers"
          @update:layers="updateLayersInLayerSet(layerSet, $event)"
          :collapsed.sync="layerSetCollapsed"
          :key="layerSet.id"
          >
        </layer-panel-item>
        <!-- this view keeps track of it's own extra layerSets -->
        <!-- these correspond to the loaded scenario's based on the selected features -->
        <layer-panel-item
          v-for="(layerSet_, index) in extraLayerSets"
          :layers="layerSet_.layers"
          @update:layers="updateLayersInExtraLayerSets(index, $event)"
          :title="layerSet_.title"
          :key="layerSet_.id"
          >
          <!-- add extra layer control options -->
        </layer-panel-item>
      </template>
      <template v-slot:actions>
        <!-- add these buttons to the button section of the layer panel -->
        <!-- use named slots after upgrading to Vue 2.6 -->
        <button
          v-if="selectFeatureMode === 'multiple' && selectedFeatures.length"
          class="layer-panel__action"
          @click="showCombine = true"
          >
          Selectie combineren
        </button>
        <button
          v-if="selectedFeatures.length"
          class="layer-panel__action"
          @click="showExportCombine = true"
          >
          Selectie exporteren
        </button>
        <button
          v-if="selectFeatureMode === 'multiple'"
          class="layer-panel__action"
          @click="showImportCombine = true"
          >
          Selectie importeren
        </button>
      </template>
    </layer-panel>
    <legend-panel
      v-if="visibleLayerLegend"
      :caption="visibleLayerLegend.title"
      :namespace="visibleLayerLegend.namespace"
      :layer-name="visibleLayerLegend.layer"
      :style-name="visibleLayerLegend.style"
      />
    <combine-popup
      v-if="showCombine"
      @close="showCombine = false"
      />
    <export-combine-popup
      v-if="showExportCombine"
      @close="showExportCombine = false"
      />
    <import-combine-popup
      v-if="showImportCombine"
      @close="showImportCombine = false"
      />
    <filter-popup
      v-if="showFilter"
      @close="showFilter = false"
      :probability.sync="selectedProbability">
    </filter-popup>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

import LiwoMap from '@/components/LiwoMap'
import NotificationBar from '@/components/NotificationBar.vue'
import LayerPanel from '@/components/LayerPanel'
import LayerPanelItem from '@/components/LayerPanelItem'
import LegendPanel from '@/components/LegendPanel'
import CombinePopup from '@/components/CombinePopup'
import ExportPopup from '@/components/ExportPopup'
import ExportCombinePopup from '@/components/ExportCombinePopUp'
import ImportCombinePopup from '@/components/ImportCombinePopUp'
import FilterPopup from '@/components/FilterPopup'

import { flattenLayerSet, normalizeLayerSet, cleanLayerSet } from '@/lib/layer-parser'
import loadBreach from '@/lib/load-breach'

import { getLayerType } from '@/lib/liwo-identifiers'
import { iconsByLayerType, redIcon, defaultIcon } from '@/lib/leaflet-utils/markers'
import { EPSG_3857 } from '@/lib/leaflet-utils/projections'
// TODO: check what logic we had here
// import { selectFeatures } from '@/lib/selection'
// import { showLayerInfoPopup } from '@/lib/leaflet-utils/popup'
import { isTruthy, includedIn, notEmpty, notNaN, getId } from '../lib/utils'
import availableBands from '../lib/available-bands'

const bands = availableBands.map(getId)

const includedInBands = includedIn(bands)

export default {
  components: {
    CombinePopup,
    ExportCombinePopup,
    ImportCombinePopup,
    ExportPopup,
    FilterPopup,
    LayerPanel,
    LayerPanelItem,
    LegendPanel,
    LiwoMap,
    NotificationBar
  },
  props: {
    filterByIds: {
      type: Boolean,
      default: true
    },
    // don't use this, use the computed layerIds
    ids: {
      type: String
    },
    band: {
      type: String,
      required: false
    },
    selectFeatureMode: {
      type: String,
      default: 'disabled'
    },
    layerSetId: {
      type: Number
    }
  },
  data () {
    return {
      // selected features
      selectedFeatures: [],
      // store markers so we can adminster them
      selectedMarkersById: {},

      // the extra layerSets
      extraLayerSets: [],
      // the main layerSet collapse
      layerSetCollapsed: false,

      selectedProbability: 'no_filter',

      // allows to select a layer (for the unit panel)
      selectedLayerId: null,
      selectedVariantIndexByLayerId: {},

      // menus
      showExport: false,
      showCombine: false,
      showExportCombine: false,
      showImportCombine: false,
      showFilter: false,

      // map projection
      projection: EPSG_3857
    }
  },
  async mounted () {
    // TODO: where  is the list of  layers for this view?
    const layerSetId = this.layerSetId

    this.$store.commit('setLayerSetId', layerSetId)

    let options = {
      id: layerSetId,
      initializeMap: true,
      filterByIds: this.filterByIds,
      selectMultipleFeatures: this.selectMultipleFeatures
    }
    this.$store.dispatch('loadLayerSetById', options)
    this.isMounted = true
    console.log('done mounting')
  },
  computed: {
    ...mapGetters([
      'layerSet',
      'layers',
      'currentNotifications'
    ]),
    layerIds () {
      // unpack the layer id string
      if (!this.ids) {
        return []
      }
      let layerIds = this.ids.split(',')
      layerIds = layerIds.map(id => _.toNumber(id))
      return layerIds
    },
    selectedLayers () {
      // a list of the layers to ber shown in the map
      if (!this.layerSet) {
        return []
      }

      // the main layers
      let layers = flattenLayerSet(this.layerSet, this.selectedVariantIndexByLayerId)

      layers = layers.filter(layer => {
        let result = _.get(layer.layerObj.properties, 'visible', true)
        return result
      })

      let extraLayers = _.flatten(
        this.extraLayerSets.map(
          // flatten all layers
          flattenLayerSet
        )
      )

      extraLayers = extraLayers.filter(layer => {
        let result = _.get(layer.layerObj.properties, 'visible', true)
        return result
      })

      // Now  that we have all layers apply the filters  on the features
      let selectedLayers = [...extraLayers, ...layers]

      selectedLayers = _.map(selectedLayers, (layer) => {
        // TODO: filter geojson by probability index
        if (_.has(layer, 'geojson')) {
          // shallow clone is enough
          layer = _.clone(layer)
          let geojson = _.clone(layer.geojson)
          geojson.features = _.filter(geojson.features, (feature) => {
            if (this.selectedProbability === 'no_filter') {
              return true
            }
            let result = feature.properties[this.selectedProbability] > 0
            return result
          })
          layer.geojson = geojson
        }
        return layer
      })

      return selectedLayers
    },

    validLayerIds () {
      return notEmpty(this.layerIds) && this.layerIds
        .map(id => _.isNumber(id) && notNaN(id))
        .every(isTruthy)
    },
    validBand () {
      return includedInBands(this.band)
    },
    combinedSenarioCanBeLoaded () {
      return this.validLayerIds && this.validBand
    },
    visibleLayerLegend () {
      if (!this.selectedLayer) {
        return undefined
      }

      return {
        ...this.selectedLayer.legend,
        layerType: this.selectedLayer.variants[0].type
      }
    }
  },
  methods: {
    updateLayersInLayerSet (layerSet, layers) {
      // send new layers to the store
      this.$store.commit('setLayersByLayerSetId', {id: this.layerSet.id, layers})
    },
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    },
    setMapObject (mapObject) {
      this.mapObject = mapObject
    },
    loadCombinedScenarios () {
      this.$store.dispatch('loadCombinedScenario', { band: this.band, layerIds: this.layerIds })
    },
    selectLayer (layer) {
      this.selectedLayerId = layer.id
      // if no variant has been selected yet
      if (!_.has(this.selectedVariantIndexByLayerId, layer.id)) {
        // select first variant
        this.$set(this.selectedVariantIndexByLayerId, layer.id, 0)
      }
    },

    selectFeature (evt) {
      if (this.selectFeatureMode === 'disabled') {
        return
      }
      let feature = evt.target.feature
      // this is the code to enable/disable the markers
      let selected = !_.includes(this.selectedFeatures, feature)
      // this looks a bit double, but it's easier to read
      let wasSelected = !selected

      if (this.selectFeatureMode === 'single') {
        // deselect all features
        this.selectedFeatures.map(feature => {
          feature.properties.selected = false
        })
      }
      // This is a double administration
      // TODO: choose to change map state (more complex) or redraw each time (slow)
      // keep state in feature also, so we can pass it alon
      feature.properties.selected = selected
      // was selected, now not, remove it
      if (wasSelected) {
        // now get rid of  the feature
        this.selectedFeatures = _.pull(this.selectedFeatures, feature)
      } else {
        if (this.selectFeatureMode === 'multiple') {
          this.selectedFeatures.push(feature)
        }
      }
      // set the markers, based on the current selected feature
      let marker = evt.target
      this.setMarkers(feature, marker)
      this.loadFeature(feature)

      // collapse first layer
      this.layerSetCollapsed = true
    },
    setMarkers (feature, marker) {
      // set the appropriate markers
      if (!feature.properties.selected) {
        // feature is no longer selected
        // get the old marker and reset it
        // TODO: use old icon.
        let layerType = getLayerType(feature)
        let icon = _.get(iconsByLayerType, layerType, defaultIcon)
        marker.setIcon(icon)
        delete this.selectedMarkersById[feature.id]
      } else {
        // we are setting a marker
        if (this.selectFeatureMode === 'single') {
          // clear old markers
          let markersToReset = _.values(this.selectedMarkersById)
          _.each(
            markersToReset,
            (marker) => {
              marker.setIcon(defaultIcon)
            }
          )
          this.selectedMarkersById = {}
          this.selectedFeatures = [feature]
        }
        this.selectedMarkersById[feature.id] = marker
        marker.setIcon(redIcon)
      }
    },
    updateLayersInExtraLayerSets (index, layers) {
      // this method updates the layers in the ExtraLayerSet at index
      // taking into account https://vuejs.org/v2/guide/list.html#Caveats
      console.log('setting layerSet[i].layers', index, layers)
      // update layers
      this.$set(this.extraLayerSets[index], 'layers', layers)
    },
    loadFeature (feature) {
      // Load the layerSet for the breach and add it to the extra list
      loadBreach(feature)
        .then(layerSet => {
          // normalize
          layerSet = normalizeLayerSet(layerSet)
          // and clean
          layerSet = cleanLayerSet(layerSet)
          // Set the first layer as visible
          _.each(layerSet.layers, layer => {
            layer.properties.visible = false
          })
          _.first(layerSet.layers).properties.visible = true
          // store the extra layerset
          if (this.selectFeatureMode === 'single') {
            this.extraLayerSets = [layerSet]
          } else {
            this.extraLayerSets.push(layerSet)
          }
        })
    }
  }
}
</script>

<style>
@import '../components/variables.css';
@import './viewer.css';

</style>
