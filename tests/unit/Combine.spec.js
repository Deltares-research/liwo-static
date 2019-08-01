/* eslint-disable import/first */
import { mount, createLocalVue } from '@vue/test-utils'
// explicitly import vue file otherwise we don't have the template render function
// eslint-disable-next-line import/no-webpack-loader-syntax
const exports = require('!vue-loader!imports-loader?window=>window!@/views/Combine.vue')
const Combine = exports.default
import leafletDirective from '@/lib/leaflet-directive'

import chai from 'chai'
import chaiDom from 'chai-dom'
import Vuex from 'vuex'
import router from '@/router'

chai.use(chaiDom)

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.directive('leaflet', leafletDirective)

const expect = chai.expect

describe('the Combine view', () => {
  let store
  let getters
  let mutations
  let actions
  beforeEach(() => {
    getters = {
      currentNotifications: () => [],
      layerSet: () => {}
    }
    actions = {
      loadLayerSetById: () => {}
    }
    mutations = {
      setLayerSetId: () => {}
    }
    store = new Vuex.Store({
      getters,
      actions,
      mutations
    })
  })

  it('should mount', () => {
    let propsData = {}
    let { vm } = mount(Combine, {
      store,
      router,
      localVue,
      propsData
    })
    expect(vm)
  })
})
