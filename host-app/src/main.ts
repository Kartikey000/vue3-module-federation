import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { perfMonitor } from './utils/performance-monitoring'

// Mark platform load start with custom attributes
perfMonitor.markPlatformLoadStart({
  environment: import.meta.env.MODE,
  appType: 'micro-frontend-host',
  hasRouter: true,
  hasStore: true,
  initialRoute: window.location.pathname
})

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')

// Mark platform load end after mount with custom attributes
perfMonitor.markPlatformLoadEnd({
  environment: import.meta.env.MODE,
  mountComplete: true,
  pluginsLoaded: ['router', 'vuex'],
  currentRoute: router.currentRoute.value.path
})

// Calculate Total Load Time after a short delay to ensure all components are loaded
setTimeout(() => {
  perfMonitor.calculateTotalLoadTime({
    environment: import.meta.env.MODE,
    pageType: 'host-application',
    hasRemotes: true,
    remoteApps: ['list-user-app', 'create-user-app'],
    currentRoute: router.currentRoute.value.path,
    allComponentsLoaded: true
  })
}, 1000)

// Initialize New Relic Browser Agent (Production only) - Hardcoded credentials
if (import.meta.env.PROD) {
  // Hardcoded New Relic credentials (from your actual NR account)
  const newRelicConfig = {
    accountId: '7225477',
    trustKey: '7225477',
    agentID: '1589146529',
    licenseKey: 'NRJS-652d628fc44fd46a6e9',
    applicationID: '1589146529'
  }
  
  import('./newrelic-config').then(({ initNewRelic }) => {
    initNewRelic({
      licenseKey: newRelicConfig.licenseKey,
      applicationID: newRelicConfig.applicationID,
      accountId: newRelicConfig.accountId,
      agentID: newRelicConfig.agentID,
      appName: 'host-app-vue-3' // Application name for BrowserPerformance events
    })
    console.log('[New Relic] ✅ Monitoring active with hardcoded credentials')
    console.log('[New Relic] Application ID:', newRelicConfig.applicationID)
    console.log('[New Relic] BrowserPerformance events enabled for marks and measures')
  }).catch(error => {
    console.error('[New Relic] ❌ Failed to initialize:', error)
  })
} else {
  console.log('[New Relic] ℹ️ Disabled in development mode')
}
