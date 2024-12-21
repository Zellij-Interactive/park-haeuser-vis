<template>
    <v-card
        class="d-flex flex-column justify-center align-center border-thin"
        elevation="0"
        rounded="lg"
    >
        <div class="d-flex flex-column justify-center align-center">
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

            <LineChart
                :parking-garages="parkingGarageStore.parkingGaragesMap"
                :filter="parkingGarageStore.filter"
                :dark-mode-on="props.darkModeOn"
                :data-to-display="dataDisplayed"
            />

            <div style="width: 100%">
                <TimeLineSlider
                    :filter="parkingGarageStore.filter"
                    :is-filter-on="isFilterOn"
                    @index-updated="
                        (index) => {
                            parkingGarageStore.filter.index = index;
                            parkingGarageStore.filter.date = new Date(index);
                        }
                    "
                />
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { useParkingGarageStore } from '@/parkingGarage/parkingGarageStore';
import TimeLineSlider from '../components/TimeLineSlider.vue';
import LineChart from '../components/LineChart.vue';
import { ref } from 'vue';

const props = defineProps<{
    darkModeOn: boolean;
    isFilterOn: boolean;
}>();

const dataDisplayed = ref<'prediction' | 'shap'>('prediction');

const parkingGarageStore = useParkingGarageStore();
</script>

<style scoped>
.chart-buttons {
    width: 20%;
}
</style>
