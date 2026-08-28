<template>
  <div
    class="viewer"
    :class="{ 'viewer--has-notificaton': currentNotifications.length }"
  >
    <div class="viewer__map-wrapper" data-tour-id="liwo-map-combine">
      <liwo-map
        :projection="projection"
        :clusterMarkers="true"
        :layers="selectedLayers"
        :getCustomSearchResults="getCustomSearchResults"
        @map:click="onSelectFeature"
        @marker:mouseover="handleMouseOver"
        @initMap="setMapObject"
      >
        <template v-slot:legend>
          <legend-panel
            :layers="selectedLayers"
            v-if="selectedLayers.length > 0"
          >
            <img :src="`legends/${band}.png`" v-if="band" />
          </legend-panel>
        </template>
      </liwo-map>
      <notification-bar :notifications="currentNotifications" />

      <layer-panel>
        <template v-slot:title>
          <button
            @click="showFilter = true"
            class="layer-control__button"
            v-test="'filter-toggle'"
            data-tour-id="filter-toggle"
          >
            <span class="sr-only">Filter doorbraaklocaties op kansklassen</span>
            <!-- icons are 32x32 but other icons don't fill up the space... -->
            <!-- TODO: use iconfont -->
            <svg
              class="icon"
              width="22"
              height="22"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="black"
                d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"
              ></path>
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

          <div
            class="layer-control layer-control-list__item layerpanel-item__title"
            v-if="loading"
          >
            Scenario's worden geladen
            <div class="lds-dual-ring"></div>
          </div>
          <!-- these correspond to the loaded scenarios based on the selected features -->
          <combine-layer-panel-item
            v-for="(layerSet_, index) in scenarioLayerSets"
            :layers="layerSet_.layers"
            @update:layers="updateLayersInScenarioLayerSets(index, $event)"
            @select:variant="
              selectVariant({
                ...$event,
                layerSet: layerSet_,
                scenarioLayerSetIndex: index,
              })
            "
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
            data-tour-id="combine-button"
          >
            Selectie combineren
          </button>
          <button
            v-if="selectedFeatures.length && selectFeatureMode === 'multiple'"
            class="layer-panel__action"
            @click="showExportCombine = true"
            v-test="'export-selection-button'"
            data-tour-id="export-selection-button"
          >
            Selectie exporteren
          </button>
          <button
            v-if="selectedFeatures.length && selectFeatureMode === 'single'"
            class="layer-panel__action"
            @click="showExport = true"
            data-tour-id="scenario-export"
          >
            Scenario exporteren
          </button>
          <button
            class="layer-panel__action"
            v-if="scenarioMode === 'compute'"
            @click="showExportCombined = true"
            v-test="'init-export-button'"
          >
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M18 17v2H6v-2H3v4c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-4h-3z"
              />
              <path
                d="M11 16.5a1.4 1.4 0 0 0 2 0l5.8-7.3a1.4 1.4 0 0 0-1.7-2l-3.1 2V3.4c0-1-1-1.4-2-1.4s-2 .3-2 1.4v5.8l-3-2a1.4 1.4 0 0 0-1.8 2l5.7 7.3z"
              />
            </svg>
            Kaart exporteren
          </button>
          <button
            v-if="selectFeatureMode === 'multiple'"
            class="layer-panel__action"
            @click="showImportCombine = true"
            v-test="'import-selection-button'"
            data-tour-id="import-selection-button"
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
      <filter-popup v-if="showFilter" @close="showFilter = false" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import LiwoMap from "@/components/LiwoMap.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import LayerPanel from "@/components/LayerPanel.vue";
import LegendPanel from "@/components/LegendPanel.vue";
import CombinePopup from "@/components/CombinePopup.vue";
import ExportPopup from "@/components/ExportPopup.vue";
import CombineLayerPanelItem from "@/components/CombineLayerPanelItem.vue";
/* note that there are some minor casing inconsistencies here  */
/* pop up is the correct spelling, but I'm sticking to the pattern below */
import ExportCombinePopup from "@/components/ExportCombinePopUp.vue";
import ExportCombinedPopup from "@/components/ExportCombinedPopUp.vue";
import ImportCombinePopup from "@/components/ImportCombinePopUp.vue";
import FilterPopup from "@/components/FilterPopup.vue";

