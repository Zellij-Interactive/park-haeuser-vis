<template>
  <main>
    <div id="map"></div>
    <!-- <D3Line msg="Vue.js and D3 Line Chart" /> -->
  </main>
</template>

<script setup lang="ts">
import D3Line from '@/components/D3Line.vue'
import L from 'leaflet'
import leaflet from 'leaflet'
import { onMounted } from 'vue'
import { useGeolocation } from '@vueuse/core'
import { mainzLocation, nearbyMarkers } from '@/stores/mapStore'
import { watchEffect } from 'vue'

let map: leaflet.Map
let userGeoMarker: leaflet.Marker

const { coords } = useGeolocation()

onMounted(() => {
  map = L.map('map').setView([mainzLocation.value.latitude, mainzLocation.value.longitude], 13)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 12,
    maxZoom: 22,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  var circle = L.circle([49.99431352635961, 8.257889508635651], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500,
  }).addTo(map)
})
</script>

<style>
#map {
  width: 100%;
  min-height: 100vh;

  overflow: hidden;

  border-radius: var(--radius);
}
</style>
