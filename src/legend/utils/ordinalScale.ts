import { _throw } from '@/core/_throw';
import { scaleOrdinal, scaleSqrt } from 'd3';

// Start and end colors
const startColor = '#dbf5ff';
const endColor = '#0000a2';
const paletteLength = 20;

// Generate 100 shades
const colorSaturationPalette = [
    '#dbf5ff',
    '#c7ebfa',
    '#b4e0f6',
    '#a1d5f3',
    '#8ecaf0',

    '#7cbfed',
    '#6ab4ea',
    '#58a8e7',
    '#469de4',
    '#3491e1',

    '#1e85de',
    '#0079da',
    '#006dd6',
    '#0061d1',
    '#0054cb',

    '#0049c2',
    '#003cb9',
    '#002cb5',
    '#001bac',
    '#0000a2',
];

export const colorScale: any = scaleOrdinal()
    .domain([...Array(paletteLength).keys()].map((key) => key.toString()))
    .range(colorSaturationPalette);

export const colorLegend = (
    selection: d3.Selection<SVGGElement, unknown, null, undefined>,
    props: {
        colorScale: d3.ScaleOrdinal<string, unknown, never>;
        rectSize: number;
        spacing: number;
        textOffset: number;
        isDarkModeOn: boolean;
    }
) => {
    const groups: d3.Selection<SVGGElement, string, SVGGElement, unknown> = selection
        .selectAll<SVGGElement, string>('g')
        .data(colorScale.domain());

    const textColor = props.isDarkModeOn ? 'white' : 'black';

    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups).attr('transform', (d, i) => `translate(${i * props.spacing}, 0)`);
    groups.exit().remove();
    groupsEnter
        .append('rect')
        .merge(groups.select('rect'))
        .attr('width', 6)
        .attr('height', props.rectSize)
        .attr('fill', colorScale);

    groupsEnter
        .append('text')
        .merge(groups.select('text'))
        .text((d, i, nodes) => {
            if (i === 0) return '0';
            if (i === nodes.length - 6) return '100%';
            return '';
        })
        .attr('y', props.textOffset)
        .attr('fill', textColor);
};

export function getColorSaturation(prediction: number) {
    if (prediction < 0 || prediction > 100) {
        // TODO
        // _throw(
        //     'Prediction value is out of bounds. Expected range: [0, 1]. Received: ' + prediction
        // );

        return startColor;
    }

    const index = Math.min(Math.floor(prediction / (100 / paletteLength)), paletteLength - 1);

    return colorSaturationPalette[index];
}
