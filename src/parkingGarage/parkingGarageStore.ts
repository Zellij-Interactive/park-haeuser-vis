import { defineStore } from 'pinia';
import type { ParkingGarage } from './types/parkingGarage';
import { parkingGarageService } from './parkingGarageService';
import type { ParkingGarageName } from './types/parkingGarageNames';
import { maxDate, minDate, type Filter } from './types/filter';
import { DateRange } from '@/core/dateRange';

export const useParkingGarageStore = defineStore('parking-garage', {
    state: () => ({
        filter: {
            parkingGarages: [],
            dateRange: new DateRange(minDate, maxDate),
            showSHAPValues: false,
        } as Filter,
        parkingGaragesMap: new Map<ParkingGarageName, ParkingGarage>(),
    }),

    actions: {
        async loadAllParkingGarages(): Promise<ParkingGarage[]> {
            const parkingGarages = await parkingGarageService.getAllParkingGarages();

            parkingGarages.forEach((parkingGarage) => {
                this.parkingGaragesMap.set(parkingGarage.name, parkingGarage);
            });

            return parkingGarages;
        },

        async getAllParkingGarage(): Promise<ParkingGarage[]> {
            if (this.parkingGaragesMap.size > 0) {
                return Array.from(this.parkingGaragesMap.values());
            }

            return await this.loadAllParkingGarages();
        },

        async getParkingGarage(name: ParkingGarageName): Promise<ParkingGarage> {
            let parkingGarage = this.parkingGaragesMap.get(name);

            if (parkingGarage != null) {
                return parkingGarage;
            }

            parkingGarage = await parkingGarageService.getParkingGarage(name);

            this.parkingGaragesMap.set(name, parkingGarage);

            return parkingGarage;
        },
    },
});
