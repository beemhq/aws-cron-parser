import AwsCronParser from '../..';
import { logger } from '../logger';

test('should generate readable schedule description', () => {
    const crons = [
        ['0 8 * * ? *', 'every day'],
        ['15,45 6 * * ? *', 'twice a day, every day'],
        ['0 7,8,9 * * ? *', 'three times a day, every day'],
        ['*/10 */6 * * ? *', 'twenty-four times a day, every day'],

        ['15,45 6 * 4,7 ? *', 'twice a day, every day in April and July'],
        ['15,45 6 15,26 * ? *', 'twice a day, on the 15th and 26th of every month'],
        ['15,45 6 15,26 3,8 ? *', 'twice a day, on the 15th and 26th of March and August'],
        ['15,45 6 15,26,29 3,6,8 ? *', 'twice a day, on the 15th, 26th, and 29th of March, June, and August'],

        ['15,45 6 ? * SUN *', 'twice a day, every week'],
        ['15,45 6 ? * MON,FRI *', 'twice a day, every Monday and Friday'],
        ['15,45 6 ? 3,8 MON,FRI *', 'twice a day, every Monday and Friday in March and August'],
        [
            '15,45 6 ? 3,6,8 TUE,THU,SAT *',
            'twice a day, every Tuesday, Thursday, and Saturday in March, June, and August',
        ],
    ];

    crons.forEach(([cron, itShouldBe]) => {
        const parsed = AwsCronParser.parse(cron);
        const desc = AwsCronParser.getScheduleDescription(parsed);
        logger.debug(desc, { label: cron });
        expect(desc).toBe(itShouldBe);
    });
});
