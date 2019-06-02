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
          @select:layer="selectLayer"
          @select:variant="selectVariant({ ...$event, layerSet })"
          :collapsed.sync="layerSetCollapsed"
          :key="layerSet.id"
          >
        </layer-panel-item>
        <!-- these correspond to the loaded scenario's based on the selected features -->
        <layer-panel-item
          v-for="(layerSet_, index) in scenarioLayerSets"
          :layers="layerSet_.layers"
          @update:layers="updateLayersInScenarioLayerSets(index, $event)"
          @select:layer="selectLayer"
          @select:variant="selectVariant({...$event, layerSet: layerSet_, scenarioLayerSetIndex: index})"
          :title="layerSet_.title"
          :key="(layerSet_.feature && layerSet_.feature.id) || layerSet_.id"
          >
          <!-- add scenario layer control options -->
        </layer-panel-item>

      </template>
      <template v-slot:actions>
        <!-- add these buttons to the button section of the layer panel -->
        <!-- use named slots after upgrading to Vue 2.6 -->
        <router-link
          v-if="selectFeatureMode === 'multiple' && selectedFeatures.length"
          :to="{name: 'combined', params: {ids: selectedFeatureIds}}"
          target="_blank"
          >
          <button

            class="layer-panel__action"
            >
            Selectie combineren
          </button>
        </router-link>
        <button
          v-if="selectFeatureMode === 'multiple' && selectedFeatures.length"
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
      :layer="selectedLayer"
      v-if="selectedLayer"
      />
    <!-- shows the export url -->
    <export-combine-popup
      :path="selectedFeatureIds"
      v-if="showExportCombine"
      @close="showExportCombine = false"
      />
    <!-- This import popup navigates to the the new url -->
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
import ExportPopup from '@/components/ExportPopup'
import ExportCombinePopup from '@/components/ExportCombinePopUp'
import ImportCombinePopup from '@/components/ImportCombinePopUp'
import FilterPopup from '@/components/FilterPopup'

import { flattenLayerSet, normalizeLayerSet, cleanLayerSet } from '@/lib/layer-parser'
import buildLayerSetNotifications from '@/lib/build-layerset-notifications'
import { loadBreach, computeCombinedScenario } from '@/lib/load-breach'

import { getLayerType } from '@/lib/liwo-identifiers'
import { iconsByLayerType, redIcon, defaultIcon } from '@/lib/leaflet-utils/markers'
import { EPSG_3857 } from '@/lib/leaflet-utils/projections'

