import router from "../router";
import { selector, waitUntilVisible } from "./helpers";
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
        title: "Tour het Landelijk Informatiesysteem Water en Overstromingen",
        showButtons: ["close"],
        progressText: "",
        onPopoverRender: (popover) => {
          const firstButton = document.createElement("button");
          const secondButton = document.createElement("button");
          const thirdButton = document.createElement("button");
          const fourthButton = document.createElement("button");
          const fifthButton = document.createElement("button");
          firstButton.innerText = "Start algemene tour";
          secondButton.innerText = "Start kaartlagen tour";
          thirdButton.innerText = "Start scenario's tour";
          fourthButton.innerText = "Start combineren scenario's tour";
          fifthButton.innerText = "Start expert tour";
          popover.footerButtons.appendChild(firstButton);
          popover.footerButtons.appendChild(secondButton);
          popover.footerButtons.appendChild(thirdButton);
          popover.footerButtons.appendChild(fourthButton);
          popover.footerButtons.appendChild(fifthButton);

          firstButton.addEventListener("click", () => {
            driverObj.moveNext();
            useGeneralTour().start();
          });

          secondButton.addEventListener("click", () => {
            driverObj.destroy();
            useLayersTour().start();
          });

          thirdButton.addEventListener("click", () => {
            driverObj.destroy();
            useScenariosTour().start();
          });

          fourthButton.addEventListener("click", () => {
            driverObj.destroy();
            useCombineTour().start();
          });

          fifthButton.addEventListener("click", () => {
            router.push(
              "/combine/7/19435,19431?center=52.40661,5.40390&zoom=10"
            );

            waitUntilVisible(selector("layer-panel")).then(() => {
              driverObj.destroy();
              useExpertTour().start();
            });
          });
        },
      },
    },
  ]);
}
