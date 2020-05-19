# AWS Cron Parser

## Specs

AWS Cron Expression specs:

```
https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions
```

## Usage

There are only 2 methods: `parse` and `next`

```js
import awsCronParser from "aws-cron-parser";
const cron = awsCronParser.parse("9 * 7,9,11 5 ? 2020");
let occurrence = awsCronParser.next(cron, new Date()); // to get the first occurrence from now
occurrence = awsCronParser.next(cron, occurrence; // to get the next occurrence following the previous one
```
