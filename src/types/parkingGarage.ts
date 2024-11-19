import type { Marker } from './marker';

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

export type ParkingGarageInfo = {
  name: string;
  location: Marker;
  maximalOccupancy: number;
  rmse: number[];
  meanValues: number[];
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

export type ParkingGarageInfoRaw = {
  name: string;
  location: Marker;
  maximalOccupancy: number;
};

export type ParkingGarageRMSERaw = {
  name: string;
  time: number;
  rmse: number;
  meanValue: number;
};
