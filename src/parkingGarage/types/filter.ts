import type { DateRange } from '@/core/dateRange';
import type { ParkingGarageName } from './parkingGarageNames';
import type { ColorBlindMode } from '@/core/colors';

export type Filter = {
    parkingGarages: ParkingGarageName[];
    dateRange: DateRange;
    showSHAPValues: boolean;
    date: Date;
    index: number;
    maxShapValue: number;
    minShapValue: number;
    threshold: number;
    colorBlindMode?: ColorBlindMode;
};

export const filterMinDate = new Date('2025-01-01T00:00:00');
export const filterMaxDate = new Date('2025-12-31T23:00:00');
