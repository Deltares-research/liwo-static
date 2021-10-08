import { generateSelector as selector } from '../../lib/generate-selector'

// eslint-disable-next-line quotes, quote-props
const mockLayerSetData = { "d": "{\"layerset\": {\"name\": \"Combineren overstromingsscenario's\", \"id\": 7, \"notify\": null, \"layers\": [{\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - A. Locaties inundatie buitendijkse gebieden\", \"layer_id\": 11, \"notify\": null, \"visible\": true, \"layer_ranking\": 1, \"iscontrollayer\": true, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Buitendijkse locaties [-]\", \"style\": \"LIWO_Basis_Doorbraaklocaties_Buitendijks\", \"geojson_style\": null, \"layer\": \"gebiedsindeling_doorbraaklocaties_buitendijks\"}, \"variants\": [{\"title\": \"Selecteer een locatie buitendijks\", \"subtitle\": \"Infrastructuur - Doorbraaklocaties buitendijks\", \"notify\": null, \"metadata\": {\"id\": 100100, \"title\": \"Infrastructuur- Locaties scenario's buitendijks\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-02-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"json\", \"datatype\": \"shape1\", \"layer\": \"gebiedsindeling_doorbraaklocaties_buitendijks\", \"style\": \"LIWO_Basis_Doorbraaklocaties_Buitendijks\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - B. Doorbraaklocaties  primaire waterkeringen\", \"layer_id\": 9, \"notify\": null, \"visible\": true, \"layer_ranking\": 2, \"iscontrollayer\": true, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Primaire doorbraaklocaties [-]\", \"style\": \"LIWO_Basis_Doorbraaklocaties_Primair\", \"geojson_style\": null, \"layer\": \"gebiedsindeling_doorbraaklocaties_primair\"}, \"variants\": [{\"title\": \"Selecteer een primaire doorbraaklocatie\", \"subtitle\": \"Infrastructuur - Doorbraaklocaties primaire keringen\", \"notify\": null, \"metadata\": {\"id\": 100098, \"title\": \"Infrastructuur - Doorbraaklocaties primaire keringen\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-02-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"json\", \"datatype\": \"shape1\", \"layer\": \"gebiedsindeling_doorbraaklocaties_primair\", \"style\": \"LIWO_Basis_Doorbraaklocaties_Primair\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - C. Doorbraaklocaties regionale waterkeringen\", \"layer_id\": 10, \"notify\": null, \"visible\": true, \"layer_ranking\": 3, \"iscontrollayer\": true, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Regionale doorbraaklocaties [-]\", \"style\": \"LIWO_Basis_Doorbraaklocaties_Regionaal\", \"geojson_style\": null, \"layer\": \"gebiedsindeling_doorbraaklocaties_regionaal\"}, \"variants\": [{\"title\": \"Selecteer een regionale doorbraaklocatie\", \"subtitle\": \"Infrastructuur- Doorbaaklocaties regionale keringen\", \"notify\": null, \"metadata\": {\"id\": 100099, \"title\": \"Infrastructuur- Doorbaaklocaties regionale keringen\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-02-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"json\", \"datatype\": \"shape1\", \"layer\": \"gebiedsindeling_doorbraaklocaties_regionaal\", \"style\": \"LIWO_Basis_Doorbraaklocaties_Regionaal\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - D. Locaties inundatie vanuit regionaal watersysteem\", \"layer_id\": 12, \"notify\": null, \"visible\": true, \"layer_ranking\": 4, \"iscontrollayer\": true, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Regionaal watersysteem locaties [-]\", \"style\": \"LIWO_Basis_Doorbraaklocaties_RegionaalWatersysteem\", \"geojson_style\": null, \"layer\": \"gebiedsindeling_doorbraaklocaties_regionaalwatersysteem\"}, \"variants\": [{\"title\": \"Selecteer een locatie regionaal watersysteem\", \"subtitle\": \"Infrastructuur- Doorbaaklocaties regionaal watersysteem\", \"notify\": null, \"metadata\": {\"id\": 100101, \"title\": \"Infrastructuur- Locaties scenario's regionaal watersysteem\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-02-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"json\", \"datatype\": \"shape1\", \"layer\": \"gebiedsindeling_doorbraaklocaties_regionaalwatersysteem\", \"style\": \"LIWO_Basis_Doorbraaklocaties_RegionaalWatersysteem\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Dijkringen\", \"layer_id\": 13, \"notify\": null, \"visible\": true, \"layer_ranking\": 5, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Dijkringen [-]\", \"style\": \"LIWO_Basis_Dijkringen\", \"geojson_style\": null, \"layer\": \"infrastructuur_dijkringen\"}, \"variants\": [{\"title\": \"Dijkringen\", \"subtitle\": \"Infrastructuur - Dijkringen\", \"notify\": null, \"metadata\": {\"id\": 100087, \"title\": \"Infrastructuur - Dijkringen\", \"abstract\": \"Dit betreft een oude dijkringen kaart waarop Ruimte voor de Rivier  dijkverleggingen nog niet zijn doorgevoerd.\", \"source\": \"Rijkswaterstaat\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2015-01-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"infrastructuur_dijkringen\", \"style\": \"LIWO_Basis_Dijkringen\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Primaire keringen\", \"layer_id\": 14, \"notify\": null, \"visible\": false, \"layer_ranking\": 6, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Primaire waterkeringen [-]\", \"style\": \"LIWO_Basis_Primaire_waterkeringen\", \"geojson_style\": null, \"layer\": \"infrastructuur_primaire_keringen\"}, \"variants\": [{\"title\": \"Primaire keringen\", \"subtitle\": \"Infrastructuur - Primaire keringen\", \"notify\": null, \"metadata\": {\"id\": 100088, \"title\": \"Infrastructuur - Primaire keringen\", \"abstract\": \"-\", \"source\": \"Informatiehuis Water\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-02-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"infrastructuur_primaire_keringen\", \"style\": \"LIWO_Basis_Primaire_waterkeringen\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Regionale keringen\", \"layer_id\": 15, \"notify\": null, \"visible\": false, \"layer_ranking\": 7, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Regionale waterkeringen [-]\", \"style\": \"LIWO_Basis_Regionale_waterkeringen\", \"geojson_style\": null, \"layer\": \"infrastructuur_regionale_keringen\"}, \"variants\": [{\"title\": \"Regionale keringen\", \"subtitle\": \"Infrastructuur - Regionale keringen\", \"notify\": null, \"metadata\": {\"id\": 100089, \"title\": \"Infrastructuur - Regionale keringen\", \"abstract\": \"-\", \"source\": \"Risicokaart (IPO)\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-02-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"infrastructuur_regionale_keringen\", \"style\": \"LIWO_Basis_Regionale_waterkeringen\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Wegen\", \"layer_id\": 16, \"notify\": null, \"visible\": false, \"layer_ranking\": 8, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Wegen [-]\", \"style\": \"LIWO_Basis_Wegen\", \"geojson_style\": null, \"layer\": \"infrastructuur_wegen_nederland\"}, \"variants\": [{\"title\": \"Wegen\", \"subtitle\": \"Infrastructuur - Wegen Nederland\", \"notify\": null, \"metadata\": {\"id\": 100090, \"title\": \"Infrastructuur - Wegen Nederland\", \"abstract\": \"-\", \"source\": \"Rijkswaterstaat\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-01-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"infrastructuur_wegen_nederland\", \"style\": \"LIWO_Basis_Wegen\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Spoorwegen\", \"layer_id\": 17, \"notify\": null, \"visible\": false, \"layer_ranking\": 9, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Spoorwegen [-]\", \"style\": \"LIWO_Basis_Spoorwegen\", \"geojson_style\": null, \"layer\": \"infrastructuur_spoorwegen_nederland\"}, \"variants\": [{\"title\": \"Spoorwegen\", \"subtitle\": \"Infrastructuur - Spoorwegen Nederland\", \"notify\": null, \"metadata\": {\"id\": 100091, \"title\": \"Infrastructuur - Spoorwegen Nederland\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-01-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"infrastructuur_spoorwegen_nederland\", \"style\": \"LIWO_Basis_Spoorwegen\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Vliegvelden\", \"layer_id\": 18, \"notify\": null, \"visible\": false, \"layer_ranking\": 10, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Vliegvelden [-]\", \"style\": \"LIWO_Basis_Vliegvelden\", \"geojson_style\": null, \"layer\": \"infrastructuur_vliegvelden_nederland\"}, \"variants\": [{\"title\": \"Vliegvelden\", \"subtitle\": \"Infrastructuur - Vliegvelden Nederland\", \"notify\": null, \"metadata\": {\"id\": 100092, \"title\": \"Infrastructuur - Vliegvelden Nederland\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2020-01-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"infrastructuur_vliegvelden_nederland\", \"style\": \"LIWO_Basis_Vliegvelden\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Waterschappen\", \"layer_id\": 19, \"notify\": null, \"visible\": false, \"layer_ranking\": 11, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Waterschappen [-]\", \"style\": \"LIWO_Basis_Waterschappen\", \"geojson_style\": null, \"layer\": \"administratieve_grenzen_waterschappen\"}, \"variants\": [{\"title\": \"Waterschappen\", \"subtitle\": \"Administratieve grenzen - Waterschappen\", \"notify\": null, \"metadata\": {\"id\": 100093, \"title\": \"Administratieve grenzen - Waterschappen\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2019-10-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"administratieve_grenzen_waterschappen\", \"style\": \"LIWO_Basis_Waterschappen\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Veiligheidsregios\", \"layer_id\": 20, \"notify\": null, \"visible\": false, \"layer_ranking\": 12, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Veiligheidsregios [-]\", \"style\": \"LIWO_Basis_Veiligheidsregios\", \"geojson_style\": null, \"layer\": \"administratieve_grenzen_veiligheidsregios\"}, \"variants\": [{\"title\": \"Veiligheidsregio's\", \"subtitle\": \"Administratieve grenzen - Veiligheidsregio's\", \"notify\": null, \"metadata\": {\"id\": 100094, \"title\": \"Administratieve grenzen - Veiligheidsregio's\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2019-12-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"administratieve_grenzen_veiligheidsregios\", \"style\": \"LIWO_Basis_Veiligheidsregios\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Provincies\", \"layer_id\": 21, \"notify\": null, \"visible\": false, \"layer_ranking\": 13, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Provincies [-]\", \"style\": \"LIWO_Basis_Provincies\", \"geojson_style\": null, \"layer\": \"administratieve_grenzen_provincies\"}, \"variants\": [{\"title\": \"Provincies\", \"subtitle\": \"Administratieve grenzen - Provincies\", \"notify\": null, \"metadata\": {\"id\": 100095, \"title\": \"Administratieve grenzen - Provincies\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2019-12-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"administratieve_grenzen_provincies\", \"style\": \"LIWO_Basis_Provincies\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Gemeenten\", \"layer_id\": 22, \"notify\": null, \"visible\": false, \"layer_ranking\": 14, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Gemeenten [-]\", \"style\": \"LIWO_Basis_Gemeenten\", \"geojson_style\": null, \"layer\": \"administratieve_grenzen_gemeenten\"}, \"variants\": [{\"title\": \"Gemeenten\", \"subtitle\": \"Administratieve grenzen - Gemeenten\", \"notify\": null, \"metadata\": {\"id\": 100096, \"title\": \"Administratieve grenzen - Gemeenten\", \"abstract\": \"-\", \"source\": \"-\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2019-10-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"administratieve_grenzen_gemeenten\", \"style\": \"LIWO_Basis_Gemeenten\"}}]}, {\"name\": \"Gevolgen per doorbraaklocatie - Overstromingen - Regionale onderdelen RWS\", \"layer_id\": 23, \"notify\": null, \"visible\": false, \"layer_ranking\": 15, \"iscontrollayer\": false, \"action\": null, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Regionale RWS onderdelen [-]\", \"style\": \"LIWO_Basis_Regionale_RWS_onderdelen\", \"geojson_style\": null, \"layer\": \"administratieve_grenzen_regionale_onderdelen_rws\"}, \"variants\": [{\"title\": \"Regionale onderdelen RWS\", \"subtitle\": \"Administratieve grenzen - Regionale onderdelen RWS\", \"notify\": null, \"metadata\": {\"id\": 100097, \"title\": \"Administratieve grenzen - Regionale onderdelen RWS\", \"abstract\": \"-\", \"source\": \"Rijkswaterstaat\", \"spatial_resolution\": null, \"contact\": null, \"link\": null, \"last_updated\": \"2019-10-01T00:00:00\", \"update_interval\": null, \"version\": null, \"keywords\": null, \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Basis\", \"type\": \"WMS\", \"datatype\": \"shape\", \"layer\": \"administratieve_grenzen_regionale_onderdelen_rws\", \"style\": \"LIWO_Basis_Regionale_RWS_onderdelen\"}}]}]}}" }

