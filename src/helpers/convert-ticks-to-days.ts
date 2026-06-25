import { DAYS_PER_YEAR, MONTH_DAYS, TICKS_PER_MONTH, TICKS_PER_YEAR } from "../constants";

export const convertTicksToDays = (ticks: number): number => {
	const years = Math.floor(ticks / TICKS_PER_YEAR);
	const MONTH_DAYS_REVERSED = [...MONTH_DAYS].reverse();
	const days = MONTH_DAYS_REVERSED.reduce(
		(a: { days: number; ticks: number }, m: number) => {
			if (a.ticks > TICKS_PER_MONTH) {
				a.ticks -= TICKS_PER_MONTH;
				a.days += m;
			}
			return a;
		},
		{
			days: 0,
			ticks: ticks - years * TICKS_PER_YEAR,
		},
	).days;
	const leftover =
		ticks - Math.floor(ticks / TICKS_PER_MONTH) * TICKS_PER_MONTH;
	const TICKS_PER_DAY = TICKS_PER_MONTH / MONTH_DAYS[date.month];
	const leftoverDays = Math.floor(leftover / TICKS_PER_DAY);

	return years * DAYS_PER_YEAR + days + leftoverDays + 1;
};
