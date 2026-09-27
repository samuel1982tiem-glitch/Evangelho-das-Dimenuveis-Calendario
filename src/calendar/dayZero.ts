/**
 * @file src/calendar/dayZero.ts
 * Day Zero definition, creation, and helper functions.
 */

import { calculateLunarAnchor } from '../astronomy/moon';
import { CalendarDay, LunarAnchorMode } from '../types/calendar';

/**
 * Creates the Day Zero CalendarDay object for a specific sacred calendar year.
 */
export function createDayZero(
  calendarYear: number,
  mode: LunarAnchorMode,
  gregorianYear: number,
  gregorianDayZeroDate: Date
): CalendarDay {
  const lunarAnchor = calculateLunarAnchor(gregorianYear, mode);

  return {
    kind: 'DAY_ZERO',
    calendarYear,
    isSabbath: true,
    sabbathType: 'ANNUAL_SABBATH',
    lunarAnchor,
    gregorianDate: gregorianDayZeroDate,
    notes: 'The sacred threshold of the New Year. Annual Sabbath outside the 364 numbered days.',
  };
}

/**
 * Type guard to check if a calendar day is Day Zero.
 */
export function isDayZero(day: CalendarDay): day is Extract<CalendarDay, { kind: 'DAY_ZERO' }> {
  return day.kind === 'DAY_ZERO';
}
