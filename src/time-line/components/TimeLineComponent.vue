<template>
    <div
        v-if="
            isCursorIn &&
            ((selectedParkingGarages.length > 0 && dataToDisplay == 'prediction') ||
                (selectedShaps.length > 0 && dataToDisplay == 'shap'))
        "
        class="tooltip"
        :style="{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`,
        }"
    >
        <v-card class="pa-1" max-width="300px" elevation="1" rounded="lg">
            <div class="d-flex">
                <div>
                    <b>Date: </b>
                    <span v-text="formatDate(tooltipData.date)" />
                </div>
                <div class="pl-8">
                    <b>Time: </b>
                    <span v-text="formatHour(tooltipData.date)" />
                </div>
            </div>
            <div
                v-if="dataToDisplay == 'prediction'"
                v-for="(value, name, index) in tooltipData.predictionValues"
                :key="name"
                :style="{ color: lineColors[index] }"
            >
                <b>{{ ParkingGarageName[name] }}: </b>
                <span v-text="value.toFixed(2)" />
            </div>
            <div v-else>
                <div>
                    <b>Parking garages: </b>
                    <span
                        v-for="(name, index) in selectedParkingGarages"
                        v-text="`${name}${selectedParkingGarages.length == index + 1 ? '' : ', '}`"
                    />
                </div>
                <div
                    v-for="(value, key, index) in tooltipData.shapValues"
                    :key="key"
                    :style="{ color: lineColors[index] }"
                >
                    <b>{{ ShapName[key] }}: </b>
                    <span v-text="value.toFixed(2)" />
                </div>
            </div>
        </v-card>
    </div>

    <div class="timeline-container pa-2">
        <div class="buttons d-flex flex-column justify-center align-center pl-1">
            <v-btn-toggle
                v-model="dataToDisplay"
                density="compact"
                divided
                mandatory
                style="transform: rotate(90deg)"
            >
                <v-btn value="prediction" text="Predictions" style="flex: 1" />
                <v-btn
                    v-if="selectedParkingGarages.length > 0"
                    value="shap"
                    text="SHAP values"
                    style="flex: 1"
                />
            </v-btn-toggle>
        </div>

        <div ref="chart"></div>

        <div class="labels d-flex flex-column">
            <div v-if="dataToDisplay == 'prediction'">
                <v-checkbox
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
            </div>

            <div v-if="dataToDisplay == 'shap'">
                <div class="px-2" v-if="selectedParkingGarages.length > 1">
                    <v-select
                        v-model="selectedAggregationType"
                        :items="aggregationTypesArray"
                        :item-title="(item) => AggregationTypeMap[item]"
                        :item-value="(item) => item"
                        label="Aggregation type"
                        density="compact"
                        variant="solo"
                        bg-color="secondary"
                        color="primary"
                        max-width="250"
                        flat
                        hide-details
                    />
                </div>

                <v-checkbox
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
        </div>

        <TimeLineSlider
            class="timeline-slider"
            :filter="props.filter"
            :is-filter-on="props.isFilterOn"
            @index-updated="(index) => emit('indexUpdated', index)"
            @selected-date-range-updated="
                (startIndex, endIndex) => emit('selectedDateRangeUpdated', startIndex, endIndex)
            "
        />

        <div
            v-if="
                (selectedParkingGarages.length == 0 && dataToDisplay == 'prediction') ||
                (selectedShaps.length == 0 && dataToDisplay == 'shap')
            "
            class="info d-flex justify-center align-center"
        >
            <v-alert
                v-if="dataToDisplay == 'prediction'"
                text="Select parking garages to display data"
                type="info"
                color="primary"
                variant="tonal"
                max-width="500"
                max-height="60"
                rounded="lg"
            ></v-alert>

            <v-alert
                v-if="dataToDisplay == 'shap'"
                text="Select SHAP values to display data"
                type="info"
                color="primary"
                variant="tonal"
                max-width="500"
                max-height="60"
                rounded="lg"
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
import { getCategoricalColorPalette } from '@/core/colors';

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

const AggregationTypeMap = {
    average: 'Average',
    median: 'Median',
    min: 'Min',
    max: 'Max',
    std: 'Std',
    range: 'Range',
} as const;

type AggregationType = keyof typeof AggregationTypeMap;

const aggregationTypesArray: AggregationType[] = Object.keys(
    AggregationTypeMap
) as AggregationType[];

