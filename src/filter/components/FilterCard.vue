<template>
    <v-card class="pa-4">
        <v-autocomplete
            v-model="actualFilter.parkingGarages"
            label="Parkhäuser"
            :items="props.parkingGaragesNames"
            variant="solo-filled"
            bg-color="grey-lighten-5"
            flat
            multiple
            chips
            clearable
        ></v-autocomplete>

        <div class="d-flex justify-space-between">
            <v-menu :close-on-content-click="false" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn
                        prepend-icon="mdi-calendar"
                        variant="flat"
                        color="grey-lighten-3"
                        rounded="lg"
                        v-bind="props"
                        :text="`Startdatum: ${formatDate(actualFilter.dateRange.startDate)}`"
                    />
                </template>

                <v-date-picker
                    v-model="actualFilter.dateRange.startDate"
                    hide-header
                    rounded="lg"
                    elevation="0"
                    color="primary"
                ></v-date-picker>
            </v-menu>

            <v-menu :close-on-content-click="false" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn
                        prepend-icon="mdi-calendar"
                        variant="flat"
                        color="grey-lighten-3"
                        rounded="lg"
                        v-bind="props"
                        :text="`Enddatum: ${formatDate(actualFilter.dateRange.endDate)}`"
                    />
                </template>

                <v-date-picker
                    v-model="actualFilter.dateRange.endDate"
                    hide-header
                    rounded="lg"
                    elevation="0"
                    color="primary"
                ></v-date-picker>
            </v-menu>
        </div>

        <v-checkbox v-model="actualFilter.showSHAPValues" label="SHAP-Werte anzeigen"></v-checkbox>

        <v-card-actions class="justify-center px-6 py-3">
            <v-btn
                class="flex-grow-1 text-none"
                color="primary"
                rounded="lg"
                variant="plain"
                :disabled="!hasChanges"
                @click="onResetClick()"
            >
                Zurücksetzen
            </v-btn>

            <v-btn
                class="text-white flex-grow-1 text-none"
                color="primary"
                rounded="lg"
                variant="flat"
                :disabled="!hasChanges"
                @click="onApplyClick()"
            >
                Anwenden
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { DateRange, formatDate } from '@/core/dateRange';
import type { Filter } from '@/parkingGarage/types/filter';
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import { computed, ref } from 'vue';

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
    filter: Filter;
}>();

const emit = defineEmits<{
    (event: 'update-filter', filter: Filter): void;
}>();

const initialFilter = ref<Filter>(props.filter);

const actualFilter = ref<Filter>(copy(initialFilter.value));

const hasChanges = computed(() => {
    return (
        !actualFilter.value.dateRange.equals(initialFilter.value.dateRange) ||
        actualFilter.value.showSHAPValues != initialFilter.value.showSHAPValues ||
        actualFilter.value.parkingGarages != initialFilter.value.parkingGarages
    );
});

function onApplyClick() {
    console.log(hasChanges.value);
    emit('update-filter', actualFilter.value);

    initialFilter.value = copy(actualFilter.value);
}

function onResetClick() {
    console.log(hasChanges.value);

    actualFilter.value = copy(initialFilter.value);
}

function copy(filter: Filter): Filter {
    return {
        parkingGarages: filter.parkingGarages,
        dateRange: new DateRange(filter.dateRange.startDate, filter.dateRange.endDate),
        showSHAPValues: filter.showSHAPValues,
    };
}
</script>

<style></style>
