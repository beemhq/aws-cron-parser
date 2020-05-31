const parseOneRule = (rule, min, max) => {
  if (rule === "?") {
    return null;
  }
  if (rule === "L") {
    return ["L"];
  }
  if (rule.endsWith("W")) {
    return ["W", parseInt(rule.substring(0, rule.length - 1), 10)];
  }
  if (rule.includes("#")) {
    return [
      "#",
      parseInt(rule.split("#")[0], 10),
      parseInt(rule.split("#")[1], 10),
    ];
  }

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

module.exports.parse = (cron) => {
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
