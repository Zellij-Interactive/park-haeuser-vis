import { defineStore } from 'pinia';
import type { ParkingGarage } from '@/types/parkingGarage';

export const useParkingGarageStore = defineStore('parking-garage', {
    state: () => ({
        parkingGarages: new Array<ParkingGarage>(),
    }),

    actions: {
        async loadAllParkingGarages(): Promise<ParkingGarage[]> {
            return [];
        },
        async getAllParkingGarages(): Promise<ParkingGarage[]> {
            return [];
        },
    },
});
