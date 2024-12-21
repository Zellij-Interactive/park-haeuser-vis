<template>
    <div ref="chart"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import * as d3 from 'd3';
import { _throw } from '@/core/_throw';
import { type SHAPValue } from '@/parkingGarage/types/shapNames';
import type { Filter } from '@/parkingGarage/types/filter';
import { strokeOpacity } from '@/legend/utils/constants';

// Props for bar chart data and title
const props = defineProps<{
    data: SHAPValue[];
    title?: string;
    filter: Filter;
    darkModeOn: boolean;
}>();

const chart = ref<HTMLDivElement | null>(null);

const width = 320;
const height = 200;

function renderHorizontalChart(data: SHAPValue[], title: string | undefined) {
    if (!chart.value) return;

    // Clear previous chart
    d3.select(chart.value).selectAll('*').remove();

    // Chart dimensions
    const margin = { top: 0, right: 10, bottom: 20, left: 140 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3
        .select(chart.value)
        .append('svg')
        .attr('width', innerWidth + margin.left + margin.right)
        .attr('height', innerHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Y scale (for categories)
    const yScale = d3
        .scaleBand()
        .domain(data.map((d, i) => d.name))
        .range([0, innerHeight])
        .padding(0.2);

    // X scale (for values)
    const xScale = d3
        .scaleLinear()
        .domain([props.filter.minShapValue, props.filter.maxShapValue])
        .nice()
        .range([0, innerWidth]);

    // Draw horizontal grid lines
    svg.selectAll('.line')
        .data(data)
        .enter()
        .append('line')
        .style('stroke-width', 1)
        .style('stroke', props.darkModeOn ? 'white' : 'black')
        .attr('stroke-opacity', strokeOpacity / 3)
        .attr('x1', 0)
        .attr('y1', (d, i) => yScale(d.name) || 0)
        .attr('x2', xScale(props.filter.maxShapValue))
        .attr('y2', (d, i) => yScale(d.name) || 0)
        .style('stroke-dasharray', '2, 2');

    // Draw vertical grid lines
    svg.selectAll('.line')
        .data(data)
        .enter()
        .append('line')
        .style('stroke-width', 1)
        .style('stroke', props.darkModeOn ? 'white' : 'black')
        .attr('stroke-opacity', strokeOpacity / 3)
        .attr('x1', (d, i) => xScale(-25 + i * 5))
        .attr('y1', 0)
        .attr('x2', (d, i) => xScale(-25 + i * 5))
        .attr('y2', yScale.bandwidth() * 16 + 5)
        .style('stroke-dasharray', '2, 2');

    // Draw bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', (d, i) => yScale(d.name) || 0)
        .attr('x', (d) => xScale(Math.min(0, d.value)))
        .attr('width', (d) => Math.abs(xScale(d.value) - xScale(0)))
        .attr('height', yScale.bandwidth())
        .attr('fill', (d) => (d.value > 0 ? 'steelblue' : 'tomato'))
        .attr('stroke', 'black')
        .attr('stroke-opacity', strokeOpacity);

    // Draw vertical centered line
    svg.selectAll('.line')
        .data(data)
        .enter()
        .append('line')
        .style('stroke-width', 1)
        .style('stroke', props.darkModeOn ? 'white' : 'black')
        .attr('stroke-opacity', 1)
        .attr('x1', (d, i) => xScale(0))
        .attr('y1', 0)
        .attr('x2', (d, i) => xScale(0))
        .attr('y2', (d) => yScale.bandwidth() * 16 + 5);

    // Add Y axis
    svg.append('g').call(d3.axisLeft(yScale));

    // Add X axis
    svg.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(xScale));

    // Add title
    if (title) {
        svg.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', -margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .text(title);
    }

    // Add title
    // svg.append('text')
    //     .attr('x', width / 2)
    //     .attr('y', -margin.top / 2)
    //     .attr('text-anchor', 'middle')
    //     .style('font-size', '14px')
    //     .text('Title');
}

// Render chart on mount and when data changes
onMounted(() => renderHorizontalChart(props.data, props.title));

watch(
    (): [SHAPValue[], boolean] => [props.data, props.darkModeOn],
    ([newData, _]) => renderHorizontalChart(newData, props.title)
);
</script>

<style>
.bar {
    opacity: 0.8;
}
.bar:hover {
    opacity: 1;
}
</style>
