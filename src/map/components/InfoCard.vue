<template>
    <InfoWindow :options="props.options">
        <div
            class="info-window d-flex flex-column px-4 pb-4"
            :style="{ width: `${props.filter.showSHAPValues ? '340px' : '230px'}` }"
        >
            <b class="text-center text-primary pb-4" v-text="props.parkingGarage.name" />

            <span><b>Maximale Auslastung:</b> {{ props.parkingGarage.maximalOccupancy }}</span>

            <span
                ><b>Koordinaten:</b> B {{ formatNumber(props.parkingGarage.location.latitude, 4) }},
                L {{ formatNumber(props.parkingGarage.location.longitude, 4) }}</span
            >

            <span>
                <b>Vorhersage:</b>
                {{
                    formatNumber(props.parkingGarage.predictions.get(filter.index)?.prediction, 2)
                }}%
            </span>

            <span>
                <b>Datum:</b>
                {{ formatDate(new Date(props.filter.index)) }}
            </span>

            <span>
                <b>Uhrzeit:</b>
                {{ formatHour(new Date(props.filter.index)) }}
            </span>

            <span v-if="props.filter.showSHAPValues">
                <b>SHAP-Werte:</b>
                <span
                    v-text="
                        ` S. = ${props.parkingGarage.predictions.get(props.filter.index)?.shapSum}`
                    "
                ></span>
            </span>

            <BarChart
                v-if="props.filter.showSHAPValues"
                :data="shapValues"
                :filter="props.filter"
                :dark-mode-on="props.darkModeOn"
            />
        </div>
    </InfoWindow>
</template>

<script setup lang="ts">
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { _throw } from '@/core/_throw';
import { InfoWindow } from 'vue3-google-map';
import type { Filter } from '@/parkingGarage/types/filter';
import { formatNumber } from '@/core/formatNumber';
import { formatDate } from '@/core/dateRange';
import { formatHour } from '@/core/dateRange';
import BarChart from './BarChart.vue';
import { computed } from 'vue';
import { ShapName, type SHAPValue } from '@/parkingGarage/types/shapNames';

const props = defineProps<{
    options: google.maps.InfoWindowOptions;
    parkingGarage: ParkingGarage;
    filter: Filter;
    darkModeOn: boolean;
}>();

const shapValues = computed<SHAPValue[]>(() => {
    const prediction = props.parkingGarage.predictions.get(props.filter.index);

    if (prediction == null) {
        _throw('Prediction not found');
    }

    return [
        { name: ShapName.shapEducation, value: prediction.shapEducation },
        {
            name: ShapName.shapServicesSpecialtyRetail,
            value: prediction.shapServicesSpecialtyRetail,
        },
        { name: ShapName.shapFinanceInsurance, value: prediction.shapFinanceInsurance },
        { name: ShapName.shapLeisureTime, value: prediction.shapLeisureTime },
        { name: ShapName.shapFoodServices, value: prediction.shapFoodServices },
        { name: ShapName.shapHealth, value: prediction.shapHealth },
        { name: ShapName.shapGrocery, value: prediction.shapGrocery },
        { name: ShapName.shapReligion, value: prediction.shapReligion },
        { name: ShapName.shapShopping, value: prediction.shapShopping },
        { name: ShapName.shapPublicSector, value: prediction.shapPublicSector },
        { name: ShapName.shapTime, value: prediction.shapTime },
        { name: ShapName.shapMonth, value: prediction.shapMonth },
        { name: ShapName.shapOthers, value: prediction.shapOthers },
    ];
});
</script>

<style>
.info-window > *:not(:first-child):not(:last-child) {
    padding-bottom: 4px;
}

/* Hide the default google close button */
.gm-ui-hover-effect {
    display: none !important;
}

/* Remove any padding or margins on the outer container and use the primary color as a background color */
.gm-style-iw {
    background-color: rgb(
        var(--v-theme-background)
    ) !important; /* Remove Google's default styling */
    padding: 0 !important; /* Ensure no extra padding */
    margin: 0 !important; /* Ensure no extra margin */
}

/* Change triangle (arrow) background */
.gm-style-iw-tc::after {
    background-color: rgb(var(--v-theme-background)) !important; /* Matches your InfoWindow color */
}

/* Additional catch-all for possible internal containers (White bards at the right and the bottom sides) */
.gm-style-iw-d {
    overflow: hidden !important; /* Prevent scrollbars */
}
</style>
