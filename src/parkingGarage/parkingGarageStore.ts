import { defineStore } from 'pinia';
import type { ParkingGaragePredictions } from '@/parkingGarage/types/parkingGaragePredictions';

export const useParkingGarageStore = defineStore('parking-garage', {
    state: () => ({
        parkingGarages: new Array<ParkingGaragePredictions>(),
    }),

    actions: {
        async loadAllParkingGarages(): Promise<ParkingGaragePredictions[]> {
            return [];
        },
        async getAllParkingGarages(): Promise<ParkingGaragePredictions[]> {
            return [];
        },
    },
});
