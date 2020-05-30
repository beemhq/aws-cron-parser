const {
  getDaysOfMonthFromDaysOfWeek,
  getDaysOfMonthForL,
  getDaysOfMonthForW,
  arrayFindFirst: find,
} = require("./common");

let iter;
const findOnce = (parsed, from) => {
  if (iter > 10)
    throw new Error("AwsCronParser : this shouldn't happen, but iter > 10");
  iter += 1;

  const cYear = from.getUTCFullYear();
  const cMonth = from.getUTCMonth() + 1;
  const cDayOfMonth = from.getUTCDate();
  const cHour = from.getUTCHours();
  const cMinute = from.getUTCMinutes();

  const year = find(parsed.years, (c) => c >= cYear);
  if (year === undefined) return null;

  const month = find(parsed.months, (c) => c >= (year === cYear ? cMonth : 1));
  if (month === undefined)
    return findOnce(parsed, new Date(Date.UTC(year + 1)));

  const isSameMonth = year === cYear && month === cMonth;

  let pDaysOfMonth = parsed.daysOfMonth;
  if (!pDaysOfMonth)
    pDaysOfMonth = getDaysOfMonthFromDaysOfWeek(year, month, parsed.daysOfWeek);
  else if (pDaysOfMonth[0] === "L")
    pDaysOfMonth = getDaysOfMonthForL(year, month);
  else if (pDaysOfMonth[0] === "W")
    pDaysOfMonth = getDaysOfMonthForW(year, month, pDaysOfMonth[1]);

  const dayOfMonth = find(
    pDaysOfMonth,
    (c) => c >= (isSameMonth ? cDayOfMonth : 1)
  );
  if (dayOfMonth === undefined)
    return findOnce(parsed, new Date(Date.UTC(year, month + 1 - 1)));

  const isSameDate = isSameMonth && dayOfMonth === cDayOfMonth;

  const hour = find(parsed.hours, (c) => c >= (isSameDate ? cHour : 0));
  if (hour === undefined)
    return findOnce(
      parsed,
      new Date(Date.UTC(year, month - 1, dayOfMonth + 1))
    );

  const minute = find(
    parsed.minutes,
    (c) => c >= (isSameDate && hour === cHour ? cMinute : 0)
  );
  if (minute === undefined)
    return findOnce(
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
module.exports.next = (parsed, from) => {
  // iter is just a safety net to prevent infinite recursive calls
  // because I'm not 100% sure this won't happen
  iter = 0;
  return findOnce(
    parsed,
    new Date((Math.floor(from.getTime() / 60000) + 1) * 60000)
  );
};
