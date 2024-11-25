<template>
    <v-card rounded="lg" class="fill-height fill-width d-flex justify-center align-center">
        <div>
            <h1>DateTimeFilter</h1>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';

const parkingGarageStore = useParkingGarageStore();
</script>

<style></style>
