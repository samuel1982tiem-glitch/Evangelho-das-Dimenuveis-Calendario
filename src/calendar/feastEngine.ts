/**
 * @file src/calendar/feastEngine.ts
 * Engine for calculating Biblical Appointed Times, Gregorian/Julian conversions,
 * multi-day feast spans, Sabbath/Feast overlaps, and active/upcoming status.
 */

import { CalendarDay, FeastCalendarModel, LunarAnchorMode } from '../types/calendar';
import {
  CalculatedFeastOccurrence,
  DoubleObservanceInfo,
  DayObservance
} from '../types/feasts';
import { getLocalizedBiblicalFeasts } from '../data/biblicalFeasts';
import { sacredDateToSolarDate } from './sacredCalendar';
import { getLunarPhaseInfo } from '../astronomy/moon';
import { Language } from '../i18n/translations';

/**
 * Calculates Julian Day Number from a JavaScript Date object.
 */
export function getJulianDayNumber(date: Date): number {
  const time = date.getTime();
  return time / 86400000 + 2440587.5;
}

/**
 * Calculates all primary Biblical feast occurrences for a given Sacred Year.
 */
export function calculateFeastOccurrences(
  sacredYear: number,
  lunarAnchorMode: LunarAnchorMode = 'CONJUNCTION',
  feastModel: FeastCalendarModel = 'BIBLICAL_LUNAR',
  currentDate: Date = new Date(),
  language: Language = 'en'
): CalculatedFeastOccurrence[] {
  const feasts = getLocalizedBiblicalFeasts(language);
  return feasts.map((feast) => {
    // 1. Calculate sacred start date & sacred end date
    const startMonth = feast.sacredMonth;
    const startDay = feast.sacredDay;

    let endMonth = startMonth;
    let endDay = startDay + feast.durationDays - 1;

    // Handle month wrap-around if duration spills into next month
    if (endDay > 28) {
      endMonth = startMonth + Math.floor((endDay - 1) / 28);
      endDay = ((endDay - 1) % 28) + 1;
    }

    // 2. Convert sacred date to Gregorian Date
    const gregorianStartDate = sacredDateToSolarDate(sacredYear, startMonth, startDay, lunarAnchorMode);
    const gregorianEndDate = sacredDateToSolarDate(sacredYear, endMonth, endDay, lunarAnchorMode);

    // Add end-of-day offset to end date
    gregorianEndDate.setHours(23, 59, 59, 999);

    // 3. Julian Day Numbers
    const julianDayStartNumber = Math.floor(getJulianDayNumber(gregorianStartDate));
    const julianDayEndNumber = Math.floor(getJulianDayNumber(gregorianEndDate));

    // 4. Lunar Phase Context at Start
    const lunarInfoStart = getLunarPhaseInfo(gregorianStartDate);

    // 5. Active & Upcoming Status Calculation
    const curTime = currentDate.getTime();
    const startTime = gregorianStartDate.getTime();
    const endTime = gregorianEndDate.getTime();

    const isActiveToday = curTime >= startTime && curTime <= endTime;

    let activeDayIndex: number | undefined;
    if (isActiveToday) {
      const msDiff = curTime - startTime;
      activeDayIndex = Math.floor(msDiff / (86400 * 1000)) + 1;
      if (activeDayIndex < 1) activeDayIndex = 1;
      if (activeDayIndex > feast.durationDays) activeDayIndex = feast.durationDays;
    }

    const isUpcoming = curTime < startTime;
    let daysUntilStart: number | undefined;
    if (isUpcoming) {
      daysUntilStart = Math.ceil((startTime - curTime) / (86400 * 1000));
    }

    return {
      feast,
      sacredYear,
      startSacredMonth: startMonth,
      startSacredDay: startDay,
      endSacredMonth: endMonth,
      endSacredDay: endDay,
      gregorianStartDate,
      gregorianEndDate,
      julianDayStartNumber,
      julianDayEndNumber,
      durationDays: feast.durationDays,
      isActiveToday,
      activeDayIndex,
      isUpcoming,
      daysUntilStart,
      lunarPhaseAtStart: lunarInfoStart.phaseName,
      lunarIlluminationAtStart: lunarInfoStart.fraction,
    };
  });
}

// Cache yearly feast occurrences by (sacredYear, lunarAnchorMode, feastModel, language) for fast 364-day grid lookups
const yearlyFeastLookupCache = new Map<string, CalculatedFeastOccurrence[]>();

/**
 * Checks if a specific day falls within any active feast occurrence.
 */
