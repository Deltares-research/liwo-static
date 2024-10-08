import { driver } from "driver.js";
import { waitUntilVisible } from "./helpers";
import "driver.js/dist/driver.css";
import '../styles/tour.css';

export let driverInstance;

export function useTour(steps) {
  let autoStart = false;

  driverInstance = driver({
    showProgress: true,
    progressText: "{{current}} van {{total}}",
    popoverOffset: 20,
    showButtons: ["next", "close"],
    nextBtnText: "Volgende",
    prevBtnText: "Vorige",
    doneBtnText: "Sluit",
  });

  driverInstance.setSteps(steps(driverInstance));
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
