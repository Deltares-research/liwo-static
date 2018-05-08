import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Maps from './views/Maps.vue'
import About from './views/About.vue'
import Contact from './views/Contact.vue'

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
