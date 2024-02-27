import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home Page - Smart Finance' // Specify the title for this route
    }
  },
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
