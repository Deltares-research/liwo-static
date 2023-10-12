export const directive = {
  created (el, binding) {
    setAttribute(el, binding)
  },
  updated (el, binding) {
    setAttribute(el, binding)
  }
}

const install = (app) => {
  app.directive('test', directive)
}

function setAttribute (el, binding) {
  if (binding.value !== false) {
    el.setAttribute('data-test', binding.value)
  }
}

export default install
