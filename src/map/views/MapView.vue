<template>
    <div id="map"></div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import { onMounted, ref } from 'vue';
import { mainzCoordinates } from '@/core/constants';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';
import { getColorSaturation } from '@/legend/utils/ordinalScale';
import { sizeScale } from '@/legend/utils/sizeScale';

const props = defineProps<{
    parkingGarages: ParkingGarage[];
}>();

const map = ref<L.Map>();
const circlePane = ref<HTMLElement>();

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
#map {
    width: 100%;
    min-height: 96vh;
    z-index: 0;
}
</style>
