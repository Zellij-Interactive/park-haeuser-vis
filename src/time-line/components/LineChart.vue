<template>
    <div ref="chart"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import * as d3 from 'd3';
import { _throw } from '@/core/_throw';
import type { Filter } from '@/parkingGarage/types/filter';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';

// Props for bar chart data and title
const props = defineProps<{
    parkingGarages: Map<ParkingGarageName, ParkingGarage>;
    filter: Filter;
    darkModeOn: boolean;
}>();

const chart = ref<HTMLDivElement | null>(null);

const selectedParkingGarages = computed(() => props.filter.parkingGarages);

const lineColors = [
    '#0095baff',
    '#d92b30ff',
    '#3cccb4ff',
    '#ab52b3ff',
    '#ffb259ff',
    '#ffdf3cff',
    '#eb82ebff',
    '#c27c30ff',
    '#a0d17dff',
    '#f260a1ff',
];

// Chart dimensions
const margin = { top: 70, right: 30, bottom: 40, left: 80 };

const width = 1800;
const height = 200;

const data = computed<{ date: Date; value: number }[]>(() =>
    Array.from(
        props.parkingGarages.get(ParkingGarageName.Augustusplatz)?.predictions.entries() ?? []
    )
        .filter(
            ([key, _]) =>
                key >= props.filter.dateRange.startDate.getTime() &&
                key <= props.filter.dateRange.endDate.getTime()
        )
        .map(([key, value]) => ({
            date: new Date(key),
            value: value.prediction,
        }))
);

watch(
    () => props.filter,
    () => {
        renderHorizontalChart(data.value, 'test');
    }
);

// Render chart on mount and when data changes
onMounted(() => {
    renderHorizontalChart(data.value, 'testing');
});

function renderHorizontalChart(data: { date: Date; value: number }[], title: string | undefined) {
    if (!chart.value) return;

    console.log('rendering');

    // Clear previous chart
    d3.select(chart.value).selectAll('*').remove();

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

    // X scale (for values)
    const xScale = d3
        .scaleTime()
        .range([0, innerWidth])
        .domain(d3.extent(data, (d) => d.date));

    // Y scale (for categories)
    const yScale = d3
        .scaleLinear()
        .range([innerHeight, 0])
        .domain([0, d3.max(data, (d) => d.value) || 0]);

    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
            d3.axisBottom(xScale).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%b %Y'))
        );

    // Add the y-axis
    svg.append('g').call(d3.axisLeft(yScale));

    // Create the line generator
    const line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value));

    // // Add the line path to the SVG element
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1)
        .attr('d', line);
}
</script>

<style></style>