export function getFeastOccurrenceForDay(
  day: CalendarDay,
  lunarAnchorMode: LunarAnchorMode = 'CONJUNCTION',
  feastModel: FeastCalendarModel = 'BIBLICAL_LUNAR',
  language: Language = 'en'
): { occurrence: CalculatedFeastOccurrence; dayIndexInFeast: number } | null {
  if (day.kind === 'DAY_ZERO') return null;

  const month = (day as any).month;
  const dayOfMonth = (day as any).dayOfMonth;

  const cacheKey = `${day.calendarYear}:${lunarAnchorMode}:${feastModel}:${language}`;
  let occurrences = yearlyFeastLookupCache.get(cacheKey);
  if (!occurrences) {
    occurrences = calculateFeastOccurrences(
      day.calendarYear,
      lunarAnchorMode,
      feastModel,
      day.gregorianDate,
      language
    );
    yearlyFeastLookupCache.set(cacheKey, occurrences);
  }

  for (const occ of occurrences) {
    // Check single-month span
    if (occ.startSacredMonth === occ.endSacredMonth) {
      if (
        month === occ.startSacredMonth &&
        dayOfMonth >= occ.startSacredDay &&
        dayOfMonth <= occ.endSacredDay
      ) {
        const dayIndexInFeast = dayOfMonth - occ.startSacredDay + 1;
        return { occurrence: occ, dayIndexInFeast };
      }
    } else {
      // Multi-month span
      if (
        (month === occ.startSacredMonth && dayOfMonth >= occ.startSacredDay) ||
        (month === occ.endSacredMonth && dayOfMonth <= occ.endSacredDay)
      ) {
        let dayIndexInFeast = 1;
        if (month === occ.startSacredMonth) {
          dayIndexInFeast = dayOfMonth - occ.startSacredDay + 1;
        } else {
          dayIndexInFeast = (28 - occ.startSacredDay + 1) + dayOfMonth;
        }
        return { occurrence: occ, dayIndexInFeast };
      }
    }
  }

  return null;
}

/**
 * Returns complete double-observance info for a given day (Weekly Sabbath + Feast Day).
 */
export function getObservancesForDay(
  day: CalendarDay,
  lunarAnchorMode: LunarAnchorMode = 'CONJUNCTION',
  feastModel: FeastCalendarModel = 'BIBLICAL_LUNAR',
  language: Language = 'en'
): DoubleObservanceInfo {
  const observances: DayObservance[] = [];

  // Check 1: Day Zero vs Weekly Sabbath
  if (day.kind === 'DAY_ZERO') {
    observances.push({
      type: 'ANNUAL_SABBATH',
      label: language === 'pt' ? 'SÁBADO DO ANO NOVO ANUAL' : 'ANNUAL NEW YEAR SABBATH',
    });
    if (day.sabbathType === 'BOTH') {
      observances.push({
        type: 'WEEKLY_SABBATH',
        label: language === 'pt' ? 'SÁBADO SEMANAL (7º Dia)' : 'WEEKLY SABBATH (7th Day)',
      });
    }
    return {
      isDoubleObservance: observances.length > 1,
      observances,
    };
  }

  // Check 2: Weekly Sabbath
  if (day.isWeeklySabbath) {
    observances.push({
      type: 'WEEKLY_SABBATH',
      label: language === 'pt' ? 'SÁBADO SEMANAL (7º Dia)' : 'WEEKLY SABBATH (7th Day)',
    });
  }

  // Check 3: Biblical Feast Occurrence
  const feastMatch = getFeastOccurrenceForDay(day, lunarAnchorMode, feastModel, language);
  if (feastMatch) {
    const { occurrence, dayIndexInFeast } = feastMatch;
    const f = occurrence.feast;

    let obsType: DayObservance['type'] = 'FEAST_DAY';
    if (f.category === 'SOLEMN_ASSEMBLY') obsType = 'SOLEMN_ASSEMBLY';
    if (f.category === 'FAST') obsType = 'FAST_DAY';

    const dayWord = language === 'pt' ? 'Dia' : 'Day';
    const ofWord = language === 'pt' ? 'de' : 'of';
    const dayText = f.durationDays > 1 ? ` (${dayWord} ${dayIndexInFeast} ${ofWord} ${f.durationDays})` : '';

    observances.push({
      type: obsType,
      label: `${f.name}${dayText}`,
      feastId: f.id,
      feastName: f.name,
      dayOfFeast: f.durationDays > 1 ? `${dayWord} ${dayIndexInFeast} ${ofWord} ${f.durationDays}` : undefined,
    });
  }

  return {
    isDoubleObservance: observances.length > 1,
    observances,
  };
}

/**
 * Gets currently active feast OR next upcoming feast with countdown info for TODAY dashboard.
 */
export function getCurrentOrNextFeast(
  currentDate: Date = new Date(),
  lunarAnchorMode: LunarAnchorMode = 'CONJUNCTION',
  feastModel: FeastCalendarModel = 'BIBLICAL_LUNAR',
  language: Language = 'en'
): { activeFeast: CalculatedFeastOccurrence | null; nextFeast: CalculatedFeastOccurrence | null } {
  const sacredYear = currentDate.getFullYear() + 4024;
  const occurrences = calculateFeastOccurrences(sacredYear, lunarAnchorMode, feastModel, currentDate, language);

  const activeFeast = occurrences.find((o) => o.isActiveToday) || null;

  let upcoming = occurrences.filter((o) => o.isUpcoming).sort((a, b) => a.gregorianStartDate.getTime() - b.gregorianStartDate.getTime());

  if (upcoming.length === 0) {
    const nextYearOccurrences = calculateFeastOccurrences(sacredYear + 1, lunarAnchorMode, feastModel, currentDate, language);
    upcoming = nextYearOccurrences.filter((o) => o.isUpcoming).sort((a, b) => a.gregorianStartDate.getTime() - b.gregorianStartDate.getTime());
  }

  const nextFeast = upcoming.length > 0 ? upcoming[0] : null;

  return {
    activeFeast,
    nextFeast,
  };
}
