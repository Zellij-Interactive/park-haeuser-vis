<template>
    <span>Maximum capacity:</span>
    <div ref="svgCircleAreaLegendContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';
import { maxRadius, sizeLegend, sizeScale } from '../utils/sizeScale';

const props = defineProps<{
    darkModeOn: boolean;
}>();

const svgCircleAreaLegendContainer = ref<HTMLDivElement | null>(null);

let svgAreaLegend: d3.Selection<SVGSVGElement, unknown, null, undefined>;

watch(
    () => props.darkModeOn,
    () => {
        renderLegend();
    }
);

function renderLegend() {
    if (!svgAreaLegend) return;

    svgAreaLegend.selectAll('g').remove();

    svgAreaLegend
        .append('g')
        .attr('transform', `translate(${maxRadius + 5},5)`)
        .call(sizeLegend, {
            sizeScale,
            textOffset: 40,
            isDarkModeOn: props.darkModeOn,
        });
}

onMounted(() => {
    if (!svgCircleAreaLegendContainer.value) return;

    svgAreaLegend = d3
        .select(svgCircleAreaLegendContainer.value)
        .append('svg')
        .attr('height', 65)
        .attr('width', 200);

    svgAreaLegend
        .append('g')
        .attr('transform', `translate(${maxRadius + 5},5)`)
        .call(sizeLegend, {
            sizeScale,
            textOffset: 40,
            isDarkModeOn: props.darkModeOn,
        });
});
</script>

<style></style>
