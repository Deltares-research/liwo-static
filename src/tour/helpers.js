export function selector(id) {
  return `[data-tour-id="${id}"]`;
}

export function waitUntilVisible(element) {
  const timeInterval = 300;
  const timeout = 2000;
  let timeTaken = 0;
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      return checkIfVisible(element)
        .then((el) => {
          clearInterval(interval);
          resolve(el);
        })
        .catch(() => {
          timeTaken += timeInterval;
          if (timeTaken > timeout) {
            clearInterval(interval);
            reject("waitUntilVisible timed out");
          }
        });
    }, timeInterval);
  });
}

export function checkIfVisible(element) {
  const foundElement = document.querySelector(element);
  if (foundElement) {
    return Promise.resolve(foundElement);
  } else {
    return Promise.reject();
  }
}

export function createButton(putBeforeElement, text, onClick) {
  const button = document.createElement("button");
  button.innerText = text;
  button.type = "button";
  button.dataset.test = text;
  putBeforeElement.insertAdjacentElement("afterbegin", button);
  button.addEventListener("click", onClick);
  return button;
}

export function createTourSummary(text, buttonText, buttonCallback) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("driver-popover-buttons-container");
  createButton(buttonContainer, buttonText, buttonCallback);
  const description = document.createElement("span");
  description.classList.add("driver-popover-description");
  description.innerText = text;
  buttonContainer.insertAdjacentElement("afterbegin", description);

  return buttonContainer;
}
