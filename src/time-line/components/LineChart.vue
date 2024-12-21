<template>
    <div class="d-flex">
        <v-checkbox
            v-if="props.dataToDisplay == 'prediction'"
            v-for="parkingGarage of props.parkingGarages.keys()"
            v-model="selectedParkingGarages"
            :key="parkingGarage"
            :label="parkingGarage"
            :value="parkingGarage"
            :ripple="false"
            :disabled="!props.filter.parkingGarages.includes(parkingGarage)"
            density="compact"
            hide-details
            multiple
        />
        <v-checkbox
            v-else
            v-for="shapKey of shapKeysArray"
            v-model="selectedShaps"
            :key="shapKey"
            :label="ShapName[shapKey]"
            :value="shapKey"
            :ripple="false"
            density="compact"
            hide-details
            multiple
        />
    </div>
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
import { ShapName } from '@/parkingGarage/types/shapNames';
import { listOfParkingGaragesNames } from '@/parkingGarage/types/parkingGarageNames';

// Props for bar chart data and title
const props = defineProps<{
    parkingGarages: Map<ParkingGarageName, ParkingGarage>;
    filter: Filter;
    darkModeOn: boolean;
    dataToDisplay: 'prediction' | 'shap';
}>();

type ShapKey = Exclude<keyof typeof ShapName, 'shapSum'>;

const shapKeysArray: ShapKey[] = Object.keys(ShapName).filter(
    (key) => key !== 'shapSum'
) as ShapKey[];

const chart = ref<HTMLDivElement | null>(null);

const selectedParkingGarages = ref<ParkingGarageName[]>([]);
const selectedShaps = ref<ShapKey[]>([]);

const lineColors = computed(() =>
    props.darkModeOn
        ? [
              '#33b1ff',
              '#fa4d56',
              '#8a3ffc',
              '#007d79',
              '#6fdc8c',
              '#ff7eb6',
              '#d2a106',
              '#4589ff',
              '#08bdba',
              '#d4bbff',
              '#ba4e00',
              '#d12771',
              '#bae6ff',
          ]
        : [
              '#1192e8',
              '#fa4d56',
              '#6929c4',
              '#005d5d',
              '#198038',
              '#b28600',
              '#9f1853',
              '#570408',
              '#8a3800',
              '#ee538b',
              '#009d9a',
              '#a56eff',
              '#012749',
          ]
);

// Chart dimensions
const margin = { top: 10, right: 0, bottom: 30, left: 40 };

const width = 1700;
const height = 200;

const data = computed<number[][]>(() => {
    let i = 0;
    const data: number[][] = [];

    if (props.dataToDisplay == 'prediction') {
        selectedParkingGarages.value.forEach((name) => {
            data[i] = Array.from(props.parkingGarages.get(name)?.predictions.entries() ?? [])
                .filter(
                    ([key, _]) =>
                        key >= props.filter.dateRange.startDate.getTime() &&
                        key <= props.filter.dateRange.endDate.getTime()
                )
                .map(([_, value]) => value.prediction);

            i++;
        });
    } else if (props.dataToDisplay == 'shap') {
        const dataMap = extractData(selectedShaps.value);

        for (const index in selectedShaps.value) {
            data[index] = dataMap.get(selectedShaps.value[index]) ?? [];
        }

        // data[0] = Array.from(
        //     props.parkingGarages.get(ParkingGarageName.CityPort)?.predictions.entries() ?? []
        // )
        //     .filter(
        //         ([key, _]) =>
        //             key >= props.filter.dateRange.startDate.getTime() &&
        //             key <= props.filter.dateRange.endDate.getTime()
        //     )
        //     .map(([_, value]) => value.shapFoodServices);

        // data[1] = Array.from(
        //     props.parkingGarages.get(ParkingGarageName.CityPort)?.predictions.entries() ?? []
        // )
        //     .filter(
        //         ([key, _]) =>
        //             key >= props.filter.dateRange.startDate.getTime() &&
        //             key <= props.filter.dateRange.endDate.getTime()
        //     )
        //     .map(([_, value]) => value.shapEducation);
    }

    return data;
});