// eslint-disable-next-line quotes, quote-props
const mockFeaturesData = { "type": "FeatureCollection", "features": [{ "type": "Feature", "id": "gebiedsindeling_doorbraaklocaties_primair.2287", "geometry": { "type": "Point", "coordinates": [5.2683, 52.4395] }, "geometry_name": "geom", "properties": { "id": 2287, "breachtypes_id": 2, "dijkringareas_id": null, "openwaters_id": 65, "name": "OOSTVAARDERSDIJK_16.0", "code": "PRIM", "x": 146914, "y": 494644, "notify": null, "lt30": 0, "f30t300": 0, "f300t3000": 1, "f3000t30k": "1", "gt30k": 2 }, "bbox": [5.2683, 52.4395, 5.2683, 52.4395] }, { "type": "Feature", "id": "gebiedsindeling_doorbraaklocaties_primair.949", "geometry": { "type": "Point", "coordinates": [5.2752, 52.3206] }, "geometry_name": "geom", "properties": { "id": 949, "breachtypes_id": 2, "dijkringareas_id": null, "openwaters_id": 65, "name": "GOOIMEERDIJK_15.5", "code": "PRIM", "x": 147362, "y": 481407, "notify": null, "lt30": 1, "f30t300": 0, "f300t3000": 0, "f3000t30k": "0", "gt30k": 0 }, "bbox": [5.2752, 52.3206, 5.2752, 52.3206] }] }

