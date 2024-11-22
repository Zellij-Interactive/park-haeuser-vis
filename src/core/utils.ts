import { _throw } from './_throw';
import { colorPalette } from './colorPalette';

export function getCircleRadius(maximalOccupancy: number): number {
    return maximalOccupancy / 10;
}

export function getColorSaturation(prediction: number) {
    if (prediction < 0 || prediction > 100) {
        _throw(
            'Prediction value is out of bounds. Expected range: [0, 1]. Received: ' + prediction
        );
    }

    const index = Math.min(Math.floor(prediction / 20), 4);

    return colorPalette[index];
}
