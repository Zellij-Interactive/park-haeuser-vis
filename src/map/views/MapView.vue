<template>
    <div id="map"></div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import { onMounted, ref, watch } from 'vue';
import { mainzCoordinates } from '@/core/constants';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';
import type { Filter } from '@/parkingGarage/types/filter';

const props = defineProps<{
    parkingGarages: ParkingGarage[];
    darkModeOn: boolean;
    filter: Filter;
}>();

const map = ref<L.Map>();

const lightLayer = ref<L.Layer>();
const darkLayer = ref<L.Layer>();

watch(
    () => props.darkModeOn,
    (isDarkModeOn) => {
        if (map.value == null || lightLayer.value == null || darkLayer.value == null) return;

        if (isDarkModeOn) {
            map.value.removeLayer(lightLayer.value);
            map.value.addLayer(darkLayer.value);

            return;
        }

        map.value.removeLayer(darkLayer.value);
        map.value.addLayer(lightLayer.value);
    }
);

onMounted(() => {
    map.value = L.map('map').setView([mainzCoordinates.latitude, mainzCoordinates.longitude], 13);

    lightLayer.value = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 14.5,
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    darkLayer.value = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    });

    // Add the default layer (light mode)
    map.value.addLayer(lightLayer.value);
});
</script>

<style>
#map {
    width: 100%;
    min-height: 96vh;
    z-index: 0;
}
</style>
