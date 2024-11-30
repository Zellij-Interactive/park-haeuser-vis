<template>
    <InfoWindow :options="props.options">
        <div class="info-window d-flex flex-column px-4 pb-4" :style="{ width: '260px' }">
            <b class="text-center text-primary">{{ props.parkingGarage.name }}</b>

            <span>Maximale Auslastung: {{ props.parkingGarage.maximalOccupancy }}</span>
            <span
                >Vorhergesagte Auslastung:
                {{ props.parkingGarage.predictions.get(filter.index)?.prediction }}</span
            >

            <span
                >Vorhergesagte Auslastung:
                {{ props.parkingGarage.predictions.get(filter.index) }}</span
            >
        </div>
    </InfoWindow>
</template>

<script setup lang="ts">
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';

import { InfoWindow } from 'vue3-google-map';
import type { Filter } from '@/parkingGarage/types/filter';
import { useTheme } from 'vuetify';

const props = defineProps<{
    options: google.maps.InfoWindowOptions;
    parkingGarage: ParkingGarage;
    filter: Filter;
}>();

const theme = useTheme();
</script>

<style>
.custom-btn {
    box-sizing: border-box;
    background: white;
    height: 40px;
    width: 40px;
    border-radius: 2px;
    border: 0px;
    margin: 10px;
    padding: 0px;
    font-size: 1.25rem;
    text-transform: none;
    appearance: none;
    cursor: pointer;
    user-select: none;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
    overflow: hidden;
}

/* Hide the default google close button */
.gm-ui-hover-effect {
    display: none !important;
}

/* Remove any padding or margins on the outer container */
.gm-style-iw {
    background-color: rgb(
        var(--v-theme-secondary)
    ) !important; /* Remove Google's default styling */
    padding: 0 !important; /* Ensure no extra padding */
    margin: 0 !important; /* Ensure no extra margin */
}

/* Additional catch-all for possible internal containers */
.gm-style-iw-d {
    overflow: hidden !important; /* Prevent scrollbars */
}
</style>
