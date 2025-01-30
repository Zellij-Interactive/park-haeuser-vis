<template>
    <v-card class="d-flex flex-column justify-center align-center" elevation="1" rounded="lg">
        <TimeLineComponent
            :parking-garages="parkingGarageStore.parkingGaragesMap"
            :filter="parkingGarageStore.filter"
            :dark-mode-on="props.darkModeOn"
            :is-filter-on="isFilterOn"
            @index-updated="
                (index) => {
                    parkingGarageStore.filter.index = index;
                    parkingGarageStore.filter.date = new Date(index);
                }
            "
            @selected-date-range-updated="
                (startIndex, endIndex) => {
                    parkingGarageStore.filter.selectedRange = new DateRange(
                        new Date(startIndex),
                        new Date(endIndex)
                    );
                }
            "
        />
    </v-card>
</template>

<script setup lang="ts">
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import TimeLineComponent from '../components/TimeLineComponent.vue';
import { DateRange } from '@/core/dateRange';

const props = defineProps<{
    darkModeOn: boolean;
    isFilterOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();
</script>

<style scoped></style>
