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
        width="500"
        persistent
    >
        <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props" @click="() => isFilterVisible ?? resetFilter()"
                ><v-icon>mdi-filter-outline</v-icon>
            </v-btn>
        </template>

        <v-card class="pa-4 card" rounded="lg" elevation="1">
            <div class="d-flex flex-column card-elements">
                <v-select
                    v-model="unsavedFilter.parkingGarages"
                    :items="sortedParkingGarages"
                    label="Parkhäuser"
                    variant="solo"
                    bg-color="secondary"
                    color="primary"
                    flat
                    multiple
                    hide-details
                >
                    <template #selection="{ item, index }">
                        <v-chip
                            v-if="index < 2"
                            class="selection-chip"
                            data-test="selection-employee-chip"
                        >
                            <span v-text="item.title" />
                        </v-chip>
                        <span
                            v-if="index == 2"
                            class="text-caption align-self-center"
                            data-test="selection-employee-more"
                        >
                            (+{{ unsavedFilter.parkingGarages.length - 1 }} weitere)
                        </span>
                    </template>

                    <template v-slot:prepend-item>
                        <v-checkbox
                            v-model="areAllSelected"
                            label="Alle auswählen"
                            color="primary"
                            :indeterminate="
                                computed(
                                    () =>
                                        unsavedFilter.parkingGarages.length > 0 &&
                                        unsavedFilter.parkingGarages.length < 10
                                ).value
                            "
                            hide-details
                        />
                    </template>
                </v-select>

                <div class="d-flex justify-space-between">
                    <v-menu
                        v-model="isStartDatePickerVisible"
                        :close-on-content-click="false"
                        location="bottom"
                    >
                        <template v-slot:activator="{ props }">
                            <v-text-field
                                v-model="startDate"
                                v-bind="props"
                                label="Startdatum"
                                variant="solo"
                                color="primary"
                                bg-color="secondary"
                                prepend-inner-icon="mdi-calendar"
                                rounded="lg"
                                density="compact"
                                max-width="220"
                                hide-details
                                flat
                                readonly
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
                            <v-text-field
                                v-model="endDate"
                                v-bind="props"
                                label="Enddatum"
                                variant="solo"
                                color="primary"
                                bg-color="secondary"
                                prepend-inner-icon="mdi-calendar"
                                rounded="lg"
                                density="compact"
                                max-width="220"
                                hide-details
                                flat
                                readonly
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

                <v-checkbox
                    v-model="unsavedFilter.showSHAPValues"
                    label="SHAP-Werte anzeigen"
                    color="primary"
                    hide-details
                />

                <v-card-actions class="justify-center">
                    <v-spacer />
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
            </div>
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

const sortedParkingGarages = [...props.parkingGaragesNames].sort((a, b) => b.localeCompare(a));

const startDate = computed(() => formatDate(unsavedFilter.value.dateRange.startDate));
const endDate = computed(() => formatDate(unsavedFilter.value.dateRange.endDate));

const areAllSelected = computed({
    get: () => unsavedFilter.value.parkingGarages.length == props.parkingGaragesNames.length,
    set: (value) => toggleSelectAll(value),
});

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

function toggleSelectAll(selectAll: boolean | null) {
    if (selectAll == null) {
        return;
    }
    if (selectAll) {
        unsavedFilter.value.parkingGarages = [...props.parkingGaragesNames];

        return;
    }

    unsavedFilter.value.parkingGarages = [];
}
</script>

<style>
.card-elements > div {
    padding: var(--gap);
}
</style>
