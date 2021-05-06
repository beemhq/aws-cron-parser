import AwsCronParser from '../..';
import { logger } from '../logger';

const arr = (s: number, e: number, step: number = 1) => {
    const rs = [];
    for (let i = s; i <= e; i += step) {
        rs.push(i);
    }
    return rs;
};

test('should parse AWS cron expressions #1', () => {
    let p;

    p = AwsCronParser.parse('6 4/3 8,18-20,26-28 * ? 2020-2030');
    logger.debug(JSON.stringify(p), { label: 'cron 1' });
    expect(p.minutes).toEqual([6]);
    expect(p.hours).toEqual([4, 7, 10, 13, 16, 19, 22]);
    expect(p.daysOfMonth).toEqual([8, 18, 19, 20, 26, 27, 28]);
    expect(p.months).toEqual(arr(1, 12));
    expect(p.daysOfWeek).toEqual([]);
    expect(p.years).toEqual(arr(2020, 2030));

    p = AwsCronParser.parse('2/13 5-8,17,21-23 * NOV ? *');
    logger.debug(JSON.stringify(p), { label: 'cron 2' });
    expect(p.minutes).toEqual([2, 15, 28, 41, 54]);
    expect(p.hours).toEqual([5, 6, 7, 8, 17, 21, 22, 23]);
    expect(p.daysOfMonth).toEqual(arr(1, 31));
    expect(p.months).toEqual([11]);
    expect(p.daysOfWeek).toEqual([]);
    expect(p.years).toEqual(arr(1970, 2199));

    p = AwsCronParser.parse('1,24,50-55,58 * 25 MAR/4 ? 2020,2021,2023,2028');
    logger.debug(JSON.stringify(p), { label: 'cron 3' });
    expect(p.minutes).toEqual([1, 24, 50, 51, 52, 53, 54, 55, 58]);
    expect(p.hours).toEqual(arr(0, 23));
    expect(p.daysOfMonth).toEqual([25]);
    expect(p.months).toEqual([3, 7, 11]);
    expect(p.daysOfWeek).toEqual([]);
    expect(p.years).toEqual([2020, 2021, 2023, 2028]);

    p = AwsCronParser.parse('* 14 6/10 FEB-JUN,OCT ? 2021/20');
    logger.debug(JSON.stringify(p), { label: 'cron 4' });
    expect(p.minutes).toEqual(arr(0, 59));
    expect(p.hours).toEqual([14]);
    expect(p.daysOfMonth).toEqual([6, 16, 26]);
    expect(p.months).toEqual([...arr(2, 6), 10]);
    expect(p.daysOfWeek).toEqual([]);
    expect(p.years).toEqual([2021, 2041, 2061, 2081, 2101, 2121, 2141, 2161, 2181]);
});

test('should parse AWS cron expressions #2', () => {
    const p = AwsCronParser.parse('15 10 ? * 6L 2002-2025');
    logger.debug(JSON.stringify(p), { label: 'cron 1' });
    expect(p.minutes).toEqual([15]);
    expect(p.hours).toEqual([10]);
    expect(p.daysOfMonth).toEqual([]);
    expect(p.months).toEqual(arr(1, 12));
    expect(p.daysOfWeek).toEqual(['L', 6]);
    expect(p.years).toEqual(arr(2002, 2025));
});

test('should parse AWS cron expression #3', () => {
    const p = AwsCronParser.parse('*/5 10 ? * MON-FRI *');
    logger.debug(JSON.stringify(p), { label: 'cron 1' });
    expect(p.minutes).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    expect(p.hours).toEqual([10]);
    expect(p.daysOfMonth).toEqual([]);
    expect(p.months).toEqual(arr(1, 12));
    expect(p.daysOfWeek).toEqual(arr(2, 6));
    expect(p.years).toEqual(arr(1970, 2199));
});

test('should parse AWS cron expression #4', () => {
    const p = AwsCronParser.parse('0 */3 */1 * ? *');
    logger.debug(JSON.stringify(p), { label: 'cron 1' });
    expect(p.minutes).toEqual([0]);
    expect(p.hours).toEqual(arr(0, 21, 3));
    expect(p.daysOfMonth).toEqual(arr(1, 31));
    expect(p.months).toEqual(arr(1, 12));
    expect(p.daysOfWeek).toEqual([]);
    expect(p.years).toEqual(arr(1970, 2199));
});

test('should parse AWS cron expression #5', () => {
    const p = AwsCronParser.parse('15 12 ? * sun,mon *');
    logger.debug(JSON.stringify(p), { label: 'cron 1' });
    expect(p.minutes).toEqual([15]);
    expect(p.hours).toEqual([12]);
    expect(p.daysOfMonth).toEqual([]);
    expect(p.months).toEqual(arr(1, 12));
    expect(p.daysOfWeek).toEqual([1, 2]);
    expect(p.years).toEqual(arr(1970, 2199));
});

test('parse-6', () => {
    const p = AwsCronParser.parse('10 7/5 7 * ? 2020');
    logger.debug(JSON.stringify(p), { label: 'cron 1' });
    expect(p.minutes).toEqual([10]);
    expect(p.hours).toEqual(arr(7, 22, 5));
    expect(p.daysOfMonth).toEqual([7]);
    expect(p.months).toEqual(arr(1, 12));
    expect(p.daysOfWeek).toEqual([]);
    expect(p.years).toEqual([2020]);
});

test('parse-7', () => {
    const p = AwsCronParser.parse('0-29/5 22 09 05 ? 2020');
    logger.debug(JSON.stringify(p), { label: 'cron 1' });
    expect(p.minutes).toEqual(arr(0, 25, 5));
    expect(p.hours).toEqual([22]);
    expect(p.daysOfMonth).toEqual([9]);
    expect(p.months).toEqual([5]);
    expect(p.daysOfWeek).toEqual([]);
    expect(p.years).toEqual([2020]);
});
