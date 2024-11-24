<template>
    <div id="map"></div>
</template>

<script setup lang="ts">
import L, { circle } from 'leaflet';
import { onMounted, ref, watch } from 'vue';
import { mainzCoordinates } from '@/core/constants';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';
import type { Filter } from '@/parkingGarage/types/filter';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import { sizeScale } from '@/legend/utils/sizeScale';
import { getColorSaturation } from '@/legend/utils/ordinalScale';
import type { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';

const props = defineProps<{
    parkingGarages: ParkingGarage[];
    darkModeOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();

const map = ref<L.Map>();
const circlePane = ref<HTMLElement>();

const circleLayers = new Map<ParkingGarageName, L.Circle>();

const lightLayer = ref<L.Layer>();
const darkLayer = ref<L.Layer>();

watch(
    () => parkingGarageStore.filter,
    (filter) => {
        removeCirclesFromMap();

        filter.parkingGarages.forEach(async (name) => {
            const parkingGarage = await parkingGarageStore.getParkingGarage(name);

            addCircleToMap(parkingGarage);
        });
    }
);

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

function addCircleToMap(parkingGarage: ParkingGarage) {
    if (map.value == null) {
        _throw('Unexpected error occurred with the map.');
    }

    const circle = L.circle([parkingGarage.location.latitude, parkingGarage.location.longitude], {
        color: '#000000',
        fillColor: getColorSaturation(parkingGarage.predictions[0].prediction),
        fillOpacity: 1,
        radius: sizeScale(parkingGarage.maximalOccupancy),
        pane: 'circlePane',
    });

    circle.addTo(map.value);

    circleLayers.set(parkingGarage.name, circle);
}

function removeCirclesFromMap() {
    circleLayers.forEach((circle, name) => {
        if (circle) {
            map.value?.removeLayer(circle);
            circleLayers.delete(name);
        }
    });
}

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
