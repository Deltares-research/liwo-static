import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About'
import Contact from './views/Contact'
import Home from './views/Home'
import Maps from './views/Maps'
import Viewer from './views/Viewer'
import Combine from './views/Combine'
import Toegankelijkheid from './views/Toegankelijkheid'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
      }
    },
    {
      path: '/maps',
      name: 'maps',
      component: Maps,
      meta: {
        title: 'LIWO - Kaarten'
      }
    },
    {
      path: '/viewer/:id(\\d+)',
      name: 'viewer',
      component: Viewer,
      meta: {
        title: 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
      },
      // pass id to component
      props: (route) => {
        let id = _.toNumber(route.params.id)
        return {
          id
        }
      }
    },
    // Some special views
    {
      // optional ids consisting of numbers and ,
      // the first id is  the layerSetId
      // the ids are the scenario  ids.
      path: '/scenarios/:id/:ids([\\d,]*)?',
      name: 'scenarios',
      // browse scenarios
      component: Combine,
      meta: {
        title: 'Bekijken overstromingsscenario\'s'
      },
      props: {
        selectFeatureMode: 'single',
        filterByIds: false,
        scenarioMode: 'lookup'
      }

    },
    {
      // optional ids consisting of numbers and ,
      path: '/combine/:id/:ids([\\d,]*)?',
      name: 'combine',
      component: Combine,
      meta: {
        title: 'Combineren overstromingsscenario\'s'
      },
      props: {
        selectFeatureMode: 'multiple',
        filterByIds: false,
        scenarioMode: 'lookup'
      }
    },
    {
      // required ids, numbers and ,
      path: '/combined/:id/:ids([\\d,]+)/:band([\\w]+)',
      name: 'combined',
      component: Combine,
      meta: {
        title: 'Gecombineerd scenario'
      },
      props: {
        selectFeatureMode: 'disabled',
        filterByIds: true,
        scenarioMode: 'compute'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: 'LIWO - Over LIWO'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
      meta: {
        title: 'LIWO - Contact'
      }
    },
    {
      path: '/toegankelijkheid',
      name: 'toegankelijkheid',
      component: Toegankelijkheid,
      meta: {
        title: 'LIWO - Toegankelijkheid'
      }
    }
  ]
})

// change title for blind people
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
