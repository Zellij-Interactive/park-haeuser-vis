<template>
    <v-card
        class="fill-height fill-width d-flex flex-column justify-center align-center"
        rounded="lg"
    >
        <TimeLineSlider
            :filter="parkingGarageStore.filter"
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
import TimeLineSlider from '../components/TimeLineSlider.vue';

const parkingGarageStore = useParkingGarageStore();
</script>

<style></style>
