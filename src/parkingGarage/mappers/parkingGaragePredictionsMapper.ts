import { _throw } from '@/core/_throw';
import type {
    ParkingGaragePredictionsRaw,
    ParkingGaragePredictions,
} from '../types/parkingGaragePredictions';

export function mapParkingGaragePredictionsRawToParingGaragePredictions(
    parkingGarage: ParkingGaragePredictionsRaw
): ParkingGaragePredictions {
    return {
        name: parkingGarage.name,
        date: parkingGarage.date ?? _throw('Could not load prediction date.'),
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
