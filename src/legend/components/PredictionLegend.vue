<template>
    <b>Prediction:</b>
    <div class="d-flex justify-end align-end container">
        <div ref="svgSaturationLegendContainer"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import { colorLegend, colorScale } from '../utils/ordinalScale';

// Reference to the container where the SVG will be rendered
const svgSaturationLegendContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (!svgSaturationLegendContainer.value) return;

    const svgSaturationLegend = d3
        .select(svgSaturationLegendContainer.value)
        .append('svg')
        .attr('height', 105)
        .attr('width', 100);

    svgSaturationLegend.append('g').attr('transform', `translate(5,5)`).call(colorLegend, {
        colorScale,
        rectSize: 20,
        spacing: 20,
        textOffset: 30,
    });
});
</script>
<style></style>
