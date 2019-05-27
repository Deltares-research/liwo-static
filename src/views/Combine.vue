<template>
<div class="viewer" :class="{'viewer--has-notificaton': currentNotifications.length}">
  <div class="viewer__map-wrapper">
    <liwo-map
      :projection="projection"
      :clusterMarkers="true"
      :layers="layers"
      @click="selectFeature"
      @initMap="setMapObject"
      />
    <notification-bar :notifications="currentNotifications"/>
    <layer-panel>
      <template v-slot:default>
        <!-- These layers are set through the store, TODO: make consistent -->
        <!-- layers can be updated in the panel item -->
        <!-- possible updates: opacity, visiblity -->
        <layer-panel-item
          v-if="layerSet"
          :layers="layerSet.layers"
          @update:layers="updateLayersInLayerSet"
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
          <template v-slot:layer-control-options>
          </template>
        </layer-panel-item>

      </template>
      <template v-slot:actions>
        <!-- add these buttons to the button section of the layer panel -->
        <!-- use named slots after upgrading to Vue 2.6 -->
        <button
          v-if="selectedFeatures.length"
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
  </div>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
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

const PAGE_TITLE = 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
const bands = availableBands.map(getId)

const includedInBands = includedIn(bands)

export default {
  components: {
    CombinePopup,
    ExportCombinePopup,
    ImportCombinePopup,
    ExportPopup,
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
      selectedFeatures: [],
      selectedMarkersById: {},
      extraLayerSets: [],
      layerSetCollapsed: false,
      isMounted: false,
      parsedLayers: [],
      id: 0,
      showExport: false,
      showCombine: false,
      showExportCombine: false,
      showImportCombine: false,
      projection: EPSG_3857
    }
  },
  async mounted () {
    // TODO: where  is the list of  layers for this view?
    const layerSetId = this.layerSetId

    this.$store.commit('setPageTitle', PAGE_TITLE)
    // TODO: this is not used in store
    this.$store.commit('setCurrentBand', this.band)

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
    ...mapState({
      variantIndexForSelectedLayer: (state) => state.visibleVariantIndexByLayerId[this.selectedLayerId]
    }),
    ...mapState([
      'selectedLayerId',
      'visibleLayerIds',
      'selectedBreaches'
    ]),
    ...mapGetters([
      'activeLayerSet',
      'layerSet',
      'panelLayerSets',
      'currentNotifications'
    ]),
    interactiveLayers () {
      if (!this.layerSet) {
        return []
      }
      let layers = this.layerSet.layers
      return layers.filter((layer, index) => layer.iscontrollayer || index === 0)
    },
    layerIds () {
      // unpack the layer id string
      if (!this.ids) {
        return []
      }
      let layerIds = this.ids.split(',')
      layerIds = layerIds.map(id => _.toNumber(id))
      return layerIds
    },
    layers () {
      // a list of the layers to ber shown in the map
      if (!this.layerSet) {
        return []
      }
      let extraLayers = _.flatten(
        this.extraLayerSets.map(
          // flatten all layers
          flattenLayerSet
        )
      )
      let layers = this.activeLayerSet
      return [...extraLayers, ...layers]
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
    selectedLayer () {
      if (!this.panelLayerSets) {
        return
      }

      const selectedLayers = this.panelLayerSets
        .map((layerset) => layerset.layers)
        .reduce((allLayers, layers) => [ ...allLayers, ...layers ], [])
        .filter(({ id }) => this.selectedLayerId === id)

      if (selectedLayers && selectedLayers[0]) {
        // should only be one
        return selectedLayers[0]
      }
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
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    },
    setMapObject (mapObject) {
      this.mapObject = mapObject
    },
    loadCombinedScenarios () {
      this.$store.dispatch('loadCombinedScenario', { band: this.band, layerIds: this.layerIds })
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
      console.log('setting layerSet.layers', index, layers)
      let layerSet = _.clone(this.extraLayerSets[index])
      layerSet.layers = layers
      this.$set(this.extraLayerSets, index, layerSet)
    },
    updateLayersInLayerSet (layers) {
      console.log('update layers in layerSet')
      // send new layers to the store
      this.$store.commit('setLayersByLayerSetId', {id: this.layerSet.id, layers})
    },
    loadFeature (feature) {
      // Load the layerSet for the breach and add it to the extra list
      loadBreach(feature)
        .then(layerSet => {
          // normalize
          layerSet = normalizeLayerSet(layerSet)
          // and clean
          layerSet = cleanLayerSet(layerSet)
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
