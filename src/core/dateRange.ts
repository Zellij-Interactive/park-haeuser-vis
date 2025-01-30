import { _throw } from './_throw';
import { differenceInDays } from 'date-fns';
import { startOfDay } from 'date-fns';

export const hourInMilliseconds = 3600000;

export class DateRange {
    startDate: Date;
    endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        if (startOfDay(startDate).getTime() > startOfDay(endDate).getTime()) {
            _throw('startDate must be before endDate');
        }
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getDifferenceInDays() {
        return differenceInDays(this.endDate, this.startDate);
    }

    equals(dateRange: DateRange): boolean {
        return (
            this.startDate.getTime() == dateRange.startDate.getTime() &&
            this.endDate.getTime() == dateRange.endDate.getTime()
        );
    }
}

export function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

export function formatHour(date: Date) {
    const hour = String(date.getHours()).padStart(2, '0');

    return `${hour}:00`;
}
