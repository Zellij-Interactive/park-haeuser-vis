<template>
    <div class="map">
        <DashboardView />
    </div>
    <div class="filter">
        <FilterView />
    </div>
    <div class="legend">
        <LegendView />
    </div>
    <div class="date-time-filter">
        <DateTimeFilterView />
    </div>
</template>

<script setup lang="ts">
import DashboardView from './views/MapView.vue';
import DateTimeFilterView from './views/DateTimeFilterView.vue';
import FilterView from './views/FilterView.vue';
import LegendView from './views/LegendView.vue';
</script>

<style scoped></style>
