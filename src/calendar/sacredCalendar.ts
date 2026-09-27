/**
 * @file src/calendar/sacredCalendar.ts
 * Master Sacred Calendar Engine (Day Zero + 13 Months x 28 Days = 364 Days).
 * Provides conversions between Gregorian solar dates and Sacred Calendar dates.
 */

import { calculateLunarAnchor } from '../astronomy/moon';
import { createDayZero } from './dayZero';
import { getSabbathType } from './sabbath';
import { CalendarConfiguration, CalendarDay, LunarAnchorMode } from '../types/calendar';

/**
 * Generates all days (Day Zero + 364 Numbered Days) for a given Sacred Year.
 * Returns 365 CalendarDay objects in chronological order.
 */
export function generateSacredYearDays(
  calendarYear: number,
  anchorMode: LunarAnchorMode = 'CONJUNCTION',
  startGregorianDate?: Date
): CalendarDay[] {
  // If startGregorianDate is not provided, estimate based on March Equinox of the corresponding solar year
  // Standard anchor epoch: Sacred Year 6050 corresponds to Gregorian 2026 CE.
  const gregorianYear = calendarYear - 4024; // e.g. 6050 -> 2026 CE
  const lunarAnchor = calculateLunarAnchor(gregorianYear, anchorMode);

  const dayZeroGregorian = startGregorianDate || lunarAnchor.timestamp;

  const days: CalendarDay[] = [];

  // 1. Day Zero (Annual Sabbath)
  const dayZeroObj = createDayZero(calendarYear, anchorMode, gregorianYear, dayZeroGregorian);
  days.push(dayZeroObj);

  // Unbroken 7-day week count.
  // Day Zero itself is an Annual Sabbath, then Day 1 begins week cycle.
  let currentGregorianTime = new Date(dayZeroGregorian.getTime() + 86400 * 1000);
  let globalWeekDay = 1; // Day 1 of week (1..7)

  // 2. Generate 364 Numbered Days (13 Months x 28 Days)
  let dayOfYear = 1;
  for (let month = 1; month <= 13; month++) {
    for (let dayOfMonth = 1; dayOfMonth <= 28; dayOfMonth++) {
      const weekOfYear = Math.ceil(dayOfYear / 7);
      const dayOfWeek = ((dayOfYear - 1) % 7) + 1; // 1 to 7
      const isWeeklySabbath = dayOfWeek === 7;
      const sabbathType = getSabbathType(false, isWeeklySabbath);

      const calendarDay: CalendarDay = {
        kind: 'NUMBERED_DAY',
        calendarYear,
        dayOfYear,
        month,
        dayOfMonth,
        weekOfYear,
        dayOfWeek,
        isWeeklySabbath,
        sabbathType,
        gregorianDate: new Date(currentGregorianTime),
      };

      days.push(calendarDay);

      // Increment day counters
      dayOfYear++;
      globalWeekDay = (globalWeekDay % 7) + 1;
      currentGregorianTime = new Date(currentGregorianTime.getTime() + 86400 * 1000);
    }
  }

  return days;
}

/**
 * Converts a Gregorian solar date to the corresponding Sacred CalendarDay.
 */
export function solarDateToSacredDate(
  gregorianDate: Date,
  anchorMode: LunarAnchorMode = 'CONJUNCTION'
): CalendarDay {
  const targetYear = gregorianDate.getFullYear();
  const lunarAnchor = calculateLunarAnchor(targetYear, anchorMode);

  // Day Zero starts on the lunar anchor date
  const dayZeroDate = new Date(lunarAnchor.timestamp);
  dayZeroDate.setHours(0, 0, 0, 0);

  const checkDate = new Date(gregorianDate);
  checkDate.setHours(0, 0, 0, 0);

  // Determine Sacred Year based on offset from Day Zero
  let sacredYear = targetYear + 4024;
  let activeDayZeroDate = dayZeroDate;

  if (checkDate < dayZeroDate) {
    // Before this year's Day Zero -> part of previous sacred year
    const prevAnchor = calculateLunarAnchor(targetYear - 1, anchorMode);
    activeDayZeroDate = new Date(prevAnchor.timestamp);
    activeDayZeroDate.setHours(0, 0, 0, 0);
    sacredYear = targetYear - 1 + 4024;
  }

  const diffTime = checkDate.getTime() - activeDayZeroDate.getTime();
  const diffDays = Math.round(diffTime / (86400 * 1000));

  if (diffDays === 0) {
    return createDayZero(sacredYear, anchorMode, targetYear, activeDayZeroDate);
  }

  if (diffDays > 0 && diffDays <= 364) {
    const dayOfYear = diffDays;
    const month = Math.ceil(dayOfYear / 28);
    const dayOfMonth = ((dayOfYear - 1) % 28) + 1;
    const weekOfYear = Math.ceil(dayOfYear / 7);
    const dayOfWeek = ((dayOfYear - 1) % 7) + 1;
    const isWeeklySabbath = dayOfWeek === 7;
    const sabbathType = getSabbathType(false, isWeeklySabbath);

    return {
      kind: 'NUMBERED_DAY',
      calendarYear: sacredYear,
      dayOfYear,
      month,
      dayOfMonth,
      weekOfYear,
      dayOfWeek,
      isWeeklySabbath,
      sabbathType,
      gregorianDate: new Date(gregorianDate),
    };
  }

  // Days beyond 364 -> Next sacred year Day Zero threshold
  const nextSacredYearDays = generateSacredYearDays(sacredYear, anchorMode, activeDayZeroDate);
  if (diffDays < nextSacredYearDays.length) {
    return nextSacredYearDays[diffDays];
  }

  return nextSacredYearDays[0];
}

/**
 * Converts a Sacred Date specification to a Gregorian Date.
 */
export function sacredDateToSolarDate(
  sacredYear: number,
  month: number, // 0 for Day Zero, 1..13 for numbered days
  dayOfMonth: number, // 0 for Day Zero, 1..28 for numbered days
  anchorMode: LunarAnchorMode = 'CONJUNCTION'
): Date {
  const gregorianYear = sacredYear - 4024;
  const lunarAnchor = calculateLunarAnchor(gregorianYear, anchorMode);
  const dayZeroDate = new Date(lunarAnchor.timestamp);
  dayZeroDate.setHours(0, 0, 0, 0);

  if (month === 0 || dayOfMonth === 0) {
    return dayZeroDate;
  }

  const dayOfYear = (month - 1) * 28 + dayOfMonth;
  const resultDate = new Date(dayZeroDate.getTime() + dayOfYear * 86400 * 1000);
  return resultDate;
}
