import type { Coordinates } from './marker';
import type { ParkingGarageName } from './parkingGarageNames';
import type { ParkingGaragePredictions } from './parkingGaragePredictions';

export type ParkingGarage = {
    name: ParkingGarageName;
    location: Coordinates;
    maximalOccupancy: number;
    predictions: ParkingGaragePredictions[];
    rmse: number[];
    meanValues: number[];
};

export type ParkingGarageRaw = {
    name: ParkingGarageName;
    location: Coordinates;
    maximalOccupancy: number;
};

export type ParkingGarageRMSERaw = {
    name: string;
    time: number;
    rmse: number;
    meanValue: number;
};
