import type { ParkingGarageName } from '@/parkingGarage/types/parkingGarageNames';

export type CustomMarker = {
    position: {
        lat: number;
        lng: number;
    };
    title: ParkingGarageName;
    icon: {
        path: google.maps.SymbolPath.CIRCLE;
        scale: number;
        fillColor?: string;
        fillOpacity: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
    };
};
