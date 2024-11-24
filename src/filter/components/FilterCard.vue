<template>
    <v-card class="pa-4">
        <v-autocomplete
            v-model="selectedParkingGarages"
            label="Parkhäuser"
            :items="props.parkingGaragesNames"
            variant="outlined"
            multiple
            chips
            clearable
        ></v-autocomplete>
        <v-card-actions class="justify-center px-6 py-3">
            <v-btn
                class="flex-grow-1 text-none"
                color="blue-darken-4"
                rounded="0"
                variant="plain"
                @click="onButtonClick()"
            >
                Zurücksetzen
            </v-btn>

            <v-btn
                class="text-white flex-grow-1 text-none"
                color="blue-darken-1"
                rounded="0"
                variant="flat"
                @click="onButtonClick()"
            >
                Anwenden
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type { Filter } from '@/parkingGarage/types/filter';
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import { ref } from 'vue';

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
    filter: Filter;
}>();

const initialFilter = 
const selectedParkingGarages = ref<ParkingGarageName[]>([]);

function onButtonClick() {
    console.log(selectedParkingGarages.value);
}
</script>

<style></style>
