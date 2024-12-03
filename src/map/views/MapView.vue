<template>
    <GoogleMap
        api-key="AIzaSyDuGL4qVEPir1UCBucl3-hlMJS7QX3U5Dg"
        style="width: 100%; height: 100%"
        :center="center"
        :zoom="15"
        :styles="mapStyles"
    >
        <Marker
            v-for="[key, value] in markers"
            :key="key"
            :options="value"
            @click="toggleDetails(key)"
        />

        <InfoCards
            v-for="[key, value] in infoWindows"
            :key="key"
            :options="{
                position: {
                    lat: value.location.latitude,
                    lng: value.location.longitude,
                },
                disableAutoPan: true,
            }"
            :parking-garage="
                parkingGarageStore.parkingGaragesMap.get(key) ??
                _throw('Parking garage not found:' + key)
            "
            :filter="parkingGarageStore.filter"
        />
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
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map';
import { googleMapLightModeStyling, googleMapsDarkModeStyling } from '../utils';
import type { CustomMarker } from '../customMarker';
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import InfoCards from '../components/InfoCard.vue';

// Props for parking garages
const props = defineProps<{
    darkModeOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();

const center = { lat: mainzCoordinates.latitude, lng: mainzCoordinates.longitude };
const markers = ref(new Map<ParkingGarageName, CustomMarker>());
const infoWindows = ref(new Map<ParkingGarageName, ParkingGarage>());

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
    const prediction = parkingGarage.predictions.get(parkingGarageStore.filter.index)?.prediction;

    if (prediction == null) {
        _throw('An error has occurred while getting the prediction value');
    }

    const isPredictionGood =
        parkingGarage.rmse[Math.floor(parkingGarageStore.filter.date.getHours() / 2)] <=
        parkingGarageStore.filter.threshold;

    markers.value.set(parkingGarage.name, {
        position: {
            lat: parkingGarage.location.latitude,
            lng: parkingGarage.location.longitude,
        },
        title: parkingGarage.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: sizeScale(parkingGarage.maximalOccupancy),
            fillColor: getColorSaturation(prediction),
            fillOpacity: 1.0,
            strokeColor: isPredictionGood ? '#000000' : '#d15e3dff',
            strokeWeight: isPredictionGood ? 1 : 4,
        },
    });
}

function toggleDetails(p: ParkingGarageName) {
    if (infoWindows.value?.has(p)) {
        infoWindows.value?.delete(p);

        return;
    }

    infoWindows.value?.set(
        p,
        parkingGarageStore.parkingGaragesMap.get(p) ?? _throw('Parking garage not found:' + p)
    );
}
</script>

<style>
#map {
    width: 100%;
    min-height: 96vh;
    z-index: 0;
}

.custom-btn {
    box-sizing: border-box;
    background: white;
    height: 40px;
    width: 40px;
    border-radius: 2px;
    border: 0px;
    margin: 10px;
    padding: 0px;
    font-size: 1.25rem;
    text-transform: none;
    appearance: none;
    cursor: pointer;
    user-select: none;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
    overflow: hidden;
}

.gm-ui-hover-effect {
    display: none !important;
}
</style>
