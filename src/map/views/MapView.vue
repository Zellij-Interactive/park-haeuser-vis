<template>
    <!-- <div id="map"></div> -->
    <D3Line msg="Vue.js and D3 Line Chart" />
</template>

<script setup lang="ts">
import D3Line from '@/map/components/D3Line.vue';
import L from 'leaflet';
import leaflet from 'leaflet';
import { onMounted } from 'vue';
import { useGeolocation } from '@vueuse/core';
import { mainzCoordinates, parkingGarages } from '@/stores/mapStore';

let map: leaflet.Map;
let userGeoMarker: leaflet.Marker;

const { coords } = useGeolocation();

// const corner1 = L.latLng(50.0078092599148, 8.137631034514413);
// const corner2 = L.latLng(49.961951139071715, 8.380938379789432);
// const bounds = L.latLngBounds(corner1, corner2);

onMounted(() => {
    map = L.map('map').setView(
        [mainzCoordinates.value.latitude, mainzCoordinates.value.longitude],
        13
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //bounds: bounds,
        minZoom: 12,
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const circle = L.circle([49.99431352635961, 8.257889508635651], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500,
    }).addTo(map);

    circle.setRadius(600);
});
</script>

<style>
#map {
    width: 100%;
    min-height: 96vh;

    z-index: 0;
}
</style>
