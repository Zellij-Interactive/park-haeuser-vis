<template>
    <FilterCard
        :parking-garages-names="props.parkingGaragesNames"
        :filter="parkingGarageStore.filter"
        @update-filter="(filter) => (parkingGarageStore.filter = { ...filter })"
    />
</template>

<script setup lang="ts">
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import FilterCard from '../components/FilterCard.vue';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';

const parkingGarageStore = useParkingGarageStore();

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
}>();
</script>

<style></style>
