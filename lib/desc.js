const n2w = require("number-to-words");

const monthNumberToWord = (n) => {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][n - 1];
};

const weekdayNumberToWord = (n) => {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][n - 1];
};

const joinMultipleWords = (words) => {
  if (words.length === 1) return words[0];
  if (words.length === 2) return `${words[0]} and ${words[1]}`;
  let rs = "";
  words.forEach((w, i, a) => {
    if (i === 0) rs += `${w},`;
    else if (i < a.length - 1) rs += ` ${w},`;
    else rs += ` and ${w}`;
  });
  return rs;
};

const handleDaysOfMonth = (p) => {
  // N N * * ? * = every day
  // N N * 4,5 ? * = every day in April and May
  // N N 1,3,5 * ? * = on the 1st, 3rd, and 5th of every month
  // N N 1,3,5 4,5 ? * = on the 1st, 3rd, and 5th of April and May
  let desc = "";
  if (p.daysOfMonth.length === 31) {
    desc += "every day";
    if (p.months.length < 12)
      desc += ` in ${joinMultipleWords(p.months.map(monthNumberToWord))}`;
  } else {
    desc += `on the ${joinMultipleWords(p.daysOfMonth.map(n2w.toOrdinal))}`;
    if (p.months.length === 12) desc += " of every month";
    else desc += ` of ${joinMultipleWords(p.months.map(monthNumberToWord))}`;
  }
  return desc;
};

const handleDaysOfWeek = (p) => {
  // N N ? * MON * = every week
  // N N ? * MON,FRI * = every Monday and Friday
  // N N ? 4,5 MON,FRI * = every Monday and Friday in April and May
  let desc = "";
  if (p.daysOfWeek.length === 1) desc += "every week";
  else
    desc += `every ${joinMultipleWords(p.daysOfWeek.map(weekdayNumberToWord))}`;
  if (p.months.length < 12)
    desc += ` in ${joinMultipleWords(p.months.map(monthNumberToWord))}`;
  return desc;
};

/**
 * @param {*} p the value returned by "parse" function of this module
 */
module.exports.getScheduleDescription = (p) => {
  let desc = "";

  const perDay = p.minutes.length * p.hours.length;
  if (perDay === 2) desc += "twice a day, ";
  else if (perDay > 2) desc += `${n2w.toWords(perDay)} times a day, `;

  if (p.daysOfMonth) desc += handleDaysOfMonth(p);
  else if (p.daysOfWeek) desc += handleDaysOfWeek(p);

  return desc;
};
