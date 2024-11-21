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
import { getCircleRadius, getColorSaturation } from '@/core/utils';

const props = defineProps<{
    parkingGarages: ParkingGarage[];
}>();

const map = ref<L.Map>();
const circlePane = ref<HTMLElement>();

function onButtonClick() {
    if (map.value == null) {
        _throw('Something is wrong with the map.');
    }
    for (const parking of props.parkingGarages) {
        L.circle([parking.location.latitude, parking.location.longitude], {
            color: '#000000',
            fillColor: getColorSaturation(parking.predictions[0].prediction),
            fillOpacity: 1,
            radius: getCircleRadius(parking.maximalOccupancy),
            pane: 'circlePane',
        }).addTo(map.value);
        }
}

onMounted(() => {
    map.value = L.map('map').setView([mainzCoordinates.latitude, mainzCoordinates.longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 14.5,
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.value);

    map.value.createPane('circlePane');

    circlePane.value = map.value.getPane('circlePane');
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
