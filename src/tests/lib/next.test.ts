import AwsCronParser from '../..';
import { logger } from '../logger';

test('should generate multiple next occurences #1', () => {
    const crons: { cron: string; should: string[] }[] = [
        {
            cron: '23,24,25 17,18 25 MAR/4 ? 2020,2021,2023,2028',
            should: [
                'Sat, 25 Jul 2020 17:23:00 GMT',
                'Sat, 25 Jul 2020 17:24:00 GMT',
                'Sat, 25 Jul 2020 17:25:00 GMT',
                'Sat, 25 Jul 2020 18:23:00 GMT',
                'Sat, 25 Jul 2020 18:24:00 GMT',
                'Sat, 25 Jul 2020 18:25:00 GMT',
                'Wed, 25 Nov 2020 17:23:00 GMT',
                'Wed, 25 Nov 2020 17:24:00 GMT',
                'Wed, 25 Nov 2020 17:25:00 GMT',
                'Wed, 25 Nov 2020 18:23:00 GMT',
            ],
        },
    ];

    crons.forEach(({ cron, should: theyShouldBe }) => {
        const parsed = AwsCronParser.parse(cron);
        let occurence: Date = new Date(Date.UTC(2020, 5 - 1, 9, 22, 30, 57));
        theyShouldBe.forEach((itShouldBe, i) => {
            occurence = AwsCronParser.next(parsed, occurence) || new Date(0);
            logger.debug(cron, { label: `${i}:${occurence?.toUTCString()}` });
            expect(occurence?.toUTCString()).toBe(itShouldBe);
        });
    });
});

test('should generate multiple next occurences #2', () => {
    const crons: { cron: string; should: string[] }[] = [
        {
            cron: '15 10 ? * 6L 2002-2025',
            should: [
                'Fri, 29 May 2020 10:15:00 GMT',
                'Fri, 26 Jun 2020 10:15:00 GMT',
                'Fri, 31 Jul 2020 10:15:00 GMT',
                'Fri, 28 Aug 2020 10:15:00 GMT',
                'Fri, 25 Sep 2020 10:15:00 GMT',
                'Fri, 30 Oct 2020 10:15:00 GMT',
                'Fri, 27 Nov 2020 10:15:00 GMT',
                'Fri, 25 Dec 2020 10:15:00 GMT',
                'Fri, 29 Jan 2021 10:15:00 GMT',
                'Fri, 26 Feb 2021 10:15:00 GMT',
            ],
        },
    ];

    crons.forEach(({ cron, should: theyShouldBe }) => {
        const parsed = AwsCronParser.parse(cron);
        let occurence = new Date(Date.UTC(2020, 5 - 1, 9, 22, 30, 57));
        theyShouldBe.forEach((itShouldBe, i) => {
            occurence = AwsCronParser.next(parsed, occurence) || new Date(0);
            logger.debug(cron, { label: `${i}:${occurence?.toUTCString()}` });
            expect(occurence.toUTCString()).toBe(itShouldBe);
        });
    });
});

test('should generate multiple next occurences #3', () => {
    const crons: { cron: string; should: string[] }[] = [
        {
            cron: '0 */3 */1 * ? *',
            should: [
                'Mon, 07 Dec 2020 18:00:00 GMT',
                'Mon, 07 Dec 2020 21:00:00 GMT',
                'Tue, 08 Dec 2020 00:00:00 GMT',
                'Tue, 08 Dec 2020 03:00:00 GMT',
            ],
        },
    ];

    crons.forEach(({ cron, should: theyShouldBe }) => {
        const parsed = AwsCronParser.parse(cron);
        let occurence = new Date(Date.UTC(2020, 12 - 1, 7, 15, 57, 37));
        theyShouldBe.forEach((itShouldBe, i) => {
            occurence = AwsCronParser.next(parsed, occurence) || new Date(0);
            logger.debug(cron, { label: `${i}:${occurence?.toUTCString()}` });
            expect(occurence.toUTCString()).toBe(itShouldBe);
        });
    });
});

test('should generate multiple next occurences #4', () => {
    const crons: { cron: string; should: string[] }[] = [
        {
            cron: '15 12 ? * sun,mon *',
            should: [
                'Sun, 13 Dec 2020 12:15:00 GMT',
                'Mon, 14 Dec 2020 12:15:00 GMT',
                'Sun, 20 Dec 2020 12:15:00 GMT',
                'Mon, 21 Dec 2020 12:15:00 GMT',
            ],
        },
    ];

    crons.forEach(({ cron, should: theyShouldBe }) => {
        const parsed = AwsCronParser.parse(cron);
        let occurence = new Date(Date.UTC(2020, 12 - 1, 7, 15, 57, 37));
        theyShouldBe.forEach((itShouldBe, i) => {
            occurence = AwsCronParser.next(parsed, occurence) || new Date(0);
            logger.debug(cron, { label: `${i}:${occurence?.toUTCString()}` });
            expect(occurence.toUTCString()).toBe(itShouldBe);
        });
    });
});

test('next-6', () => {
    const crons: { cron: string; should: string[] }[] = [
        {
            cron: '10 7/5 7 * ? 2020,2021',
            should: [
                'Mon, 07 Dec 2020 17:10:00 GMT',
                'Mon, 07 Dec 2020 22:10:00 GMT',
                'Thu, 07 Jan 2021 07:10:00 GMT',
                'Thu, 07 Jan 2021 12:10:00 GMT',
            ],
        },
    ];

    crons.forEach(({ cron, should: theyShouldBe }) => {
        const parsed = AwsCronParser.parse(cron);
        let occurence = new Date(Date.UTC(2020, 12 - 1, 7, 15, 57, 37));
        theyShouldBe.forEach((itShouldBe, i) => {
            occurence = AwsCronParser.next(parsed, occurence) || new Date(0);
            logger.debug(cron, { label: `${i}:${occurence?.toUTCString()}` });
            expect(occurence.toUTCString()).toBe(itShouldBe);
        });
    });
});
