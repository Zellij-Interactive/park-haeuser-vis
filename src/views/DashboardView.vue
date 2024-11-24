<template>
    <main>
        <!-- Loading Dialog -->
        <v-dialog v-model="isLoading" no-click-animation persistent height="46" width="250">
            <v-card class="d-flex flex-column text-center pt-2">
                <b class="mb-2">Loading...</b>
                <v-progress-linear indeterminate></v-progress-linear>
            </v-card>
        </v-dialog>

        <!-- Layout Grid -->
        <div class="grid-container">
            <!-- Map Section -->
            <div class="map">
                <MapView
                    :parking-garages="parkingGarages"
                    @markerClicked="handleMarkerClick"
                />
            </div>

            <!-- Filter Section -->
            <div class="filter d-flex justify-center align-center">
                <FilterView />
            </div>

            <!-- Legend Section -->
            <div class="legend d-flex justify-center align-center">
                <LegendView />
            </div>

            <!-- Date-Time Filter Section -->
            <div class="date-time-filter d-flex justify-center align-center">
                <DateTimeFilterView />
            </div>

            <!-- Bar Chart Section -->
            <div class="bar-chart" v-if="selectedChartData">
                <BarChart :data="selectedChartData.data" :title="selectedChartData.title" />
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
import BarChart from '@/BarChart/BarChart.vue';

// Reactive Properties
const parkingGarageStore = useParkingGarageStore();
const parkingGarages = ref<ParkingGarage[]>([]);
const selectedChartData = ref<{ data: number[]; title: string } | null>(null);
const isLoading = ref(false);

// Load parking garages on component mount
onMounted(async () => {
    await usingIndicator(isLoading, async () => {
        parkingGarages.value = await parkingGarageStore.getAllParkingGarage();
    });
});

// Handle marker click to show bar chart
function handleMarkerClick(garage: ParkingGarage) {
    console.log(`Marker clicked: ${garage.name}`); // Debug Log

    selectedChartData.value = {
        data: garage.rmse, // Replace with real data, e.g., RMSE values from the garage
        title: `Data for ${garage.name}`,
    };
}
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

.bar-chart {
    grid-row: 3 / -1; /* Position the chart below the legend */
    grid-column: 2 / -1;
    z-index: 1;
}

.grid-container {
    display: grid;
    grid-template-columns: 6fr 1fr;
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
