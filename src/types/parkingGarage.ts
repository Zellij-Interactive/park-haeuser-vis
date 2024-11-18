import type { Marker } from './marker';

export type ParkingGarage = {
    location: Marker;
    name: string;
    maximalOccupancy: number;
};
