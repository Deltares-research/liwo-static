<template>
  <div class="viewer" :class="{'viewer--has-notificaton': currentNotifications.length}">
    <div class="viewer__map-wrapper">
      <liwo-map
        :projection="projection"
        :clusterMarkers="true"
        :layers="selectedLayers"
        @map:click="selectFeature"
        @marker:mouseover="handleMouseOver"
        @initMap="setMapObject"
      >
        <template v-slot:legend>
          <legend-panel
            :layers="selectedLayers.map(layer => layer.layerObj)"
            v-if="selectedLayers.length > 0"
          >
            <img :src="`legends/${band}.png`" v-if="band">
          </legend-panel>

        </template>
      </liwo-map>
      <notification-bar :notifications="currentNotifications"/>
      <layer-panel>
        <template v-slot:title>
          <button @click="showFilter = true" class="layer-control__button" v-test="'filter-toggle'">
            <span class="sr-only">Filter doorbraaklocaties op kansklassen</span>
            <!-- icons are 32x32 but other icons don't fill up the space... -->
            <!-- TODO: use iconfont -->
            <svg class="icon" width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="black" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path>
            </svg>
          </button>
        </template>
        <template v-slot:default>
          <!-- These layers are set through the store, TODO: make consistent -->
          <!-- layers can be updated in the panel item -->
          <!-- possible updates: opacity, visiblity -->
          <combine-layer-panel-item
            v-if="layerSet"
            :layers="layerSet.layers"
            @update:layers="updateLayersInLayerSet(layerSet, $event)"
            @select:variant="selectVariant({ ...$event, layerSet })"
            v-model:collapsed="layerSetCollapsed"
            :key="layerSet.id"
          >
          </combine-layer-panel-item>

          <div class="layer-control layer-control-list__item layerpanel-item__title" v-if="loading">
            Scenario's worden geladen
            <div class="lds-dual-ring"></div>
          </div>
          <!-- these correspond to the loaded scenarios based on the selected features -->
          <combine-layer-panel-item
            v-for="(layerSet_, index) in scenarioLayerSets"
            :layers="layerSet_.layers"
            @update:layers="updateLayersInScenarioLayerSets(index, $event)"
            @select:variant="selectVariant({...$event, layerSet: layerSet_, scenarioLayerSetIndex: index})"
            :title="layerSet_.title"
            :key="(layerSet_.feature && layerSet_.feature.id) || layerSet_.id"
          >
            <!-- add scenario layer control options -->
          </combine-layer-panel-item>

        </template>
        <template v-slot:actions>
          <!-- add these buttons to the button section of the layer panel -->
          <!-- use named slots after upgrading to Vue 2.6 -->
          <!-- add this button once export of combined maps is working -->
          <button
            v-if="selectFeatureMode === 'multiple' && selectedFeatures.length"
            class="layer-panel__action"
            @click="showCombine = true"
            v-test="'combine-button'"
          >
            Selectie combineren
          </button>
          <button
            v-if="selectedFeatures.length && selectFeatureMode === 'multiple' "
            class="layer-panel__action"
            @click="showExportCombine = true"
            v-test="'export-selection-button'"
          >
            Selectie exporteren
          </button>
          <button
            v-if="selectedFeatures.length && selectFeatureMode === 'single'"
            class="layer-panel__action"
            @click="showExport = true"
          >
            Scenario exporteren
          </button>
          <button
            class="layer-panel__action"
            v-if="scenarioMode === 'compute'"
            @click="showExportCombined = true"
            v-test="'init-export-button'"
          >
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M18 17v2H6v-2H3v4c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-4h-3z"/>
              <path d="M11 16.5a1.4 1.4 0 0 0 2 0l5.8-7.3a1.4 1.4 0 0 0-1.7-2l-3.1 2V3.4c0-1-1-1.4-2-1.4s-2 .3-2 1.4v5.8l-3-2a1.4 1.4 0 0 0-1.8 2l5.7 7.3z"/>
            </svg>
            Kaart exporteren
          </button>
          <button
            v-if="selectFeatureMode === 'multiple'"
            class="layer-panel__action"
            @click="showImportCombine = true"
            v-test="'import-selection-button'"
          >
            Selectie importeren
          </button>
        </template>
      </layer-panel>
      <combine-popup
        :path="selectedScenarioIdsPath"
        :layer-set-id="layerSetId"
        @close="showCombine = false"
        v-if="showCombine"
        ></combine-popup>
      <!-- This popup is shown in single mode -->
      <export-popup
        v-if="showExport"
        :map-object="mapObject"
        :map-layers="selectedLayers"
        @close="showExport = false"
      />
      <!-- shows the export url in multiple  mode-->
      <export-combine-popup
        :path="selectedScenarioIdsPath"
        v-if="selectFeatureMode === 'multiple' && showExportCombine"
        @close="showExportCombine = false"
      />
      <!-- shows the export url in combined  mode-->
      <export-combined-popup
        :map-object="mapObject"
        :map-layers="selectedLayers"
        v-if="showExportCombined"
        @close="showExportCombined = false"
      />
      <!-- This import popup navigates to the the new url -->
      <import-combine-popup
        v-if="showImportCombine"
        :current-selected-ids="selectedScenarioIdsPath"
        @close="showImportCombine = false"
        @update="loadScenarioLayerSetsByRoute"
      />
      <filter-popup
        v-if="showFilter"
        @close="showFilter = false"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import _ from 'lodash'

