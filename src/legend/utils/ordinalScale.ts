import { _throw } from '@/core/_throw';
import { ColorBlindMode, getColorPalette, paletteLength } from '../../core/colors';
import { scaleOrdinal } from 'd3';

export const strokeOpacity = 0.8;
export const strokeWeight = 2;
export const strokeGap = 6;

export const colorScale: any = (mode: ColorBlindMode) =>
    scaleOrdinal()
        .domain([...Array(paletteLength).keys()].map((key) => key.toString()))
        .range(getColorPalette(mode));

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

    return getColorPalette(colorBlindMode)[index];
}
