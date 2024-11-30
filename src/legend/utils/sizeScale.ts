import { _throw } from '@/core/_throw';
import * as d3 from 'd3';

export const sizeScale: d3.ScalePower<number, number, never> = d3.scaleSqrt();

// Scales
const maxOccupancy = 1033;
const minOccupancy = 145;

export const minRadius = 10;
export const maxRadius = 30;

sizeScale.domain([minOccupancy, maxOccupancy]).range([minRadius, maxRadius]);

export const sizeLegend = (
    selection: d3.Selection<SVGGElement, unknown, null, undefined>,
    props: {
        sizeScale: d3.ScalePower<number, number, never>;
        textOffset: number;
        isDarkModeOn: boolean;
    }
) => {
    const ticks = sizeScale.ticks(5).filter((d) => d != 0 && d != 400 && d != 800);

    const groups: d3.Selection<SVGGElement, number, SVGGElement, number> = selection
        .selectAll<SVGGElement, number>('g')
        .data(ticks);

    const textAndCirclesColor = props.isDarkModeOn ? 'white' : 'black';

    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups).attr('transform', (d, i) => `translate(0, ${sizeScale(d)})`);
    groups.exit().remove();
    groupsEnter
        .append('circle')
        .merge(groups.select('circle'))
        .attr('r', sizeScale)
        .attr('fill', 'none')
        .attr('stroke', textAndCirclesColor);

    groupsEnter
        .append('text')
        .merge(groups.select('text'))
        .text((d) => d)
        .attr('y', sizeScale)
        .attr('x', props.textOffset)
        .attr('fill', textAndCirclesColor);
};

export function getCircleRadius(occupancy: number): number {
    return Math.sqrt(sizeScale(occupancy) / Math.PI);
}
