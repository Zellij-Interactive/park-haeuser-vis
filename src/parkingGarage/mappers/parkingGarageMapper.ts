import type { ParkingGarageRaw, ParkingGarage } from '../types/parkingGarage';

export function mapParkingGarageRawToParingGarage(parkingGarage: ParkingGarageRaw): ParkingGarage {
    return {
        infos: undefined,
        date: undefined,
        prediction: parkingGarage.prediction,
        shapEducation: parkingGarage.shapEducation,
        shapServicesSpecialtyRetail: parkingGarage.shapServicesSpecialtyRetail,
        shapFinanceInsurance: parkingGarage.shapFinanceInsurance,
        shapLeisureTime: parkingGarage.shapLeisureTime,
        shapFoodServices: parkingGarage.shapFoodServices,
        shapHealth: parkingGarage.shapHealth,
        shapGrocery: parkingGarage.shapGrocery,
        shapReligion: parkingGarage.shapReligion,
        shapShopping: parkingGarage.shapShopping,
        shapOthers: parkingGarage.shapOthers,
        shapPublicSector: parkingGarage.shapPublicSector,
        shapTime: parkingGarage.shapTime,
        shapMonth: parkingGarage.shapMonth,
        shapSum: parkingGarage.shapSum,
    };
}
