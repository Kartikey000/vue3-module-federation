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

// Optional: Initialize New Relic Browser Agent
// Uncomment and configure after setting up New Relic account
/*
import { initNewRelic } from './newrelic-config'

if (import.meta.env.VITE_NEW_RELIC_LICENSE_KEY) {
  initNewRelic({
    accountId: import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID,
    trustKey: import.meta.env.VITE_NEW_RELIC_TRUST_KEY,
    agentID: import.meta.env.VITE_NEW_RELIC_AGENT_ID,
    licenseKey: import.meta.env.VITE_NEW_RELIC_LICENSE_KEY,
    applicationID: import.meta.env.VITE_NEW_RELIC_APPLICATION_ID,
  })
}
*/
