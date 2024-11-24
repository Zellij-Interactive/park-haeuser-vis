import type { DateRange } from '@/core/dateRange';
import type { ParkingGarageName } from './parkingGarageNames';

export type Filter = {
    parkingGarages: ParkingGarageName[];
    dateRange: DateRange;
    showSHAPValues: boolean;
};

export const minDate = new Date('2025-01-01');
export const maxDate = new Date('2025-12-31');