import LiwoMap from '@/components/LiwoMap.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import LayerPanel from '@/components/LayerPanel.vue'
import LegendPanel from '@/components/LegendPanel.vue'
import CombinePopup from '@/components/CombinePopup.vue'
import ExportPopup from '@/components/ExportPopup.vue'
import CombineLayerPanelItem from '@/components/CombineLayerPanelItem.vue'
/* note that there are some minor casing inconsistencies here  */
/* pop up is the correct spelling, but I'm sticking to the pattern below */
import ExportCombinePopup from '@/components/ExportCombinePopUp.vue'
import ExportCombinedPopup from '@/components/ExportCombinedPopUp.vue'
import ImportCombinePopup from '@/components/ImportCombinePopUp.vue'
import FilterPopup from '@/components/FilterPopup.vue'

import { flattenLayerSet, normalizeLayerSet, cleanLayerSet, selectVariantsInLayerSet } from '@/lib/layer-parser'
import buildLayerSetNotifications from '@/lib/build-layerset-notifications'
import { loadBreach, getScenarioInfo, computeCombinedScenario, getFeatureIdsByScenarioIds } from '@/lib/load-breach'

import { getLayerType, BREACH_LAYERS_EN } from '@/lib/liwo-identifiers'
import { iconsByLayerType, redIcon, defaultIcon } from '@/lib/leaflet-utils/markers'
import { EPSG_3857 } from '@/lib/leaflet-utils/projections'
import { showLayersInfoPopup, showCombinedLayersInfoPopup } from '@/lib/leaflet-utils/popup'

