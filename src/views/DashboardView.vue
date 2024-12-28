<template>
    <!-- Loading Dialog -->
    <v-dialog v-model="isLoading" no-click-animation persistent height="200" width="600">
        <v-card rounded="lg" elevation="0" class="border-thin">
            <div class="d-flex flex-column align-center">
                <img src="../../public/logo.png" class="pa-4" width="560" />
                <v-progress-circular indeterminate color="grey"></v-progress-circular>
            </div>
        </v-card>
    </v-dialog>

    <main>
        <div
            v-if="!isLoading && parkingGarageStore.filter.parkingGarages.length == 0"
            class="info d-flex justify-center pt-4"
        >
            <v-card rounded="lg" elevation="0" class="border-thin">
                <v-alert
                    text="Wählen Sie Parkhäuser aus, um die zugehörigen Daten zu visualisieren und analysieren."
                    type="info"
                    variant="tonal"
                    closable
                />
            </v-card>
        </div>

        <!-- Layout Grid -->
        <div class="grid-container">
            <!-- Map Section -->
            <div class="map">
                <MapView :dark-mode-on="props.darkModeOn" />
            </div>

            <!-- Filter Section -->
            <div class="left-side pr-2">
                <v-card v-if="!isLoading" class="border-thin" elevation="0"> </v-card>
            </div>

            <!-- Filter Section -->
            <div class="menu pr-2" v-if="!isLoading">
                <MenuView
                    :parking-garages-names="parkingGaragesNames"
                    :dark-mode-on="props.darkModeOn"
                    @toggle-theme="emit('toggleTheme')"
                    @filter-clicked="isFilterOn = !isFilterOn"
                />
            </div>

            <!-- Legend Section -->
            <div
                v-if="!isLoading && parkingGarageStore.filter.parkingGarages.length > 0"
                class="legend d-flex justify-end align-end pr-2"
            >
                <LegendView :dark-mode-on="props.darkModeOn" />
            </div>

            <!-- Time-Line Section -->
            <div
                v-if="!isLoading && parkingGarageStore.filter.parkingGarages.length > 0"
                class="time-line px-2"
            >
                <TimeLineView :dark-mode-on="props.darkModeOn" :is-filter-on="isFilterOn" />
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
import { computed, onMounted, ref } from 'vue';
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
const isLoading = ref(false);
const isFilterOn = ref(false);

// Load parking garages on component mount
onMounted(async () => {
    await usingIndicator(isLoading, async () => {
        parkingGarages.value = await parkingGarageStore.getAllParkingGarage();
    });
});
</script>

<style>
.info {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
}

.test > * {
    border: 2px red solid;
}

.map {
    grid-area: 1 / 1 / -1 / -1;
    z-index: 0;
}

.left-side {
    grid-row: 1 / 3;
    grid-column: 1 / 2;
    z-index: 1;

    margin-top: 4px;
    pointer-events: none;
}

.menu {
    grid-row: 1 / 2;
    grid-column: 3 / -1;
    z-index: 1;

    margin-top: 4px;
    pointer-events: none;
}

.menu > * {
    pointer-events: auto;
}

.legend {
    grid-row: 2 / 3;
    grid-column: 3 / -1;
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
    grid-template-columns: 2fr 6fr 2fr;
    grid-template-rows: 4fr 1fr 2fr;
    height: 100vh;
}

.grid-container > div:not(.map) {
    padding: var(--gap);
}
</style>
