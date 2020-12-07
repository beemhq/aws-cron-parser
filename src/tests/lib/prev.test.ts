import AwsCronParser from '../..';
import { logger } from '../logger';

test('should generate multiple previous occurences', () => {
    const crons: { cron: string; should: string[] }[] = [
        {
            cron: '23,24,25 17,18 25 MAR/4 ? 2019,2020,2021,2023,2028',
            should: [
                'Wed, 25 Mar 2020 18:25:00 GMT',
                'Wed, 25 Mar 2020 18:24:00 GMT',
                'Wed, 25 Mar 2020 18:23:00 GMT',
                'Wed, 25 Mar 2020 17:25:00 GMT',
                'Wed, 25 Mar 2020 17:24:00 GMT',
                'Wed, 25 Mar 2020 17:23:00 GMT',
                'Mon, 25 Nov 2019 18:25:00 GMT',
                'Mon, 25 Nov 2019 18:24:00 GMT',
                'Mon, 25 Nov 2019 18:23:00 GMT',
                'Mon, 25 Nov 2019 17:25:00 GMT',
            ],
        },
    ];

    crons.forEach(({ cron, should: theyShouldBe }) => {
        const parsed = AwsCronParser.parse(cron);
        let occurence = new Date(Date.UTC(2020, 5 - 1, 9, 22, 30, 57));
        theyShouldBe.forEach((itShouldBe, i) => {
            occurence = AwsCronParser.prev(parsed, occurence) || new Date(0);
            logger.debug(cron, { label: `${i}:${occurence?.toUTCString()}` });
            expect(occurence.toUTCString()).toBe(itShouldBe);
        });
    });
});