export default {
  name: 'CombinePage',
  components: {
    CombinePopup,
    ExportCombinePopup,
    ExportCombinedPopup,
    ImportCombinePopup,
    ExportPopup,
    FilterPopup,
    LayerPanel,
    CombineLayerPanelItem,
    LegendPanel,
    LiwoMap,
    NotificationBar
  },
  props: {
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
      // this is information about computed scenarios
      scenarioInfo: {},
      // the main layerSet collapse
      layerSetCollapsed: false,

      // features loaded by Url, constructed during mount
      featureIds: [],

      // loading icon and guard against continuous reloading
      loading: false,

      // menus
      /* we have three different export menus (regular maps, the combine view and in the combine*d* view, with the results ) */
      showExport: false,
      showExportCombine: false,
      showExportCombined: false,
      showImportCombine: false,
      showCombine: false,
      showFilter: false,

      // map projection
      projection: EPSG_3857
    }
  },
  async mounted () {
    // If the url contains a list of scenarioIds
    // get the layerSet that corresponds to this map
    const layerSetId = this.layerSetId
    // store it
    this.$store.commit('setLayerSetId', layerSetId)
    // load the corresponding layerSet
    await this.$store.dispatch('loadLayerSetById', { id: layerSetId })
    // now we can load the scenario layerSets (which will look for the ids in the url)
    this.loadScenarioLayerSetsByRoute()
  },
  computed: {
    // we get the default layerSet from the store
    ...mapGetters([
      'layerSet',
      'layers',
      'currentNotifications'
    ]),
    ...mapState(['imminentFlood', 'selectedProbabilities']),
    layerSetId () {
      return parseInt(this.$route.params.id, 10)
    },
    scenarioIds () {
      // unpack the id string to filter all the features
      if (!this.$route.params.ids) {
        return []
      }
      let ids = this.$route.params.ids.split(',')
      ids = ids.map(id => parseInt(id, 10))
      return ids
    },
    band () {
      // the band  from the url
      return this.$route.params.band
    },
    selectedScenarioIdsPath () {
      // get the list  of selected scenarios, used to generate the current url
      return this.selectedScenarioIds.join(',')
    },
    selectedScenarioIds () {
      // the ids that are used for the combined scenarios are the map_id in the variants
      // we have to scan all layerSets
      // in the layerSets we have to get all layers (should be one per layerSet)
      // for each layer select the variant that is selected or the first if none is selected.
      const ids = []
      // TODO: restructure backend
      // here we have a confusion between different types
      // a scenario can contain multiple layers (e.g. waterdepth, damage)
      // these ids correspond to the first layer (waterdepth) of the scenario
      this.scenarioLayerSets.forEach(layerSet => {
        if (layerSet.layers.length === 0) {
          console.warn('got back  unexpected empty layerSet from backend', layerSet)
          return
        }

        // Only select first layer
        // multiple layers in scenarios are bands
        const layer = layerSet.layers[0]
        const selectedVariant = layer.properties.selectedVariant
        const variant = layer.variants.find(variant => variant.layer === selectedVariant) || layer.variants[0]
        // this is the scenario (breach + return period) id in the form scenario_number
        const scenario = variant.layer
        const scenarioRe = /^scenario_(\d+)$/
        const match = scenario.match(scenarioRe)
        if (!(match && match.length === 2)) {
          console.warn('got back  unexpected scenario id from backend', scenario)
        }
        const scenarioId = parseInt(match[1])
        ids.push(scenarioId)
      })
      return ids
    },
    selectedLayers () {
      // a list of the layers to ber shown in the map
      if (!this.layerSet) {
        return []
      }

      // the main layers, restructured so we can load them into leaflet
      let layers = flattenLayerSet(this.layerSet)

      layers = layers.filter(layer => {
        // toss  out the invisible layers
        const layerVisible = _.get(layer.layerObj.properties, 'visible', true)
        return layerVisible
      })

      // make a deep clone (this is faster than lodash deepClone)
      // this is needed so we can remove features
      // TODO: optimize this (using omit?)
      layers = JSON.parse(JSON.stringify(layers))

      layers = layers.map(layer => {
        if (!_.has(layer, 'geojson')) {
          return layer
        }
        // TODO: do this using stylesheet
        // replace markers by circle markers and add classes so we can style this
        const geojson = layer.geojson
        if (this.filterByIds) {
          // this is true for the combined scenario
          geojson.features = _.filter(geojson.features, (feature) => {
            // if we are filtering by Id
            return (this.featureIds.includes(feature.properties.id))
          })
          geojson.features = _.map(geojson.features, (feature) => {
            feature.properties.selected = true
            // find extra info from the loaded scenarioInfo
            if (this.scenarioInfo.features) {
              const extraInfo = this.scenarioInfo.features.find((f) => f.properties.breachlocationid === feature.properties.id)
              // english band name
              const bandNeeded = BREACH_LAYERS_EN[this.band]
              const availableBands = extraInfo.properties.band_names
              const bandMissing = availableBands && !availableBands.includes(bandNeeded)
              if (bandMissing) {
                feature.properties.missing = true
              } else {
                feature.properties.missing = false
              }
              Object.assign(feature.properties, extraInfo.properties)
            }

            /* TODO: set scenario info to missing */
            return feature
          })
        }

        // if feature is not selected, filter by probabilities
        if (this.selectedProbabilities.length || this.imminentFlood) {
          geojson.features = _.filter(geojson.features, (feature) => {
            const checkProbabilities = this.selectedProbabilities.some(item => feature.properties[item] > 0)
            let checkImminentFlood = false
            if (this.imminentFlood) {
              checkImminentFlood = feature.properties.dreigende_overstroming === 1
            }
            return checkProbabilities || checkImminentFlood
          })
        }

        // if no probabilities are selected, return an empty array of features
        if (!this.selectedProbabilities.length && !this.imminentFlood) {
          geojson.features = []
        }

        const selectedFeatureIds = _.map(this.selectedFeatures, 'properties.id')
        geojson.features = _.map(geojson.features, (feature) => {
          // set feature selected to true
          if (selectedFeatureIds.includes(feature.properties.id)) {
            feature.properties.selected = true
          }
          return feature
        })
        // store  the new geojson in the layer
        layer.geojson = geojson
        // return the new layer
        return layer
      })
      // these are the extra scenarios
      let scenarioLayers = _.flatten(
        this.scenarioLayerSets.map(
          // flatten all layers
          flattenLayerSet
        )
      )

      // also filter these by visibility
      scenarioLayers = scenarioLayers.filter(layer => {
        const layerVisible = _.get(layer.layerObj.properties, 'visible', true)
        return layerVisible
      })

      // Now  that we have all layers combine  them
      const selectedLayers = [...layers, ...scenarioLayers]

      return selectedLayers
    },
    controlLayers () {
      if (!this.layers) {
        return []
      }

      return this.layers
        .filter(layer => layer.iscontrollayer)
        .map(({ layerObj }) => layerObj)
    }
  },
  methods: {
    updateLayersInLayerSet (layerSet, layers) {
      // send new layers to the store
      this.$store.commit('setLayersByLayerSetId', { id: layerSet.id, layers })
    },
    updateLayersInScenarioLayerSets (index, layers) {
      this.scenarioLayerSets[index].layers = layers
    },
    updatePath () {
      // replace the url with the ids of the currently loaded scenarios
      // don't put this in a watch because scenario's are loaded asynchronously
      const path = this.selectedScenarioIdsPath

      if (this.$route.params.ids === path) {
        /* location did not change, we're done */
        return
      }

      this.$router.replace({
        params: {
          ids: path
        },
        query: this.$route.query
      })
    },
    selectVariant ({ layer, layerSet, scenarioLayerSetIndex }) {
      _.each(layerSet.layers, (layerSetLayer) => {
        layerSetLayer.properties.selectedVariant = layer
      })

      // Store new layers (which now contain the new active variant)
      if (layerSet === this.layerSet) {
        // TODO: move this to store
        this.updateLayersInLayerSet(layerSet.id, layerSet.layers)
      } else {
        // store the index in all layers, because layers in the scenario
        // are actually bands that share the same variant....
        // TODO: move band selection to more logic location, now it is magic...
        // TODO: move this to scenario module  in store
        this.updateLayersInScenarioLayerSets(scenarioLayerSetIndex, layerSet.layers)

        // show the notification for this variant
        this.$store.commit('clearInfoNotificationsById', this.layerSetId)
        const layers = flattenLayerSet(layerSet)
        const notifications = buildLayerSetNotifications(layers)

        _.each(
          notifications,
          (notification) => {
            // add them to the main layerSetId number to show up
            this.$store.commit('addNotificationById', { id: this.layerSetId, notification })
          }
        )
      }
      // now that the new variant is selected we can update the path
      this.updatePath()
    },
    async loadScenarioLayerSetsByRoute () {
      // A bit long function name but it gets a bit complex here
      // We have two conditions that can cause the list of scenario is to load to change
      // - features, selected  on the map
      // - ids,  changes in the url
      // Currently the ids in the url are changed after the features are loaded
      // we could use the url as the source of truth,  but that is not the case at the moment.

      // Set the loading icon
      this.loading = true

      // we need to get the features first as we are filtering the layer using these
      const featureInfoByScenarioId = await getFeatureIdsByScenarioIds(this.scenarioIds)
      const featureIds = _.filter(_.map(featureInfoByScenarioId, 'breachlocationid'))
      // get all uniq ids
      this.featureIds = _.uniq(featureIds)

      if (this.scenarioMode === 'compute') {
        // if we are  computing, we can pass them on
        const layerSet = await this.computeScenario(this.scenarioIds)
        const scenarioInfo = await getScenarioInfo(this.scenarioIds, featureInfoByScenarioId)
        this.scenarioLayerSets = [layerSet]
        this.scenarioInfo = scenarioInfo
      } else {
        // If we are interacting we need to lookup the corresponding features
        const features = _.map(this.featureIds, this.getFeatureById)
        const layerSets = await this.loadScenarioLayerSetsByFeatures(features)
        this.scenarioLayerSets = layerSets
      }
      // we are done, hide the loading icon
      this.loading = false
    },
    async loadScenarioLayerSetsByFeatures (features) {
      // load all  scenarios
      this.scenarioLayerSets = []

      if (_.isEmpty(features)) {
        return Promise.resolve([])
      }
      // collapse first layer
      this.layerSetCollapsed = true
      // now start loading

      // change the selected property
      features.map(feature => { feature.properties.selected = true })

      // select features
      this.selectedFeatures = features
      // If we  selected something we have to load the scenario
      // now that we have selected the features, we can load the corresponding maps
      let layerSets = []
      const promises = features.map(feature => this.loadFeature(feature))
      layerSets = await Promise.all(promises)
      // store the scenario layerset
      return layerSets
    },
    getFeatureById (id) {
      // get a feature by an id
      // get layes  with a geojson attribute
      const flatLayers = flattenLayerSet(this.layerSet)
      const layers = _.filter(flatLayers, 'geojson')
      const features = _.flatten(_.map(layers, 'geojson.features'))
      const feature = _.find(features, ['properties.id', id])
      return feature
    },
    async selectFeature (evt) {
      if (this.selectFeatureMode === 'disabled') {
        return
      }
      // Set the loading icon
      this.loading = true

      // because a new feature is selected, we have to clear the old warning notifications
      this.$store.commit('clearWarningNotificationsById', this.layerSetId)

      const feature = evt.target.feature
      // this is the code to enable/disable the markers
      // TODO: check if we need to use properties.id or feature.id
      const selectedFeatureIds = _.map(this.selectedFeatures, 'properties.id')
      const selected = !_.includes(selectedFeatureIds, feature.properties.id)
      // this looks a bit double, but it's easier to read
      const wasSelected = !selected

      // set feature properties for reactive components
      // deselect all features
      this.selectedFeatures.map(feature => {
        feature.properties.selected = false
      })

      // select the feature
      feature.properties.selected = selected

      // This is a double administration
      // TODO: We now replace the map state each time something changes. This is slow, flickering and uncommon.
      // Change this to using the map as a stateful object that we have to change. This is a bit more complex (aligning two states)
      // but much more common and responsive

      // administer our own  list of  selected features
      if (wasSelected) {
        // now get rid of  the feature
        _.remove(this.selectedFeatures, (otherFeature) => {
          return otherFeature.properties.id === feature.properties.id
        })
        // get rid of scenarioLayers that are not  currently selected
        const scenarioLayerSets = this.scenarioLayerSets.filter((layerSet) => {
          // if  this layerSet was  created based on our feature, remove it
          const selectedIds = _.map(this.selectedFeatures, 'id')
          return selectedIds.includes(layerSet.feature.id)
        })
        this.scenarioLayerSets = scenarioLayerSets

        if(!this.scenarioLayerSets.length) {
          this.layerSetCollapsed = false
        }
      } else if(this.selectFeatureMode === 'multiple') { // we just selected this feature, add it to the list
        this.selectedFeatures.push(feature)
      } else {
        this.selectedFeatures = [feature]
      }

      // set the markers, based on the current selected feature
      const marker = evt.target
      this.setMarkers(feature, marker)

      if (wasSelected) {
        // if we deselected the selectedFeature reset the selectedFeature
        if (_.isEqual(feature, this.selectedFeature)) {
          this.selectedFeature = null
        }
      }
      // now manually load the layerSets that correspond to the current selection
      const layerSets = await this.loadScenarioLayerSetsByFeatures(this.selectedFeatures)
      this.scenarioLayerSets = layerSets
      // we are done, hide the loading icon
      this.loading = false

      // and update the path
      this.updatePath()
    },
    setMarkers (feature, marker) {
      // set the appropriate markers
      // TODO: replace feature reloading with this marker  update code
      if (!feature.properties.selected) {
        // feature is no longer selected
        // get the old marker and reset it
        // TODO: use old icon.
        const layerType = getLayerType(feature)
        const icon = _.get(iconsByLayerType, layerType, defaultIcon)
        marker.setIcon(icon)
        delete this.selectedMarkersById[feature.id]
      } else {
        // we are setting a marker
        if (this.selectFeatureMode === 'single') {
          // clear old markers
          const markersToReset = _.values(this.selectedMarkersById)
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
      // TODO: move this back the store in a scenario module
      // Load the layerSet for the breach and add it to the scenario list
      let layerSet = await loadBreach(feature, this.layerSetId)
      // normalize
      layerSet = normalizeLayerSet(layerSet)
      // and clean
      layerSet = cleanLayerSet(layerSet)

      _.each(layerSet.layers, layer => {
        layer.breachId = layerSet.id
      })
      layerSet = selectVariantsInLayerSet(layerSet, this.scenarioIds)
      // before showing new notifications, clear existing ones
      this.$store.commit('clearInfoNotificationsById', this.layerSetId)

      const layers = flattenLayerSet(layerSet)
      const notifications = buildLayerSetNotifications(layers)

      _.each(
        notifications,
        (notification) => {
          // add them to the main layerSetId number to show up
          this.$store.commit('addNotificationById', { id: this.layerSetId, notification })
        }
      )
      return layerSet
    },
    async computeScenario (scenarioIds) {
      // TODO: move this back to the store in a scenario module
      this.layerSetCollapsed = true
      // Load the layerSet for the breach and add it to the scenario list
      let layerSet = await computeCombinedScenario(scenarioIds, this.band, this.layerSetId)
      // normalize
      layerSet = normalizeLayerSet(layerSet)
      // and clean
      layerSet = cleanLayerSet(layerSet)

      // Set the first layer as visible
      _.each(layerSet.layers, layer => {
        layer.properties.visible = false
      })
      if (!_.isEmpty(layerSet.layers)) {
        _.first(layerSet.layers).properties.visible = true
      }
      // store the scenario layerset
      return layerSet
    },
    setMapObject (mapObject) {
      // add a tooltip if the map is clicked
      this.mapObject = mapObject
      // TODO: implement in GEE
      this.mapObject.on('click', (event) => {
        if (this.scenarioMode === 'compute') {
          showCombinedLayersInfoPopup({
            map: mapObject,
            selectedLayers: this.selectedLayers,
            latlng: event.latlng
          })
          return
        }

        showLayersInfoPopup({
          map: mapObject,
          selectedLayers: this.selectedLayers,
          position: event.containerPoint,
          latlng: event.latlng
        })
      })
    },
    handleMouseOver ({ feature, marker }) {
      const selectedLayer = this.selectedLayers.find(layer => layer.layerSet.id === feature.properties.id)

      if (feature.properties.Overschrijdingsfrequentie) {
        marker.setTooltipContent(`${feature.properties.name} - Kans 1 op ${feature.properties.Overschrijdingsfrequentie}`)
      }

      if (marker.feature.properties.selected && selectedLayer) {
        marker.setTooltipContent(`${feature.properties.name} - ${selectedLayer.title}`)
      }
    }
  }
}
</script>

<style>
  @import '../components/variables.css';
  @import './viewer.css';
  @import './loading.css';
</style>
