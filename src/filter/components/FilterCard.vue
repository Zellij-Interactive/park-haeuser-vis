<template>
    <v-menu
        v-model="isFilterVisible"
        :close-on-content-click="false"
        eager
        location="bottom"
        transition="none"
        offset="8"
    >
        <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props" @click="() => (isFilterVisible = true)"
                ><v-icon>mdi-filter-outline</v-icon>
            </v-btn>
        </template>

        <v-card class="pa-4">
            <div>
                <v-autocomplete
                    v-model="actualFilter.parkingGarages"
                    label="Parkhäuser"
                    :items="props.parkingGaragesNames"
                    variant="solo"
                    bg-color="secondary"
                    flat
                    multiple
                    chips
                    clearable
                ></v-autocomplete>
            </div>

            <div class="d-flex justify-space-between">
                <v-menu :close-on-content-click="false" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            prepend-icon="mdi-calendar"
                            variant="flat"
                            color="secondary"
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
                            color="secondary"
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

            <div>
                <v-checkbox
                    v-model="actualFilter.showSHAPValues"
                    label="SHAP-Werte anzeigen"
                    color="primary"
                ></v-checkbox>
            </div>

            <v-card-actions class="justify-center px-6 py-3">
                <v-btn
                    class="flex-grow-1 text-none"
                    color="primary"
                    rounded="lg"
                    variant="text"
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
    </v-menu>
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
const isFilterVisible = ref(false);

const hasChanges = computed(() => {
    return (
        !actualFilter.value.dateRange.equals(initialFilter.value.dateRange) ||
        actualFilter.value.showSHAPValues != initialFilter.value.showSHAPValues ||
        actualFilter.value.parkingGarages != initialFilter.value.parkingGarages
    );
});

function onApplyClick() {
    emit('update-filter', actualFilter.value);

    initialFilter.value = copy(actualFilter.value);
    isFilterVisible.value = false;
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

<style>
.foo {
    border: 2px solid black;
}
</style>
