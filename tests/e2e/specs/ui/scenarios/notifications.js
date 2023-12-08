// TODO: check how we can do this consistently with absolute imports
import { generateSelector as selector } from '../../../lib/generate-selector'

const mockDataScenarios = {
  // eslint-disable-next-line quote-props, quotes
  "d": "[{\"layerset\": [{\"breachlocation_id\": 1201, \"name\": \"Waterdiepte_flood_scenario_set\", \"id\": 34, \"notification\": null, \"layers\": [{\"name\": \"Waterdiepte\", \"id\": 62, \"notification\": null, \"visible\": true, \"extent\": {\"epsgcode\": \"4326,0\", \"minx\": 1.5710449, \"maxx\": 9.019775, \"miny\": 50.2753, \"maxy\": 53.61094}, \"legend\": {\"title\": \"Maximale waterdiepte [m]\", \"style\": \"liwo_waterdiepte_band1\", \"layer\": \"scenario_18309\"}, \"variants\": [{\"title\": \"Kans 1 op 10000\", \"subtitle\": \"Overstromingsscenarios - waterdiepte - Dijkring 44 - Kromme Rijn - IJmuiden - T10000\", \"notification\": \"Deze overstroming kan tot nieuwe dijkdoorbraken leiden bij Halfweg, Amsterdam Zuid, Amsterdam Noord of Zaandam (dijkring 13 en 14)\", \"metadata\": {\"title\": \"IJmuiden referentie TP\", \"abstract\": \"Scenarionaam = IJmuiden referentie TP<br>Scenario ID = 18309<br>Scenariodatum = 2015-11-02<br>Eigenaar = Provincie Noord-Holland<br>Type overstroming = B<br>Naam doorbraaklocatie = IJmuiden<br>X-coordinaat doorbraaklocatie = 98730.0000705<br>Y-coordinaat doorbraaklocatie = 497900.000468<br>Overschrijdingsfrequentie = 10000<br>Gebiedsnaam = Dijkring 44 - Kromme Rijn<br>Naam buitenwater = Noordzee<br>Buitenwater type = zee<br>Naam waterkering = Sluis IJmuiden<br>Totaal schade = 6300.0<br>Totaal aantal slachtoffers = 208.0<br>Aantal getroffenen = 101200.0<br>Modelleersoftware = 2.13<br>Modelversie = Sobek<br>Motivatie rekenmethode = Normering dijkring 44<br>Doel scenario = In kaart brengen van schade bij falen van regionale keringen door doorbraak bij IJmuiden<br>Berekeningsmethode = 2d model<br>Modelresolutie = 100<br>Standzekere regionale keringen = Ja<br>Bresdiepte = -999.0<br>Initiele bresbreedte = 50.0\", \"source\": \"Provincie Noord-Holland\", \"spatial_resolution\": \"100\", \"contact\": null, \"link\": null, \"last_updated\": null, \"update_interval\": null, \"version\": null, \"keywords\": \"2.13;2d model\", \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"properties\": {\"layer\": \"scenario_18309\", \"Scenarionaam\": \"IJmuiden referentie TP\", \"Scenario ID\": \"18309\", \"Eigenaar\": \"Provincie Noord-Holland\", \"Type overstroming\": \"B\", \"Naam doorbraaklocatie\": \"IJmuiden\", \"X-coordinaat doorbraaklocatie\": 98730.0000705, \"Y-coordinaat doorbraaklocatie\": 497900.000468, \"Overschrijdingsfrequentie\": \"10000\", \"Stormvloedkering open\": \" \", \"Gebiedsnaam\": \"Dijkring 44 - Kromme Rijn\", \"Naam buitenwater\": \"Noordzee\", \"Buitenwater type\": \"zee\", \"Totaal schade\": \"6300.0\", \"Totaal aantal slachtoffers\": \"208.0\", \"Aantal getroffenen\": \"101200.0\", \"Modelleersoftware\": \"2.13\", \"Modelversie\": \"Sobek\", \"Motivatie rekenmethode\": \"Normering dijkring 44\", \"Doel scenario\": \"In kaart brengen van schade bij falen van regionale keringen door doorbraak bij IJmuiden\", \"Berekeningsmethode\": \"2d model\", \"Modelresolutie\": \"100\", \"Standzekere regionale keringen\": \"Ja\", \"Initiele bresbreedte\": \"50.0\", \"Methode bresgroei\": \" \", \"Maximale bresbreedte\": \" \", \"Bodemhoogte model\": \" \", \"Ruwheid model\": \" \", \"Toestand SVK\": null, \"Bresvorming dijk\": \"Ja\", \"Moment van falen\": null, \"waterstandsverloop\": null, \"Bresvorming kunstwerk\": null, \"Standzekerheid achterliggende lijnelementen\": null, \"Ingrepen in watersysteem\": null, \"klimaatscenario\": null, \"Dreigende overstroming\": 0}, \"map\": {\"namespace\": \"LIWO_Primair\", \"type\": \"WMS\", \"datatype\": \"geotiff\", \"layer\": \"scenario_18309\", \"map_id\": 12425, \"style\": \"liwo_waterdiepte_band1\"}}, {\"title\": \"Kans 1 op 100000\", \"subtitle\": \"Overstromingsscenarios - waterdiepte - Dijkring 44 - Kromme Rijn - IJmuiden - T100000\", \"notification\": \"Deze overstroming kan tot nieuwe dijkdoorbraken leiden bij Halfweg, Amsterdam Zuid, Amsterdam Noord of Zaandam (dijkring 13 en 14)\", \"metadata\": {\"title\": \"IJmuiden referentie TP+1D\", \"abstract\": \"Scenarionaam = IJmuiden referentie TP+1D<br>Scenario ID = 18310<br>Scenariodatum = 2015-11-02<br>Eigenaar = Provincie Noord-Holland<br>Type overstroming = B<br>Naam doorbraaklocatie = IJmuiden<br>X-coordinaat doorbraaklocatie = 98730.0000705<br>Y-coordinaat doorbraaklocatie = 497900.000468<br>Overschrijdingsfrequentie = 100000<br>Gebiedsnaam = Dijkring 44 - Kromme Rijn<br>Naam buitenwater = Noordzee<br>Buitenwater type = zee<br>Naam waterkering = Sluis IJmuiden<br>Totaal schade = 12000.0<br>Totaal aantal slachtoffers = 569.0<br>Aantal getroffenen = 267000.0<br>Modelleersoftware = 2.13<br>Modelversie = Sobek<br>Motivatie rekenmethode = Normering dijkring 44<br>Doel scenario = In kaart brengen van schade bij falen van regionale keringen door doorbraak bij IJmuiden<br>Berekeningsmethode = 2d model<br>Modelresolutie = 100<br>Standzekere regionale keringen = Ja<br>Bresdiepte = -999.0<br>Initiele bresbreedte = 50.0\", \"source\": \"Provincie Noord-Holland\", \"spatial_resolution\": \"100\", \"contact\": null, \"link\": null, \"last_updated\": null, \"update_interval\": null, \"version\": null, \"keywords\": \"2.13;2d model\", \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"properties\": {\"layer\": \"scenario_18310\", \"Scenarionaam\": \"IJmuiden referentie TP+1D\", \"Scenario ID\": \"18310\", \"Eigenaar\": \"Provincie Noord-Holland\", \"Type overstroming\": \"B\", \"Naam doorbraaklocatie\": \"IJmuiden\", \"X-coordinaat doorbraaklocatie\": 98730.0000705, \"Y-coordinaat doorbraaklocatie\": 497900.000468, \"Overschrijdingsfrequentie\": \"100000\", \"Stormvloedkering open\": \" \", \"Gebiedsnaam\": \"Dijkring 44 - Kromme Rijn\", \"Naam buitenwater\": \"Noordzee\", \"Buitenwater type\": \"zee\", \"Totaal schade\": \"12000.0\", \"Totaal aantal slachtoffers\": \"569.0\", \"Aantal getroffenen\": \"267000.0\", \"Modelleersoftware\": \"2.13\", \"Modelversie\": \"Sobek\", \"Motivatie rekenmethode\": \"Normering dijkring 44\", \"Doel scenario\": \"In kaart brengen van schade bij falen van regionale keringen door doorbraak bij IJmuiden\", \"Berekeningsmethode\": \"2d model\", \"Modelresolutie\": \"100\", \"Standzekere regionale keringen\": \"Ja\", \"Initiele bresbreedte\": \"50.0\", \"Methode bresgroei\": \" \", \"Maximale bresbreedte\": \" \", \"Bodemhoogte model\": \" \", \"Ruwheid model\": \" \", \"Toestand SVK\": null, \"Bresvorming dijk\": \"Ja\", \"Moment van falen\": null, \"waterstandsverloop\": null, \"Bresvorming kunstwerk\": null, \"Standzekerheid achterliggende lijnelementen\": null, \"Ingrepen in watersysteem\": null, \"klimaatscenario\": null, \"Dreigende overstroming\": 0}, \"map\": {\"namespace\": \"LIWO_Primair\", \"type\": \"WMS\", \"datatype\": \"geotiff\", \"layer\": \"scenario_18310\", \"map_id\": 12432, \"style\": \"liwo_waterdiepte_band1\"}}, {\"title\": \"Kans 1 op 3000\", \"subtitle\": \"Overstromingsscenarios - waterdiepte - Dijkring 44 - Kromme Rijn - IJmuiden - T3000\", \"notification\": \"Deze overstroming kan tot nieuwe dijkdoorbraken leiden bij Halfweg, Amsterdam Zuid, Amsterdam Noord of Zaandam (dijkring 13 en 14)\", \"metadata\": {\"title\": \"Ijmuiden- zonder bres (overschrijding kombergend vermogen)\", \"abstract\": \"Scenarionaam = Ijmuiden- zonder bres (overschrijding kombergend vermogen)<br>Scenario ID = 21106<br>Scenariodatum = 2019-11-28<br>Eigenaar = RWS Waterdienst<br>Type overstroming = B<br>Naam doorbraaklocatie = IJmuiden<br>X-coordinaat doorbraaklocatie = 98730.0000705<br>Y-coordinaat doorbraaklocatie = 497900.000468<br>Overschrijdingsfrequentie = 3000<br>Gebiedsnaam = Dijkring 44 - Kromme Rijn<br>Naam buitenwater = Noordzee<br>Buitenwater type = zee<br>Totaal schade = 840000.0<br>Totaal aantal slachtoffers = 13.0<br>Aantal getroffenen = 7724.0<br>Modelleersoftware = SOBEK<br>Modelversie = 1<br>Motivatie rekenmethode = Normering dijkring 44<br>Doel scenario = Ijmuiden toegevoegd scenario ROR<br>Berekeningsmethode = 2d model<br>Modelresolutie = 100<br>Standzekere regionale keringen = Ja<br>Bresdiepte = -999.0<br>Initiele bresbreedte = -999.0\", \"source\": \"RWS Waterdienst\", \"spatial_resolution\": \"100\", \"contact\": null, \"link\": null, \"last_updated\": null, \"update_interval\": null, \"version\": null, \"keywords\": \"SOBEK;2d model\", \"epsg\": null, \"bbox_wgs84\": null, \"usage_limitations\": null}, \"properties\": {\"layer\": \"scenario_21106\", \"Scenarionaam\": \"Ijmuiden- zonder bres (overschrijding kombergend vermogen)\", \"Scenario ID\": \"21106\", \"Eigenaar\": \"RWS Waterdienst\", \"Type overstroming\": \"B\", \"Naam doorbraaklocatie\": \"IJmuiden\", \"X-coordinaat doorbraaklocatie\": 98730.0000705, \"Y-coordinaat doorbraaklocatie\": 497900.000468, \"Overschrijdingsfrequentie\": \"3000\", \"Stormvloedkering open\": \" \", \"Gebiedsnaam\": \"Dijkring 44 - Kromme Rijn\", \"Naam buitenwater\": \"Noordzee\", \"Buitenwater type\": \"zee\", \"Totaal schade\": \"840000.0\", \"Totaal aantal slachtoffers\": \"13.0\", \"Aantal getroffenen\": \"7724.0\", \"Modelleersoftware\": \"SOBEK\", \"Modelversie\": \"1\", \"Motivatie rekenmethode\": \"Normering dijkring 44\", \"Doel scenario\": \"Ijmuiden toegevoegd scenario ROR\", \"Berekeningsmethode\": \"2d model\", \"Modelresolutie\": \"100\", \"Standzekere regionale keringen\": \"Ja\", \"Initiele bresbreedte\": \"-999.0\", \"Methode bresgroei\": \" \", \"Maximale bresbreedte\": \" \", \"Bodemhoogte model\": \" \", \"Ruwheid model\": \" \", \"Toestand SVK\": null, \"Bresvorming dijk\": \"Nee\", \"Moment van falen\": null, \"waterstandsverloop\": null, \"Bresvorming kunstwerk\": null, \"Standzekerheid achterliggende lijnelementen\": null, \"Ingrepen in watersysteem\": null, \"klimaatscenario\": null, \"Dreigende overstroming\": 0}, \"map\": {\"namespace\": \"LIWO_Primair\", \"type\": \"WMS\", \"datatype\": \"geotiff\", \"layer\": \"scenario_21106\", \"map_id\": 12439, \"style\": \"liwo_waterdiepte_band1\"}}]}]}]}]"
}

describe('Notifications', () => {
  beforeEach(() => {
    cy.intercept('GetScenariosPerBreachGeneric', mockDataScenarios).as('scenarios')
  })

  it('Are visible when needed', () => {
    cy.visit('/#/scenarios/6/13536')

    cy.wait('@scenarios', { timeout: 120000 })
      .then(() => {
        cy.get(selector('notification'))
          .should('exist')
      })
  })

  it('Can be closed by clicking on them', () => {
    cy.visit('/#/scenarios/6/13536')

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
    cy.visit('/#/scenarios/6/13536')

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
