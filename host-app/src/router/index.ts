import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/users',
      name: 'list-users',
      component: () => import('../views/ListUserView.vue')
    },
    {
      path: '/users/create',
      name: 'create-user',
      component: () => import('../views/CreateUserView.vue')
    },
    {
      path: '/users/edit/:id',
      name: 'edit-user',
      component: () => import('../views/CreateUserView.vue')
    }
  ]
})

// Track SPA navigation for New Relic
// This helps New Relic monitor client-side route changes in the single-page application
router.afterEach((to, from) => {
  if (typeof window !== 'undefined' && (window as any).newrelic) {
    // Set the page view name to the new route path
    (window as any).newrelic.setPageViewName(to.fullPath)
    
    // Optionally add custom attributes for better tracking
    if ((window as any).newrelic.setCustomAttribute) {
      (window as any).newrelic.setCustomAttribute('routeName', to.name as string || 'unknown')
      (window as any).newrelic.setCustomAttribute('routePath', to.path)
      if (from.path) {
        (window as any).newrelic.setCustomAttribute('previousRoute', from.path)
      }
    }
    
    console.log(`[New Relic] SPA Navigation tracked: ${from.path} → ${to.path}`)
  }
})

export default router

