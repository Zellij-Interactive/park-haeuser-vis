import { _throw } from '@/core/_throw';
import { ColorBlindMode } from '@/parkingGarage/types/filter';
import { scaleOrdinal } from 'd3';

// Generate 100 shades
const defaultPalette = [
    '#f7fbffff',
    '#deebf7ff',
    '#c6dbefff',
    '#9ecae1ff',
    '#6baed6ff',
    '#4292c6ff',
    '#2171b5ff',
    '#08519cff',
    '#083582ff',
    '#022259ff',
];

const protanopiaPalette = [
    '#fffcd4ff',
    '#cde0caff',
    '#b4d2c6ff',
    '#82b6bcff',
    '#69a8b7ff',
    '#5a93a8ff',
    '#3d6a89ff',
    '#2e557aff',
    '#102b5bff',
    '#0d2644ff',
];

const deuteranopiaPalette = [
    '#eae2bbff',
    '#e9d7b8ff',
    '#e8c9b3ff',
    '#e8baaeff',
    '#d7aba9ff',
    '#c59ca4ff',
    '#a48d9eff',
    '#827d99ff',
    '#606d94ff',
    '#1d4e89ff',
];

const tritanopiaPalette = [
    '#fcedfbff',
    '#f1c1c5ff',
    '#ecacaaff',
    '#e18073ff',
    '#db6a58ff',
    '#c75c49ff',
    '#a1412cff',
    '#8d331dff',
    '#661800ff',
    '#510b00ff',
];

const paletteLength = defaultPalette.length;

export const colorScale: any = (mode: ColorBlindMode) => {
    switch (mode) {
        case undefined:
            return scaleOrdinal()
                .domain([...Array(paletteLength).keys()].map((key) => key.toString()))
                .range(defaultPalette);
        case ColorBlindMode.Protanopia:
            return scaleOrdinal()
                .domain([...Array(paletteLength).keys()].map((key) => key.toString()))
                .range(protanopiaPalette);
        case ColorBlindMode.Deuteranopia:
            return scaleOrdinal()
                .domain([...Array(paletteLength).keys()].map((key) => key.toString()))
                .range(deuteranopiaPalette);
        case ColorBlindMode.Tritanopia:
            return scaleOrdinal()
                .domain([...Array(paletteLength).keys()].map((key) => key.toString()))
                .range(tritanopiaPalette);
        default:
            _throw('Illegal state.');
    }
};

export const colorLegend = (
    selection: d3.Selection<SVGGElement, unknown, null, undefined>,
    props: {
        colorScale: d3.ScaleOrdinal<string, unknown, never>;
        rectSize: number;
        spacing: number;
        textOffset: number;
        isDarkModeOn: boolean;
        colorBlindMode?: ColorBlindMode;
    }
) => {
    const groups: d3.Selection<SVGGElement, string, SVGGElement, unknown> = selection
        .selectAll<SVGGElement, string>('g')
        .data(colorScale(props.colorBlindMode).domain());

    const textColor = props.isDarkModeOn ? 'white' : 'black';

    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups).attr('transform', (d, i) => `translate(${i * props.spacing}, 0)`);
    groups.exit().remove();
    groupsEnter
        .append('rect')
        .merge(groups.select('rect'))
        .attr('width', 12)
        .attr('height', props.rectSize)
        .attr('fill', colorScale(props.colorBlindMode));

    groupsEnter
        .append('text')
        .merge(groups.select('text'))
        .text((d, i, nodes) => {
            if (i === 0) return '0%';
            if (i === nodes.length - 2) return '100%';
            return '';
        })
        .attr('y', props.textOffset)
        .attr('fill', textColor);
};

export function getColorSaturation(prediction: number, colorBlindMode?: ColorBlindMode) {
    if (prediction < 0 || prediction > 100) {
        _throw(
            'Prediction value is out of bounds. Expected range: [0, 100]. Received: ' + prediction
        );
    }

    const index = Math.min(Math.floor(prediction / (100 / paletteLength)), paletteLength - 1);

    switch (colorBlindMode) {
        case undefined:
            return defaultPalette[index];
        case ColorBlindMode.Protanopia:
            return protanopiaPalette[index];
        case ColorBlindMode.Deuteranopia:
            return deuteranopiaPalette[index];
        case ColorBlindMode.Tritanopia:
            return tritanopiaPalette[index];
        default:
            _throw('Illegal state.');
    }
}
