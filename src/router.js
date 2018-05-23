import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About'
import Contact from './views/Contact'
import Home from './views/Home'
import Maps from './views/Maps'
import Viewer from './views/Viewer.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home pagina'
      }
    },
    {
      path: '/maps',
      name: 'maps',
      component: Maps,
      meta: {
        title: 'Kaarten overzicht'
      }
    },
    {
      path: '/viewer/:id',
      name: 'viewer',
      component: Viewer,
      meta: {
        title: 'Kaart'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: 'Over LIWO'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
      meta: {
        title: 'Contact informatie'
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
