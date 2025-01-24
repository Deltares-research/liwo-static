import { createButton, selector } from "./helpers";
import { useLayersTour } from "./use-layers-tour";
import { useTour } from "./use-tour";

export function useGeneralTour() {
  return useTour((driverObj) => [
    {
      element: selector("liwo-header"),
      popover: {
        title: "Landelijk Informatiesysteem Water en Overstromingen",
        description:
          "Welkom op het Landelijk Informatiesysteem Water en Overstromingen. LIWO bevat kaartenlagen voor professionals die zich bezig houden met wateroverlast en overstromingen.",
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
        doneBtnText: "Start kaartlagen tour",
        onNextClick: () => {
          driverObj.destroy();
          useLayersTour().start();
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
