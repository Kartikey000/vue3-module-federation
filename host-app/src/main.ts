import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { perfMonitor } from './utils/performance-monitoring'

// Mark platform load start
perfMonitor.markPlatformLoadStart()

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')

// Mark platform load end after mount
perfMonitor.markPlatformLoadEnd()

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
    })
    console.log('[New Relic] ✅ Monitoring active with hardcoded credentials')
    console.log('[New Relic] Application ID:', newRelicConfig.applicationID)
  }).catch(error => {
    console.error('[New Relic] ❌ Failed to initialize:', error)
  })
} else {
  console.log('[New Relic] ℹ️ Disabled in development mode')
}
