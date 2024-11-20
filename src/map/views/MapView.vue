<template>
    <div class="test">
        <v-btn @click="onButtonclick()">Button</v-btn>
    </div>
    <div id="map"></div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import { onMounted } from 'vue';
import { mainzCoordinates } from '@/core/constants';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';

const props = defineProps<{
    parkingGarages: ParkingGarage[];
}>();

// const corner1 = L.latLng(50.0078092599148, 8.137631034514413);
// const corner2 = L.latLng(49.961951139071715, 8.380938379789432);
// const bounds = L.latLngBounds(corner1, corner2);
let map: L.Map;

function onButtonclick() {
    console.log(props.parkingGarages);
}

onMounted(() => {
    map = L.map('map').setView([mainzCoordinates.latitude, mainzCoordinates.longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //bounds: bounds,
        minZoom: 12,
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const circle = L.circle([mainzCoordinates.latitude, mainzCoordinates.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500,
    }).addTo(map);

    //circle.setRadius(600);
});
</script>

<style>
.test {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
}
#map {
    width: 100%;
    min-height: 96vh;
    z-index: 0;
}
</style>
