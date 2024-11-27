import type { Coordinates } from './marker';
import type { ParkingGarageName } from './parkingGarageNames';
import type { ParkingGaragePrediction } from './parkingGaragePrediction';

export type ParkingGarage = {
    name: ParkingGarageName;
    location: Coordinates;
    maximalOccupancy: number;

    // The number key represents the value of getTime()
    // milliseconds since January 1, 1970, 00:00:00 UTC
    predictions: Map<number, ParkingGaragePrediction>;

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
