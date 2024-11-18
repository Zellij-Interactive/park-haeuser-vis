import { useLocalStorage } from '@vueuse/core';
import { type Marker } from '@/types/marker';
import type { ParkingGarage } from '@/types/parkingGarage';

import * as d3 from 'd3';

export const mainzCoordinates = useLocalStorage<Marker>('MAINZ_LOCATION', {
    latitude: 49.97947979124793,
    longitude: 8.265089599253555,
});

export const parkingGarages = useLocalStorage<ParkingGarage[]>('PARKING_GARAGES', []);

loadParkingGarageInfos().then((data) => {
    parkingGarages.value = data;
});

async function loadParkingGarageInfos(): Promise<ParkingGarage[]> {
    try {
        const dsv = d3.dsvFormat(';');

        const response = await fetch('./src/data/Parkhausinfos.csv');

        if (!response) {
            throw new Error('Failed to fetch CSV: ${response.statusText}');
        }

        const csvText = await response.text();
        const rawData = dsv.parse(csvText);

        return rawData.map((d) => ({
            name: d.Name,
            maximalOccupancy: +d['Maximale Belegung in Parkplaetze'],
            location: {
                latitude: parseFloat(d.Latitude.replace(',', '.')),
                longitude: parseFloat(d.Longitude.replace(',', '.')),
            },
        }));
    } catch (error) {
        console.error('Error processing CSV data:', error);
        return [];
    }
}