import { flattenLayerSet, selectVariantsInLayerSet } from "@/lib/layer-parser";
import buildNotifications from "@/lib/build-layerset-notifications";
import {
  loadBreach,
  getScenarioInfo,
  computeCombinedScenario,
  getFeatureIdsByScenarioIds,
  getFeatureByBreachLocationId,
} from "@/lib/load-breach";

import { BREACH_LAYERS_EN } from "@/lib/liwo-identifiers";
import { EPSG_3857 } from "@/lib/leaflet-utils/projections";
import {
  showLayersInfoPopup,
  showCombinedLayersInfoPopup,
} from "@/lib/leaflet-utils/popup";
import { getScenarioSearchResults } from "@/lib/leaflet-utils/scenario-search-results";

export default {
  name: "CombinePage",
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
    NotificationBar,
  },
  props: {
    // Comes from the router.js
    selectFeatureMode: {
      type: String,
      // multiple/single/disabled
      default: "disabled",
    },
    // do we compute breaches or just look them up
    scenarioMode: {
      type: String,
      // lookup/compute
      default: "lookup",
    },
  },
  data() {
    return {
      // selected features
      selectedFeatures: [],

      // the scenario layerSets
      scenarioLayerSets: [],
      // this is information about computed scenarios
      scenarioInfo: {},
      // the main layerSet collapse
      layerSetCollapsed: false,

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
      projection: EPSG_3857,
    };
  },
  async mounted() {
    /**
     * If the url contains a list of scenarioIds
     * get the layerSet that corresponds to this map
     */
    await this.$store.dispatch("loadLayerSetById", { id: this.layerSetId });
    /** now we can load the scenario layerSets (which will look for the ids in the url) */
    this.loadScenarioLayerSetsByRoute();
  },
  computed: {
    ...mapState([
      "notificationsById",
      "layerSetsById",
      "selectedProbabilities",
      "imminentFlood",
    ]),
    layerSetId() {
      return parseInt(this.$route.params.id, 10);
    },
    band() {
      /**
       * The band from the url
       */
      return this.$route.params.band;
    },
    layerSet() {
      return this.layerSetsById[this.layerSetId];
    },
    currentNotifications() {
      return this.notificationsById[this.layerSetId] || [];
    },
    selectedScenarioIdsPath() {
      /**
       * Gets the list  of selected scenarios,
       * used to generate the current url
       */
      return this.selectedScenarioIds.join(",");
    },
    selectedLayers() {
      if (!this.layerSet) {
        return [];
      }

      let layers = flattenLayerSet(this.layerSet).filter(
        (layer) => layer.layerObj.properties?.visible ?? true,
      );

      /**
       * Make a deep clone, this is needed so we can remove features.
       */
      layers = JSON.parse(JSON.stringify(layers));

      layers = layers.map((layer) => {
        if (!("geojson" in layer)) {
          return layer;
        }

        const geojson = layer.geojson;

        if (this.scenarioMode === "compute") {
          console.log(layer)
          geojson.features = geojson.features.filter((feature) => {
            if (this.scenarioInfo.features) {
              return this.scenarioInfo.features.some(
                (scenarioInfoFeature) =>
                  scenarioInfoFeature.properties.breachlocationid ===
                  feature.properties.id,
              );
            }

            return false;
          });

          geojson.features = geojson.features.map((feature) => {
            feature.properties.selected = true;

            if (this.scenarioInfo.features) {
              const extraInfo = this.scenarioInfo.features.find(
                (scenarioInfoFeature) =>
                  scenarioInfoFeature.properties.breachlocationid ===
                  feature.properties.id,
              );
              const bandNeeded = BREACH_LAYERS_EN[this.band];
              const availableBands = extraInfo.properties.band_names;
              const bandMissing =
                availableBands && !availableBands.includes(bandNeeded);
              if (bandMissing) {
                feature.properties.missing = true;
              } else {
                feature.properties.missing = false;
              }
              Object.assign(feature.properties, extraInfo.properties);
            }

            return feature;
          });
        }

        /**
         * Filter depending on probabilities and imminentFlood filter
         */
        if (this.selectedProbabilities.length || this.imminentFlood) {
          geojson.features = geojson.features.filter((feature) => {
            const checkProbabilities = this.selectedProbabilities.some(
              (item) => feature.properties[item] > 0,
            );
            let checkImminentFlood = false;
            if (this.imminentFlood) {
              checkImminentFlood =
                feature.properties.dreigende_overstroming === 1;
            }
            return checkProbabilities || checkImminentFlood;
          });
        }

        if (!this.selectedProbabilities.length && !this.imminentFlood) {
          geojson.features = [];
        }

        /**
         * Select feature depending on selectedFeatures
         */
        geojson.features = geojson.features.map((feature) => {
          if (
            this.selectedFeatures.some(
              (selectedFeature) =>
                selectedFeature.properties.id === feature.properties.id,
            )
          ) {
            feature.properties.selected = true;
          }
          return feature;
        });

        layer.geojson = geojson;
        return layer;
      });

      /**
       * These are the extra scenarios
       */
      const scenarioLayers = this.scenarioLayerSets
        .flatMap(flattenLayerSet)
        .filter((layer) => layer.layerObj.properties?.visible ?? true);

      /**
       * Now  that we have all layers combine  them
       */
      const selectedLayers = [...layers, ...scenarioLayers];

      const notifications = buildNotifications(selectedLayers);
      notifications.forEach((notification) => {
        /** Add notifications to the main layerSetId number to show up */
        this.$store.commit("addNotificationById", {
          id: this.layerSetId,
          notification,
        });
      });

      return selectedLayers;
    },
    /**
     * The scenarioIds that are currently selected, based on the url
     */
    scenarioIds() {
      if (!this.$route.params.ids) {
        return [];
      }
      let ids = this.$route.params.ids.split(",");
      ids = ids.map((id) => parseInt(id, 10));
      return ids;
    },
    selectedScenarioIds() {
      /**
       * The ids that are used for the combined scenarios are the map_id in the variants
       * we have to scan all layerSets.
       * In the layerSets we have to get all layers (should be one per layerSet)
       * for each layer select the variant that is selected or the first if none is selected
       */
      const ids = [];

      /**
       * Here we have a confusion between different types
       * a scenario can contain multiple layers (e.g. waterdepth, damage)
       * these ids correspond to the first layer (waterdepth) of the scenario
       */
      this.scenarioLayerSets.forEach((layerSet) => {
        if (layerSet.layers.length === 0) {
          console.warn(
            "got back  unexpected empty layerSet from backend",
            layerSet,
          );
          return;
        }

        /**
         * Only select first layer
         * Multiple layers in scenarios are bands
         */
        const layer = layerSet.layers[0];
        const selectedVariant = layer.properties.selectedVariant;
        const variant =
          layer.variants.find((variant) => variant.layer === selectedVariant) ||
          layer.variants[0];

        /**
         * This is the scenario (breach + return period) id in the form scenario_number
         */
        const scenario = variant.layer;
        const scenarioRegex = /^scenario_(\d+)$/;
        const match = scenario.match(scenarioRegex);
        if (!(match && match.length === 2)) {
          console.warn(
            "got back  unexpected scenario id from backend",
            scenario,
          );
        }
        const scenarioId = parseInt(match[1]);
        ids.push(scenarioId);
      });
      return ids;
    },
    getCustomSearchResults() {
      return (query) =>
        getScenarioSearchResults(query, {
          selectFeatureMode: this.selectFeatureMode,
          mapId: this.$route.params.id,
        });
    },
  },
  methods: {
    async loadScenarioLayerSetsByRoute() {
      const featureInfoByScenarioId = await getFeatureIdsByScenarioIds(
        this.scenarioIds,
      );

      if (this.scenarioMode === "compute") {
        await this.getComputedCombinedLayerSet(featureInfoByScenarioId);
      } else {
        const features = Object.entries(featureInfoByScenarioId).map(
          ([, scenario]) =>
            getFeatureByBreachLocationId(
              this.layerSet,
              scenario.breachlocationid,
            ),
        );

        features.map(this.selectFeature);
        await this.getScenarioLayerSets();
      }
    },
    async getComputedCombinedLayerSet(featureInfoByScenarioId) {
      this.loading = true;
      this.layerSetCollapsed = true;
      try {
        const { layerSet } = await computeCombinedScenario(
          this.scenarioIds,
          this.band,
        );
        const scenarioInfo = await getScenarioInfo(
          this.scenarioIds,
          featureInfoByScenarioId,
        );

        this.scenarioInfo = scenarioInfo;
        this.scenarioLayerSets = [layerSet];
      } finally {
        this.loading = false;
      }
    },
    async onSelectFeature(event) {
      if (this.selectFeatureMode === "disabled") {
        return;
      }
      this.selectFeature(event.target.feature);
      await this.getScenarioLayerSets();

      this.updatePath();
    },
    selectFeature(feature) {
      const selectedFeature = this.selectedFeatures.find(
        (selectedFeature) => selectedFeature.id === feature.id,
      );

      /**
       * If the feature is selected we deselect it
       * Otherwise we select it depending on the selectFeatureMode
       */
      if (selectedFeature) {
        selectedFeature.properties.selected = false;
        this.selectedFeatures = this.selectedFeatures.filter(
          (selectedFeature) => selectedFeature.id !== feature.id,
        );
      } else if (this.selectFeatureMode === "multiple") {
        feature.properties.selected = true;
        this.selectedFeatures.push(feature);
      } else {
        /**
         * First reset the features and then set the current feature
         */
        this.selectedFeatures.forEach((feature) => {
          feature.properties.selected = false;
        });
        feature.properties.selected = true;
        this.selectedFeatures = [feature];
      }

      /**
       * If there are no selectedFeatures we reset
       * the UI
       */
      if (this.selectedFeatures.length === 0) {
        this.layerSetCollapsed = false;
      } else {
        this.layerSetCollapsed = true;
      }
    },
    async getScenarioLayerSets() {
      try {
        this.loading = true;
        this.scenarioLayerSets = [];
        this.$store.commit("clearInfoNotificationsById", this.layerSetId);

        this.scenarioLayerSets = await Promise.all(
          this.selectedFeatures.map(async (feature) => {
            const { variantFilterProperties, layerSet } =
              await loadBreach(feature);

            variantFilterProperties.forEach(({ properties, breachId }) => {
              this.$store.commit("setVariantFilterProperties", {
                properties,
                breachId,
              });
            });

            return selectVariantsInLayerSet(layerSet, this.scenarioIds);
          }),
        );
      } finally {
        this.loading = false;
      }
    },
    selectVariant({ layer, layerSet, scenarioLayerSetIndex }) {
      this.$store.commit("clearInfoNotificationsById", this.layerSetId);
      layerSet.layers.forEach((layerSetLayer) => {
        layerSetLayer.properties.selectedVariant = layer;
      });

      this.updateLayersInScenarioLayerSets(
        scenarioLayerSetIndex,
        layerSet.layers,
      );

      this.updatePath();
    },
    setMapObject(mapObject) {
      this.mapObject = mapObject;
      this.mapObject.on("click", (event) => {
        if (this.scenarioMode === "compute") {
          showCombinedLayersInfoPopup({
            map: mapObject,
            selectedLayers: this.selectedLayers,
            latlng: event.latlng,
          });
        } else {
          showLayersInfoPopup({
            map: mapObject,
            selectedLayers: this.selectedLayers,
            position: event.containerPoint,
            latlng: event.latlng,
          });
        }
      });
    },
    handleMouseOver({ feature, marker }) {
      const selectedLayer = this.selectedLayers.find(
        (layer) => layer.layerSet.id === feature.properties.id,
      );
      const name = selectedLayer?.properties.name
        ? selectedLayer.properties.name
        : feature.properties.name;
      const overschrijdingsfrequentie = selectedLayer?.properties
        .Overschrijdingsfrequentie
        ? selectedLayer.properties.Overschrijdingsfrequentie
        : feature.properties.Overschrijdingsfrequentie;

      if (overschrijdingsfrequentie) {
        marker.setTooltipContent(
          `${name} - Kans 1 op ${overschrijdingsfrequentie}`,
        );
      }
    },
    updatePath() {
      /**
       * Replace the url with the ids of the currently loaded scenarios
       * don't put this in a watch because scenario's are loaded asynchronously
       */
      const path = this.selectedScenarioIdsPath;

      /* If the location did not change, we're done */
      if (this.$route.params.ids === path) {
        return;
      }

      this.$router.replace({
        params: {
          ids: path,
        },
        query: this.$route.query,
      });
    },
    updateLayersInLayerSet(layerSet, layers) {
      /**
       * Send new layer to the store
       */
      this.$store.commit("setLayersByLayerSetId", { id: layerSet.id, layers });
    },
    updateLayersInScenarioLayerSets(index, layers) {
      this.scenarioLayerSets[index].layers = layers;
    },
  },
};
</script>

<style>
@import "../components/variables.css";
@import "./viewer.css";
@import "./loading.css";
</style>
