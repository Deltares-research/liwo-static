
import { mount } from '@vue/test-utils'

import Combine from '@/views/Combine.vue'
import { directive as testDirective} from '@/directives/test'

import { createStore } from 'vuex'
import router from '@/router'
import { expect, beforeEach, it } from 'vitest'

let store
let getters
let mutations
let actions

beforeEach(() => {
  getters = {
    currentNotifications: () => [],
    layerSet: () => {},
    layers: () => {},
  }
  actions = {
    loadLayerSetById: () => {}
  }
  mutations = {
    setLayerSetId: () => {}
  }
  store = createStore({
    getters,
    actions,
    mutations
  })
})

it('should mount', () => {
  const propsData = {}
  const { vm } = mount(Combine, {
    global: {
      directives: {
        test: testDirective
      },
      plugins: [store, router]
    },
    propsData
  })
  expect(vm).toBeTruthy()
})
