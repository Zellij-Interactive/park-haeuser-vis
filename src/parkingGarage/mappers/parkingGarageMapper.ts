import type { ParkingGarage, ParkingGarageRaw } from '../types/parkingGarage.js';

export function mapParkingGarageRawToParingGarage(
    parkingGarageInfo: ParkingGarageRaw
): ParkingGarage {
    return {
        name: parkingGarageInfo.name,
        location: parkingGarageInfo.location,
        maximalOccupancy: parkingGarageInfo.maximalOccupancy,
        predictions: [],
        rmse: [],
        meanValues: [],
    };
}
