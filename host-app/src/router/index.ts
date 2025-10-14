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
    const nr = (window as any).newrelic
    
    // Set the page view name to the new route path
    if (typeof nr.setPageViewName === 'function') {
      nr.setPageViewName(to.fullPath)
    }
    
    // Add custom attributes for better tracking (each call is independent)
    if (typeof nr.setCustomAttribute === 'function') {
      nr.setCustomAttribute('routeName', to.name as string || 'unknown')
      nr.setCustomAttribute('routePath', to.path)
      nr.setCustomAttribute('routeFullPath', to.fullPath)
      
      // Track previous route
      if (from.path) {
        nr.setCustomAttribute('previousRoute', from.path)
        nr.setCustomAttribute('previousRouteName', from.name as string || 'unknown')
      }
      
      // Track route metadata
      nr.setCustomAttribute('hasParams', Object.keys(to.params).length > 0)
      nr.setCustomAttribute('hasQuery', Object.keys(to.query).length > 0)
      
      // Track specific route types
      if (to.path.includes('/users/edit/')) {
        nr.setCustomAttribute('pageType', 'edit-user')
        nr.setCustomAttribute('userId', to.params.id as string)
      } else if (to.path === '/users/create') {
        nr.setCustomAttribute('pageType', 'create-user')
      } else if (to.path === '/users') {
        nr.setCustomAttribute('pageType', 'list-users')
      } else if (to.path === '/') {
        nr.setCustomAttribute('pageType', 'home')
      } else if (to.path === '/about') {
        nr.setCustomAttribute('pageType', 'about')
      }
      
      // Track navigation type
      const navigationType = from.path === '' ? 'initial' : 'navigation'
      nr.setCustomAttribute('navigationType', navigationType)
    }
    
    console.log(`[New Relic] SPA Navigation tracked: ${from.path} → ${to.path}`)
  }
})

export default router

