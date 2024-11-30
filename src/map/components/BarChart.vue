<template>
    <div ref="chart" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import * as d3 from 'd3';

// Props for bar chart data and title
const props = defineProps<{ data: number[]; title: string }>();
const chart = ref<HTMLDivElement | null>(null);

function renderHorizontalChart(data: number[], title: string) {
    if (!chart.value) return;

    // Clear previous chart
    d3.select(chart.value).selectAll('*').remove();

    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3
        .select(chart.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Y scale (for categories)
    const y = d3
        .scaleBand()
        .domain(data.map((_, i) => i.toString()))
        .range([0, height])
        .padding(0.1);

    // X scale (for values)
    const x = d3
        .scaleLinear()
        .domain([d3.min(data) || 0, d3.max(data) || 0])
        .nice()
        .range([0, width]);

    // Draw bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', (_, i) => y(i.toString()) || 0)
        .attr('x', (d) => (d > 0 ? x(0) : x(d)))
        .attr('width', (d) => Math.abs(x(d) - x(0)))
        .attr('height', y.bandwidth())
        .attr('fill', (d) => (d > 0 ? 'steelblue' : 'tomato'));

    // Add Y axis
    svg.append('g').call(d3.axisLeft(y));

    // Add X axis
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text(title);
}

// Render chart on mount and when data changes
onMounted(() => renderHorizontalChart(props.data, props.title));

watch(
    () => props.data,
    (newData) => renderHorizontalChart(newData, props.title)
);
</script>

<style>
.chart-container {
    width: 100%;
    height: 100%;
}
.bar {
    opacity: 0.8;
}
.bar:hover {
    opacity: 1;
}
</style>
