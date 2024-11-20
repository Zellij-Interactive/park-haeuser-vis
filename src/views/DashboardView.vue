<template>
    <main>
        <div class="grid-container">
            <div class="map">
                <MapView :parking-garages="parkingGarages" />
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

const parkingGarageStore = useParkingGarageStore();

const parkingGarages = ref<ParkingGarage[]>();

onMounted(async () => {
    parkingGarages.value = await parkingGarageStore.getAllParkingGarage();
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
    grid-template-columns: 6fr 1fr;
    grid-template-rows: 4fr 4fr 1fr;

    height: 100vh;

    gap: 10px;
    background-color: #2196f3;
    padding: 10px;
}

.grid-container > div {
    background-color: rgba(255, 255, 255, 0.7);
    text-align: center;
    padding: 20px 0;
    font-size: 30px;
}
</style>
