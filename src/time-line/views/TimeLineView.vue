<template>
    <v-card
        class="d-flex flex-column justify-center align-center border-thin"
        elevation="0"
        rounded="lg"
    >
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
        />
    </v-card>
</template>

<script setup lang="ts">
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import TimeLineComponent from '../components/TimeLineComponent.vue';

const props = defineProps<{
    darkModeOn: boolean;
    isFilterOn: boolean;
}>();

const parkingGarageStore = useParkingGarageStore();
</script>

<style scoped></style>
