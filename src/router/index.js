import { createRouter, createWebHistory } from 'vue-router'
import Registration from '../views/Registration.vue'
import Homepage from '../views/Homepage.vue'
import NotFound404 from '../views/NotFound404.vue'

const routes = [
  // Registration page
  {
    path: '/registration',
    name: 'registration',
    component: Registration,
    meta: {
      title: 'Registration - Smart Finance',
      showNavigation: false
    }
  },

  // Homepage
  {
    path: '/',
    name: 'homepage',
    component: Homepage,
    meta: {
      title: 'Homepage - Smart Finance',
      showNavigation: true
    }
  },

  // CatchAll 404 Page
  {
    path: '/:catchAll(.*)',
    name: 'notFound404',
    component: NotFound404,
    meta: {
      title: 'Not Found Page - Smart Finance',
      showNavigation: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


// Update the title based on the route metadata
router.afterEach((to) => {
  document.title = to.meta.title || 'Smart Finance';
});

export default router
