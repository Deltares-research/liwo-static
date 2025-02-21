import { driver } from "driver.js";
import { waitUntilVisible } from "./helpers";
import "driver.js/dist/driver.css";
import "../styles/tour.css";

export let driverInstance;

export function useTour(steps) {
  if (driverInstance?.isActive()) {
    driverInstance.destroy();
  }

  let autoStart = false;

  driverInstance = driver({
    showProgress: true,
    progressText: "{{current}} van {{total}}",
    popoverOffset: 20,
    nextBtnText: "Volgende",
    prevBtnText: "Vorige",
    doneBtnText: "Sluit",
    allowClose: false,
  });

  driverInstance.setSteps(
    steps(driverInstance).map((step) => ({
      ...step,
      popover: {
        ...step.popover,
        showButtons: ["next", "close"],
      },
    }))
  );

  if (autoStart) {
    waitUntilVisible(steps(driverInstance)[0].element).then(() => {
      driverInstance.drive();
    });
  }

  return {
    start(step = 0) {
      autoStart = true;
      if (driverInstance) {
        waitUntilVisible(steps(driverInstance)[step].element).then(() => {
          driverInstance.drive(step);
        });
      }
    },
  };
}
