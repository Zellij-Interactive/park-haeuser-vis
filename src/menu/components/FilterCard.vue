<template>
    <v-menu
        v-model="isFilterVisible"
        :close-on-content-click="false"
        :close-on-back="false"
        :no-click-animation="true"
        eager
        location="bottom"
        transition="none"
        offset="8"
        max-width="500"
        persistent
    >
        <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props" @click="() => isFilterVisible ?? resetFilter()"
                ><v-icon>mdi-filter-outline</v-icon>
            </v-btn>
        </template>

        <v-card class="pa-4" rounded="lg" elevation="1">
            <div>
                <v-select
                    v-model="unsavedFilter.parkingGarages"
                    label="Parkhäuser"
                    :items="props.parkingGaragesNames"
                    variant="solo"
                    bg-color="secondary"
                    flat
                    multiple
                    chips
                    clearable
                ></v-select>
            </div>

            <div class="d-flex justify-space-between">
                <v-menu
                    v-model="isStartDatePickerVisible"
                    :close-on-content-click="false"
                    location="bottom"
                >
                    <template v-slot:activator="{ props }">
                        <v-btn
                            prepend-icon="mdi-calendar"
                            variant="flat"
                            color="secondary"
                            rounded="lg"
                            v-bind="props"
                            :text="`Startdatum: ${formatDate(unsavedFilter.dateRange.startDate)}`"
                        />
                    </template>

                    <v-date-picker
                        v-model="unsavedFilter.dateRange.startDate"
                        hide-header
                        rounded="lg"
                        elevation="3"
                        color="primary"
                        :min="filterMinDate"
                        :max="filterMaxDate"
                        @update:modelValue="isStartDatePickerVisible = false"
                    ></v-date-picker>
                </v-menu>

                <v-menu
                    v-model="isEndDatePickerVisible"
                    :close-on-content-click="false"
                    location="bottom"
                >
                    <template v-slot:activator="{ props }">
                        <v-btn
                            prepend-icon="mdi-calendar"
                            variant="flat"
                            color="secondary"
                            rounded="lg"
                            v-bind="props"
                            :text="`Enddatum: ${formatDate(unsavedFilter.dateRange.endDate)}`"
                        />
                    </template>

                    <v-date-picker
                        v-model="unsavedFilter.dateRange.endDate"
                        hide-header
                        rounded="lg"
                        elevation="3"
                        color="primary"
                        :min="filterMinDate"
                        :max="filterMaxDate"
                        @update:modelValue="isEndDatePickerVisible = false"
                    ></v-date-picker>
                </v-menu>
            </div>

            <div>
                <v-checkbox
                    v-model="unsavedFilter.showSHAPValues"
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
                    @click="resetFilter()"
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
import { computed, ref, watchEffect } from 'vue';
import { filterMinDate, filterMaxDate } from '@/parkingGarage/types/filter';

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
    filter: Filter;
}>();

const emit = defineEmits<{
    (event: 'update:filter', filter: Filter): void;
}>();

const initialFilter = ref<Filter>(props.filter);

const unsavedFilter = ref<Filter>(copy(initialFilter.value));
const isFilterVisible = ref(false);
const isStartDatePickerVisible = ref(false);
const isEndDatePickerVisible = ref(false);

const hasChanges = computed(() => {
    return (
        !unsavedFilter.value.dateRange.equals(initialFilter.value.dateRange) ||
        unsavedFilter.value.showSHAPValues != initialFilter.value.showSHAPValues ||
        unsavedFilter.value.parkingGarages != initialFilter.value.parkingGarages
    );
});

watchEffect(() => keepFilterUpdated());

function onApplyClick() {
    emit('update:filter', unsavedFilter.value);

    initialFilter.value = copy(unsavedFilter.value);
    isFilterVisible.value = false;
}

function resetFilter() {
    unsavedFilter.value = copy(initialFilter.value);
}

function keepFilterUpdated() {
    unsavedFilter.value = copy(props.filter);
}

function copy(filter: Filter): Filter {
    return {
        parkingGarages: filter.parkingGarages,
        dateRange: new DateRange(filter.dateRange.startDate, filter.dateRange.endDate),
        showSHAPValues: filter.showSHAPValues,
        index: filter.index,
    };
}
</script>

<style></style>
