import { selector, waitUntilVisible } from "./helpers";
import { useGeneralTour } from "./use-general-tour";
import { useScenariosTour } from "./use-scenarios-tour";
import { useTour } from "./use-tour";

export function useLayersTour() {
  return useTour((driverObj) => {
    const steps = [
      {
        element: selector("layerset-0"),
        popover: {
          title: "Kaartlagen",
          description:
            "Hier zijn alle samengestelde waterdiepte kaarten weergegeven. Dit zijn specifieke combinaties van de individuele overstromingsscenario's. Er wordt onderscheid gemaakt in type A t/m D.",
          onPopoverRender: (popover) => {
            const firstButton = document.createElement("button");
            firstButton.innerText = "Start algemene tour";
            popover.footerButtons.insertAdjacentElement(
              "afterbegin",
              firstButton
            );
            firstButton.addEventListener("click", () => {
              driverObj.destroy();
              useGeneralTour().start();
            });
          },
        },
      },
      {
        element: selector("layerset-1"),
        popover: {
          title: "Kaartlagen",
          description:
            "Hier zijn kunt u de individuele overstromingsscenario's bekijken en heeft u de mogelijkheid om individuele overstromingsscenario's te combineren om een 'eigen' samengestelde waterdieptekaart te maken.",
        },
      },
      {
        element: selector("layerset-2"),
        popover: {
          title: "Kaartlagen",
          description:
            "Hier zijn kaartlagen opgenomen met die voor specifieke projectdoeleinden zijn vastgesteld.",
        },
      },
      {
        element: selector("layerset-3"),
        popover: {
          title: "Kaartlagen",
          description:
            "Hier treft u kaartlagen aan met informatie over overstromingskansen voor de huidige situatie, voor de situatie dat de waterkeringen voldoen aan de norm (2050) en voor 2100, rekeninghoudend met klimaatverandering.",
        },
      },
      {
        element: selector("layerset-4"),
        popover: {
          title: "Kaartlagen",
          description:
            "Hier zijn kaartlagen opgenomen met informatie over overstromingsrisico's (alleen voor doorbraken van primaire waterkeringen).",
        },
      },
      {
        element: selector("layerset-5"),
        popover: {
          title: "Kaartlagen",
          description:
            "Hier zijn alle kaarten gebundeld die informatie bevatten voor evacuaties.",
        },
      },
      {
        element: selector("layerset-map-18-link"),
        popover: {
          title: "Kaartlagen",
          description:
            "Klik op de naam van een kaartenset om de verschillende kaartlagen van deze kaartenset te openen.",
          nextBtnText: "Open kaartlaag",
          onNextClick: (element) => {
            element.click();
            waitUntilVisible(selector("legend-panel")).then(() => {
              driverObj.moveNext();
            });
          },
        },
      },
      {
        element: selector("legend-panel"),
        popover: {
          title: "Kaartlaag",
          description:
            "Bij elke kaartlaag hoort een legenda die het kleurgebruik in de kaart toelicht.",
        },
      },
      {
        element: ".leaflet-control-layers-toggle",
        popover: {
          title: "Kaartlaag",
          description:
            "Klik hier om een alternatieve achtergrond kaartlaag te kiezen, zoals een luchtfoto of helemaal geen achtergrond kaartlaag.",
        },
      },
      {
        element: ".leaflet-control-zoom",
        popover: {
          title: "Kaartlaag",
          description: "Met deze knoppen kun je de kaartlaag in-/uitzoomen.",
        },
      },
      {
        element: ".leaflet-control-geocoder-icon",
        popover: {
          title: "Kaartlaag",
          description:
            "Hier kunt u een adres en/of woonplaats invoeren, waarop de kaart wordt ingezoomd.",
        },
      },
      {
        element: ".leaflet-control-fill-window",
        popover: {
          title: "Kaartlaag",
          description: "Klik hier om de kaart schermvullend weer te geven.",
          nextBtnText: "Maak schermvullend",
          onNextClick: (element) => {
            element.click();
            driverObj.moveNext();
          },
        },
      },
      {
        element: ".leaflet-control-fill-window",
        popover: {
          title: "Kaartlaag",
          description:
            "Klik hier om terug te keren van de schermvullende weergave.",
          nextBtnText: "Sluit schermvullend",
          onNextClick: (element) => {
            element.click();
            driverObj.moveNext();
          },
        },
      },
      {
        element: ".leaflet-browser-print",
        popover: {
          title: "Kaartlaag",
          description: "Klik hier om de getoonde kaartlaag af te drukken.",
        },
      },
      {
        element: selector("layer-panel"),
        popover: {
          title: "Kaartlaag",
          description:
            "Hier kunt u wisselen tussen verschillende kaartlagen in de geopende kaartenset en specifieke opties per kaartlaag activeren.",
        },
      },
      {
        element: selector("layer-visibility"),
        popover: {
          title: "Kaartlaag",
          description:
            "Hiermee kunt u de zichtbaarheid van de kaartlaag aan-/uitzetten. Het is mogelijk om tegelijk meerdere kaartlagen zichtbaar te maken.",
        },
      },
      {
        element: selector("layer-transparency"),
        popover: {
          title: "Kaartlaag",
          description:
            "Hiermee kunt u de transparantie van de kaartlaag aanpassen.",
        },
      },
      {
        element: selector("layer-metadata"),
        popover: {
          title: "Kaartlaag",
          description:
            "Klik hier om de metadata van de getoonde kaartlaag op te vragen.",
          nextBtnText: "Open metadata",
          onNextClick: (element) => {
            element.click();
            waitUntilVisible(selector("popup-close")).then(() => {
              driverObj.moveNext();
            });
          },
        },
      },
      {
        element: selector("popup-close"),
        popover: {
          title: "Kaartlaag",
          description:
            "Klik hier om het scherm met de metadata weer te sluiten.",
          nextBtnText: "Sluit metadata",
          onNextClick: (element) => {
            element.click();
            driverObj.moveNext();
          },
        },
      },
      {
        element: selector("layer-variant-select"),
        popover: {
          title: "Kaartlaag",
          description:
            "Kies van 1 van de verschillende varianten van de kaartlaag in deze keuzelijst.",
        },
      },
      {
        element: selector("layer-export"),
        popover: {
          title: "Kaartlaag",
          description:
            "Hier kunt een download starten van de getoonde kaartlagen. Een kaartlaag wordt gedownload als GIS bestand (shape file of geotiff).",
          nextBtnText: "Open download",
          onNextClick: (element) => {
            element.click();
            waitUntilVisible(selector("popup-close")).then(() => {
              driverObj.moveNext();
            });
          },
        },
      },
      {
        element: selector("layer-export-name"),
        popover: {
          title: "Kaartlaag",
          description: "Geef een naam aan het bestand dat u wilt exporteren.",
        },
      },
      {
        element: selector("layer-export-button"),
        popover: {
          title: "Kaartlaag",
          description:
            "Klik hier om de export te starten. Er wordt een zip bestand gedownload met alle kaartenlagen uit de geopende kaartenset.",
        },
      },
      {
        element: selector("layer-export-cancel-button"),
        popover: {
          title: "Kaartlaag",
          description:
            "Klik hier om de export te annuleren. De popup wordt gesloten.",
          nextBtnText: "Sluit download",
          onNextClick: (element) => {
            element.click();
            driverObj.moveNext();
          },
        },
      },
      {
        element: ".viewer__map-wrapper",
        popover: {
          title: "Kaartlaag",
          description:
            "Door in de kaart te klikken wordt de waarde van de actieve kaartlaag op die specifieke locatie weergegeven.",
        },
      },
      {
        element: selector("notifications"),
        popover: {
          title: "Kaartlaag",
          description:
            "In de notificatie wordt relevante informatie over een kaartlaag weergegeven.",
        },
      },
      {
        element: selector("kaarten-header"),
        popover: {
          title: "Kaartlaag",
          description: "Keer terug naar het overzicht met alle LIWO kaarten.",
          doneBtnText: "Start scenarios tour",
          onNextClick: (element) => {
            element.click();
            driverObj.destroy();
            useScenariosTour().start();
          },
          onPopoverRender: (popover) => {
            const firstButton = document.createElement("button");
            firstButton.innerText = "Sluit";
            popover.footerButtons.insertAdjacentElement(
              "afterbegin",
              firstButton
            );
            firstButton.addEventListener("click", () => {
              driverObj.destroy();
            });
          },
        },
      },
    ];

    return steps;
  });
}
