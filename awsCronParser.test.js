const AwsCronParser = require("./awsCronParser");

const logger = {
  debug: (s, o) => console.log(`[${o.label}] ${s}`),
};

const arr = (s, e) => {
  const rs = [];
  for (let i = s; i <= e; i += 1) {
    rs.push(i);
  }
  return rs;
};

test("should parse AWS cron expressions", () => {
  let p;

  p = AwsCronParser.parse("6 4/3 8,18-20,26-28 * ? 2020-2030");
  logger.debug(JSON.stringify(p), { label: "cron 1" });
  expect(p.minutes).toEqual([6]);
  expect(p.hours).toEqual([4, 7, 10, 13, 16, 19, 22]);
  expect(p.daysOfMonth).toEqual([8, 18, 19, 20, 26, 27, 28]);
  expect(p.months).toEqual(arr(1, 12));
  expect(p.daysOfWeek).toBeNull();
  expect(p.years).toEqual(arr(2020, 2030));

  p = AwsCronParser.parse("2/13 5-8,17,21-23 * NOV ? *");
  logger.debug(JSON.stringify(p), { label: "cron 2" });
  expect(p.minutes).toEqual([2, 15, 28, 41, 54]);
  expect(p.hours).toEqual([5, 6, 7, 8, 17, 21, 22, 23]);
  expect(p.daysOfMonth).toEqual(arr(1, 31));
  expect(p.months).toEqual([11]);
  expect(p.daysOfWeek).toBeNull();
  expect(p.years).toEqual(arr(1970, 2199));

  p = AwsCronParser.parse("1,24,50-55,58 * 25 MAR/4 ? 2020,2021,2023,2028");
  logger.debug(JSON.stringify(p), { label: "cron 3" });
  expect(p.minutes).toEqual([1, 24, 50, 51, 52, 53, 54, 55, 58]);
  expect(p.hours).toEqual(arr(0, 23));
  expect(p.daysOfMonth).toEqual([25]);
  expect(p.months).toEqual([3, 7, 11]);
  expect(p.daysOfWeek).toBeNull();
  expect(p.years).toEqual([2020, 2021, 2023, 2028]);

  p = AwsCronParser.parse("* 14 6/10 FEB-JUN,OCT ? 2021/20");
  logger.debug(JSON.stringify(p), { label: "cron 4" });
  expect(p.minutes).toEqual(arr(0, 59));
  expect(p.hours).toEqual([14]);
  expect(p.daysOfMonth).toEqual([6, 16, 26]);
  expect(p.months).toEqual([...arr(2, 6), 10]);
  expect(p.daysOfWeek).toBeNull();
  expect(p.years).toEqual([
    2021,
    2041,
    2061,
    2081,
    2101,
    2121,
    2141,
    2161,
    2181,
  ]);
});

