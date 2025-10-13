<script setup lang="ts">
import ListUser from './components/ListUser.vue'
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="40" height="40" />
        <h1>List User App</h1>
      </div>
      <p class="subtitle">Standalone List User Micro-frontend</p>
    </header>

    <main class="main-content">
      <ListUser />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #42b983 0%, #359268 100%);
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

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
