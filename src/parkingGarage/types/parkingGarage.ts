import type { Marker } from './marker';
import type { ParkingGaragePredictions } from './parkingGaragePredictions';

export type ParkingGarage = {
    name: string;
    location: Marker;
    maximalOccupancy: number;
    predictions: ParkingGaragePredictions[];
    rmse: number[];
    meanValues: number[];
};

export type ParkingGarageRaw = {
    name: string;
    location: Marker;
    maximalOccupancy: number;
};

export type ParkingGarageRMSERaw = {
    name: string;
    time: number;
    rmse: number;
    meanValue: number;
};
