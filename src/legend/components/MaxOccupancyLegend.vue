<template>
    <b>Maximale Auslastung:</b>
    <div class="d-flex justify-end align-end container">
        <div ref="svgCircleAreaLegendContainer"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import { maxRadius, sizeLegend, sizeScale } from '../utils/sizeScale';

const svgCircleAreaLegendContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (!svgCircleAreaLegendContainer.value) return;

    const svgAreaLegend = d3
        .select(svgCircleAreaLegendContainer.value)
        .append('svg')
        .attr('height', 65)
        .attr('width', 120);

    svgAreaLegend
        .append('g')
        .attr('transform', `translate(${maxRadius + 5},5)`)
        .call(sizeLegend, {
            sizeScale,
            textOffset: 40,
        });
});
</script>

<style></style>
