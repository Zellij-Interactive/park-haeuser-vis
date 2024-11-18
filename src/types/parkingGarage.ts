import type { Marker } from './marker';

export type ParkingGarageInfo = {
    location: Marker;
    name: string;
    maximalOccupancy: number;
};
