<template>
    <div class="foo d-flex justify-end">
        <div class="mr-1">
            <v-tooltip
                :text="`Darstellung: ${props.darkModeOn ? 'Dunkles Design' : 'Helles Design'}`"
                location="bottom"
            >
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" @click="() => emit('toggleTheme')" color="primary">
                        <v-icon>mdi-theme-light-dark</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </div>
        <div class="ml-1">
            <FilterCard
                v-model:filter="parkingGarageStore.filter"
                :parking-garages-names="props.parkingGaragesNames"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import FilterCard from '../components/FilterCard.vue';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';

const parkingGarageStore = useParkingGarageStore();

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
    darkModeOn: boolean;
}>();

const emit = defineEmits<{
    (event: 'toggleTheme'): void;
}>();
</script>

<style></style>
