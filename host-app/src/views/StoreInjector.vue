<template>
  <slot :store="store"></slot>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useStore, Store } from 'vuex'

// This component ensures the Vuex store is available to federated components
const store = useStore()

// Provide the store using both methods for maximum compatibility
provide('vuex-store', store)
provide(Store, store)
</script>

