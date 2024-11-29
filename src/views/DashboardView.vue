<template>
    <v-dialog v-model="isLoading" no-click-animation persistent height="46" width="250">
        <v-card class="d-flex flex-column text-center pt-2">
            <b class="mb-2">Loading...</b>
            <v-progress-linear indeterminate></v-progress-linear>
        </v-card>
    </v-dialog>

    <main>
        <div class="grid-container">
            <div class="map">
                <MapView :parking-garages="parkingGarages" :dark-mode-on="props.darkModeOn" />
            </div>
            <div class="menu pr-2">
                <MenuView
                    :parking-garages-names="parkingGaragesNames"
                    @toggle-theme="emit('toggleTheme')"
                />
            </div>
            <div class="legend d-flex justify-end align-end pr-2">
                <LegendView :dark-mode-on="props.darkModeOn" />
            </div>
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

const parkingGarageStore = useParkingGarageStore();

const parkingGaragesNames: ParkingGarageName[] = listOfParkingGaragesNames;

const parkingGarages = ref<ParkingGarage[]>([]);
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
.menu {
    grid-row: 1 / 2;
    grid-column: 2 / -1;

    z-index: 1;

    margin-top: 4px;
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
</style>
