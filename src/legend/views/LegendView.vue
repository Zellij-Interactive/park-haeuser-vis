<template>
    <v-card class="pa-4">
        <div>
            <PredictionLegend :dark-mode-on="props.darkModeOn" />
            <maxOccupancyLegend :dark-mode-on="props.darkModeOn" />
        </div>
    </v-card>
</template>

<script setup lang="ts">
import maxOccupancyLegend from '../components/MaxOccupancyLegend.vue';
import PredictionLegend from '../components/PredictionLegend.vue';

const props = defineProps<{
    darkModeOn: boolean;
}>();
</script>

<style>
.legend-container {
    width: 80%;
    margin: var(--gap);
    padding: var(--gap);
    border: 2px black solid;
}
</style>
