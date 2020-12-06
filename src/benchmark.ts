import Benchmark from 'benchmark';
import awsCronParser from '.';

new Benchmark.Suite()
    .add('aws-cron-parser-next', function () {
        awsCronParser.next(awsCronParser.parse('1 2 3 4 ? *'), new Date());
    })
    .add('aws-cron-parser-prev', function () {
        awsCronParser.prev(awsCronParser.parse('1 2 3 4 ? *'), new Date());
    })
    .on('cycle', function (event: { target: any }) {
        console.log(String(event.target));
    })
    .run({ async: true });