const minMax = computed(() => {
    let localMin = 0;
    let localMax = 0;

    data.value.forEach((values) =>
        values.forEach((value) => {
            localMin = localMin < value ? localMin : value;
            localMax = localMax < value ? value : localMax;
        })
    );

    return { min: localMin, max: localMax };
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
    () => [
        props.darkModeOn,
        props.filter,
        props.dataToDisplay,
        selectedParkingGarages.value,
        selectedShaps.value,
    ],
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
    const yScale = d3
        .scaleLinear()
        .range([innerHeight, 0])
        .domain([minMax.value.min, minMax.value.max]);

    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${innerHeight - 5})`)
        .style('font-size', '14px')
        .call(
            d3
                .axisBottom(xScale)
                .ticks(d3.timeMonth.every(1))
                .tickFormat(d3.timeFormat('%b %Y') as (value: Date | d3.NumberValue) => string)
        )
        .call((g) => g.select('.domain').remove())
        .selectAll('.tick line')
        .style('stroke-opacity', 0);
    svg.selectAll('.tick text').attr('fill', '#777');

    // Add the y-axis
    svg.append('g')
        .style('font-size', '14px')
        .attr('transform', `translate(0,0)`)
        .call(
            d3
                .axisLeft(yScale)
                .ticks(
                    props.dataToDisplay == 'prediction'
                        ? (minMax.value.max - minMax.value.min) / 20
                        : (minMax.value.max - minMax.value.min) / 2
                )
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(d3.format('d'))
        )
        .call((g) => g.select('.domain').remove())
        .selectAll('.tick text')
        .style('fill', '#777')
        .style('visibility', (d, i, nodes) => {
            if (i === 0) {
                return 'hidden';
            } else {
                return 'visible';
            }
        });

    // Add vertical grid lines
    svg.selectAll('xGrid')
        .data(xScale.ticks().slice(1))
        .join('line')
        .attr('x1', (d) => xScale(d))
        .attr('x2', (d) => xScale(d))
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 0.5);

    // Add horizontal grid lines
    svg.selectAll('yGrid')
        .data(yScale.ticks(5).slice(1))
        .join('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', (d) => yScale(d))
        .attr('y2', (d) => yScale(d))
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 0.5);

    // Add Y-axis label
    // svg.append('text')
    //     .attr('transform', 'rotate(-90)')
    //     .attr('y', 40 - margin.left)
    //     .attr('x', 14 - innerHeight / 2)
    //     .attr('dy', '1em')
    //     .style('text-anchor', 'middle')
    //     .style('font-size', '14px')
    //     .style('fill', '#777')
    //     .style('font-family', 'sans-serif')
    //     .text('Auslastung Pred.');

    // Add the chart title
    // svg.append('text')
    //     .attr('x', margin.left - 60)
    //     .attr('y', margin.top - 70)
    //     .attr('fill', props.darkModeOn ? 'white' : 'black')
    //     .style('font-size', '16px')
    //     .style('font-weight', 'bold')
    //     .style('font-family', 'sans-serif')
    //     .text('Parkhausauslastung Vorhersage');

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

function extractData(property: ShapKey[]): Map<string, number[]> {
    const map = new Map<string, number[]>();

    Array.from(props.parkingGarages.get(ParkingGarageName.CityPort)?.predictions.entries() ?? [])
        .filter(
            ([key]) =>
                key >= props.filter.dateRange.startDate.getTime() &&
                key <= props.filter.dateRange.endDate.getTime()
        )
        .forEach(([_, value]) =>
            property.forEach((name) => {
                const values = map.get(name) ?? [];
                values.push(value[name]);
                map.set(name, values);
            })
        );

    return map;
}
</script>

<style></style>
