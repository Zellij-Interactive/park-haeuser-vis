<template>
    <div class="slider d-flex flex-column justify-center align-center">
        <v-range-slider
            v-model="selectedRangeInMilliseconds"
            strict
            :max="maxDateInMilliseconds"
            :min="minDateInMilliseconds"
            :step="hourInMilliseconds"
            style="width: 100%"
            :thumb-size="12"
            track-color="secondary"
            track-fill-color="primary"
            thumb-color="primary"
            density="compact"
            hide-details
        >
            <template v-slot:thumb-label="{ modelValue }">
                <div class="thumb-label-date d-flex justify-center text-secondary">
                    <span v-text="formatDate(new Date(modelValue))" />
                    <span v-text="`, ${formatHour(new Date(modelValue))}`" />
                </div>
            </template>

            <template v-slot:prepend>
                <v-btn
                    class="range-dates"
                    density="compact"
                    variant="flat"
                    v-text="
                        `${formatDate(new Date(selectedRangeInMilliseconds[0]))}, ${formatHour(new Date(selectedRangeInMilliseconds[0]))}`
                    "
                    hide-details
                />
            </template>

            <template v-slot:append>
                <v-btn
                    class="range-dates"
                    density="compact"
                    variant="flat"
                    v-text="
                        `${formatDate(new Date(selectedRangeInMilliseconds[1]))}, ${formatHour(new Date(selectedRangeInMilliseconds[1]))}`
                    "
                    hide-details
                />
            </template>
        </v-range-slider>

        <v-slider
            v-model="currentValue"
            :max="selectedRangeInMilliseconds[1]"
            :min="selectedRangeInMilliseconds[0]"
            :step="hourInMilliseconds"
            style="width: 100%"
            :thumb-size="0"
            class="pt-3 time-player"
            thumb-label="always"
            track-color="secondary"
            track-fill-color="primary"
            density="compact"
            hide-details
        >
            <template v-slot:thumb-label="{ modelValue }">
                <div class="thumb-label-date d-flex justify-center text-secondary">
                    <span v-text="formatDate(new Date(modelValue))" />
                    <span v-text="`, ${formatHour(new Date(modelValue))}`" />
                </div>
            </template>
        </v-slider>

        <div class="d-flex justify-space-between pb-2" :style="{ width: '68px' }">
            <v-tooltip v-if="!isPlaying" text="Abspielen" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" variant="flat" :ripple="false" @click="startTimer()">
                        <v-icon>mdi-play</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

            <v-tooltip v-else text="Pause" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" variant="flat" :ripple="false" @click="pauseTimer()">
                        <v-icon>mdi-pause</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

            <v-tooltip text="Wiedergabegeschwindigkeit" location="top">
                <template v-slot:activator="{ props: tooltipProps }">
                    <v-menu location="center">
                        <template v-slot:activator="{ props: menuProps }">
                            <v-btn
                                v-bind="{ ...menuProps, ...tooltipProps }"
                                class="text-none"
                                variant="text"
                                :ripple="false"
                            >
                                {{ `x${speed}` }}
                            </v-btn>
                        </template>
                        <v-btn-toggle
                            v-model="speed"
                            class="text-none"
                            :ripple="false"
                            variant="flat"
                            mandatory
                        >
                            <v-btn value="0.25" text="0.25" />
                            <v-btn value="0.50" text="0.50" />
                            <v-btn value="0.75" text="0.75" />
                            <v-btn value="1" text="1" />
                            <v-btn value="2" text="2" />
                            <v-btn value="4" text="4" />
                            <v-btn value="8" text="8" />
                        </v-btn-toggle>
                    </v-menu>
                </template>
            </v-tooltip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatDate, formatHour, hourInMilliseconds } from '@/core/dateRange';
import type { Filter } from '@/parkingGarage/types/filter';
import { _throw } from '@/core/_throw';

const props = defineProps<{
    filter: Filter;
    isFilterOn: boolean;
}>();

const emit = defineEmits<{
    (event: 'indexUpdated', index: number): void;
    (event: 'selectedDateRangeUpdated', startIndex: number, endIndex: number): void;
}>();

const startDate = computed(() => props.filter.dateRange.startDate);
const endDate = computed(() => props.filter.dateRange.endDate);

const minDateInMilliseconds = computed(() => startDate.value.getTime());
const maxDateInMilliseconds = computed(() => endDate.value.getTime());

const selectedRangeInMilliseconds = ref([minDateInMilliseconds.value, maxDateInMilliseconds.value]);

const currentValue = ref(minDateInMilliseconds.value);

const isPlaying = ref(false);

const speed = ref('1');

watch(
    () => props.isFilterOn,
    (value) => {
        if (value) {
            pauseTimer();
        }
    }
);

watch(
    () => currentValue.value,
    (value) => {
        emit('indexUpdated', value);
    }
);

watch(
    () => props.filter.dateRange,
    (value) => {
        selectedRangeInMilliseconds.value = [value.startDate.getTime(), value.endDate.getTime()];
    }
);

watch(
    () => selectedRangeInMilliseconds.value,
    ([startIndex, endIndex]) => {
        emit('selectedDateRangeUpdated', startIndex, endIndex);

        if (currentValue.value < startIndex || currentValue.value > endIndex) {
            currentValue.value = startIndex;
        }
    }
);

async function startTimer() {
    isPlaying.value = true;

    while (currentValue.value <= maxDateInMilliseconds.value && isPlaying.value) {
        await sleep(100 / parseFloat(speed.value));

        currentValue.value += hourInMilliseconds;
    }
}

function pauseTimer() {
    isPlaying.value = false;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>

<style>
.time-player .v-slider-thumb {
    padding-top: 20px;
}
.thumb-label-date {
    margin-bottom: 2px;
    width: 120px;
}
.range-dates {
    height: 22px !important;
    width: 180px;
}
</style>
