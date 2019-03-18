import toNumber from 'lodash/toNumber'
import includes from 'lodash/includes'
import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About'
import Contact from './views/Contact'
import Home from './views/Home'
import Maps from './views/Maps'
import Viewer from './views/Viewer.vue'

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
      path: '/viewer/:id',
      name: 'viewer',
      component: Viewer,
      meta: {
        title: 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
      },
      beforeEnter: (to, from, next) => {
        // number or NaN
        let id = toNumber(_.get(to, 'params.id'))
        // don't show non-public maps, not secret, just not that relevant for the public
        if (includes(nonPublicViews, id)) {
          next('/')
        } else {
          next()
        }
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
