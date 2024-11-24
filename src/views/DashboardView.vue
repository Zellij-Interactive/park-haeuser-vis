<template>
    <main>
        <v-dialog v-model="isLoading" no-click-animation persistent height="46" width="250">
            <v-card class="d-flex flex-column text-center pt-2">
                <b class="mb-2">Loading...</b>
                <v-progress-linear indeterminate></v-progress-linear>
            </v-card>
        </v-dialog>
        <div class="grid-container">
            <div class="map">
                <MapView :parking-garages="parkingGarages" />
            </div>
            <div class="filter">
                <FilterView :parking-garages-names="parkingGaragesNames" />
            </div>
            <div class="legend d-flex justify-center align-center">
                <LegendView />
            </div>
            <div class="date-time-filter d-flex justify-center align-center">
                <DateTimeFilterView />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import MapView from '@/map/views/MapView.vue';
import FilterView from '@/filter/views/FilterView.vue';
import LegendView from '@/legend/views/LegendView.vue';
import DateTimeFilterView from '@/date-time-filter/views/DateTimeFilterView.vue';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { onMounted, ref } from 'vue';
import { usingIndicator } from '@/core/usingIndicator';
import {
    listOfParkingGaragesNames,
    ParkingGarageName,
} from '@/parkingGarage/types/parkingGarageNames';

const parkingGarageStore = useParkingGarageStore();

const parkingGarages = ref<ParkingGarage[]>([]);
const parkingGaragesNames: ParkingGarageName[] = listOfParkingGaragesNames;

const isLoading = ref(false);

onMounted(async () => {
    await usingIndicator(isLoading, async () => {
        parkingGarages.value = await parkingGarageStore.getAllParkingGarage();
    });
});
</script>

<style>
.map {
    grid-area: 1 / 1 / -1 / -1;

    z-index: 0;
}
.filter {
    grid-row: 1 / 2;
    grid-column: 2 / -1;

    z-index: 1;

    margin-top: 20px;
}

.legend {
    grid-row: 2 / 3;
    grid-column: 2 / -1;

    z-index: 1;
}

.date-time-filter {
    grid-row: 3 / -1;
    grid-column: 1 / -1;

    z-index: 1;
}

.grid-container {
    display: grid;
    grid-template-columns: 6fr 3fr;
    grid-template-rows: 4fr 1fr 1fr;

    height: 100vh;

    gap: 10px;
    background-color: #2196f3;
    padding: 10px;
}

.grid-container > div {
    background-color: rgba(255, 255, 255, 0.7);
    padding: 20px 0;
    font-size: 14px;
}
</style>
