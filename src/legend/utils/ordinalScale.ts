import { _throw } from '@/core/_throw';
import { scaleOrdinal, scaleSqrt } from 'd3';

const colorSaturationPalette = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];

export const colorScale: any = scaleOrdinal()
    .domain(['0-20', '20-40', '40-60', '60-80', '80-100%'])
    .range(colorSaturationPalette);

export const colorLegend = (
    selection: d3.Selection<SVGGElement, unknown, null, undefined>,
    props: {
        colorScale: d3.ScaleOrdinal<string, unknown, never>;
        rectSize: number;
        spacing: number;
        textOffset: number;
    }
) => {
    const groups: d3.Selection<SVGGElement, string, SVGGElement, unknown> = selection
        .selectAll<SVGGElement, string>('g')
        .data(colorScale.domain());

    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups).attr('transform', (d, i) => `translate(0, ${i * props.spacing})`);
    groups.exit().remove();
    groupsEnter
        .append('rect')
        .merge(groups.select('rect'))
        .attr('width', props.rectSize)
        .attr('height', props.rectSize)
        .attr('fill', colorScale);

    groupsEnter
        .append('text')
        .merge(groups.select('text'))
        .text((d) => d)
        .attr('dy', '0.32em')
        .attr('dx', props.textOffset)
        .attr('y', props.rectSize / 2);
};

export function getColorSaturation(prediction: number) {
    if (prediction < 0 || prediction > 100) {
        _throw(
            'Prediction value is out of bounds. Expected range: [0, 1]. Received: ' + prediction
        );
    }

    const index = Math.min(Math.floor(prediction / 20), 4);

    return colorSaturationPalette[index];
}
