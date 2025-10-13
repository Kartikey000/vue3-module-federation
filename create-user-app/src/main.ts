import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createUserStore } from './store-init'

const app = createApp(App)

// Use local store for standalone mode
app.use(createUserStore())

app.mount('#app')
