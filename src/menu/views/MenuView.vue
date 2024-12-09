<template>
    <div class="foo d-flex justify-end">
        <div class="mr-2">
            <v-tooltip
                :text="`Darstellung: ${props.darkModeOn ? 'Dunkles Design' : 'Helles Design'}`"
                location="bottom"
            >
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" @click="() => emit('toggleTheme')" color="white" height="40">
                        <v-icon>mdi-theme-light-dark</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </div>
        <div class="mr-12">
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
