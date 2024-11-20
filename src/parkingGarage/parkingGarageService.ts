import { _throw } from '@/core/_throw';
import type { ParkingGarage } from './types/parkingGarage';
import { ParkingGarageName } from './types/parkingGarageNames';
import { parkingGarageApi } from './parkingGarageApi';

export const parkingGarageService = {
    async getParkingGarage(name: ParkingGarageName): Promise<ParkingGarage> {
        return await parkingGarageApi.retrieveFromIndexedDB(name);
    },

    async getAllParkingGarages(): Promise<ParkingGarage[]> {
        const parkingGarages: ParkingGarage[] = [];

        for (const name of Object.values(ParkingGarageName)) {
            parkingGarages.push(await this.getParkingGarage(name));
        }
        return parkingGarages;
    },
};
