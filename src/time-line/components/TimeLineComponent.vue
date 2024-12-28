<template>
    <div
        v-if="isCursorIn"
        class="tooltip"
        :style="{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`,
        }"
    >
        <v-card class="tooltip-text pa-1">
            <div>
                <b>SHAP-Wert: </b>
                <span v-text="tooltipData.shapValue" />
            </div>
            <div>
                <b>Uhrzeit: </b>
                <span v-text="formatHour(tooltipData.date)" />
            </div>
            <div>
                <b>Datum: </b>
                <span v-text="formatDate(tooltipData.date)" />
            </div>
        </v-card>
    </div>

    <div class="timeline-container">
        <div class="buttons d-flex flex-column justify-center align-center">
            <v-btn-toggle
                v-model="dataToDisplay"
                class="buttons"
                density="compact"
                divided
                mandatory
                style="transform: rotate(90deg)"
            >
                <v-btn value="prediction" text="Vorhersage" style="flex: 1" />
                <v-btn value="shap" text="SHAP-Werte" style="flex: 1" />
            </v-btn-toggle>
        </div>

        <div class="pr-1" ref="chart"></div>

        <div class="labels d-flex flex-column">
            <v-checkbox
                v-if="dataToDisplay == 'prediction'"
                v-for="(parkingGarage, index) of Array.from(props.parkingGarages.keys()).filter(
                    (p) =>
                        props.filter.parkingGarages.includes(p) &&
                        selectedParkingGarages.includes(p)
                )"
                v-model="selectedParkingGarages"
                :key="parkingGarage"
                :value="parkingGarage"
                :ripple="false"
                :color="lineColors[index]"
                density="compact"
                hide-details
                multiple
            >
                <template #label>
                    <span
                        class="text-caption"
                        :style="{ color: lineColors[index] }"
                        v-text="parkingGarage"
                    />
                </template>
            </v-checkbox>
            <v-checkbox
                v-if="dataToDisplay == 'prediction'"
                v-for="(parkingGarage, index) of Array.from(props.parkingGarages.keys()).filter(
                    (p) =>
                        props.filter.parkingGarages.includes(p) &&
                        !selectedParkingGarages.includes(p)
                )"
                v-model="selectedParkingGarages"
                :key="parkingGarage"
                :value="parkingGarage"
                :ripple="false"
                density="compact"
                hide-details
                multiple
            >
                <template #label>
                    <span class="text-caption" v-text="parkingGarage" />
                </template>
            </v-checkbox>

            <v-checkbox
                v-if="dataToDisplay == 'shap'"
                v-for="(shapKey, index) of selectedShaps"
                v-model="selectedShaps"
                :key="shapKey"
                :label="ShapName[shapKey]"
                :value="shapKey"
                :ripple="false"
                :color="lineColors[index]"
                density="compact"
                hide-details
                multiple
            >
                <template #label>
                    <span
                        class="text-caption"
                        :style="{ color: lineColors[index] }"
                        v-text="ShapName[shapKey]"
                    />
                </template>
            </v-checkbox>
            <v-checkbox
                v-if="dataToDisplay == 'shap'"
                v-for="(shapKey, index) of unselectedShaps"
                v-model="selectedShaps"
                :key="shapKey"
                :value="shapKey"
                :ripple="false"
                density="compact"
                hide-details
                multiple
            >
                <template #label>
                    <span class="text-caption" v-text="ShapName[shapKey]" />
                </template>
            </v-checkbox>
        </div>

        <TimeLineSlider
            v-if="
                (selectedParkingGarages.length > 0 && dataToDisplay == 'prediction') ||
                (selectedShaps.length > 0 && dataToDisplay == 'shap')
            "
            class="timeline-slider"
            :filter="props.filter"
            :is-filter-on="props.isFilterOn"
            @index-updated="(index) => emit('indexUpdated', index)"
            @selected-date-range-updated="
                (startIndex, endIndex) => emit('selectedDateRangeUpdated', startIndex, endIndex)
            "
        />
        <div v-else class="timeline-slider d-flex justify-center align-center">
            <v-alert
                v-if="dataToDisplay == 'prediction'"
                text="Wählen Sie Parkhäuser aus, um die Daten anzuzeigen."
                type="info"
                variant="tonal"
                max-width="500"
                max-height="60"
            ></v-alert>

            <v-alert
                v-if="dataToDisplay == 'shap'"
                text="Wählen Sie SHAP-Werte aus, um die Daten anzuzeigen."
                type="info"
                variant="tonal"
                max-width="500"
                max-height="60"
            ></v-alert>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Filter } from '@/parkingGarage/types/filter';
