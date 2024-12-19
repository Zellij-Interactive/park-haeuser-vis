<template>
    <v-card class="pa-2 border-thin" elevation="0" rounded="lg">
        <div class="justify-space-between">
            <MaxOccupancyLegend :dark-mode-on="props.darkModeOn" />
            <PredictionQualityLegend
                :dark-mode-on="props.darkModeOn"
                :filter="parkingGarageStore.filter"
            />
            <PredictionLegend
                :dark-mode-on="props.darkModeOn"
                :filter="parkingGarageStore.filter"
            />
        </div>
    </v-card>
</template>

<script setup lang="ts">
import MaxOccupancyLegend from '../components/MaxOccupancyLegend.vue';
import PredictionLegend from '../components/PredictionLegend.vue';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import PredictionQualityLegend from '../components/PredictionQualityLegend.vue';

const props = defineProps<{
    darkModeOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();
</script>

<style></style>
