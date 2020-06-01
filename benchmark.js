const Benchmark = require("benchmark");
const awsCronParser = require("./awsCronParser");

new Benchmark.Suite()
  .add("aws-cron-parser-next", function () {
    awsCronParser.next(awsCronParser.parse("1 2 3 4 ? *"), new Date());
  })
  .add("aws-cron-parser-prev", function () {
    awsCronParser.prev(awsCronParser.parse("1 2 3 4 ? *"), new Date());
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run({ async: true });
