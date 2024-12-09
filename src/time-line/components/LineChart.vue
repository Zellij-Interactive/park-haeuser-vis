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
import { hourInMilliseconds } from '@/core/dateRange';

// Props for bar chart data and title
const props = defineProps<{
    parkingGarages: Map<ParkingGarageName, ParkingGarage>;
    filter: Filter;
    darkModeOn: boolean;
}>();

const chart = ref<HTMLDivElement | null>(null);

const selectedParkingGarages = computed(() => props.filter.parkingGarages);

const lineColors = computed(() =>
    props.darkModeOn
        ? [
              '#26b6ffff',
              '#e65154ff',
              '#67e6d1ff',
              '#cd76d6ff',
              '#ffca8cff',
              '#fff2b3ff',
              '#ff8cd9ff',
              '#d99d5bff',
              '#c8f2a9ff',
              '#d4b8ffff',
          ]
        : [
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
          ]
);

// Chart dimensions
const margin = { top: 70, right: 30, bottom: 40, left: 80 };

const width = 1800;
const height = 200;

const data = computed<number[][]>(() => {
    let i = 0;
    const data: number[][] = [];

    props.filter.parkingGarages.forEach((name) => {
        data[i] = Array.from(props.parkingGarages.get(name)?.predictions.entries() ?? [])
            .filter(
                ([key, _]) =>
                    key >= props.filter.dateRange.startDate.getTime() &&
                    key <= props.filter.dateRange.endDate.getTime()
            )
            .map(([_, value]) => value.prediction);

        i++;
    });

    return data;
});

const dates = computed<Date[]>(() => {
    const dates: Date[] = [];

    for (
        let currentIndex = props.filter.dateRange.startDate.getTime();
        currentIndex < props.filter.dateRange.endDate.getTime();
        currentIndex += hourInMilliseconds
    ) {
        dates.push(new Date(currentIndex));
    }

    return dates;
});

watch(
    () => [props.darkModeOn, props.filter],
    () => {
        renderChart();
    }
);

// Render chart on mount and when data changes
onMounted(() => {
    renderChart();
});

function renderChart() {
    if (!chart.value) return;

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

    // X scale (for dates)
    const extent = d3.extent(dates.value);
    if (!extent[0] || !extent[1]) {
        _throw('Something went wrong.');
    }
    const xScale = d3.scaleTime().range([0, innerWidth]).domain(extent);

    // Y scale (for values)
    const yScale = d3.scaleLinear().range([innerHeight, 0]).domain([0, 100]);

    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
            d3
                .axisBottom(xScale)
                .ticks(d3.timeMonth.every(1))
                .tickFormat(d3.timeFormat('%b %Y') as (value: Date | d3.NumberValue) => string)
        );

    // Add the y-axis
    svg.append('g').call(
        d3.axisLeft(yScale).tickValues([0, 25, 50, 75, 100]).tickFormat(d3.format('d'))
    );

    for (let i = 0; i < data.value.length; i++) {
        const currentData = dates.value.map((date, index) => ({
            date: date,
            value: data.value[i][index],
        }));

        renderLines(svg, xScale, yScale, currentData, lineColors.value[i]);
    }
}

function renderLines(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>,
    data: { date: Date; value: number }[],
    color: string
) {
    if (!chart.value) return;

    // Create the line generator
    const line = d3
        .line<{ date: Date; value: number }>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value));

    // Add the line path to the SVG element
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1)
        .attr('d', line);
}
</script>

<style></style>
