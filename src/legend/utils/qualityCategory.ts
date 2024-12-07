import { _throw } from '@/core/_throw';
import { ColorBlindMode } from '@/parkingGarage/types/filter';
import { scaleOrdinal } from 'd3';

const defaultColor = '#c6dbefff';
const protanopiaColor = '#b4d2c6ff';
const deuteranopiaColor = '#e8c9b3ff';
const tritanopiaColor = '#ecacaaff';

const length = 2;

export const colorScale: any = (mode: ColorBlindMode) => {
    switch (mode) {
        case undefined:
            return scaleOrdinal()
                .domain([...Array(length).keys()].map((key) => key.toString()))
                .range([defaultColor, defaultColor]);
        case ColorBlindMode.Protanopia:
            return scaleOrdinal()
                .domain([...Array(length).keys()].map((key) => key.toString()))
                .range([protanopiaColor, protanopiaColor]);
        case ColorBlindMode.Deuteranopia:
            return scaleOrdinal()
                .domain([...Array(length).keys()].map((key) => key.toString()))
                .range([deuteranopiaColor, deuteranopiaColor]);
        case ColorBlindMode.Tritanopia:
            return scaleOrdinal()
                .domain([...Array(length).keys()].map((key) => key.toString()))
                .range([tritanopiaColor, tritanopiaColor]);
        default:
            _throw('Illegal state.');
    }
};

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

    const textColor = props.isDarkModeOn ? 'white' : 'black';

    const groupsEnter = groups.enter().append('g');
    groupsEnter.merge(groups).attr('transform', (d, i) => `translate(0, ${i * props.spacing})`);
    groups.exit().remove();
    groupsEnter
        .append('circle')
        .merge(groups.select('circle'))
        .attr('r', props.radius)
        .attr('fill', colorScale(props.colorBlindMode))
        .attr('stroke-width', (d, i) => {
            if (i === 0) return 1;
            if (i === 1) return 4;
            _throw('error setting the width of circle');
        })
        .attr('stroke', (d, i) => {
            if (i === 0) return textColor;
            if (i === 1) {
                switch (props.colorBlindMode) {
                    case undefined:
                        return '#EB271B';
                    case ColorBlindMode.Protanopia:
                        return '#FFB03B';
                    case ColorBlindMode.Deuteranopia:
                        return '#FEE800';
                    case ColorBlindMode.Tritanopia:
                        return '#027385';
                }
            }
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
        .attr('fill', textColor);
};

export function getColorSaturation(prediction: number, colorBlindMode?: ColorBlindMode) {
    if (prediction < 0 || prediction > 100) {
        _throw(
            'Prediction value is out of bounds. Expected range: [0, 100]. Received: ' + prediction
        );
    }

    const index = Math.min(Math.floor(prediction / (100 / length)), length - 1);

    switch (colorBlindMode) {
        case undefined:
            return defaultColor;
        case ColorBlindMode.Protanopia:
            return protanopiaColor;
        case ColorBlindMode.Deuteranopia:
            return deuteranopiaColor;
        case ColorBlindMode.Tritanopia:
            return tritanopiaColor;
        default:
            _throw('Illegal state.');
    }
}
