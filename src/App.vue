<template>
  <div class="map">
    <DashboardView />
  </div>
  <div class="filter">
    <FilterView />
  </div>
  <div class="date-time-filter">
    <DateTimeFilterView />
  </div>
</template>

<script setup lang="ts">
import DashboardView from './views/MapView.vue'
import DateTimeFilterView from './views/DateTimeFilterView.vue'
import FilterView from './views/FilterView.vue'
</script>

<style scoped></style>
