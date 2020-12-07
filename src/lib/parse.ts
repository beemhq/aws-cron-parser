export type ParsedRule = (string | number)[];

export interface ParsedCron {
    minutes: ParsedRule;
    hours: ParsedRule;
    daysOfMonth: ParsedRule;
    months: ParsedRule;
    daysOfWeek: ParsedRule;
    years: ParsedRule;
}

const parseOneRule = (rule: string, min: number, max: number): ParsedRule => {
    if (rule === '?') {
        return [];
    }
    if (rule === 'L') {
        return ['L'];
    }
    if (rule.endsWith('L')) {
        return ['L', parseInt(rule.substring(0, rule.length - 1), 10)];
    }
    if (rule.endsWith('W')) {
        return ['W', parseInt(rule.substring(0, rule.length - 1), 10)];
    }
    if (rule.includes('#')) {
        return ['#', parseInt(rule.split('#')[0], 10), parseInt(rule.split('#')[1], 10)];
    }

    let newRule;
    if (rule === '*') {
        newRule = `${min}-${max}`;
    } else if (rule.includes('/')) {
        const parts = rule.split('/');
        if (parts[0] === '*') parts[0] = min.toString();
        let start = parseInt(parts[0], 10);
        const increment = parseInt(parts[1], 10);
        newRule = '';
        while (start <= max) {
            newRule += `,${start}`;
            start += increment;
        }
        newRule = newRule.substring(1);
    } else {
        newRule = rule;
    }

    const allows: number[] = [];
    newRule.split(',').forEach((s) => {
        if (s.includes('-')) {
            const parts = s.split('-');
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            for (let i = start; i <= end; i += 1) allows.push(i);
        } else {
            allows.push(parseInt(s, 10));
        }
    });
    return allows;
};

const replace = (s: string, rules: string[][]) => {
    let rs = s.toUpperCase();
    rules.forEach(([from, to]) => {
        rs = rs.replace(from, to);
    });
    return rs;
};

const monthReplaces = [
    ['JAN', '1'],
    ['FEB', '2'],
    ['MAR', '3'],
    ['APR', '4'],
    ['MAY', '5'],
    ['JUN', '6'],
    ['JUL', '7'],
    ['AUG', '8'],
    ['SEP', '9'],
    ['OCT', '10'],
    ['NOV', '11'],
    ['DEC', '12'],
];

const dayWeekReplaces = [
    ['SUN', '1'],
    ['MON', '2'],
    ['TUE', '3'],
    ['WED', '4'],
    ['THU', '5'],
    ['FRI', '6'],
    ['SAT', '7'],
];

export function parse(cron: string): ParsedCron {
    const rules = cron.split(' ');

    return {
        minutes: parseOneRule(rules[0], 0, 59),
        hours: parseOneRule(rules[1], 0, 23),
        daysOfMonth: parseOneRule(rules[2], 1, 31),
        months: parseOneRule(replace(rules[3], monthReplaces), 1, 12),
        daysOfWeek: parseOneRule(replace(rules[4], dayWeekReplaces), 1, 7),
        years: parseOneRule(rules[5], 1970, 2199),
    };
}
