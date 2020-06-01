# AWS Cron Parser

[![circleci](https://circleci.com/gh/beemhq/aws-cron-parser.svg?style=shield)](https://app.circleci.com/pipelines/github/beemhq/aws-cron-parser)
[![benchmark](https://img.shields.io/badge/benchmark-128%2C937%20ops%2Fsec-informational)](https://runkit.com/vinhtnguyen/aws-cron-parser---benchmark)
[![codacy](https://app.codacy.com/project/badge/Grade/6c1314916ad54dbfbe1a4698af373883)](https://app.codacy.com/manual/vinhtnguyen/aws-cron-parser/dashboard)

This utility was built to process AWS Cron Expressions used by Amazon CloudWatch. It can support all the specs listed in the link below, including the special wildcards L W and #.

## Specs

AWS Cron Expression specs:

<https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions>

## Usage

There are only 3 methods: `parse`, `next`, and `prev`

```js
import awsCronParser from "aws-cron-parser";

// first we need to parse the cron expression
const cron = awsCronParser.parse("9 * 7,9,11 5 ? 2020,2022,2024-2099");

// to get the first occurrence from now
let occurrence = awsCronParser.next(cron, new Date());

// to get the next occurrence following the previous one
occurrence = awsCronParser.next(cron, occurrence);

// and use prev to get the previous occurrence
occurrence = awsCronParser.prev(cron, occurrence);
```