export default {
  name: 'Combine',
  components: {
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
    layerSetId: {
      type: Number
    },
    // Only show selected ids
    filterByIds: {
      type: Boolean,
      default: true
    },
    // can we select features? multiple features?
    selectFeatureMode: {
      type: String,
      // multiple/single/disabled
      default: 'disabled'
    },
    // do we compute breaches or just look them up
    scenarioMode: {
      type: String,
      // lookup/compute
      default: 'lookup'
    }
  },
  data () {
    return {
      // selected features
      selectedFeatures: [],
      // store markers so we can adminster them
      selectedMarkersById: {},

      // the scenario layerSets
      scenarioLayerSets: [],
      // the main layerSet collapse
      layerSetCollapsed: false,
      selectedProbability: 'no_filter',

      // allows to select a layer (for the unit panel)
      selectedLayer: null,

      // menus
      showExport: false,
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
      id: layerSetId
    }

    this.$store.dispatch('loadLayerSetById', options)
      .then(() => {
        // if we just navigated to this list of ids, then we also have to load
        // the scenarios
        this.loadScenarioLayerSets()
      })
  },
  watch: {
    selectedFeatureIds (val) {
      this.$router.replace({
        params: {
          ids: val
        }
      })
    },
    ids (val) {
      console.log('ids changed reloading')
      // if the ids in the url changes than we reload all the scenarioLayerSets
      this.scenarioLayerSets = []
      this.loadScenarioLayerSets()
    }
  },
  computed: {
    ...mapGetters([
      'layerSet',
      'layers',
      'currentNotifications'
    ]),
    ids () {
      // unpack the id string to filter all the features
      if (!this.$route.params.ids) {
        return []
      }
      let ids = this.$route.params.ids.split(',')
      ids = ids.map(id => _.toNumber(id))
      return ids
    },
    selectedFeatureIds  () {
      // pack the  selected feature into an ids string for the url
      let featureIds = _.map(this.selectedFeatures, 'properties.id')
      return featureIds.join(',')
    },
    selectedLayers () {
      // a list of the layers to ber shown in the map
      if (!this.layerSet) {
        return []
      }

      // the main layers
      let layers = flattenLayerSet(this.layerSet)

      layers = layers.filter(layer => {
        let result = _.get(layer.layerObj.properties, 'visible', true)
        return result
      })

      if (this.filterByIds) {
        layers = layers.map(layer => {
          if (_.has(layer, 'geojson')) {
            let features = layer.geojson.features.filter(feature => this.ids.includes(feature.properties.id))
            layer.geojson.features = features
          }
          return layer
        })
      }

      let scenarioLayers = _.flatten(
        this.scenarioLayerSets.map(
          // flatten all layers
          flattenLayerSet
        )
      )

      scenarioLayers = scenarioLayers.filter(layer => {
        let result = _.get(layer.layerObj.properties, 'visible', true)
        return result
      })

      // Now  that we have all layers apply the filters  on the features
      let selectedLayers = [...scenarioLayers, ...layers]

      // filter the geojsons before passing them to the map
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
    }

  },
  methods: {
    updateLayersInLayerSet (layerSet, layers) {
      // send new layers to the store
      this.$store.commit('setLayersByLayerSetId', {id: this.layerSet.id, layers})
    },
    updateLayersInScenarioLayerSets (index, layers) {
      // this method updates the layers in the ScenarioLayerSet at index
      // taking into account https://vuejs.org/v2/guide/list.html#Caveats
      console.log('setting layerSet[i].layers', index, layers)
      // update layers
      this.$set(this.scenarioLayerSets[index], 'layers', layers)
    },
    setMapObject (mapObject) {
      this.mapObject = mapObject
    },
    selectLayer (layer) {
      this.selectedLayer = layer
    },
    selectVariant ({ index, layerSet, scenarioLayerSetIndex, layer }) {
      // store the index of the active variant
      this.$set(layer.properties, 'selectedVariant', index)
      // Store new layers (which now contain the new active variant)
      if (layerSet === this.layerSet) {
        this.updateLayersInLayerSet(layerSet.id, layerSet.layers)
      } else {
        this.updateLayersInScenarioLayerSets(scenarioLayerSetIndex, layerSet.layers)
      }
    },
    async loadScenarioLayerSets () {
      // load all  scenario's

      // nothing to do
      if (!this.ids) {
        return
      }
      // collapse first layer
      this.layerSetCollapsed = true
      // now start loading

      let features = _.map(this.ids, this.getFeatureById)
      // change the selected property
      features.map(feature => { feature.properties.selected = true })

      // select features
      this.selectedFeatures = features
      // If we  selected something we have to load the scenario
      // now that we have selected the features, we can load the corresponding maps
      let promise
      if (this.scenarioMode === 'compute') {
        promise = this.computeScenario(this.selectedFeatures)
      } else {
        promise = Promise.all(
          features.map(feature => {
            // load features
            this.loadFeature(feature)
          })
        )
      }
      return promise
    },
    getFeatureById (id) {
      // get a feature by an id
      // get layes  with a geojson attribute
      let flatLayers = flattenLayerSet(this.layerSet)
      let layers = _.filter(flatLayers, 'geojson')
      let features = _.flatten(_.map(layers, 'geojson.features'))
      let feature = _.find(features, ['properties.id', id])
      return feature
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
      // select the feature
      feature.properties.selected = selected

      // This is a double administration
      // TODO: We now replace the map state each time something changes. This is slow, flickering and uncommon.
      // Change this to using the map as a stateful object that we have to change. This is a bit more complex (aligning two states)
      // but much more common and responsive

      // administer our own  list of  selected features
      if (wasSelected) {
        // now get rid of  the feature
        this.selectedFeatures = _.pull(this.selectedFeatures, feature)
        // get rid of scenarioLayers that are not  currently selected
        let scenarioLayerSets = this.scenarioLayerSets.filter((layerSet) => {
          // if  this layerSet was  created based on our feature, remove it
          let selectedIds = _.map(this.selectedFeatures, 'id')
          return selectedIds.includes(layerSet.feature.id)
        })
        this.scenarioLayerSets = scenarioLayerSets
      } else {
        if (this.selectFeatureMode === 'multiple') {
          this.selectedFeatures.push(feature)
        }
      }
      // set the markers, based on the current selected feature
      let marker = evt.target
      this.setMarkers(feature, marker)

      if (wasSelected) {
        // We deselected something,  we're done
        if (_.isEqual(feature, this.selectedFeature)) {
          this.selectedFeature = null
        }
      }
    },
    setMarkers (feature, marker) {
      // set the appropriate markers
      // TODO: choose if we  want to set or replace markers
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
    async loadFeature (feature) {
      // TODO: move this back the store in a breach module
      // Load the layerSet for the breach and add it to the scenario list
      loadBreach(feature)
        .then(layerSet => {
          // normalize
          layerSet = normalizeLayerSet(layerSet)
          // and clean
          layerSet = cleanLayerSet(layerSet)
          const layers = flattenLayerSet(layerSet)
          const notifications = buildLayerSetNotifications(layers)
          _.each(
            notifications,
            (notification) => {
              // add them to the main layerSetId number to show up
              this.$store.commit('addNotificationById', {id: this.layerSetId, notification})
            }
          )
          // store the scenario layerset
          if (this.selectFeatureMode === 'single') {
            this.scenarioLayerSets = [layerSet]
          } else {
            this.scenarioLayerSets.push(layerSet)
          }
        })
    },
    async computeScenario (features) {
      // Load the layerSet for the breach and add it to the scenario list
      let promise = computeCombinedScenario(features)
      promise
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
          // store the scenario layerset
          this.scenarioLayerSets = [layerSet]
        })
      return promise
    }
  }
}
</script>

<style>
@import '../components/variables.css';
@import './viewer.css';

</style>
