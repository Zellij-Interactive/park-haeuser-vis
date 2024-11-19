import type { Marker } from './marker';

export type ParkingGarageInfo = {
    name: string;
    location: Marker;
    maximalOccupancy: number;
    rmse: number[];
    meanValues: number[];
};

export type ParkingGarageInfoRaw = {
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
