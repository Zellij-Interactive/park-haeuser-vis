<template>
    <div class="foo d-flex justify-end gap-4">
        <v-btn @click="() => emit('toggleTheme')" color="primary"
            ><v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
        <FilterCard
            v-model:filter="parkingGarageStore.filter"
            :parking-garages-names="props.parkingGaragesNames"
        />
    </div>
</template>

<script setup lang="ts">
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import FilterCard from '../components/FilterCard.vue';
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';

const parkingGarageStore = useParkingGarageStore();

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
}>();

const emit = defineEmits<{
    (event: 'toggleTheme'): void;
}>();
</script>

<style>
.foo {
    border: 2px solid black;
}
</style>
