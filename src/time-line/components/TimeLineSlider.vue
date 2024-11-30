<template>
    <div class="slider d-flex flex-column justify-center align-center">
        <v-slider
            v-model="currentValue"
            :max="maxDateInMilliseconds"
            :min="minDateInMilliseconds"
            :step="hourInMilliseconds"
            style="width: 100%"
            thumb-label="always"
            :thumb-size="0"
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

            <template v-slot:prepend>
                <div class="d-flex justify-space-between" :style="{ width: '68px' }">
                    <v-tooltip v-if="!isPlaying" text="Abspielen" location="top">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                density="compact"
                                variant="text"
                                icon="mdi-play"
                                :ripple="false"
                                @click="startTimer()"
                            />
                        </template>
                    </v-tooltip>

                    <v-tooltip v-else text="Pause" location="top">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                density="compact"
                                variant="text"
                                icon="mdi-pause"
                                :ripple="false"
                                @click="pauseTimer()"
                            />
                        </template>
                    </v-tooltip>

                    <v-tooltip text="Wiedergabegeschwindigkeit" location="top">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                class="text-none"
                                density="compact"
                                variant="text"
                                :ripple="false"
                                @click="changeSpeed()"
                                :text="`x${speed}`"
                                icon=""
                            />
                        </template>
                    </v-tooltip>
                </div>
            </template>

            <!-- <template v-slot:prepend>
                <v-text-field
                    density="compact"
                    variant="outlined"
                    style="max-width: 120px"
                    hide-details
                    readonly
                >
                    {{ formatDate(startDate) }}
                </v-text-field>
            </template>

            <template v-slot:append>
                <v-text-field
                    density="compact"
                    variant="outlined"
                    style="max-width: 120px"
                    hide-details
                    readonly
                >
                    {{ formatDate(endDate) }}
                </v-text-field>
            </template> -->
        </v-slider>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatDate, formatHour } from '@/core/dateRange';
import type { Filter } from '@/parkingGarage/types/filter';

const props = defineProps<{
    filter: Filter;
}>();

const emit = defineEmits<{
    (event: 'indexUpdated', index: number): void;
}>();

const startDate = computed(() => props.filter.dateRange.startDate);
const endDate = computed(() => props.filter.dateRange.endDate);

const minDateInMilliseconds = computed(() => startDate.value.getTime());
const maxDateInMilliseconds = computed(() => endDate.value.getTime());

const currentValue = ref(minDateInMilliseconds.value);

const hourInMilliseconds = 3600000;

const isPlaying = ref(false);
const speed = ref<1 | 2 | 4>(1);

watch(
    () => currentValue.value,
    (value) => {
        emit('indexUpdated', value);
    }
);

async function startTimer() {
    isPlaying.value = true;

    while (currentValue.value <= maxDateInMilliseconds.value && isPlaying.value) {
        await sleep(100 / speed.value);

        currentValue.value += hourInMilliseconds;
    }
}

function pauseTimer() {
    isPlaying.value = false;
}

function changeSpeed() {
    speed.value = speed.value == 4 ? 1 : ((speed.value * 2) as 1 | 2 | 4);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>

<style>
.slider {
    width: 90%;
}
.v-slider-thumb {
    padding-top: 20px;
}
.thumb-label-date {
    margin-bottom: 2px;
    width: 120px;
}
</style>
