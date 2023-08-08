const install = (app) => {
  app.directive('test', {
    created (el, binding) {
      setAttribute(el, binding)
    },
    updated (el, binding) {
      setAttribute(el, binding)
    }
  })
}

function setAttribute (el, binding) {
  if (binding.value !== false) {
    el.setAttribute('data-test', binding.value)
  }
}

export default install
