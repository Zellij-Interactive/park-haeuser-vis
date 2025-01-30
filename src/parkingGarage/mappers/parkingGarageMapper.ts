import type { ParkingGarage, ParkingGarageRaw } from '../types/parkingGarage.js';
import type { ParkingGaragePrediction } from '../types/parkingGaragePrediction.js';

export function mapParkingGarageRawToParingGarage(
    parkingGarageInfo: ParkingGarageRaw
): ParkingGarage {
    return {
        name: parkingGarageInfo.name,
        location: parkingGarageInfo.location,
        maximalOccupancy: parkingGarageInfo.maximalOccupancy,
        predictions: new Map<number, ParkingGaragePrediction>(),
        rmse: [],
        meanValues: [],
    };
}