const url = '#/combine/7?center=52.32401,5.35995&zoom=10'

describe('Combine multiple selections: marker selection', () => {
  it('Changes marker image on click', () => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)

    cy.get('.leaflet-marker-icon')
      .eq(0)
      .invoke('attr', 'src')
      .then((srcVal) => {
        cy.get('.leaflet-marker-icon')
          .eq(0)
          .click({ force: true })
          .invoke('attr', 'src')
          .should('not.eq', srcVal)
      })

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .invoke('attr', 'src')
      .then((srcVal) => {
        cy.get('.leaflet-marker-icon')
          .eq(3)
          .click({ force: true })
          .invoke('attr', 'src')
          .should('not.eq', srcVal)
      })
  })

  it('Opens correct layers in panel', () => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)

    const location1 = mockFeaturesData.features[0].properties.name
    const location2 = mockFeaturesData.features[1].properties.name

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.get(selector('layer-panel'))
      .parent()
      .children()
      .should('have.length', 3)

    cy.contains(location1)
      .parentsUntil(selector('layer-panel'))
      .next()
      .contains('Waterdiepte')

    cy.contains(location2)
      .parentsUntil(selector('layer-panel'))
      .next()
      .contains('Waterdiepte')
  })

  it('Closes correct layers in panel', () => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)

    const location1 = mockFeaturesData.features[0].properties.name
    const location2 = mockFeaturesData.features[1].properties.name

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get('.leaflet-marker-icon')
      .eq(4)
      .click({ force: true })

    cy.contains(location1)
      .parentsUntil(selector('layer-panel'))
      .next()
      .contains('Waterdiepte')

    cy.contains(location2)
      .parentsUntil(selector('layer-panel'))
      .next()
      .contains('Waterdiepte')

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.get(selector('layer-panel'))
      .parent()
      .children()
      .should('have.length', 2)
  })

  it('Changes legend graphic', () => {
    cy.intercept(new RegExp(/GetLayerSet/), mockLayerSetData).as('layerset')
    cy.intercept(new RegExp(/getFeature/), mockFeaturesData).as('features')

    cy.visit(url)

    cy.get('.leaflet-marker-icon')
      .eq(3)
      .click({ force: true })

    cy.wait(5000)

    cy.get(`${selector('legend')} img`)
      .invoke('attr', 'src')
      .then(initSrc => {
        cy.get('.leaflet-marker-icon')
          .eq(4)
          .click({ force: true })

        cy.wait(5000)

        cy.get(`${selector('legend')} img`)
          .invoke('attr', 'src')
          .then(newSrc => {
            expect(initSrc).to.not.equal(newSrc)
          })
      })
  })
})
