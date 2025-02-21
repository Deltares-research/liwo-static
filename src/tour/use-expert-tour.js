import { selector, waitUntilVisible } from "./helpers";
import { useTour } from "./use-tour";

export function useExpertTour() {
  return useTour((driverObj) => [
    {
      element: selector("filter-toggle"),
      popover: {
        title: "Expert",
        description:
          "Klik op het filter icoon om een scherm te openen, waarmee je een filter kan activeren op de zichtbare doorbraaklocaties en scenario’s.",
        nextBtnText: "Open filter",
        onNextClick: (element) => {
          element.click();
          waitUntilVisible(selector("filter-form-probabilities")).then(() => {
            driverObj.moveNext();
          });
        },
      },
    },
    {
      element: selector("filter-form-probabilities"),
      popover: {
        title: "Expert",
        description:
          "Maak een selectie van de kansklasse van overstromingsscenario's waarvoor u de doorbraaklocaties op de kaart wilt zien.",
      },
    },
    {
      element: selector("filter-form-flood"),
      popover: {
        title: "Expert",
        description:
          "Activeer deze optie als u ook de scenario's zonder status 'geschikt voor landelijke gebruik' wilt zien.",
      },
    },
    {
      element: selector("popup-close"),
      popover: {
        title: "Expert",
        description: "Klik hier om het filter te sluiten.",
        nextBtnText: "Sluit filter",
        onNextClick: (element) => {
          element.click();
          driverObj.moveNext();
        },
      },
    },
    {
      element: selector("site-header"),
      popover: {
        title: "Expert",
        doneBtnText: "Sluit tour",
        description:
          "Kopieer het gehele LIWO URL adres, om kaartbeelden met andere gebruikers uit te wissselen. Wanneer andere gebruikers exact dezelfde URL gebruiken, zien zijn dezelfde kaart (bereik en zoomlevel).",
      },
    },
  ]);
}
