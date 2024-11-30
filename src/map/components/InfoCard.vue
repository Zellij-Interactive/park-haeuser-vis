<template>
    <InfoWindow :options="props.options">
        <div class="info-window d-flex flex-column px-4 pb-4" :style="{ width: '600px' }">
            <b class="text-center text-primary pb-4" v-text="props.parkingGarage.name" />

            <span><b>Maximale Auslastung:</b> {{ props.parkingGarage.maximalOccupancy }}</span>

            <span
                ><b>Koordinaten:</b> B {{ formatNumber(props.parkingGarage.location.latitude, 4) }},
                L {{ formatNumber(props.parkingGarage.location.longitude, 4) }}</span
            >

            <span>
                <b>Vorhersage:</b>
                {{
                    formatNumber(props.parkingGarage.predictions.get(filter.index)?.prediction, 2)
                }}%
            </span>

            <span>
                <b>Datum:</b>
                {{ formatDate(new Date(props.filter.index)) }}</span
            >
            <span>
                <b>Uhrzeit:</b>
                {{ formatHour(new Date(props.filter.index)) }}</span
            >

            <BarChart :data="props.parkingGarage.rmse" title="testing" />
        </div>
    </InfoWindow>
</template>

<script setup lang="ts">
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';
import { InfoWindow } from 'vue3-google-map';
import type { Filter } from '@/parkingGarage/types/filter';
import { useTheme } from 'vuetify';
import { formatNumber } from '@/core/formatNumber';
import { formatDate } from '@/core/dateRange';
import { formatHour } from '@/core/dateRange';
import BarChart from './BarChart.vue';

const props = defineProps<{
    options: google.maps.InfoWindowOptions;
    parkingGarage: ParkingGarage;
    filter: Filter;
}>();

const theme = useTheme();
</script>

<style>
.info-window > *:not(:first-child) {
    padding-bottom: 4px;
}
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

/* Remove any padding or margins on the outer container and use the primary color as a background color */
.gm-style-iw {
    background-color: rgb(
        var(--v-theme-background)
    ) !important; /* Remove Google's default styling */
    padding: 0 !important; /* Ensure no extra padding */
    margin: 0 !important; /* Ensure no extra margin */
}

/* Change triangle (arrow) background */
.gm-style-iw-tc::after {
    background-color: rgb(var(--v-theme-background)) !important; /* Matches your InfoWindow color */
}

/* Additional catch-all for possible internal containers (White bards at the right and the bottom sides) */
.gm-style-iw-d {
    overflow: hidden !important; /* Prevent scrollbars */
}
</style>
