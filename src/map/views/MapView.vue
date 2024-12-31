<template>
    <GoogleMap
        api-key="AIzaSyDuGL4qVEPir1UCBucl3-hlMJS7QX3U5Dg"
        style="width: 100%; height: 100%"
        :center="center"
        :zoom="14"
        :styles="mapStyles"
    >
        <Marker v-for="[key, value] in predictionQualityMarkers" :key="key" :options="value" />

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
            :dark-mode-on="props.darkModeOn"
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
import { GoogleMap, Marker } from 'vue3-google-map';
import { googleMapLightModeStyling, googleMapsDarkModeStyling } from '../utils';
import type { CustomMarker } from '../customMarker';
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import InfoCards from '../components/InfoCard.vue';
import { ColorBlindMode, getBorderColor } from '@/core/colors';
import type { Filter } from '@/parkingGarage/types/filter';
import { strokeGap, strokeOpacity, strokeWeight } from '@/legend/utils/constants';

// Props for parking garages
const props = defineProps<{
    darkModeOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();

const center = { lat: mainzCoordinates.latitude, lng: mainzCoordinates.longitude };

const markers = ref(new Map<ParkingGarageName, CustomMarker>());
const predictionQualityMarkers = ref(new Map<ParkingGarageName, CustomMarker>());
const infoWindows = ref(new Map<ParkingGarageName, ParkingGarage>());

const mapStyles = computed(() =>
    props.darkModeOn ? googleMapsDarkModeStyling : googleMapLightModeStyling
);

watch(
    (): [Filter, boolean] => [parkingGarageStore.filter, props.darkModeOn],
    ([filter, _]) => {
        // Hide non filter parking garages
        Object.values(ParkingGarageName)
            .filter((e) => !parkingGarageStore.filter.parkingGarages.includes(e))
            .forEach((e) => {
                markers.value.delete(e);
                predictionQualityMarkers.value.delete(e);
            });

        filter.parkingGarages.forEach(async (name) => {
            const parkingGarage = await parkingGarageStore.getParkingGarage(name);

            addMarkerToMap(parkingGarage, filter.colorBlindMode);
        });
    },
    { immediate: true, deep: true }
);

function addMarkerToMap(parkingGarage: ParkingGarage, colorBlindMode?: ColorBlindMode) {
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
            fillColor: getColorSaturation(prediction, colorBlindMode),
            fillOpacity: 0.8,
            strokeColor: getColorSaturation(100, colorBlindMode),
            strokeOpacity: strokeOpacity,
            strokeWeight: strokeWeight,
        },
    });

    predictionQualityMarkers.value.set(parkingGarage.name, {
        position: {
            lat: parkingGarage.location.latitude,
            lng: parkingGarage.location.longitude,
        },
        title: parkingGarage.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: sizeScale(parkingGarage.maximalOccupancy) + strokeGap,
            fillOpacity: 0,
            strokeColor: isPredictionGood
                ? '#000000'
                : getBorderColor(props.darkModeOn, colorBlindMode),
            strokeWeight: isPredictionGood ? 0 : 4,
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

.gm-ui-hover-effect,
.gm-fullscreen-control,
.gm-style-mtc,
.gm-svpc,
.gmnoprint,
.gm-style-cc {
    display: none !important;
}
</style>
