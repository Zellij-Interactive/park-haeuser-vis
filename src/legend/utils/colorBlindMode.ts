import { _throw } from '@/core/_throw';

export enum ColorBlindMode {
    Protanopia = 'protanopia',
    Deuteranopia = 'deuteranopia',
    Tritanopia = 'tritanopia',
}

export function getBorderColor(colorBlindMode?: ColorBlindMode) {
    switch (colorBlindMode) {
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

export function getColorPalette(mode?: ColorBlindMode): string[] {
    switch (mode) {
        case undefined:
            return defaultPalette;
        case ColorBlindMode.Protanopia:
            return protanopiaPalette;
        case ColorBlindMode.Deuteranopia:
            return deuteranopiaPalette;
        case ColorBlindMode.Tritanopia:
            return tritanopiaPalette;
        default:
            _throw('Illegal state.');
    }
}

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

export const paletteLength = defaultPalette.length;
