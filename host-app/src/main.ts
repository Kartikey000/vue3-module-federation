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

// Initialize New Relic Browser Agent
// Only runs in PRODUCTION mode with proper credentials
// Dynamic import ensures New Relic is tree-shaken out of development builds
if (import.meta.env.PROD) {
  if (import.meta.env.NEWRELIC_LICENSE_KEY && import.meta.env.NEWRELIC_APPLICATION_ID) {
    import('./newrelic-config').then(({ initNewRelic }) => {
      initNewRelic({
        licenseKey: import.meta.env.NEWRELIC_LICENSE_KEY,
        applicationID: import.meta.env.NEWRELIC_APPLICATION_ID,
        accountId: import.meta.env.NEWRELIC_ACCOUNT_ID,
        agentID: import.meta.env.NEWRELIC_AGENT_ID,
      })
      console.log('[New Relic] ✅ Monitoring active')
    }).catch(error => {
      console.error('[New Relic] ❌ Failed to initialize:', error)
    })
  } else {
    console.warn('[New Relic] ⚠️ Credentials not configured')
  }
} else {
  console.log('[New Relic] ℹ️ Disabled in development mode')
}
