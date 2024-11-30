// A Pinia store managing parking garage data across the app.
import { defineStore } from 'pinia';
import type { ParkingGarage } from './types/parkingGarage';
import { parkingGarageService } from './parkingGarageService';
import type { ParkingGarageName } from './types/parkingGarageNames';
import { filterMaxDate, filterMinDate, type Filter } from './types/filter';
import { DateRange } from '@/core/dateRange';


export const useParkingGarageStore = defineStore('parking-garage', {
//     parkingGaragesMap:
// A Map object that stores parking garage data.
// Keys: ParkingGarageName (unique identifier).
// Values: ParkingGarage (detailed data about each parking garage).
    state: () => ({
        filter: {
            parkingGarages: [],
            dateRange: new DateRange(filterMinDate, filterMaxDate),
            showSHAPValues: false,
            index: filterMinDate.getTime(),
        } as Filter,
        parkingGaragesMap: new Map<ParkingGarageName, ParkingGarage>(),
    }),

    actions: {
//         Fetches all parking garages from the parkingGarageService.
// Saves each parking garage to the parkingGaragesMap.
// Returns the full list of parking garages.
        async loadAllParkingGarages(): Promise<ParkingGarage[]> {
            const parkingGarages = await parkingGarageService.getAllParkingGarages();

            parkingGarages.forEach((parkingGarage) => {
                this.parkingGaragesMap.set(parkingGarage.name, parkingGarage);
            });

            return parkingGarages;
        },
        // Checks if parkingGaragesMap is already populated.
        // If populated, converts the Map to an array and returns it.
        // Otherwise, calls loadAllParkingGarages to fetch and return all data.
        // When you need all parking garages but don’t want to reload if they’re already in memory.

        async getAllParkingGarage(): Promise<ParkingGarage[]> {
            if (this.parkingGaragesMap.size > 0) {
                return Array.from(this.parkingGaragesMap.values());
            }

            return await this.loadAllParkingGarages();
        },
        // Checks if the requested garage (name) is already in parkingGaragesMap.
        // If found, returns it.
        // Otherwise, fetches it from parkingGarageService, stores it in the map, and returns it.
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


