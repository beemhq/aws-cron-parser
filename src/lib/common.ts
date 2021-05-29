import { ParsedRule } from './parse';

const isWeekday = (year: number, month: number, day: number): boolean => {
    if (day < 1 || day > 31) {
        return false;
    }
    const thisDate = new Date(year, month - 1, day);
    if (thisDate.getMonth() !== month - 1) {
        return false;
    }
    return thisDate.getDay() > 0 && thisDate.getDay() < 6;
};

export const getDaysOfMonthFromDaysOfWeek = (year: number, month: number, daysOfWeek: ParsedRule) => {
    const daysOfMonth = [];
    let index = 0; // only for "#" use case
    for (let i = 1; i <= 31; i += 1) {
        const thisDate = new Date(year, month - 1, i);
        // already after last day of month
        if (thisDate.getMonth() !== month - 1) {
            break;
        }
        if (daysOfWeek[0] === 'L') {
            if (daysOfWeek[1] === thisDate.getDay() + 1) {
                const sameDayNextWeek = new Date(thisDate.getTime() + 7 * 24 * 3600000);
                if (sameDayNextWeek.getMonth() !== thisDate.getMonth()) {
                    return [i];
                }
            }
        } else if (daysOfWeek[0] === '#') {
            if (daysOfWeek[1] === thisDate.getDay() + 1) {
                index += 1;
            }
            if (daysOfWeek[2] === index) {
                return [i];
            }
        } else if (daysOfWeek.includes(thisDate.getDay() + 1)) {
            daysOfMonth.push(i);
        }
    }
    return daysOfMonth;
};

export const getDaysOfMonthForL = (year: number, month: number, daysBefore: number): number[] => {
    for (let i = 31; i >= 28; i -= 1) {
        const thisDate = new Date(year, month - 1, i);
        if (thisDate.getMonth() === month - 1) {
            return [i - daysBefore];
        }
    }
    throw new Error('getDaysOfMonthForL - should not happen');
};

export const getDaysOfMonthForW = (year: number, month: number, day: number): number[] => {
    const offset = [0, 1, -1, 2, -2].find((c) => isWeekday(year, month, day + c));
    if (offset === undefined) throw new Error('getDaysOfMonthForW - should not happen');
    return [day + offset];
};

export const arrayFindFirst = (a: any[], f: any) => {
    return a.find(f);
};

export const arrayFindLast = (a: any[], f: any) => {
    // note: a.slice().reverse().find(f) is less efficient
    for (let i = a.length - 1; i >= 0; i--) {
        // eslint-disable-next-line security/detect-object-injection
        const e = a[i];
        if (f(e)) {
            return e;
        }
    }
};
