import router from "../router";
import { createButton, selector, waitUntilVisible } from "./helpers";
import { useLayersTour } from "./use-layers-tour";
import { useScenariosTour } from "./use-scenarios-tour";
import { useCombineTour } from "./use-combine-tour";
import { useGeneralTour } from "./use-general-tour";
import { useTour } from "./use-tour";
import { useExpertTour } from "./use-expert-tour";

export function useStartTour() {
  return useTour((driverObj) => [
    {
      element: selector("start-tour-header"),
      popover: {
        title: "Landelijk Informatiesysteem Water en Overstromingen (LIWO)",
        showButtons: ["close"],
        progressText: "",
        onPopoverRender: (popover) => {
          const container = document.createElement("div");
          container.classList.add("driver-popover-buttons");
          popover.footerButtons.insertAdjacentElement("afterbegin", container);

          const generalTour = createButtonWithText(
            "Krijg een algemene impressie van de website: ",
            "Start algemene tour",
            () => {
              driverObj.moveNext();
              useGeneralTour().start();
            }
          );

          const layersTour = createButtonWithText(
            "Bekijk hoe je kaartlagen kan gebruiken: ",
            "Start kaartlagen tour",
            () => {
              driverObj.destroy();
              useLayersTour().start();
            }
          );

          const scenariosTour = createButtonWithText(
            "Bekijk hoe je verschillende scenario's kan bekijken: ",
            "Start scenario's tour",
            () => {
              driverObj.destroy();
              useScenariosTour().start();
            }
          );

          const combineTour = createButtonWithText(
            "Bekijk hoe je scenario's kan combineren: ",
            "Start combineren tour",
            () => {
              driverObj.destroy();
              useCombineTour().start();
            }
          );

          const expertTour = createButtonWithText(
            "Bekijk hoe je nog meer uit LIWO kan halen: ",
            "Start expert tour",
            () => {
              router.push(
                "/combine/7/19435,19431?center=52.40661,5.40390&zoom=10"
              );

              waitUntilVisible(selector("layer-panel")).then(() => {
                driverObj.destroy();
                useExpertTour().start();
              });
            }
          );

          container.insertAdjacentElement("afterbegin", expertTour);
          container.insertAdjacentElement("afterbegin", combineTour);
          container.insertAdjacentElement("afterbegin", scenariosTour);
          container.insertAdjacentElement("afterbegin", layersTour);
          container.insertAdjacentElement("afterbegin", generalTour);
        },
      },
    },
  ]);
}

function createButtonWithText(text, buttonText, buttonCallback) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("driver-popover-buttons-container");
  createButton(buttonContainer, buttonText, buttonCallback);
  const description = document.createElement("span");
  description.classList.add("driver-popover-description");
  description.innerText = text;
  buttonContainer.insertAdjacentElement("afterbegin", description);

  return buttonContainer;
}
