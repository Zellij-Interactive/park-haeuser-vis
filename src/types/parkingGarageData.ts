import type { ParkingGarageInfo } from './parkingGarage';

export type ParkingGarageData = {
    date?: Date;
    infos?: ParkingGarageInfo;
    prediction: number;
    shapEducation: number;
    shapServicesSpecialtyRetail: number;
    shapFinanceInsurance: number;
    shapLeisureTime: number;
    shapFoodServices: number;
    shapHealth: number;
    shapGrocery: number;
    shapReligion: number;
    shapShopping: number;
    shapOthers: number;
    shapPublicSector: number;
    shapTime: number;
    shapMonth: number;
};
