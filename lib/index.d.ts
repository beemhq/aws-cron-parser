declare module "aws-cron-parser" {
  interface CronExpression {
    minutes: Array<string | number | null>;
    hours: Array<string | number | null>;
    daysOfMonth: Array<string | number | null>;
    months: Array<string | number | null>;
    daysOfWeek: Array<string | number | null>;
    years: Array<string | number | null>;
  }

  export function parse(cron: string): CronExpression;
  export function next(parsed: CronExpression, from: Date): Date | null;
  export function prev(parsed: CronExpression, from: Date): Date | null;
}
