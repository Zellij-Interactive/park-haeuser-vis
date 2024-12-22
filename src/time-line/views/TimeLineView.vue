<template>
    <v-card
        class="d-flex flex-column justify-center align-center border-thin"
        elevation="0"
        rounded="lg"
    >
        <v-btn-toggle
            v-model="dataDisplayed"
            density="compact"
            min-width="100px"
            divided
            mandatory
            style="width: 400px"
        >
            <v-btn value="prediction" text="Vorhersage" style="flex: 1" />
            <v-btn value="shap" text="SHAP-Werte" style="flex: 1" />
        </v-btn-toggle>

        <TimeLineComponent
            :parking-garages="parkingGarageStore.parkingGaragesMap"
            :filter="parkingGarageStore.filter"
            :dark-mode-on="props.darkModeOn"
            :data-to-display="dataDisplayed"
            :is-filter-on="isFilterOn"
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
import { ref } from 'vue';
import TimeLineComponent from '../components/TimeLineComponent.vue';

const props = defineProps<{
    darkModeOn: boolean;
    isFilterOn: boolean;
}>();

const dataDisplayed = ref<'prediction' | 'shap'>('prediction');

const parkingGarageStore = useParkingGarageStore();
</script>

<style scoped></style>
