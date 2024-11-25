<template>
    <div class="d-flex justify-end">
        <v-menu :close-on-content-click="false" location="bottom">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props"><v-icon>mdi-filter-outline</v-icon> </v-btn>
            </template>

            <FilterCard
                :parking-garages-names="props.parkingGaragesNames"
                :filter="parkingGarageStore.filter"
                max-width="600"
                @update-filter="(filter) => (parkingGarageStore.filter = { ...filter })"
            />
        </v-menu>
    </div>
</template>

<script setup lang="ts">
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import FilterCard from '../components/FilterCard.vue';
import type { Filter } from '@/parkingGarage/types/filter';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';

const parkingGarageStore = useParkingGarageStore();

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
}>();
</script>

<style></style>
