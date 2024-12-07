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
            return '#164995';
        case ColorBlindMode.Deuteranopia:
            return '#094E81';
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
    '#fff5dcff',
    '#f7e9ccff',
    '#eedebdff',
    '#e6d2adff',
    '#d0c8a0ff',
    '#bbbd93ff',
    '#a5b386ff',
    '#8e9b72ff',
    '#78835fff',
    '#616b4bff',
];

const deuteranopiaPalette = [
    '#f9d6b3ff',
    '#e8c29cff',
    '#d8ae84ff',
    '#c79a6dff',
    '#b78165ff',
    '#a6695cff',
    '#91595cff',
    '#7f5158ff',
    '#734c56ff',
    '#664755ff',
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
