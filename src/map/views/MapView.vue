<template>
    <div id="map"></div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import { onMounted } from 'vue';
import { useGeolocation } from '@vueuse/core';
import { mainzCoordinates, parkingGaragesInfos } from '@/stores/mapStore';

let map: L.Map;

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

    const circle = L.circle([mainzCoordinates.value.latitude, mainzCoordinates.value.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500,
    }).addTo(map);

    //circle.setRadius(600);
});
</script>

<style>
#map {
    width: 100%;
    min-height: 96vh;
}
</style>
