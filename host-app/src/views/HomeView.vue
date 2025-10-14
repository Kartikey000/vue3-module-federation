<template>
  <div class="home">
    <h1>Welcome to Host App</h1>
    <p>This is the home page of the Module Federation Host Application.</p>
    
    <div class="card-container">
      <div class="card">
        <h2>About</h2>
        <p>Learn more about this application</p>
        <router-link to="/about" class="btn">Go to About</router-link>
      </div>
      
      <div class="card">
        <h2>List Users</h2>
        <p>View all users in the system</p>
        <router-link to="/users" class="btn">View Users</router-link>
      </div>
      
      <div class="card">
        <h2>Create User</h2>
        <p>Add a new user to the system</p>
        <router-link to="/users/create" class="btn">Create User</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { perfMonitor } from '../utils/performance-monitoring'

onMounted(() => {
  // Mark component load start with custom attributes
  perfMonitor.markComponentLoadStart('HomeView', {
    componentType: 'page',
    isRemote: false,
    pageType: 'landing',
    hasNavigation: true,
    cardCount: 3,
    route: '/'
  })
  
  // Mark component load end with final metadata
  perfMonitor.markComponentLoadEnd('HomeView', {
    pageType: 'landing',
    renderComplete: true,
    cardsRendered: 3,
    hasLinks: true,
    navigationReady: true
  })
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card h2 {
  color: #42b983;
  margin-bottom: 0.5rem;
}

.card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #359268;
}
</style>

