import { selector } from "./helpers";
import { useLayersTour } from "./use-layers-tour";
import { useScenariosTour } from "./use-scenarios-tour";
import { useTour } from "./use-tour";

export function useGeneralTour() {
  return useTour((driverObj) => [
    {
      element: selector("liwo-header"),
      popover: {
        title: "Landelijk Informatiesysteem Water en Overstromingen",
        description:
          "Welkom op het Landelijk Informatiesysteem Water en Overstromingen. LIWO bevat kaartenlagen voor professionals die zich bezig houden met wateroverlast en overstromingen.",
        showButtons: ['close'],
        progressText: "",
        onPopoverRender: (popover) => {
          const firstButton = document.createElement("button");
          const secondButton = document.createElement("button");
          const thirdButton = document.createElement("button");
          firstButton.innerText = "Start algemene tour";
          secondButton.innerText = "Start kaartlagen tour";
          thirdButton.innerText = "Start scenario's tour";
          popover.footerButtons.appendChild(firstButton);
          popover.footerButtons.appendChild(secondButton);
          popover.footerButtons.appendChild(thirdButton);

          firstButton.addEventListener("click", () => {
            driverObj.moveNext();
          });

          secondButton.addEventListener("click", () => {
            driverObj.destroy();
            useLayersTour().start();
          });

          thirdButton.addEventListener("click", () => {
            driverObj.destroy();
            useScenariosTour().start();
          });
        },
      },
    },
    {
      element: selector("contact-header"),
      popover: {
        title: "Algemeen",
        description:
          "Hier vindt u contactgegevens voor als u vragen heeft over LIWO.",
      },
    },
    {
      element: selector("toegankelijkheid-header"),
      popover: {
        title: "Algemeen",
        description:
          "Hier vindt u informatie over de toegankelijkheid van deze website.",
      },
    },
    {
      element: selector("cookies-header"),
      popover: {
        title: "Algemeen",
        description:
          "Hier treft u achtergrondinformatie over het gebruik van cookies op deze website.",
      },
    },
    {
      element: selector("over-liwo-header"),
      popover: {
        title: "Algemeen",
        description:
          "Hier leest u meer over de achtergrond van LIWO en het gebruik van informatie uit LIWO.",
        onPopoverRender: (popover) => {
          const firstButton = document.createElement("button");
          firstButton.innerText = "Start kaartlagen tour";
          popover.footerButtons.appendChild(firstButton);

          firstButton.addEventListener("click", () => {
            driverObj.destroy();
            useLayersTour().start();
          });
        },
      },
    },
  ]);
}
