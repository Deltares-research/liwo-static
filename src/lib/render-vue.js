import Vue from 'vue'

export default function (baseComponent, propsData) {
  let Component = Vue.extend(baseComponent)
  let instance = new Component({ propsData })

  return instance.$mount().$el
}
