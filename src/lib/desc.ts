import * as n2w from 'number-to-words';
import { ParsedCron } from './parse';

const monthNumberToWord = (n: number) => {
    return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ][n - 1];
};

const weekdayNumberToWord = (n: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][n - 1];
};

const joinMultipleWords = (words: string[]) => {
    if (words.length === 1) return words[0];
    if (words.length === 2) return `${words[0]} and ${words[1]}`;
    let rs = '';
    words.forEach((w, i, a) => {
        if (i === 0) rs += `${w},`;
        else if (i < a.length - 1) rs += ` ${w},`;
        else rs += ` and ${w}`;
    });
    return rs;
};

const checkCurrentlyUnsupported = (p: ParsedCron) => {
    for (const part of ['months', 'daysOfMonth', 'daysOfWeek']) {
        const found = p[part].find((e: string | number) => typeof e !== 'number');
        if (found) return true;
    }
    return false;
};

const handleDaysOfMonth = (p: ParsedCron) => {
    if (checkCurrentlyUnsupported(p)) return '';
    // N N * * ? * = every day
    // N N * 4,5 ? * = every day in April and May
    // N N 1,3,5 * ? * = on the 1st, 3rd, and 5th of every month
    // N N 1,3,5 4,5 ? * = on the 1st, 3rd, and 5th of April and May
    let desc = '';
    if (p.daysOfMonth.length === 31) {
        desc += 'every day';
        if (p.months.length < 12) desc += ` in ${joinMultipleWords((p.months as number[]).map(monthNumberToWord))}`;
    } else {
        desc += `on the ${joinMultipleWords((p.daysOfMonth as number[]).map(n2w.toOrdinal))}`;
        if (p.months.length === 12) desc += ' of every month';
        else desc += ` of ${joinMultipleWords((p.months as number[]).map(monthNumberToWord))}`;
    }
    return desc;
};

const handleDaysOfWeek = (p: ParsedCron) => {
    if (checkCurrentlyUnsupported(p)) return '';
    // N N ? * MON * = every Monday
    // N N ? * MON,FRI * = every Monday and Friday
    // N N ? 4,5 MON,FRI * = every Monday and Friday in April and May
    let desc = '';
    desc += `every ${joinMultipleWords((p.daysOfWeek as number[]).map(weekdayNumberToWord))}`;
    if (p.months.length < 12) desc += ` in ${joinMultipleWords((p.months as number[]).map(monthNumberToWord))}`;
    return desc;
};

const handleOncePerDay = (p: ParsedCron) => {
    const { hours, minutes } = p;
    const h = +hours[0] % 12 || 12;
    const m = +minutes[0];
    const mm = m < 10 ? `0${m}` : `${m}`;
    const am = +hours[0] < 12 ? 'AM' : 'PM';
    return `${h}:${mm} ${am}`;
};

/**
 * @param {*} p the value returned by "parse" function of this module
 */
export function getScheduleDescription(p: ParsedCron): string {
    let desc = '';

    const perDay = p.minutes.length * p.hours.length;
    if (perDay === 2) desc += 'twice a day, ';
    else if (perDay > 2) desc += `${n2w.toWords(perDay)} times a day, `;

    if (p.daysOfMonth.length > 0) desc += handleDaysOfMonth(p);
    else if (p.daysOfWeek.length > 0) desc += handleDaysOfWeek(p);

    if (perDay === 1) desc += ` at ${handleOncePerDay(p)}`;

    return desc;
}
