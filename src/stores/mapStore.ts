import { useLocalStorage } from '@vueuse/core';
import { type Marker } from '@/types/marker';
import type { ParkingGarage } from '@/types/parkingGarage';

import * as d3 from 'd3';

export const mainzCoordinates = useLocalStorage<Marker>('MAINZ_LOCATION', {
    latitude: 49.97947979124793,
    longitude: 8.265089599253555,
});

export const parkingGarages = useLocalStorage<ParkingGarage[]>('PARKING_GARAGES', () => {
    let data;

    d3.csv('../../data/Parkhausdaten.csv')
        .then((_data) => {
            data = _data;
            console.log(_data);
        })
        .catch((error) => {
            console.error('Error loading the data:', error);
        });

    console.log(data);
    return [];
});
