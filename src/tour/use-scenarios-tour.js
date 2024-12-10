import router from "../router";
import { selector, waitUntilVisible } from "./helpers";
import { useCombineTour } from "./use-combine-tour";
import { useTour } from "./use-tour";

export function useScenariosTour() {
  return useTour((driverObj) => [
    {
      element: selector("layerset-map-6-link"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "Klik hier om individuele overstromingsscenario's te bekijken.",
        nextBtnText: "Open kaartlaag",
        onNextClick: () => {
          router.push("/scenarios/6/13538?center=51.84797,4.65657&zoom=13");
          waitUntilVisible(".viewer__map-wrapper").then(() => {
            driverObj.moveNext();
          });
        },
      },
    },
    {
      element: ".viewer__map-wrapper",
      popover: {
        title: "Bekijken scenario's",
        description:
          "Deze kaart bevat alle doorbraaklocaties (gekleurde markers). Afhankelijk van het zoomniveau van de kaart worden deze markers geclusterd weergeven met een nummer. Zoom verder in om de markers zichtbaar te maken.",
        onNextClick: () => {
          waitUntilVisible(".icon-active").then(() => {
            document.querySelector(".icon-active").click();
            driverObj.moveNext();
          });
        },
      },
    },
    {
      element: ".icon-active",
      popover: {
        title: "Bekijken scenario's",
        description:
          "Klik op een marker om een overstromingsscenario bij de betreffende doorbraaklocatie te laden. In de kaart worden standaard de waterdiepte van het overstromingsscenario geladen. De doorbraaklocatie wordt geel gemarkeerd. Overigens zijn niet altijd alle kaartlagen voor elke doorbraaklocatie beschikbaar!",
      },
    },
    {
      element: selector("layer-visibility"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "Hier ziet u de verschillende kaartlagen die beschikbaar zijn bij het actieve scenario. Met het oogje kunt u de zichtbaarheid aanpassen.",
      },
    },
    {
      element: selector("layer-panel-collapse"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "De algemene kaartlagen zijn (voor de overzichtelijkheid) ingeklapt. Klik hier om deze zichtbaar te maken en om het overzicht weer te verbergen.",
      },
    },
    {
      element: selector("layerpanel-item"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "Bij een doorbraaklocatie kunnen meerdere scenario's beschikbaar zijn. Deze worden varianten genoemd..",
      },
    },
    {
      element: selector("change-variant"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "Klik op deze knop om een andere variant bij de doorbraaklocatie te kiezen.",
        nextBtnText: "Wijzig varianten",
        onNextClick: (element) => {
          element.click();
          waitUntilVisible(selector("change-variant-options")).then(() => {
            driverObj.moveNext();
          });
        },
      },
    },
    {
      element: selector("change-variant-options"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "In deze tabel worden alle varianten getoond die beschikbaar zijn bij de gekozen doorbraaklocatie. ",
      },
    },
    {
      element: selector("change-variant-filters"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "Wanneer het aantal varianten groot is kan de lijst met varianten met behulp van filters wordt verkleind. De beschikbaarheid van filters is afhankelijk van de type varianten.",
      },
    },
    {
      element: selector("variant-select"),
      popover: {
        title: "Bekijken scenario's",
        description: "Klik hier om een andere variant te kiezen.",
        nextBtnText: "Verander van variant",
        onNextClick: (element) => {
          element.click();
          driverObj.moveNext();
        },
      },
    },
    {
      element: selector("variant-select-button"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "Klik hier om de geselecteerde variant in de kaart te laden. Het scherm met de varianten wordt automatisch gesloten.",
        nextBtnText: "Laad variant",
        onNextClick: (element) => {
          element.click();
          driverObj.moveNext();
        },
      },
    },
    {
      element: selector("scenario-export"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "Klik hier om een geotiif te exporten van de geselecteerde variant. De naam van het gexporteerde bestand is standaard 'scenario_13535.tiff'.",
      },
    },
    {
      element: selector("legend-button"),
      popover: {
        title: "Bekijken scenario's",
        description:
          "De legenda is in dit scherm geminimaliseerd. Klik op de legenda om deze open/dicht te klappen.",
      },
    },
    {
      element: ".icon-active",
      popover: {
        title: "Bekijken scenario's",
        description:
          "Klik op een geel gemarkeerde doorbraaklocatie om de kaartlagen van het overstromingsscenario uit de kaart te verwijderen.",
      },
    },
    {
      element: selector("kaarten-header"),
      popover: {
        title: "Bekijken scenario's",
        description: "Keer terug naar het overzicht met alle LIWO kaarten.",
        doneBtnText: "Start combineren scenario's tour",
        onNextClick: (element) => {
          element.click();
          driverObj.destroy();
          useCombineTour().start();
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
  ]);
}
