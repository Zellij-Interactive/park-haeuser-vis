<template>
    <div class="test">
        <v-btn @click="onButtonClick()">Show Large Circles</v-btn>
    </div>
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

// Props for parking garages
const props = defineProps<{
    parkingGarages: ParkingGarage[];
}>();

// Emit markerClicked event
const emit = defineEmits(['markerClicked']);

// Leaflet map and circle pane references
const map = ref<L.Map | null>(null);
const circlePane = ref<HTMLElement | null>(null);

// Add large circles to the map (existing functionality)
function onButtonClick() {
    if (!map.value) {
        _throw('Map is not initialized.');
    }

    console.log('Adding large circles for garages:', props.parkingGarages);

    props.parkingGarages.forEach((parking) => {
        L.circle([parking.location.latitude, parking.location.longitude], {
            color: '#000000',
            fillColor: getColorSaturation(parking.predictions[0]?.prediction || 0),
            fillOpacity: 0.8,
            radius: sizeScale(parking.maximalOccupancy),
            pane: 'circlePane',
        }).addTo(map.value!);
    });
}

// Add smaller interactive circles to the map
function addMarkers() {
    if (!map.value) {
        _throw('Map is not initialized.');
    }

    props.parkingGarages.forEach((parking) => {
        const circle = L.circle([parking.location.latitude, parking.location.longitude], {
            color: 'blue',
            fillColor: 'lightblue',
            fillOpacity: 0.6,
            radius: 150,
        }).addTo(map.value!);

        // Attach click event to circle
        circle.on('click', () => {
            console.log(`Marker clicked: ${parking.name}`);
            emit('markerClicked', parking);
        });
    });
}

// Initialize the map and add interactive circles on mount
onMounted(() => {
    map.value = L.map('map').setView([mainzCoordinates.latitude, mainzCoordinates.longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 14.5,
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.value!);

    // Create custom pane for larger circles
    map.value.createPane('circlePane');
    circlePane.value = map.value.getPane('circlePane') || null;

    // Add smaller interactive circles
    addMarkers();
});
</script>

<style>
.test {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
#map {
    width: 100%;
    min-height: 96vh;
    z-index: 0;
}
</style>
