<template>
    <div class="pr-2">
        <span>Prediction:</span>
        <div ref="svgSaturationLegendContainer"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';
import { colorLegend, colorScale } from '../utils/ordinalScale';

const props = defineProps<{
    darkModeOn: boolean;
}>();

// Reference to the container where the SVG will be rendered
const svgSaturationLegendContainer = ref<HTMLDivElement | null>(null);

let svgSaturationLegend: d3.Selection<SVGSVGElement, unknown, null, undefined>;

watch(
    () => props.darkModeOn,
    () => {
        renderLegend();
    }
);

function renderLegend() {
    if (!svgSaturationLegend) return;

    svgSaturationLegend.selectAll('g').remove();

    svgSaturationLegend.append('g').attr('transform', `translate(5,5)`).call(colorLegend, {
        colorScale,
        rectSize: 20,
        spacing: 6,
        textOffset: 40,
        isDarkModeOn: props.darkModeOn,
    });
}

onMounted(() => {
    if (!svgSaturationLegendContainer.value) return;

    svgSaturationLegend = d3
        .select(svgSaturationLegendContainer.value)
        .append('svg')
        .attr('height', 50)
        .attr('width', 140);

    svgSaturationLegend.append('g').attr('transform', `translate(5,5)`).call(colorLegend, {
        colorScale,
        rectSize: 20,
        spacing: 6,
        textOffset: 40,
        isDarkModeOn: props.darkModeOn,
    });
});
</script>

<style></style>
