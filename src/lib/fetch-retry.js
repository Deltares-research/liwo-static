function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function fetchRetry(url, options = {}, retries) {
  function onError(error) {
    if (retries > 0) {
      return wait(1000).then(() => fetchRetry(url, options, retries - 1));
    }
    throw new Error(error);
  }

  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return onError(res.status)
    })
    .catch((error) => {
      return onError(error)
    });
}
