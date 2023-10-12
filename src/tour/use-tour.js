import { driver } from 'driver.js'
import { onMounted, onUnmounted } from 'vue'
import "driver.js/dist/driver.css";

export function useTour(steps) {
  let driverInstance
  let autoStart = false

  onMounted(() => {
    driverInstance = driver({
      steps
    })

    if(autoStart) {
      waitUntilVisible(steps[0].element).then(() => {
        driverInstance.drive()
      })
    }
  })

  onUnmounted(() => {
    driverInstance.destroy()
  })

  return {
    start() {
      autoStart = true
      if(driverInstance) {
        waitUntilVisible(steps[0].element).then(() => {
          driverInstance.drive()
        })
      }
    },
  }
}


function waitUntilVisible(element) {
  const timeInterval = 300
  const timeout = 2000
  let timeTaken = 0
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      return checkIfVisible(element)
        .then(el => {
          clearInterval(interval)
          resolve(el)
        })
        .catch(() => {
          timeTaken += timeInterval
          if (timeTaken > timeout) {
            clearInterval(interval)
            reject('waitUntilVisible timed out')
          }
        })
    }, timeInterval)
  })
}

function checkIfVisible(element) {
  const foundElement = document.querySelector(element)
  if (foundElement) {
    return Promise.resolve(foundElement)
  } else {
    return Promise.reject()
  }
}
