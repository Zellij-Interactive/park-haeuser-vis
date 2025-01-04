import { _throw } from '@/core/_throw';

export enum ColorBlindMode {
    Protanopia = 'protanopia',
    Deuteranopia = 'deuteranopia',
    Tritanopia = 'tritanopia',
}

export function getBorderColor(darkModeOn: boolean, colorBlindMode?: ColorBlindMode) {
    switch (colorBlindMode) {
        case undefined:
            return darkModeOn ? '#EFB9B4' : '#EE5038';
        case ColorBlindMode.Protanopia:
            return darkModeOn ? '#929DC9' : '#164995';
        case ColorBlindMode.Deuteranopia:
            return darkModeOn ? '#929BCF' : '#094E81';
        case ColorBlindMode.Tritanopia:
            return darkModeOn ? '#75A5B3' : '#027385';
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

export const defaultPalette = [
    '#edf5ff',
    '#d0e2ff',
    '#a6c8ff',
    '#78a9ff',
    '#4589ff',
    '#0f62fe',
    '#0043ce',
    '#002d9c',
    '#001d6c',
    '#001141',
];

export const protanopiaPalette = [
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

export const deuteranopiaPalette = [
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

export function getCategoricalColorPalette(darkModeOn: boolean, colorBlindMode?: ColorBlindMode) {
    if (colorBlindMode == ColorBlindMode.Protanopia) {
        return darkModeOn
            ? [
                  '#5a7cce', // Muted blue
                  '#7c8e4e', // Muted green
                  '#d4a5a5', // Soft red
                  '#9c6b9e', // Purple-gray
                  '#97c6c3', // Aquamarine
                  '#c1a762', // Yellow-brown
                  '#7190ab', // Slate blue
                  '#8b9478', // Olive gray
                  '#c4b5a1', // Beige
                  '#6b8e6e', // Sage green
                  '#9e9ba8', // Lavender gray
                  '#8d7c67', // Tan
                  '#6b95b1', // Light steel blue
              ]
            : [
                  '#739ce0', // Bright blue
                  '#97c981', // Soft green
                  '#e6b4b4', // Light red
                  '#b38cb7', // Lavender
                  '#a6dedc', // Cyan
                  '#d2b971', // Goldenrod
                  '#87a8c6', // Cool blue
                  '#b3b49c', // Light olive
                  '#d6ccb9', // Cream
                  '#93c496', // Light teal
                  '#b7b4c0', // Soft gray-purple
                  '#baa38f', // Light brown
                  '#87b5d6', // Soft blue
              ];
    } else if (colorBlindMode == ColorBlindMode.Deuteranopia) {
        return darkModeOn
            ? [
                  '#6279d1', // Medium blue
                  '#7a8288', // Gray
                  '#c2a769', // Sand yellow
                  '#ab85a3', // Mauve
                  '#8cc6b5', // Seafoam
                  '#c19393', // Peach
                  '#adb686', // Olive gray
                  '#7c6d9e', // Purple
                  '#b8a4c3', // Lavender
                  '#688f85', // Teal gray
                  '#9b88a5', // Dusty purple
                  '#856a6e', // Rose gray
                  '#7d96c8', // Soft blue
              ]
            : [
                  '#8597e4', // Light blue
                  '#a5a8a7', // Gray
                  '#e6c59b', // Light sand
                  '#c1a6c3', // Lilac
                  '#a7e0d1', // Soft teal
                  '#dfb4a5', // Peach
                  '#c3c7a2', // Olive
                  '#a087c3', // Light purple
                  '#d7c3e0', // Lavender
                  '#8cb7a7', // Light seafoam
                  '#bca6c1', // Dusty pink
                  '#c99b9e', // Warm rose
                  '#a6c8e3', // Powder blue
              ];
    } else if (colorBlindMode == ColorBlindMode.Tritanopia) {
        return darkModeOn
            ? [
                  '#637cba', // Muted blue
                  '#9e7a71', // Brown-gray
                  '#b39f68', // Soft gold
                  '#7d93b0', // Slate blue
                  '#8dbba2', // Teal
                  '#b49c92', // Peach gray
                  '#a59c6d', // Olive
                  '#8391a1', // Gray blue
                  '#b8aaa6', // Light taupe
                  '#729485', // Sage green
                  '#9897a1', // Cool gray
                  '#847a67', // Warm tan
                  '#7b94b8', // Light steel blue
              ]
            : [
                  '#8ca4d4', // Light blue
                  '#c29c91', // Soft brown
                  '#d4c293', // Light gold
                  '#a7b5c6', // Gray-blue
                  '#a9d5c1', // Mint green
                  '#d6bbb1', // Light peach
                  '#c2b392', // Warm beige
                  '#b6c3d1', // Powder blue
                  '#e0d2c9', // Pale cream
                  '#a1c1b2', // Light teal
                  '#cac7d1', // Soft lavender-gray
                  '#c3b6a2', // Tan
                  '#aac2da', // Sky blue
              ];
    } else {
        // Default: No color blindness mode
        return darkModeOn
            ? [
                  '#1d70a5',
                  '#fc2c44',
                  '#79c8ae',
                  '#b34a01',
                  '#41d26b',
                  '#b1475c',
                  '#a9c358',
                  '#7b4dd9',
                  '#c7c4d9',
                  '#197959',
                  '#d98ff4',
                  '#ed2bb1',
                  '#e49c4f',
              ]
            : [
                  '#466cf0',
                  '#e71761',
                  '#0a442b',
                  '#bb8091',
                  '#682526',
                  '#729c63',
                  '#5f1181',
                  '#3295e9',
                  '#dd3dca',
                  '#12982d',
                  '#bc5c1f',
                  '#013688',
                  '#b28b28',
              ];
    }
}
