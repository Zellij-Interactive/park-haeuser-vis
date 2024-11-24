<template>
    <div class="foo">
        <v-expansion-panels elevation="0" class="pa-4">
            <v-expansion-panel eager>
                <v-expansion-panel-title>Filter</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <FilterCard
                        :parking-garages-names="props.parkingGaragesNames"
                        :filter="props.filter"
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

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
    filter: Filter;
}>();
</script>

<style></style>
