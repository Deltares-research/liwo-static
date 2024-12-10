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
        title: "Tour het Landelijk Informatiesysteem Water en Overstromingen",
        showButtons: ["close"],
        progressText: "",
        onPopoverRender: (popover) => {
          createButton(popover.footerButtons, "Start expert tour", () => {
            router.push(
              "/combine/7/19435,19431?center=52.40661,5.40390&zoom=10"
            );

            waitUntilVisible(selector("layer-panel")).then(() => {
              driverObj.destroy();
              useExpertTour().start();
            });
          });
          createButton(
            popover.footerButtons,
            "Start combineren scenario's tour",
            () => {
              driverObj.destroy();
              useCombineTour().start();
            }
          );
          createButton(popover.footerButtons, "Start scenario's tour", () => {
            driverObj.destroy();
            useScenariosTour().start();
          });
          createButton(popover.footerButtons, "Start kaartlagen tour", () => {
            driverObj.destroy();
            useLayersTour().start();
          });
          createButton(popover.footerButtons, "Start algemene tour", () => {
            driverObj.moveNext();
            useGeneralTour().start();
          });
        },
      },
    },
  ]);
}
