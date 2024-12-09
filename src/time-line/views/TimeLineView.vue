<template>
    <v-card
        class="fill-height fill-width d-flex flex-column justify-center align-center"
        rounded="lg"
    >
        <LineChart
            :parking-garages="parkingGarageStore.parkingGaragesMap"
            :filter="parkingGarageStore.filter"
            :dark-mode-on="props.darkModeOn"
        />

        <TimeLineSlider
            :filter="parkingGarageStore.filter"
            @index-updated="
                (index) => {
                    parkingGarageStore.filter.index = index;
                    parkingGarageStore.filter.date = new Date(index);
                }
            "
        />
    </v-card>
</template>

<script setup lang="ts">
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import TimeLineSlider from '../components/TimeLineSlider.vue';
import LineChart from '../components/LineChart.vue';

const props = defineProps<{
    darkModeOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();
</script>

<style></style>
