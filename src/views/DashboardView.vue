<template>
    <!-- Loading Dialog -->
    <v-dialog v-model="isLoading" no-click-animation persistent height="46" width="250">
        <v-card class="d-flex flex-column text-center pt-2">
            <b class="mb-2">Loading...</b>
            <v-progress-linear indeterminate></v-progress-linear>
        </v-card>
    </v-dialog>

    <main>
        <!-- Layout Grid -->
        <div class="grid-container">
            <!-- Map Section -->
            <div class="map">
                <MapView :dark-mode-on="props.darkModeOn" />
            </div>

            <!-- Filter Section -->
            <div class="menu pr-2">
                <MenuView
                    :parking-garages-names="parkingGaragesNames"
                    :dark-mode-on="props.darkModeOn"
                    @toggle-theme="emit('toggleTheme')"
                />
            </div>

            <!-- Legend Section -->
            <div class="legend d-flex justify-end align-end pr-2">
                <LegendView :dark-mode-on="props.darkModeOn" />
            </div>

            <!-- Time-Line Section -->
            <div class="time-line px-2">
                <TimeLineView />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import MapView from '@/map/views/MapView.vue';
import MenuView from '@/menu/views/MenuView.vue';
import LegendView from '@/legend/views/LegendView.vue';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { onMounted, ref } from 'vue';
import { usingIndicator } from '@/core/usingIndicator';
import {
    listOfParkingGaragesNames,
    ParkingGarageName,
} from '@/parkingGarage/types/parkingGarageNames';
import TimeLineView from '@/time-line/views/TimeLineView.vue';

const props = defineProps<{
    darkModeOn: boolean;
}>();

const emit = defineEmits<{
    (event: 'toggleTheme'): void;
}>();

// Reactive Properties
const parkingGarageStore = useParkingGarageStore();

const parkingGaragesNames: ParkingGarageName[] = listOfParkingGaragesNames;

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
.menu {
    grid-row: 1 / 2;
    grid-column: 2 / -1;
    z-index: 1;

    margin-top: 4px;
    pointer-events: none;
}

.menu > * {
    pointer-events: auto;
}

.legend {
    grid-row: 2 / 3;
    grid-column: 2 / -1;
    z-index: 1;
}

.time-line {
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
    grid-template-columns: 6fr 2fr;
    grid-template-rows: 4fr 1fr 1fr;
    height: 100vh;

    background-color: var(--v-teal-darken-3);
}

.grid-container > div:not(.map) {
    padding: var(--gap);

    border: 2px solid black;
}
.test {
    border: 2px solid black;
}
</style>
