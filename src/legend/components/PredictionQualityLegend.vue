<template>
    <div class="pr-2">
        <span>Qualität der Vorhersage:</span>
        <div ref="svgLegendContainer"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';
import { colorLegend, colorScale } from '../utils/qualityCategory';
import type { Filter } from '@/parkingGarage/types/filter';

const props = defineProps<{
    darkModeOn: boolean;
    filter: Filter;
}>();

// Reference to the container where the SVG will be rendered
const svgLegendContainer = ref<HTMLDivElement | null>(null);

let svgSaturationLegend: d3.Selection<SVGSVGElement, unknown, null, undefined>;

watch(
    () => props.darkModeOn,
    () => {
        renderLegend();
    }
);

watch(
    () => props.filter,
    () => {
        renderLegend();
    }
);

function renderLegend() {
    if (!svgSaturationLegend) return;

    svgSaturationLegend.selectAll('g').remove();

    svgSaturationLegend.append('g').attr('transform', `translate(20,20)`).call(colorLegend, {
        colorScale,
        radius: 12,
        spacing: 34,
        textOffset: 24,
        isDarkModeOn: props.darkModeOn,
        colorBlindMode: props.filter.colorBlindMode,
    });
}

onMounted(() => {
    if (!svgLegendContainer.value) return;

    svgSaturationLegend = d3
        .select(svgLegendContainer.value)
        .append('svg')
        .attr('height', 72)
        .attr('width', 200);

    svgSaturationLegend.append('g').attr('transform', `translate(20,20)`).call(colorLegend, {
        colorScale,
        radius: 12,
        spacing: 34,
        textOffset: 24,
        isDarkModeOn: props.darkModeOn,
        colorBlindMode: props.filter.colorBlindMode,
    });
});
</script>

<style></style>
