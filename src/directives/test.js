import Vue from 'vue'

Vue.directive('test', {
  bind (el, binding) {
    setAttribute(el, binding)
  },
  update (el, binding) {
    setAttribute(el, binding)
  }
})

function setAttribute (el, binding) {
  if (binding.value !== false) {
    el.setAttribute('data-test', binding.value)
  }
}
