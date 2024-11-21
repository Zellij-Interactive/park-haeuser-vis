<template>
    <div class="test">
        <v-btn @click="onButtonClick()">Button</v-btn>
    </div>
    <div id="map"></div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import { onMounted, ref } from 'vue';
import { mainzCoordinates } from '@/core/constants';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';

const props = defineProps<{
    parkingGarages: ParkingGarage[];
}>();

const map = ref<L.Map>();

function onButtonClick() {
    if (map.value == null) {
        _throw('Something is wrong with the map.');
    }
    for (const parking of props.parkingGarages) {
        var marker = L.marker([parking.location.latitude, parking.location.longitude]).addTo(
            map.value
        );

        marker.bindPopup(parking.name).openPopup();
    }
}

onMounted(() => {
    map.value = L.map('map').setView([mainzCoordinates.latitude, mainzCoordinates.longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 12,
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.value);

    map.value.createPane('circlePane');

    const circlePane = map.value.getPane('circlePane');

    if (circlePane != null) {
        circlePane.style.zIndex = '650';
    }

    var polygon = L.polygon([
        [mainzCoordinates.latitude, mainzCoordinates.longitude],
        [mainzCoordinates.latitude - 1, mainzCoordinates.longitude - 2],
        [mainzCoordinates.latitude - 3, mainzCoordinates.longitude - 6],
    ]).addTo(map.value);

    var circle = L.circle([mainzCoordinates.latitude, mainzCoordinates.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500,
        pane: 'circlePane', // Assign circle to the custom pane
    }).addTo(map.value);

    var marker = L.marker([mainzCoordinates.latitude, mainzCoordinates.longitude], {
        pane: 'circlePane',
    }).addTo(map.value);
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
