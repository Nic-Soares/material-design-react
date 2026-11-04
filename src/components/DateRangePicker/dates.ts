// Calendar arithmetic on local dates. Every Date here is a day at local
// midnight, so comparisons are plain time comparisons and time zones never
// shift a day.

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/** The same day `months` later, clamped to the end of shorter months. */
export function addMonths(date: Date, months: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0);
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), last.getDate()),
  );
}

export const sameDay = (a: Date | null, b: Date | null) =>
  a !== null && b !== null && a.getTime() === b.getTime();

export const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** The weeks shown for a month: full weeks, `null` outside the month. */
export function monthWeeks(month: Date, weekStartsOn: number) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from(
      { length: days },
      (_, day) => new Date(month.getFullYear(), month.getMonth(), day + 1),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

/** First day of the week for a locale (0 = Sunday), where the engine knows. */
export function localeWeekStart(locale?: string) {
  try {
    const info = new Intl.Locale(
      locale ?? navigator.language,
    ) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const firstDay = (info.getWeekInfo?.() ?? info.weekInfo)?.firstDay;
    return firstDay === undefined ? 0 : firstDay % 7;
  } catch {
    return 0;
  }
}

/** `yyyy-mm-dd`, the value of `<input type="date">`. */
export const isoDate = (date: Date | null) =>
  date === null
    ? ""
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
