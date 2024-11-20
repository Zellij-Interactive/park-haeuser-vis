<template>
    <div ref="chartdiv"></div>
</template>

<script setup lang="ts">
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { onMounted, onUnmounted, ref } from 'vue';

// Apply animated theme
am4core.useTheme(am4themes_animated);

// Reference for the chart container
const chartdiv = ref<HTMLDivElement | null>(null);

// Variable to hold the chart instance
let chart: am4charts.XYChart | null = null;

onMounted(() => {
    if (chartdiv.value) {
        // Create the chart
        chart = am4core.create(chartdiv.value, am4charts.XYChart);

        chart.paddingRight = 20;

        // Generate data
        let data = [];
        let visits = 10;
        for (let i = 1; i < 366; i++) {
            visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
            data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits });
        }

        chart.data = data;

        // Configure axes
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        if (valueAxis.tooltip) {
            valueAxis.tooltip.disabled = true;
        }
        valueAxis.renderer.minWidth = 35;

        // Configure series
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = 'date';
        series.dataFields.valueY = 'value';
        series.tooltipText = '{valueY.value}';

        // Add cursor
        chart.cursor = new am4charts.XYCursor();

        // Add scrollbar
        const scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
    }
});

onUnmounted(() => {
    // Dispose of the chart to clean up resources
    if (chart) {
        chart.dispose();
        chart = null;
    }
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding: 0 20px;
}

svg {
    /* important for responsiveness */
    display: block;
    fill: none;
    stroke: none;
    width: 100%;
    height: 100%;
    overflow: visible;
    background: #eee;
}

.buttons {
    margin-top: 2rem;
}
</style>
