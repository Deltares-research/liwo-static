import { defineComponent } from 'vue'

export default function (baseComponent, propsData) {
  const Component = defineComponent(baseComponent)
  const instance = new Component({ propsData })

  return instance.$mount().$el
}