const shapKeysArray: ShapKey[] = Object.keys(ShapName).filter(
    (key) => key !== 'shapSum'
) as ShapKey[];

const chart = ref<HTMLDivElement | null>(null);

const dataToDisplay = ref<'prediction' | 'shap'>('prediction');

const tooltipData = ref({
    x: 0,
    y: 0,
    date: new Date(),
    predictionValues: {} as Record<ParkingGarageName, number>,
    shapValues: {} as Record<ShapKey, number>,
});
const isCursorIn = ref(false);

const selectedParkingGarages = ref<ParkingGarageName[]>([]);
const selectedShaps = ref<ShapKey[]>([]);

const selectedAggregationType = ref<AggregationType>('average');

const unselectedShaps = computed<ShapKey[]>(() =>
    shapKeysArray.filter((shap) => !selectedShaps.value.includes(shap))
);

const lineColors = computed(() =>
    getCategoricalColorPalette(props.darkModeOn, props.filter.colorBlindMode)
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
        selectedAggregationType.value,
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
    const tooltip = d3.select(chart.value).append('div').attr('class', 'tooltip');

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

    // Determine the appropriate tick interval and format based on the date range
    const dateRange =
        props.filter.selectedRange.endDate.getTime() -
        props.filter.selectedRange.startDate.getTime();
    let tickInterval, tickFormat;
    if (dateRange <= 7 * 24 * 60 * 60 * 1000) {
        // less than or equal to 1 week
        tickInterval = d3.timeDay.every(1);
        tickFormat = d3.timeFormat('%d %b');
    } else if (dateRange <= 30 * 24 * 60 * 60 * 1000) {
        // less than or equal to 1 month
        tickInterval = d3.timeWeek.every(1);
        tickFormat = d3.timeFormat('%d %b');
    } else {
        tickInterval = d3.timeMonth.every(1);
        tickFormat = d3.timeFormat('%b %Y');
    }

    // Add the x-axis
    const xAxis = svg
        .append('g')
        .attr('transform', `translate(0,${innerHeight - 5})`)
        .style('font-size', '14px')
        .call(
            d3
                .axisBottom(xScale)
                .ticks(tickInterval)
                .tickFormat(tickFormat as (value: Date | d3.NumberValue) => string)
        )
        .call((g) => g.select('.domain').remove())
        .selectAll('.tick line')
        .style('stroke-opacity', 0);

    xAxis
        .selectAll('.tick text')
        .attr('fill', '#777')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

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

    const allData = dates.value.map((date, index) => {
        const values = data.value.map((lineData) => lineData[index]);
        return { date, values };
    });

    renderLines(svg, xScale, yScale, tooltip, allData);
}

function renderLines(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>,
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
    allData: { date: Date; values: number[] }[]
) {
    if (!chart.value) return;

    // Create the line generator
    const line = d3
        .line<{ date: Date; value: number }>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value))
        .curve(d3.curveBasis);

    // Add the line paths to the SVG element
    data.value.forEach((lineData, lineIndex) => {
        const currentData = dates.value.map((date, index) => ({
            date: date,
            value: lineData[index],
        }));

        svg.append('path')
            .datum(currentData)
            .attr('fill', 'none')
            .attr('stroke', lineColors.value[lineIndex])
            .attr('stroke-width', 2)
            .attr('d', line);
    });

    // Add a cursor line element
    const cursorLine = svg
        .append('line')
        .style('stroke', props.darkModeOn ? 'white' : 'black')
        .style(
            'opacity',
            (selectedParkingGarages.value.length > 0 && dataToDisplay.value == 'prediction') ||
                (selectedShaps.value.length > 0 && dataToDisplay.value == 'shap')
                ? 0.4
                : 0
        )
        .style('stroke-width', 1)
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
        const i = bisectDate(allData, x0, 1);
        const d0 = allData[i - 1];
        const d1 = allData[i];
        const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
        const xPos = xScale(d.date);

        // Update the cursor line position
        cursorLine
            .transition()
            .duration(50)
            .attr('x1', xScale(d.date))
            .attr('y1', 0)
            .attr('x2', xScale(d.date))
            .attr('y2', yScale(minMax.value.min));

        tooltipData.value.x = event.pageX + 8;
        tooltipData.value.y = yCoord + 10;
        tooltipData.value.date = d.date;
        tooltipData.value.shapValues = selectedShaps.value.reduce(
            (acc, shapKey, index) => {
                acc[shapKey] = d.values[index];
                return acc;
            },
            {} as Record<ShapKey, number>
        );
        tooltipData.value.predictionValues = selectedParkingGarages.value.reduce(
            (acc, parkingGarage, index) => {
                acc[parkingGarage] = d.values[index];
                return acc;
            },
            {} as Record<ParkingGarageName, number>
        );

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

