import { _throw } from './_throw';
import { differenceInDays } from 'date-fns';

export class DateRange {
    readonly startDate: Date;
    readonly endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        if (startDate.getTime() > endDate.getTime()) {
            _throw('startDate must be before endDate');
        }
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getDifferenceInDays() {
        return differenceInDays(this.endDate, this.startDate);
    }
}
