<template>
    <div class="legend-container">
        <PredictionLegend />
        <maxOccupancyLegend />
    </div>
</template>

<script setup lang="ts">
import maxOccupancyLegend from '../components/MaxOccupancyLegend.vue';
import PredictionLegend from '../components/PredictionLegend.vue';
</script>

<style>
.legend-container {
    width: 80%;
    margin: var(--gap);
    padding: var(--gap);
}
</style>
