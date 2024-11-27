<template>
    <GoogleMap
        api-key="AIzaSyDuGL4qVEPir1UCBucl3-hlMJS7QX3U5Dg"
        style="width: 100%; height: 100%"
        :center="center"
        :zoom="15"
        :styles="mapStyles"
    >
        <Marker v-for="[key, value] in markers" :key="value.title" :options="value" />
    </GoogleMap>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { mainzCoordinates } from '@/core/constants';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import { sizeScale } from '@/legend/utils/sizeScale';
import { getColorSaturation } from '@/legend/utils/ordinalScale';
import { GoogleMap, Marker } from 'vue3-google-map';
import { googleMapLightModeStyling, googleMapsDarkModeStyling } from '../utils';
import type { CustomMarker } from '../customMarker';
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';

const props = defineProps<{
    parkingGarages: ParkingGarage[];
    darkModeOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();

const center = { lat: mainzCoordinates.latitude, lng: mainzCoordinates.longitude };
const markers = ref(new Map<ParkingGarageName, CustomMarker>());

const mapStyles = computed(() =>
    props.darkModeOn ? googleMapsDarkModeStyling : googleMapLightModeStyling
);

watch(
    () => parkingGarageStore.filter,
    (filter) => {
        // Hide non filter parking garages
        Object.values(ParkingGarageName)
            .filter((e) => !parkingGarageStore.filter.parkingGarages.includes(e))
            .forEach((e) => markers.value.delete(e));

        filter.parkingGarages.forEach(async (name) => {
            const parkingGarage = await parkingGarageStore.getParkingGarage(name);

            addMarkerToMap(parkingGarage);
        });
    },
    { immediate: true, deep: true }
);

function addMarkerToMap(parkingGarage: ParkingGarage) {
    markers.value.set(parkingGarage.name, {
        position: {
            lat: parkingGarage.location.latitude,
            lng: parkingGarage.location.longitude,
        },
        title: parkingGarage.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: sizeScale(parkingGarage.maximalOccupancy),
            fillColor: getColorSaturation(
                parkingGarage.predictions.get(parkingGarageStore.filter.index)?.prediction ??
                    _throw('An error has occurred while getting the prediction value')
            ),
            fillOpacity: 1.0,
            strokeColor: '#000000',
            strokeWeight: 1,
        },
    });
}
</script>

<style>
#map {
    width: 100%;
    min-height: 96vh;
    z-index: 0;
}
</style>
