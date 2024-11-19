import type { ParkingGarageInfo } from './parkingGarageInfo';

export type ParkingGarage = {
    infos?: ParkingGarageInfo;
    date?: Date;
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
    shapSum: number;
};

export type ParkingGarageRaw = {
    name: string;
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
    shapSum: number;
};
