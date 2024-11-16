<template>
  <main>
    <div class="about">
      <h1>Dashboard</h1>
    </div>
    <D3Line msg="Vue.js and D3 Line Chart" />
  </main>
</template>

<script setup lang="ts">
import D3Line from '@/components/D3Line.vue'
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
