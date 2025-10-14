<template>
  <div class="about">
    <h1>About This Application</h1>
    
    <div class="content">
      <section>
        <h2>Module Federation with Vue 3</h2>
        <p>
          This is a host application that demonstrates Module Federation with Vue 3.
          It serves as the container for micro-frontends that can be loaded dynamically.
        </p>
      </section>
      
      <section>
        <h2>Features</h2>
        <ul>
          <li>Dynamic module loading with Module Federation</li>
          <li>Vue 3 with Composition API</li>
          <li>TypeScript support</li>
          <li>Vue Router for navigation</li>
          <li>Modern development with Vite</li>
        </ul>
      </section>
      
      <section>
        <h2>Remote Applications</h2>
        <ul>
          <li><strong>List User App:</strong> Manages user listing functionality</li>
          <li><strong>Create User App:</strong> Handles user creation and updates</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { perfMonitor } from '../utils/performance-monitoring'

onMounted(() => {
  // Mark component load start with custom attributes
  perfMonitor.markComponentLoadStart('AboutView', {
    componentType: 'page',
    isRemote: false,
    pageType: 'information',
    hasSections: true,
    sectionCount: 3,
    route: '/about'
  })
  
  // Mark component load end with final metadata
  perfMonitor.markComponentLoadEnd('AboutView', {
    pageType: 'information',
    renderComplete: true,
    sectionsRendered: 3,
    contentType: 'static',
    hasFeatureList: true
  })
})
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

section {
  margin-bottom: 2rem;
}

section:last-child {
  margin-bottom: 0;
}

h2 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.6;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #666;
  line-height: 1.6;
}

li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #42b983;
  font-weight: bold;
}
</style>

