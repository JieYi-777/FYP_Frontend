import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import axios1 from '../axios.service';
import Registration from '../views/Registration.vue';
import Login from '../views/Login.vue';
import Homepage from '../views/Homepage.vue';
import Expenses from '../views/Expenses.vue';
import Budgets from '../views/Budgets.vue';
import NotFound404 from '../views/NotFound404.vue';


// Check the validity of the token every time go to the specific pages
const checkTokenExpiration = async (to, from, next) => {
  // Check if the token exists in the Vuex state
  const token = store.getters.getToken;

  if (token) {
    try {
      // Send a request to the backend to validate the token
      const response = await axios1.get('/auth/validate-token',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const isValid = response.data.isValid;

      if (isValid) {
        // Token is valid, continue to the route
        next();
      }
    } catch (error) {
      // An error occurred while validating the token, maybe token is expired or invalid, 
      // redirect to the login page
      console.error('Error validating token:', error);
      next({name: 'login'});
    }
  } else {
    // Token is not present, redirect to the login page
    next({name: 'login'});
  }
};

const routes = [
  // Registration page
  {
    path: '/registration',
    name: 'registration',
    component: Registration,
    meta: {
      title: 'Registration - Smart Finance',
      showNavigation: false,
      requiresAuth: false
    }
  },

  // Login page
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login - Smart Finance',
      showNavigation: false,
      requiresAuth: false
    }
  },

  // Homepage
  {
    path: '/',
    name: 'homepage',
    component: Homepage,
    meta: {
      title: 'Homepage - Smart Finance',
      showNavigation: true,
      requiresAuth: true
    },
    beforeEnter: checkTokenExpiration
  },

  // User's expenses page
  {
    path: '/expenses',
    name: 'expenses',
    component: Expenses,
    meta: {
      title: 'Expenses - Smart Finance',
      showNavigation: true,
      requiresAuth: true
    },
    beforeEnter: checkTokenExpiration
  },

  // User's budgets page
  {
    path: '/budgets',
    name: 'budgets',
    component: Budgets,
    meta: {
      title: 'Budgets - Smart Finance',
      showNavigation: true,
      requiresAuth: true
    },
    beforeEnter: checkTokenExpiration
  },

  // CatchAll 404 Page
  {
    path: '/:catchAll(.*)',
    name: 'notFound404',
    component: NotFound404,
    meta: {
      title: 'Not Found Page - Smart Finance',
      showNavigation: false,
      requiresAuth: false
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Check for the metada of each route, if requiresAuth is true, then check the user has token or not,
// if has, continue, else redirect to login page
// Note: Only effective when the page is reloading or directly enter the url 
//       (not apply if manually delete the token, the vuex still remember the old states because no reloading)
router.beforeEach((to, from, next) => {

  if (to.meta.requiresAuth) {

    // Route requires authentication
    if (store.getters.isAuthenticated) {
      // User is authenticated
      next();
    } else {
      // User is not authenticated, redirect to login page
      next({name: 'login'});
    }
  } else {
    // Route does not require authentication
    next();
  }
});

// Update the title based on the route metadata
router.afterEach((to) => {
  document.title = to.meta.title || 'Smart Finance';
});

export default router;