function extractData(properties: ShapKey[]): Map<ShapKey, number[]> {
    const mapByParkingGarage = new Map<ParkingGarageName, Map<ShapKey, number[]>>();

    selectedParkingGarages.value.forEach((garage) => {
        const map = mapByParkingGarage.get(garage) ?? new Map<ShapKey, number[]>();

        Array.from(props.parkingGarages.get(garage)?.predictions.entries() ?? [])
            .filter(
                ([key]) =>
                    key >= props.filter.selectedRange.startDate.getTime() &&
                    key <= props.filter.selectedRange.endDate.getTime()
            )
            .forEach(([_, value]) =>
                properties.forEach((feature) => {
                    const values = map.get(feature) ?? [];
                    values.push(value[feature]);

                    map.set(feature, values);
                })
            );

        mapByParkingGarage.set(garage, map);
    });

    if (selectedParkingGarages.value.length == 1) {
        return (
            mapByParkingGarage.get(selectedParkingGarages.value[0]) ??
            _throw('Something went wrong.')
        );
    }

    return aggregateData(mapByParkingGarage, properties);
}

function aggregateData(
    data: Map<ParkingGarageName, Map<ShapKey, number[]>>,
    properties: ShapKey[]
): Map<ShapKey, number[]> {
    const aggregatedValuesMap = new Map<ShapKey, number[]>();

    properties.forEach((feature) => {
        const aggregatedValues: number[] = [];

        // Gather all SHAP values for the current feature across all garages
        const allFeatureValuesByIndex: number[][] = [];
        selectedParkingGarages.value.forEach((garage) => {
            const featureValues = data.get(garage)?.get(feature) ?? [];

            featureValues.forEach((value, index) => {
                allFeatureValuesByIndex[index] = allFeatureValuesByIndex[index] ?? [];
                allFeatureValuesByIndex[index].push(value);
            });
        });

        // Compute aggregation for each index
        allFeatureValuesByIndex.forEach((valuesAtIndex, index) => {
            switch (selectedAggregationType.value) {
                // case 'sum':
                //     aggregatedValues[index] = valuesAtIndex.reduce((sum, val) => sum + val, 0);
                //     break;
                case 'average':
                    aggregatedValues[index] =
                        valuesAtIndex.reduce((sum, val) => sum + val, 0) /
                        selectedParkingGarages.value.length;
                    break;
                case 'median':
                    valuesAtIndex.sort((a, b) => a - b);
                    const mid = Math.floor(valuesAtIndex.length / 2);
                    aggregatedValues[index] =
                        valuesAtIndex.length % 2 === 0
                            ? (valuesAtIndex[mid - 1] + valuesAtIndex[mid]) / 2
                            : valuesAtIndex[mid];
                    break;
                case 'min':
                    aggregatedValues[index] = Math.min(...valuesAtIndex);
                    break;
                case 'max':
                    aggregatedValues[index] = Math.max(...valuesAtIndex);
                    break;
                case 'std':
                    const mean =
                        valuesAtIndex.reduce((sum, val) => sum + val, 0) / valuesAtIndex.length;
                    aggregatedValues[index] = Math.sqrt(
                        valuesAtIndex.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
                            valuesAtIndex.length
                    );
                    break;
                case 'range':
                    aggregatedValues[index] =
                        Math.max(...valuesAtIndex) - Math.min(...valuesAtIndex);
                    break;
                default:
                    throw new Error(`Unknown aggregation type: ${selectedAggregationType.value}`);
            }
        });

        aggregatedValuesMap.set(feature, aggregatedValues);
    });

    return aggregatedValuesMap;
}
</script>

<style scoped>
.timeline-container {
    display: grid;
    grid-template-columns: 8fr 40px 1fr;
    grid-template-rows: 2fr 1fr;

    max-height: 318px;
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
    opacity: 0.9;
    z-index: 2;
    font-size: 13px;
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
