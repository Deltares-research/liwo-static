import mapConfig from "../map.config.js";
import { loadGeojson } from "./load-geojson";
import { cleanLayerSet, normalizeLayer } from "./layer-parser.js";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function getLayerSetById(id) {
  const body = JSON.stringify({ id });

  const services = await mapConfig.getServices();
  const apiBase = services.WEBSERVICE_URL;
  let layerSet = await fetch(`${apiBase}/Maps.asmx/GetLayerSet`, {
    method: "POST",
    mode: "cors",
    headers,
    body,
  })
    .then((res) => res.json())
    .then((data) => JSON.parse(data.d))
    .then((data) => data.layerset)
    .catch((error) => {
      console.error(`Error fetching the layerSets: ${error}`);
      return [];
    });

  return {
    ...layerSet,
    title: layerSet.name || layerSet.title,
  };
}

/**
 * We load the geojson for each variant.
 * If there is no geojson we return the variant as is
 */
export async function getGeojsonByVariant(variant) {
  const geojson = await loadGeojson(variant.map);
  if (geojson) {
    variant.map.geojson = geojson;
  }
  return variant;
}

export async function getCleanLayerSetByRawLayerSet(layerSet) {
  const layers = await Promise.all(
    layerSet.layers.map(async (layer) => {
      const variants = await Promise.all(
        layer.variants.map(getGeojsonByVariant),
      );

      const nameSplit = layer.name.split(" - ");
      const title = Array.isArray(nameSplit)
        ? nameSplit[nameSplit.length - 1]
        : layer.name;

      const mappedLayer = {
        ...layer,
        id: layer.layer_id || layer.id,
        title,
        variants,
      };

      return normalizeLayer(mappedLayer);
    }),
  );

  return cleanLayerSet({
    ...layerSet,
    layers,
  });
}

export async function loadLayerSetById(id) {
  const layerSetRaw = await getLayerSetById(id);
  const layerSet = await getCleanLayerSetByRawLayerSet(layerSetRaw);
  return layerSet;
}

export async function loadLayerSets() {
  /**
   * @note we don't need to login anymore, but the function
   *       is still used to get the list of public maps
   */
  const body = JSON.stringify({
    username: "anonymous@rws.nl",
    password: "",
    mode: "",
  });
  const services = await mapConfig.getServices();
  const apiBase = services.WEBSERVICE_URL;
  return fetch(`${apiBase}/Authentication.asmx/Login`, {
    method: "POST",
    mode: "cors",
    headers,
    body,
  })
    .then((res) => res.json())
    .then((data) => JSON.parse(data.d))
    .then((data) => data.layersets);
}

export default {
  loadLayerSetById,
  loadLayerSets,
};
