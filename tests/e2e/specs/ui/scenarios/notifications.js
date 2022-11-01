// TODO: check how we can do this consistently with absolute imports
import { generateSelector as selector } from '../../../lib/generate-selector'

const mockDataScenarios = {
  // eslint-disable-next-line quote-props, quotes
  "d": "[{\"layerset\": [{\"name\": \"Waterdiepte_flood_scenario_set\", \"id\": 34, \"notification\": null, \"layers\": [{\"name\": \"Waterdiepte\", \"id\": 61, \"notification\": null, \"visible\": true, \"extent\": {\"epsgcode\": \"4326.0\", \"minx\": 1.57104, \"maxx\": 9.01978, \"miny\": 50.2753, \"maxy\": 53.6109}, \"legend\": {\"title\": \"Maximale waterdiepte [m]\", \"style\": \"liwo_waterdiepte_band1\", \"layer\": \"scenario_18309\"}, \"variants\": [{\"title\": \"100000_MET_BRES\", \"subtitle\": \"Overstromingsscenarios - waterdiepte - Dijkring 44 - Kromme Rijn - IJmuiden - T100000_MET_BRES\", \"notification\": null, \"metadata\": {\"title\": \"IJmuiden referentie TP+1D\", \"abstract\": \"Scenarionaam = IJmuiden referentie TP+1D<br>ScenarioID = 18310<br>Eigenaar = Provincie Noord-Holland<br>Type overstroming = B<br>Naam doorbraaklocatie = IJmuiden<br>x-coordinaat doobraaklocatie = 98730.0000704999984<br>y-coordinaat doobraaklocatie = 497900.000468000013<br>Overschrijdingsfrequentie: = 100000_MET_BRES<br>Gebiedsnaam = Dijkring 44 - Kromme Rijn<br>Naam buitenwater = Noordzee<br>Buitenwater type = zee<br>Naam waterkering = Sluis IJmuiden<br>Totaal schade = 12329525403.0<br>Totaal aantal slachtoffers = 569.0<br>Aantal getroffenen = 267013.0<br>Modelleersoftware = 2.13<br>Modelversie = Sobek<br>Motivatie rekenmethode = Normering dijkring 44<br>Doel scenario = In kaart brengen van schade bij falen van regionale keringen door doorbraak bij IJmuiden<br>Berekeningsmethode = 2d model<br>Modelresolutie = 100<br>Standzekere regionale keringen = Ja<br>Evacuatiefractie: 0 <br>Initiele bresbreedte = 50.0\", \"source\": \"Provincie Noord-Holland\", \"spatial_resolution\": \"100\", \"contact\": null, \"link\": null, \"last_updated\": null, \"update_interval\": null, \"version\": null, \"keywords\": \"2.13;2d model\", \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Primair\", \"type\": \"WMS\", \"datatype\": \"geotiff\", \"layer\": \"scenario_18310\", \"map_id\": 11544, \"style\": \"liwo_waterdiepte_band1\"}}, {\"title\": \"10000_MET_BRES\", \"subtitle\": \"Overstromingsscenarios - waterdiepte - Dijkring 44 - Kromme Rijn - IJmuiden - T10000_MET_BRES\", \"notification\": null, \"metadata\": {\"title\": \"IJmuiden referentie TP\", \"abstract\": \"Scenarionaam = IJmuiden referentie TP<br>ScenarioID = 18309<br>Eigenaar = Provincie Noord-Holland<br>Type overstroming = B<br>Naam doorbraaklocatie = IJmuiden<br>x-coordinaat doobraaklocatie = 98730.0000704999984<br>y-coordinaat doobraaklocatie = 497900.000468000013<br>Overschrijdingsfrequentie: = 10000_MET_BRES<br>Gebiedsnaam = Dijkring 44 - Kromme Rijn<br>Naam buitenwater = Noordzee<br>Buitenwater type = zee<br>Naam waterkering = Sluis IJmuiden<br>Totaal schade = 6318462008.0<br>Totaal aantal slachtoffers = 208.0<br>Aantal getroffenen = 101215.0<br>Modelleersoftware = 2.13<br>Modelversie = Sobek<br>Motivatie rekenmethode = Normering dijkring 44<br>Doel scenario = In kaart brengen van schade bij falen van regionale keringen door doorbraak bij IJmuiden<br>Berekeningsmethode = 2d model<br>Modelresolutie = 100<br>Standzekere regionale keringen = Ja<br>Evacuatiefractie: 0 <br>Initiele bresbreedte = 50.0\", \"source\": \"Provincie Noord-Holland\", \"spatial_resolution\": \"100\", \"contact\": null, \"link\": null, \"last_updated\": null, \"update_interval\": null, \"version\": null, \"keywords\": \"2.13;2d model\", \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Primair\", \"type\": \"WMS\", \"datatype\": \"geotiff\", \"layer\": \"scenario_18309\", \"map_id\": 11537, \"style\": \"liwo_waterdiepte_band1\"}}, {\"title\": \"10000_ZONDER_BRES\", \"subtitle\": \"Overstromingsscenarios - waterdiepte - Dijkring 44 - Kromme Rijn - IJmuiden - T10000_ZONDER_BRES\", \"notification\": null, \"metadata\": {\"title\": \"Ijmuiden- zonder bres (overschrijding kombergend vermogen)\", \"abstract\": \"Scenarionaam = Ijmuiden- zonder bres (overschrijding kombergend vermogen)<br>ScenarioID = 60016<br>Eigenaar = Provincie Noord-Holland<br>Type overstroming = B<br>Naam doorbraaklocatie = IJmuiden<br>x-coordinaat doobraaklocatie = 98730.0000704999984<br>y-coordinaat doobraaklocatie = 497900.000468000013<br>Overschrijdingsfrequentie: = 10000_ZONDER_BRES<br>Gebiedsnaam = Dijkring 44 - Kromme Rijn<br>Naam buitenwater = Noordzee<br>Buitenwater type = zee<br>Naam waterkering = Sluis IJmuiden<br>Totaal schade = 836695541.0<br>Totaal aantal slachtoffers = 13.0<br>Aantal getroffenen = 7723.0<br>Motivatie rekenmethode = Normering dijkring 44<br>Doel scenario = RWS special<br>Berekeningsmethode = GIS-methode<br>Modelresolutie = 100<br>Standzekere regionale keringen = Ja<br>Evacuatiefractie: 0 <br>Initiele bresbreedte = 50.0\", \"source\": \"Provincie Noord-Holland\", \"spatial_resolution\": \"100\", \"contact\": null, \"link\": null, \"last_updated\": null, \"update_interval\": null, \"version\": null, \"keywords\": \";GIS-methode\", \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"map\": {\"namespace\": \"LIWO_Primair\", \"type\": \"WMS\", \"datatype\": \"geotiff\", \"layer\": \"scenario_60016\", \"map_id\": 11533, \"style\": \"liwo_waterdiepte_band1\"}}]}]}]}]"
}

describe('Notifications', () => {
  beforeEach(() => {
    cy.intercept('GetScenariosPerBreachGeneric', mockDataScenarios).as('scenarios')
  })

  it('Are visible when needed', () => {
    cy.visit('/#/scenarios/6/18310')

    cy.wait('@scenarios', { timeout: 120000 })
      .then(() => {
        cy.get(selector('notification'))
          .should('exist')
      })
  })

  it('Can be closed by clicking on them', () => {
    cy.visit('/#/scenarios/6/18310')

    cy.wait('@scenarios', { timeout: 120000 })
      .then(() => {
        cy.get(selector('notification-button'))
          .should('exist')
          .click()
      })
      .then(() => {
        cy.get(selector('notification-button'))
          .should('not.exist')
      })
  })

  it('Can be closed using the close button', () => {
    cy.visit('/#/scenarios/6/18310')

    cy.wait('@scenarios', { timeout: 120000 })
      .then(() => {
        cy.get(selector('notification'))
          .should('exist')
          .click()
      })
      .then(() => {
        cy.get(selector('notification-button'))
          .should('not.exist')
      })
  })
})
