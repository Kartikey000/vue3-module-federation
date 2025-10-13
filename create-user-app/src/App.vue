<script setup lang="ts">
import { ref } from 'vue'
import CreateUpdateUser from './components/CreateUpdateUser.vue'

const testUserId = ref<string | number>()
const showCreateMode = ref(true)

const toggleMode = () => {
  showCreateMode.value = !showCreateMode.value
  testUserId.value = showCreateMode.value ? undefined : 123
}
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="40" height="40" />
        <h1>Create/Update User App</h1>
      </div>
      <p class="subtitle">Standalone Create/Update User Micro-frontend</p>
    </header>

    <div class="mode-switcher">
      <button @click="toggleMode" class="btn-mode">
        Switch to {{ showCreateMode ? 'Edit' : 'Create' }} Mode
      </button>
      <p class="mode-info">
        Current Mode: <strong>{{ showCreateMode ? 'Create' : 'Edit' }}</strong>
        <span v-if="!showCreateMode"> (User ID: {{ testUserId }})</span>
      </p>
    </div>

    <main class="main-content">
      <CreateUpdateUser :userId="testUserId" :key="testUserId" />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.logo {
  display: block;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.mode-switcher {
  max-width: 600px;
  margin: 2rem auto 0;
  padding: 0 1rem;
  text-align: center;
}

.btn-mode {
  padding: 0.75rem 1.5rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-mode:hover {
  background-color: #764ba2;
}

.mode-info {
  margin-top: 1rem;
  color: #666;
}

.mode-info strong {
  color: #667eea;
}

.main-content {
  padding: 2rem;
}
</style>
