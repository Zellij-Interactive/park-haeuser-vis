import { useLocalStorage } from '@vueuse/core';
import { type Marker } from '@/types/marker';

export const mainzCoordinates = useLocalStorage<Marker>('MAINZ_LOCATION', {
    latitude: 49.97947979124793,
    longitude: 8.265089599253555,
});

export const nearbyMarkers = useLocalStorage<Marker[]>('NEARBY_MARKERS', []);
