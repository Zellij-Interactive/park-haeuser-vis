import type { ParkingGarageInfo, ParkingGarageInfoRaw } from '../types/parkingGarageInfo.ts';

export function mapParkingGarageInfoRawToParingGarageInfo(
    parkingGarageInfo: ParkingGarageInfoRaw
): ParkingGarageInfo {
    return {
        name: parkingGarageInfo.name,
        location: parkingGarageInfo.location,
        maximalOccupancy: parkingGarageInfo.maximalOccupancy,
        rmse: [],
        meanValues: [],
    };
}
