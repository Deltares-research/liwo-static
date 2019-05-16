import toNumber from 'lodash/fp/toNumber'
import includes from 'lodash/fp/includes'
import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About'
import Contact from './views/Contact'
import Home from './views/Home'
import Maps from './views/Maps'
import Viewer from './views/Viewer'
import Combine from './views/Combine'

Vue.use(Router)

// These views contain information that is not interesting for the public.
// It is public information but not relevant
const nonPublicViews = [1, 2, 3, 4, 5, 6, 7, 8, 9]

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
        return {
          id: toNumber(route.params.id)
        }
      },
      beforeEnter: (to, from, next) => {
        // don't show non-public maps, not secret, just not that relevant for the public
        if (includes(toNumber(to.params.id), nonPublicViews)) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/combine/:ids(\\d+)?',
      name: 'combine',
      component: Combine,
      meta: {
        title: 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
      },
      props: {
        selectMultipleFeatures: true,
        filterByIds: false,
        layerSetId: 33
      }
    },
    {
      path: '/combined/:ids(\\d+)?/:band?',
      name: 'combined',
      component: Combine,
      meta: {
        title: 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
      },
      props: {
        selectMultipleFeatures: false,
        filterByIds: true,
        layerSetId: 34
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
    }
  ]
})

// change title for blind people
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
