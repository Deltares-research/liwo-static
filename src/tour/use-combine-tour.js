import router from "../router";
import { createButton, selector, waitUntilVisible } from "./helpers";
import { useExpertTour } from "./use-expert-tour";
import { useTour } from "./use-tour";

export function useCombineTour() {
  return useTour((driverObj) => [
    {
      element: selector("layerset-map-7-link"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Klik hier om individuele overstromingsscenario's te bekijken.",
        nextBtnText: "Open kaartlaag",
        onNextClick: () => {
          router.push("/combine/7/19435,19431?center=52.40661,5.40390&zoom=10");
          waitUntilVisible(selector("liwo-map-combine")).then(() => {
            driverObj.moveNext();
          });
        },
      },
    },
    {
      element: selector("liwo-map-combine"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Klik op een marker om een overstromingsscenario bij de betreffende doorbraaklocatie te laden. In de kaart worden standaard de waterdiepte van het overstromingsscenario geladen. De doorbraaklocatie wordt geel gemarkeerd. Klik meer markers aan om extra overstromingsscenario's te laden. Maak een complete selectie om een 'eigen' samengestelde kaartlaag te creeren.",
      },
    },
    {
      element: ".icon-active",
      popover: {
        title: "Scenario's combineren",
        description:
          "Klik meer markers aan om extra overstromingsscenario's te laden. Maak een complete selectie om een 'eigen' samengestelde kaartlaag te creeren.",
      },
    },
    {
      element: selector("combine-button"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Klik hier om het aanmaken van de 'eigen' samengestelde kaartlaag te starten.",
        nextBtnText: "Combineer selectie",
        onNextClick: (element) => {
          element.click();
          waitUntilVisible(selector("combine-controls")).then(() => {
            driverObj.moveNext();
          });
        },
      },
    },
    {
      element: selector("combine-controls"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Kies welke type kaartlaag gecombineerd moet worden (standaard is dit de waterdiepte). Tussen haakjes staat een aantal weergegeven dat aangeeft bij hoeveel van de geselecteerde scenario's de gekozen kaartlaag beschikbaar is.",
        onNextClick: () => {
          waitUntilVisible(selector("combine-controls-combine-button")).then(
            () => {
              driverObj.moveNext();
            }
          );
        },
      },
    },
    {
      element: selector("combine-controls-combine-button"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Start het combineren van de indivuele scenario's voor de gekozen type kaartlaag. Er wordt een nieuw tabblad geopend waarin het gecombineerde resultaat wordt weergegeven.",
      },
    },
    {
      element: selector("combine-controls-cancel-button"),
      popover: {
        title: "Kaartlaag",
        description:
          "Klik hier om het combineren te annuleren. De popup wordt gesloten.",
        nextBtnText: "Sluit combineren",
        onNextClick: (element) => {
          element.click();
          driverObj.moveNext();
        },
      },
    },
    {
      element: selector("export-selection-button"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Klik op deze knop om een door u gemaakte selectie van doorbraaklocaties en varianten met een andere gebruiker te delen.",
        nextBtnText: "Exporteer selectie",
        onNextClick: (element) => {
          element.click();
          waitUntilVisible(selector("export-selection-url")).then(() => {
            driverObj.moveNext();
          });
        },
      },
    },
    {
      element: selector("export-selection-url"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Deel deze link met een andere gebruiker. Deze gebruiker zal dan exact hetzelfde scherm (met selectie van doorbraaklocaties en varianten) te zien krijgen.",
      },
    },
    {
      element: selector("export-selection-cancel-button"),
      popover: {
        title: "Kaartlaag",
        description: "Sluit het scherm met deze knop.",
        nextBtnText: "Sluit exporteren",
        onNextClick: (element) => {
          element.click();
          driverObj.moveNext();
        },
      },
    },
    {
      element: selector("import-selection-button"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Klik op deze knop om een link met een selectie van doorbraaklocaties en varianten van een andere gebruiker te importeren.",
        nextBtnText: "Importeer selectie",
        onNextClick: (element) => {
          element.click();
          waitUntilVisible(selector("import-selection-url")).then(() => {
            driverObj.moveNext();
          });
        },
      },
    },
    {
      element: selector("import-selection-url"),
      popover: {
        title: "Scenario's combineren",
        description: "Plak hier de link die u hebt ontvangen.",
      },
    },
    {
      element: selector("import-url-checkbox"),
      popover: {
        title: "Scenario's combineren",
        description:
          "Vinkje aan, betekent huidige selectie vervangen met selectie uit de link en vinkje uit, betekent huidige selectie uitbreiden met selectie uit de link.",
      },
    },
    {
      element: selector("import-url-button"),
      popover: {
        title: "Scenario's combineren",
        description: "Klik hier om de import te starten.",
      },
    },
    {
      element: selector("import-url-cancel-button"),
      popover: {
        title: "Scenario's combineren",
        description: "Sluit het scherm met deze knop.",
        doneBtnText: "Start expert tour",
        onNextClick: (element) => {
          driverObj.destroy();
          element.click();
          useExpertTour().start();
        },
        onPopoverRender: (popover) => {
          createButton(popover.footerButtons, "Sluit tour", () => {
            driverObj.destroy();
          });
        },
      },
    },
  ]);
}
