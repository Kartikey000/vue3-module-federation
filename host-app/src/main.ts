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

// Initialize New Relic Browser Agent (Production only)
if (import.meta.env.PROD) {
  console.log(import.meta.env, 'env')
  const licenseKey = import.meta.env.NEWRELIC_LICENSE_KEY
  const applicationID = import.meta.env.NEWRELIC_APPLICATION_ID
  
  if (licenseKey && applicationID) {
    import('./newrelic-config').then(({ initNewRelic }) => {
      initNewRelic({
        licenseKey: licenseKey,
        applicationID: applicationID,
        accountId: import.meta.env.NEWRELIC_ACCOUNT_ID,
        agentID: import.meta.env.NEWRELIC_AGENT_ID,
      })
      console.log('[New Relic] ✅ Monitoring active')
    }).catch(error => {
      console.error('[New Relic] ❌ Failed to initialize:', error)
    })
  } else {
    console.warn('[New Relic] ⚠️ Credentials not configured')
    console.log('[New Relic] License Key:', licenseKey ? 'Found' : 'Missing')
    console.log('[New Relic] Application ID:', applicationID ? 'Found' : 'Missing')
  }
} else {
  console.log('[New Relic] ℹ️ Disabled in development mode')
}
