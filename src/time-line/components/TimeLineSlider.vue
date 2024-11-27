<template>
    <div class="slider d-flex flex-column justify-center align-center">
        <div>
            <v-btn density="compact" variant="flat">
                <v-icon @click="startTimer()">mdi-play</v-icon>
            </v-btn>
            <v-btn density="compact" variant="flat">
                <v-icon @click="pauseTimer()">mdi-pause</v-icon>
            </v-btn>
            <v-btn density="compact" variant="flat" @click="changeSpeed()" :text="`x${speed}`">
            </v-btn>
        </div>

        <v-slider
            v-model="currentValue"
            :max="max"
            :min="min"
            :step="hourInMilliseconds"
            style="width: 100%"
            thumb-label="always"
        >
            <template v-slot:prepend>
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
            </template>
        </v-slider>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatDate } from '@/core/dateRange';
import type { Filter } from '@/parkingGarage/types/filter';

const props = defineProps<{
    filter: Filter;
}>();

const emit = defineEmits<{
    (event: 'indexUpdated', index: number): void;
}>();

const startDate = computed(() => props.filter.dateRange.startDate);
const endDate = computed(() => props.filter.dateRange.endDate);

const min = computed(() => startDate.value.getTime());
const max = computed(() => endDate.value.getTime());

const currentValue = ref(min.value);

const hourInMilliseconds = 3600000;

const isPlaying = ref(false);
const speed = ref<1 | 2 | 4>(1);

watch(
    () => currentValue.value,
    (value) => {
        if (value == max.value && isPlaying.value) {
            isPlaying.value = false;
        }

        emit('indexUpdated', currentValue.value);
    }
);

async function startTimer() {
    isPlaying.value = true;

    while (currentValue.value <= max.value) {
        if (!isPlaying.value) {
            break;
        }

        await sleep(100 / speed.value);

        currentValue.value += hourInMilliseconds;
    }

    isPlaying.value = false;
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
</style>
