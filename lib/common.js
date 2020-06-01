const isWeekday = (year, month, day) => {
  if (day < 1 || day > 31) {
    return false;
  }
  const thisDate = new Date(year, month - 1, day);
  if (thisDate.getMonth() !== month - 1) {
    return false;
  }
  return thisDate.getDay() > 0 && thisDate.getDay() < 6;
};

module.exports.getDaysOfMonthFromDaysOfWeek = (year, month, daysOfWeek) => {
  const daysOfMonth = [];
  let index = 0; // only for "#" use case
  for (let i = 1; i <= 31; i += 1) {
    const thisDate = new Date(year, month - 1, i);
    // already after last day of month
    if (thisDate.getMonth() !== month - 1) {
      break;
    }
    if (daysOfWeek[0] === "#") {
      if (daysOfWeek[1] === thisDate.getDay() + 1) {
        index += 1;
      }
      if (daysOfWeek[2] === index) {
        return [i];
      }
    } else if (daysOfWeek.includes(thisDate.getDay() + 1)) {
      daysOfMonth.push(i);
    }
  }
  return daysOfMonth;
};

module.exports.getDaysOfMonthForL = (year, month) => {
  for (let i = 31; i >= 28; i -= 1) {
    const thisDate = new Date(year, month - 1, i);
    if (thisDate.getMonth() === month - 1) {
      return [i];
    }
  }
  throw new Error("getDaysOfMonthForL - should not happen");
};

module.exports.getDaysOfMonthForW = (year, month, day) => {
  return [day + [0, 1, -1, 2, -2].find((c) => isWeekday(year, month, day + c))];
};

module.exports.arrayFindFirst = (a, f) => {
  return a.find(f);
};

module.exports.arrayFindLast = (a, f) => {
  // note: a.slice().reverse().find(f) is less efficient
  for (let i = a.length - 1; i >= 0; i--) {
    // eslint-disable-next-line detect-object-injection
    const e = a[i];
    if (f(e)) {
      return e;
    }
  }
};
