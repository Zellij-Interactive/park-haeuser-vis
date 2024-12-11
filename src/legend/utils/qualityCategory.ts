import { _throw } from '@/core/_throw';
import { ColorBlindMode, getBorderColor } from './colorBlindMode';
import { getColorPalette } from './colorBlindMode';
import { scaleOrdinal } from 'd3';
import { strokeGap, strokeOpacity, strokeWeight } from './ordinalScale';

const length = 2;

export const colorScale: any = (mode: ColorBlindMode) =>
    scaleOrdinal()
        .domain([...Array(length).keys()].map((key) => key.toString()))
        .range([getColorPalette(mode)[3], getColorPalette(mode)[3]]);

export const colorLegend = (
    selection: d3.Selection<SVGGElement, unknown, null, undefined>,
    props: {
        colorScale: d3.ScaleOrdinal<string, unknown, never>;
        radius: number;
        spacing: number;
        textOffset: number;
        isDarkModeOn: boolean;
        colorBlindMode?: ColorBlindMode;
    }
) => {
    const groups: d3.Selection<SVGGElement, string, SVGGElement, unknown> = selection
        .selectAll<SVGGElement, string>('g')
        .data(colorScale(props.colorBlindMode).domain());

    const textAndStrokeColor = props.isDarkModeOn ? 'white' : 'black';

    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups).attr('transform', (d, i) => `translate(0, ${i * props.spacing})`);
    groups.exit().remove();

    groupsEnter
        .append('circle')
        .merge(groups.select('circle'))
        .attr('r', props.radius)
        .attr('fill', 'none')
        .attr('stroke-width', strokeWeight)
        .attr('stroke', textAndStrokeColor)
        .attr('stroke-opacity', strokeOpacity);

    // Border for prediction quality
    groupsEnter
        .append('circle')
        .merge(groups.select('circle'))
        .attr('r', props.radius + strokeGap)
        .attr('fill', 'none')
        .attr('stroke-width', (d, i) => {
            if (i === 0) return 0;
            if (i === 1) return 4;
            _throw('error setting the width of circle');
        })
        .attr('stroke', (d, i) => {
            if (i === 0) return 'black';
            if (i === 1) return getBorderColor(props.isDarkModeOn, props.colorBlindMode);
            _throw('error setting the color of the border');
        });

    groupsEnter
        .append('text')
        .merge(groups.select('text'))
        .text((d, i) => {
            if (i === 0) return 'Korrekte Vorhersage';
            if (i === 1) return 'Falsche Vorhersage';
            _throw('error setting the text');
        })
        .attr('dy', '0.32em')
        .attr('x', props.textOffset)
        .attr('fill', textAndStrokeColor);
};
