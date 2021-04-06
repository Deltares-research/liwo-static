import Vue from 'vue'

export default function (baseComponent, propsData) {
  const Component = Vue.extend(baseComponent)
  const instance = new Component({ propsData })

  return instance.$mount().$el
}
