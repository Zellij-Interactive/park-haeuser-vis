<template>
    <v-card class="pa-4" elevation="1" rounded="lg">
        <div class="d-flex justify-space-between">
            <PredictionLegend
                :dark-mode-on="props.darkModeOn"
                :filter="parkingGarageStore.filter"
            />
            <maxOccupancyLegend :dark-mode-on="props.darkModeOn" />
        </div>
    </v-card>
</template>

<script setup lang="ts">
import maxOccupancyLegend from '../components/MaxOccupancyLegend.vue';
import PredictionLegend from '../components/PredictionLegend.vue';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';

const props = defineProps<{
    darkModeOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();
</script>

<style></style>
