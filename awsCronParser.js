/**
 * AWS Cron Expression specs
 * https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions
 */

const parseOneRule = (rule, min, max) => {
  if (rule === "?") return null;
  if (rule === "L") return ["L"];
  if (rule.endsWith("W"))
    return ["W", parseInt(rule.substring(0, rule.length - 1), 10)];
  if (rule.includes("#"))
    return [
      "#",
      parseInt(rule.split("#")[0], 10),
      parseInt(rule.split("#")[1], 10),
    ];

  let newRule;
  if (rule === "*") {
    newRule = `${min}-${max}`;
  } else if (rule.includes("/")) {
    let [start, increment] = rule.split("/");
    start = parseInt(start, 10);
    increment = parseInt(increment, 10);
    newRule = "";
    while (start <= max) {
      newRule += `,${start}`;
      start += increment;
    }
    newRule = newRule.substring(1);
  } else {
    newRule = rule;
  }

  const allows = [];
  newRule.split(",").forEach((s) => {
    if (s.includes("-")) {
      let [start, end] = s.split("-");
      start = parseInt(start, 10);
      end = parseInt(end, 10);
      for (let i = start; i <= end; i += 1) {
        allows.push(i);
      }
    } else {
      allows.push(parseInt(s, 10));
    }
  });
  return allows;
};

const replace = (s, rules) => {
  let rs = s;
  rules.forEach(([from, to]) => {
    rs = rs.replace(from, to);
  });
  return rs;
};

const monthReplaces = [
  ["JAN", "1"],
  ["FEB", "2"],
  ["MAR", "3"],
  ["APR", "4"],
  ["MAY", "5"],
  ["JUN", "6"],
  ["JUL", "7"],
  ["AUG", "8"],
  ["SEP", "9"],
  ["OCT", "10"],
  ["NOV", "11"],
  ["DEC", "12"],
];

const dayWeekReplaces = [
  ["SUN", "1"],
  ["MON", "2"],
  ["TUE", "3"],
  ["WED", "4"],
  ["THU", "5"],
  ["FRI", "6"],
  ["SAT", "7"],
  ["L", "7"],
];

/**
 * cron is assumed to be validated by AWS already
 * @param {*} cron
 */
const parse = (cron) => {
  const rs = {};
  const rules = cron.split(" ");

  rs.minutes = parseOneRule(rules[0], 0, 59);
  rs.hours = parseOneRule(rules[1], 0, 23);
  rs.daysOfMonth = parseOneRule(rules[2], 1, 31);
  rs.months = parseOneRule(replace(rules[3], monthReplaces), 1, 12);
  rs.daysOfWeek = parseOneRule(replace(rules[4], dayWeekReplaces), 1, 7);
  rs.years = parseOneRule(rules[5], 1970, 2199);

  return rs;
};

const getDaysOfMonthFromDaysOfWeek = (year, month, daysOfWeek) => {
  const daysOfMonth = [];
  let index = 0; // only for "#" use case
  for (let i = 1; i <= 31; i += 1) {
    const thisDate = new Date(year, month - 1, i);

    // already after last day of month
    if (thisDate.getMonth() !== month - 1) break;

    if (daysOfWeek[0] === "#") {
      if (daysOfWeek[1] === thisDate.getDay() + 1) index += 1;
      if (daysOfWeek[2] === index) return [i];
    } else if (daysOfWeek.includes(thisDate.getDay() + 1)) daysOfMonth.push(i);
  }
  return daysOfMonth;
};

const getDaysOfMonthForL = (year, month) => {
  for (let i = 31; i >= 28; i -= 1) {
    const thisDate = new Date(year, month - 1, i);
    if (thisDate.getMonth() === month - 1) return [i];
  }
  throw new Error("getDaysOfMonthForL - should not happen");
};

const isWeekday = (year, month, day) => {
  if (day < 1 || day > 31) return false;
  const thisDate = new Date(year, month - 1, day);
  if (thisDate.getMonth() !== month - 1) return false;
  return thisDate.getDay() > 0 && thisDate.getDay() < 6;
};

const getDaysOfMonthForW = (year, month, day) => {
  return [day + [0, 1, -1, 2, -2].find((c) => isWeekday(year, month, day + c))];
};

let nextIterCount;
const nextOnce = (parsed, from) => {
  if (nextIterCount > 10)
    throw new Error(
      "AwsCronParser : this shouldn't happen, but nextIterCount > 10"
    );
  nextIterCount += 1;

  const cYear = from.getUTCFullYear();
  const cMonth = from.getUTCMonth() + 1;
  const cDayOfMonth = from.getUTCDate();
  const cHour = from.getUTCHours();
  const cMinute = from.getUTCMinutes();

  const year = parsed.years.find((c) => c >= cYear);
  if (year === undefined) return null;

  const month = parsed.months.find((c) => c >= (year === cYear ? cMonth : 1));
  if (month === undefined)
    return nextOnce(parsed, new Date(Date.UTC(year + 1)));

  const isSameMonth = year === cYear && month === cMonth;

  let daysOfMonthLocal = parsed.daysOfMonth;
  if (!daysOfMonthLocal)
    daysOfMonthLocal = getDaysOfMonthFromDaysOfWeek(
      year,
      month,
      parsed.daysOfWeek
    );
  else if (daysOfMonthLocal[0] === "L")
    daysOfMonthLocal = getDaysOfMonthForL(year, month);
  else if (daysOfMonthLocal[0] === "W")
    daysOfMonthLocal = getDaysOfMonthForW(year, month, daysOfMonthLocal[1]);

  const dayOfMonth = daysOfMonthLocal.find(
    (c) => c >= (isSameMonth ? cDayOfMonth : 1)
  );
  if (dayOfMonth === undefined)
    return nextOnce(parsed, new Date(Date.UTC(year, month + 1 - 1)));

  const isSameDate = isSameMonth && dayOfMonth === cDayOfMonth;

  const hour = parsed.hours.find((c) => c >= (isSameDate ? cHour : 0));
  if (hour === undefined)
    return nextOnce(
      parsed,
      new Date(Date.UTC(year, month - 1, dayOfMonth + 1))
    );

  const minute = parsed.minutes.find(
    (c) => c >= (isSameDate && hour === cHour ? cMinute + 1 : 0)
  );
  if (minute === undefined)
    return nextOnce(
      parsed,
      new Date(Date.UTC(year, month - 1, dayOfMonth, hour + 1))
    );

  return new Date(Date.UTC(year, month - 1, dayOfMonth, hour, minute));
};

/**
 * generate the next occurrence AFTER the "from" date value
 * returns NULL when there is no more future occurrence
 * @param {*} parsed the value returned by "parse" function of this module
 * @param {*} from the Date to start from
 */
const next = (parsed, from) => {
  // nextIterCount is just a safety net to prevent infinite recursive calls
  // because I'm not 100% sure this won't happen
  nextIterCount = 0;
  return nextOnce(parsed, from);
};

module.exports = {
  parse,
  next,
};
