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

function checkIfVisible(element) {
  const foundElement = document.querySelector(element);
  if (foundElement) {
    return Promise.resolve(foundElement);
  } else {
    return Promise.reject();
  }
}