import type { ParkingGarage } from '@/parkingGarage/types/parkingGarage';
import { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';
import TimeLineSlider from './TimeLineSlider.vue';
import { ref, watch, onMounted, computed } from 'vue';
import * as d3 from 'd3';
import { _throw } from '@/core/_throw';
import { hourInMilliseconds } from '@/core/dateRange';
import { ShapName } from '@/parkingGarage/types/shapNames';
import { formatDate, formatHour } from '@/core/dateRange';

const props = defineProps<{
    parkingGarages: Map<ParkingGarageName, ParkingGarage>;
    filter: Filter;
    darkModeOn: boolean;
    isFilterOn: boolean;
}>();

const emit = defineEmits<{
    (event: 'indexUpdated', index: number): void;
    (event: 'selectedDateRangeUpdated', startIndex: number, endIndex: number): void;
}>();

type ShapKey = Exclude<keyof typeof ShapName, 'shapSum'>;

const shapKeysArray: ShapKey[] = Object.keys(ShapName).filter(
    (key) => key !== 'shapSum'
) as ShapKey[];

const chart = ref<HTMLDivElement | null>(null);

const dataToDisplay = ref<'prediction' | 'shap'>('prediction');

const tooltipData = ref({
    x: 0,
    y: 0,
    date: new Date(),
    shapValue: 0,
});
const isCursorIn = ref(false);

const selectedParkingGarages = ref<ParkingGarageName[]>([]);
const selectedShaps = ref<ShapKey[]>([]);

const unselectedShaps = computed<ShapKey[]>(() =>
    shapKeysArray.filter((shap) => !selectedShaps.value.includes(shap))
);

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

const width = 1650;
const height = 200;

const data = computed<number[][]>(() => {
    let i = 0;
    const data: number[][] = [];

    if (dataToDisplay.value == 'prediction') {
        selectedParkingGarages.value.forEach((name) => {
            data[i] = Array.from(props.parkingGarages.get(name)?.predictions.entries() ?? [])
                .filter(
                    ([key, _]) =>
                        key >= props.filter.selectedRange.startDate.getTime() &&
                        key <= props.filter.selectedRange.endDate.getTime()
                )
                .map(([_, value]) => value.prediction);

            i++;
        });
    } else if (dataToDisplay.value == 'shap') {
        const dataMap = extractData(selectedShaps.value);

        for (const index in selectedShaps.value) {
            data[index] = dataMap.get(selectedShaps.value[index]) ?? [];
        }
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
        let currentIndex = props.filter.selectedRange.startDate.getTime();
        currentIndex < props.filter.selectedRange.endDate.getTime();
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
        dataToDisplay.value,
        selectedParkingGarages.value,
        selectedShaps.value,
    ],
    () => {
        renderChart();
    },
    { deep: true }
);

// Render chart on mount and when data changes
onMounted(() => {
    renderChart();
});

function renderChart() {
    if (!chart.value) return;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(chart.value).selectAll('*').remove();

    // Create tooltip
    const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

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
                    dataToDisplay.value == 'prediction'
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
        .data(
            dataToDisplay.value == 'prediction'
                ? yScale.ticks(5).slice(1)
                : yScale.ticks(10).slice(1)
        )
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

        renderLines(svg, xScale, yScale, tooltip, currentData, lineColors.value[i]);
    }
}

function renderLines(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>,
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
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
        .attr('stroke-width', 2)
        .attr('d', line);

    // Add a cursor line element
    const cursorLine = svg
        .append('line')
        .style('stroke', 'grey')
        .style('stroke-width', 2)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 0);

    // create a listening rectangle
    const listeningRect = svg
        .append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('opacity', 0);

    // create the mouse move function
    listeningRect.on('mousemove', function (event) {
        const [xCoord, yCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector((d: { date: Date }) => d.date).left;
        const x0 = xScale.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
        const xPos = xScale(d.date);
        const yPos = yScale(d.value);

        // Update the cursor line position
        cursorLine
            .transition()
            .duration(50)
            .attr('x1', xScale(d.date))
            .attr('y1', 0)
            .attr('x2', xScale(d.date))
            .attr('y2', yScale(minMax.value.min));

        // Add transition for the circle radius
        //circle.transition().duration(50).attr('r', 5);

        tooltipData.value.x = event.pageX + 8;
        tooltipData.value.y = yCoord + 10;
        tooltipData.value.date = d.date;
        tooltipData.value.shapValue = d.value;

        // Add in our tooltip
        // tooltip
        //     .style('display', 'block')
        //     .style('left', `${xPos}px`)
        //     .style('top', `${yPos}px`)
        //     .style('position', 'absolute')
        //     .html(
        //         `<strong>Date:</strong>${formatDate(d.date)}<br><strong>Wert:</strong> ${d.value !== undefined ? d.value : 'N/A'}`
        //     );

        isCursorIn.value = true;

        // listening rectangle mouse leave function
        listeningRect.on('mouseleave', function () {
            isCursorIn.value = false;
            cursorLine
                .transition()
                .duration(50)
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', 0);

            tooltip.style('display', 'none');
        });
    });
}

function extractData(property: ShapKey[]): Map<string, number[]> {
    const map = new Map<string, number[]>();

    Array.from(props.parkingGarages.get(ParkingGarageName.CityPort)?.predictions.entries() ?? [])
        .filter(
            ([key]) =>
                key >= props.filter.selectedRange.startDate.getTime() &&
                key <= props.filter.selectedRange.endDate.getTime()
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

<style>
.timeline-container {
    display: grid;
    grid-template-columns: 8fr 40px 1fr;
    grid-template-rows: 2fr 1fr;

    max-height: 308px;
}

.chart {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    z-index: 0;
}

.buttons {
    grid-row: 1 / -1;
    grid-column: 2 / 3;
    z-index: 1;
}

.buttons .v-btn-group {
    min-width: 300px !important;
}

.labels {
    grid-row: 1 / -1;
    grid-column: 3 / -1;
    z-index: 1;

    overflow: auto;
}

.timeline-slider {
    grid-row: 2 / -1;
    grid-column: 1 / 2;
    z-index: 1;

    padding-left: 40px;
}

.rect {
    pointer-events: all;
    fill-opacity: 0;
    stroke-opacity: 0;
    z-index: 1;
}

.tooltip {
    position: absolute;
    opacity: 0.7;
    z-index: 2;
}

/* scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    border-radius: 8px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
