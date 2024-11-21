import { _throw } from "./_throw";

export function getCircleRadius(maximalOccupancy: number): number {
    return maximalOccupancy / 10;
}

export function getColorSaturation(prediction: number) {
    if (prediction < 0 || prediction > 100) {
        _throw('Prediction value is out of bounds. Expected range: [0, 1]. Received: ' + prediction)
    }

    const colorPalette = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c']

    const index = Math.min(Math.floor(prediction / 20), colorPalette.length - 1);

    return colorPalette[index]
}
