<template>
    <div class="d-flex justify-end">
        <div class="mr-2">
            <v-tooltip
                :text="`Switch to ${props.darkModeOn ? 'light mode' : 'dark mode'}`"
                location="bottom"
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                        elevation="1"
                        rounded="lg"
                        :ripple="false"
                        @click="() => emit('toggleTheme')"
                    >
                        <v-icon>mdi-theme-light-dark</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </div>
        <div>
            <FilterCard
                v-model:filter="parkingGarageStore.filter"
                :parking-garages-names="props.parkingGaragesNames"
                @filter-clicked="() => emit('filter-clicked')"
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
    (event: 'filter-clicked'): void;
}>();
</script>

<style></style>
