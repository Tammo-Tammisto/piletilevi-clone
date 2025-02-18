<script setup>
import { ref } from 'vue';
import Tabs from './components/Tabs.vue';
</script>

<template>
  <Tabs />
  <Suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>