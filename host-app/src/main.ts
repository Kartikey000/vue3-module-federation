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
if (import.meta.env.NEWRELIC_LICENSE_KEY && import.meta.env.NEWRELIC_APPLICATION_ID) {
  import('./newrelic-config').then(({ initNewRelic }) => {
    initNewRelic({
      licenseKey: import.meta.env.NEWRELIC_LICENSE_KEY,
      applicationID: import.meta.env.NEWRELIC_APPLICATION_ID,
      accountId: import.meta.env.NEWRELIC_ACCOUNT_ID,
      trustKey: import.meta.env.NEWRELIC_TRUST_KEY,
      agentID: import.meta.env.NEWRELIC_AGENT_ID,
    })
  })
} else {
  console.log('[New Relic] Skipped - License key or Application ID not configured')
}
