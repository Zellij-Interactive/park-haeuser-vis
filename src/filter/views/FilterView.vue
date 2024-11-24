<template>
    <div class="foo">
        <v-expansion-panels elevation="0" class="pa-4">
            <v-expansion-panel eager>
                <v-expansion-panel-title>Filter</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <FilterCard
                        :parking-garages-names="props.parkingGaragesNames"
                        :filter="props.filter"
                        @update-filter="(filter) => applyFilter(filter)"
                    />
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script setup lang="ts">
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import FilterCard from '../components/FilterCard.vue';
import type { Filter } from '@/parkingGarage/types/filter';
import { EmitFlags } from 'typescript';

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
    filter: Filter;
}>();

function applyFilter(filter: Filter) {
    console.log('applying the following filter:');
    console.log(filter);

    // logic to apply the filter
}
</script>

<style></style>
