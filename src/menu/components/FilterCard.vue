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
        <template v-slot:activator="{ props: menuProps }">
            <v-tooltip v-bind="menuProps" text="Filteroptionen" location="bottom">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn
                        v-bind="{ ...menuProps, ...tooltipProps }"
                        class="border-thin"
                        elevation="0"
                        :ripple="false"
                        @click="
                            () => {
                                isFilterVisible ?? resetFilter();
                                emit('filter-clicked');
                            }
                        "
                        ><v-icon>mdi-filter-outline</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </template>

        <v-card class="pa-3 card border-thin" rounded="lg" elevation="0">
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
                            (+{{ unsavedFilter.parkingGarages.length - 2 }} weitere)
                        </span>
                    </template>

                    <template v-slot:prepend-item>
                        <v-list-item>
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
                            <v-divider />
                        </v-list-item>
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
                            :allowed-dates="
                                (date: any) =>
                                    date.getTime() <= unsavedFilter.dateRange.endDate.getTime()
                            "
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
                            :allowed-dates="
                                (date: any) =>
                                    date.getTime() >= unsavedFilter.dateRange.startDate.getTime()
                            "
                        ></v-date-picker>
                    </v-menu>
                </div>

                <v-slider
                    v-model="unsavedFilter.threshold"
                    :max="20"
                    :min="1"
                    :step="1"
                    style="width: 96%"
                    thumb-label
                    track-color="secondary"
                    track-fill-color="primary"
                    thumb-color="primary"
                    :thumb-size="12"
                    density="compact"
                    hide-details
                    label="Vorhersagequalität threshold"
                />

                <v-checkbox
                    v-model="unsavedFilter.showSHAPValues"
                    label="SHAP-Werte anzeigen"
                    color="primary"
                    density="compact"
                    hide-details
                />

                <div class="d-flex justify-space-between align-center">
                    <v-checkbox
                        v-model="colorBlindModeOn"
                        label="Colorblind mode"
                        color="primary"
                        density="compact"
                        hide-details
                    />

                    <v-select
                        v-if="colorBlindModeOn"
                        v-model="unsavedFilter.colorBlindMode"
                        :items="Object.values(ColorBlindMode)"
                        density="compact"
                        variant="solo"
                        bg-color="secondary"
                        color="primary"
                        max-width="250"
                        flat
                        hide-details
                    />
                </div>

                <v-card-actions class="pt-6">
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
import { ColorBlindMode } from '@/core/colors';
import { addHours } from 'date-fns';

const props = defineProps<{
    parkingGaragesNames: ParkingGarageName[];
    filter: Filter;
}>();

const emit = defineEmits<{
    (event: 'update:filter', filter: Filter): void;
    (event: 'filter-clicked'): void;
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

const colorBlindModeOn = computed({
    get: () => unsavedFilter.value.colorBlindMode != null,
    set: (value) =>
        (unsavedFilter.value.colorBlindMode = value ? ColorBlindMode.Protanopia : undefined),
});

const hasChanges = computed(() => {
    return (
        !unsavedFilter.value.dateRange.equals(initialFilter.value.dateRange) ||
        unsavedFilter.value.showSHAPValues != initialFilter.value.showSHAPValues ||
        unsavedFilter.value.parkingGarages != initialFilter.value.parkingGarages ||
        unsavedFilter.value.colorBlindMode != initialFilter.value.colorBlindMode ||
        unsavedFilter.value.threshold != initialFilter.value.threshold
    );
});

watchEffect(() => keepFilterUpdated());

function onApplyClick() {
    unsavedFilter.value.dateRange = new DateRange(
        unsavedFilter.value.dateRange.startDate,
        addHours(new Date(unsavedFilter.value.dateRange.endDate), 23)
    );
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
        selectedRange: new DateRange(filter.selectedRange.startDate, filter.selectedRange.endDate),
        showSHAPValues: filter.showSHAPValues,
        date: filter.date,
        index: filter.index,
        maxShapValue: filter.maxShapValue,
        minShapValue: filter.minShapValue,
        threshold: filter.threshold,
        colorBlindMode: filter.colorBlindMode,
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
