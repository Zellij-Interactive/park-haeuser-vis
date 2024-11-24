<template>
    <div id="map"></div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import { onMounted, ref, watch } from 'vue';
import { mainzCoordinates } from '@/core/constants';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';
import { getColorSaturation } from '@/legend/utils/ordinalScale';
import { sizeScale } from '@/legend/utils/sizeScale';

const props = defineProps<{
    parkingGarages: ParkingGarage[];
    darkModeOn: boolean;
}>();

const map = ref<L.Map>();
const circlePane = ref<HTMLElement>();

let lightLayer: L.Layer, darkLayer: L.Layer;

watch(
    () => props.darkModeOn,
    (isDarkModeOn) => {
        if (map.value == null) return;

        if (isDarkModeOn) {
            map.value.removeLayer(lightLayer);
            map.value.addLayer(darkLayer);

            return;
        }

        map.value.removeLayer(darkLayer);
        map.value.addLayer(lightLayer);
    }
);

onMounted(() => {
    map.value = L.map('map').setView([mainzCoordinates.latitude, mainzCoordinates.longitude], 13);

    lightLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 14.5,
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    });

    // Add the default layer (light mode)
    darkLayer.addTo(map.value);
});
</script>

<style>
#map {
    width: 100%;
    min-height: 96vh;
    z-index: 0;
}
</style>
