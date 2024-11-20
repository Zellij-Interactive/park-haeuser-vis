import type { Marker } from './marker';
import type { ParkingGarageName } from './parkingGarageNames';
import type { ParkingGaragePredictions } from './parkingGaragePredictions';

export type ParkingGarage = {
    name: ParkingGarageName;
    location: Marker;
    maximalOccupancy: number;
    predictions: ParkingGaragePredictions[];
    rmse: number[];
    meanValues: number[];
};

export type ParkingGarageRaw = {
    name: ParkingGarageName;
    location: Marker;
    maximalOccupancy: number;
};

export type ParkingGarageRMSERaw = {
    name: string;
    time: number;
    rmse: number;
    meanValue: number;
};