test("should generate next & prev occurence for various crons", () => {
  let occurence;

  const base = new Date(Date.UTC(2020, 5 - 1, 9, 22, 30, 57));

  const crons = [
    [
      "1,24,50-55,58 * 25 MAR/4 ? 2020,2021,2023,2028",
      "Sat, 25 Jul 2020 00:01:00 GMT",
      "Wed, 25 Mar 2020 23:58:00 GMT",
    ],
    ["9 * 7,9,11 3,5,7 ? 2021", "Sun, 07 Mar 2021 00:09:00 GMT", undefined],
    ["9 * 7,9,11 5 ? 2021", "Fri, 07 May 2021 00:09:00 GMT", undefined],
    [
      "9 * 7,9,11 5 ? 2020",
      "Sat, 09 May 2020 23:09:00 GMT",
      "Sat, 09 May 2020 22:09:00 GMT",
    ],
    [
      "9 8-20 7,9,11 5 ? 2020",
      "Mon, 11 May 2020 08:09:00 GMT",
      "Sat, 09 May 2020 20:09:00 GMT",
    ],
    [
      "9 8-20 ? 5 MON-WED,FRI 2020",
      "Mon, 11 May 2020 08:09:00 GMT",
      "Fri, 08 May 2020 20:09:00 GMT",
    ],
    [
      "3 2-5 ? 4,6,8,10 TUE,THU,SAT 2020",
      "Tue, 02 Jun 2020 02:03:00 GMT",
      "Thu, 30 Apr 2020 05:03:00 GMT",
    ],
    [
      "9 * L 5 ? 2019,2020",
      "Sun, 31 May 2020 00:09:00 GMT",
      "Fri, 31 May 2019 23:09:00 GMT",
    ],
    [
      "19 4 L 9 ? 2019,2020",
      "Wed, 30 Sep 2020 04:19:00 GMT",
      "Mon, 30 Sep 2019 04:19:00 GMT",
    ],
    [
      "19 4 3W 9 ? 2019,2020",
      "Thu, 03 Sep 2020 04:19:00 GMT",
      "Tue, 03 Sep 2019 04:19:00 GMT",
    ],
    [
      "19 4 5W 9 ? 2019,2020",
      "Fri, 04 Sep 2020 04:19:00 GMT",
      "Thu, 05 Sep 2019 04:19:00 GMT",
    ],
    [
      "9 8-20 ? 8 5#2 2019,2020",
      "Thu, 13 Aug 2020 08:09:00 GMT",
      "Thu, 08 Aug 2019 20:09:00 GMT",
    ],
    [
      "9 8-20 ? 8 5#3 2019,2020",
      "Thu, 20 Aug 2020 08:09:00 GMT",
      "Thu, 15 Aug 2019 20:09:00 GMT",
    ],
    [
      "9 8-20 ? 12 3#1 2019,2020",
      "Tue, 01 Dec 2020 08:09:00 GMT",
      "Tue, 03 Dec 2019 20:09:00 GMT",
    ],
    [
      "9 8-20 ? 12 3#5 2019,2020",
      "Tue, 29 Dec 2020 08:09:00 GMT",
      "Tue, 31 Dec 2019 20:09:00 GMT",
    ],
    [
      "0 0 1 1 ? *",
      "Fri, 01 Jan 2021 00:00:00 GMT",
      "Wed, 01 Jan 2020 00:00:00 GMT",
    ],
    [
      "0 1 2 3 ? *",
      "Tue, 02 Mar 2021 01:00:00 GMT",
      "Mon, 02 Mar 2020 01:00:00 GMT",
    ],
    [
      "7 1 2 3 ? *",
      "Tue, 02 Mar 2021 01:07:00 GMT",
      "Mon, 02 Mar 2020 01:07:00 GMT",
    ],
    [
      "* * 2 3 ? *",
      "Tue, 02 Mar 2021 00:00:00 GMT",
      "Mon, 02 Mar 2020 23:59:00 GMT",
    ],
  ];

  crons.forEach(([cron, nextShouldBe, prevShouldBe]) => {
    const parsed = AwsCronParser.parse(cron);

    occurence = AwsCronParser.next(parsed, base);
    logger.debug(cron, { label: occurence?.toUTCString() });
    expect(occurence.toUTCString()).toBe(nextShouldBe);

    occurence = AwsCronParser.prev(parsed, base);
    logger.debug(cron, { label: occurence?.toUTCString() });
    expect(occurence?.toUTCString()).toBe(prevShouldBe);
  });
});

test("should generate multiple next occurences", () => {
  const crons = [
    [
      "23,24,25 17,18 25 MAR/4 ? 2020,2021,2023,2028",
      [
        "Sat, 25 Jul 2020 17:23:00 GMT",
        "Sat, 25 Jul 2020 17:24:00 GMT",
        "Sat, 25 Jul 2020 17:25:00 GMT",
        "Sat, 25 Jul 2020 18:23:00 GMT",
        "Sat, 25 Jul 2020 18:24:00 GMT",
        "Sat, 25 Jul 2020 18:25:00 GMT",
        "Wed, 25 Nov 2020 17:23:00 GMT",
        "Wed, 25 Nov 2020 17:24:00 GMT",
        "Wed, 25 Nov 2020 17:25:00 GMT",
        "Wed, 25 Nov 2020 18:23:00 GMT",
      ],
    ],
  ];

  crons.forEach(([cron, itShouldBe]) => {
    const parsed = AwsCronParser.parse(cron);
    let occurence = new Date(Date.UTC(2020, 5 - 1, 9, 22, 30, 57));
    for (let i = 0; i < 10; i += 1) {
      occurence = AwsCronParser.next(parsed, occurence);
      logger.debug(cron, { label: `${i}:${occurence?.toUTCString()}` });
      expect(occurence.toUTCString()).toBe(itShouldBe[i]);
    }
  });
});

test("should generate multiple previous occurences", () => {
  const crons = [
    [
      "23,24,25 17,18 25 MAR/4 ? 2019,2020,2021,2023,2028",
      [
        "Wed, 25 Mar 2020 18:25:00 GMT",
        "Wed, 25 Mar 2020 18:24:00 GMT",
        "Wed, 25 Mar 2020 18:23:00 GMT",
        "Wed, 25 Mar 2020 17:25:00 GMT",
        "Wed, 25 Mar 2020 17:24:00 GMT",
        "Wed, 25 Mar 2020 17:23:00 GMT",
        "Mon, 25 Nov 2019 18:25:00 GMT",
        "Mon, 25 Nov 2019 18:24:00 GMT",
        "Mon, 25 Nov 2019 18:23:00 GMT",
        "Mon, 25 Nov 2019 17:25:00 GMT",
      ],
    ],
  ];

  crons.forEach(([cron, itShouldBe]) => {
    const parsed = AwsCronParser.parse(cron);
    let occurence = new Date(Date.UTC(2020, 5 - 1, 9, 22, 30, 57));
    for (let i = 0; i < 10; i += 1) {
      occurence = AwsCronParser.prev(parsed, occurence);
      logger.debug(cron, { label: `${i}:${occurence?.toUTCString()}` });
      expect(occurence.toUTCString()).toBe(itShouldBe[i]);
    }
  });
});
