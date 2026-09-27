/**
 * @file src/calendar/sabbath.ts
 * Unbroken 7-day Sabbath cycle calculation and Sabbath taxonomy.
 */

import { SabbathType } from '../types/calendar';

/**
 * Checks if a given day-of-week (1 to 7) is the weekly Sabbath.
 * Day 7 is always the weekly Sabbath.
 */
export function isWeeklySabbath(dayOfWeek: number): boolean {
  return dayOfWeek === 7;
}

/**
 * Determines the combined Sabbath status for a day.
 */
export function getSabbathType(isDayZero: boolean, isWeeklySabbathDay: boolean): SabbathType {
  if (isDayZero && isWeeklySabbathDay) {
    return 'BOTH';
  }
  if (isDayZero) {
    return 'ANNUAL_SABBATH';
  }
  if (isWeeklySabbathDay) {
    return 'WEEKLY_SABBATH';
  }
  return 'NONE';
}

import { Language, TRANSLATIONS } from '../i18n/translations';

/**
 * Gets a human-readable Sabbath description taking language into account.
 */
export function getSabbathBadgeLabel(sabbathType: SabbathType, language: Language = 'en'): { text: string; bgClass: string; textClass: string } {
  const b = TRANSLATIONS[language].badges;
  switch (sabbathType) {
    case 'BOTH':
      return { text: b.grandSabbath, bgClass: 'bg-amber-500/20 border-amber-500/50', textClass: 'text-amber-300' };
    case 'ANNUAL_SABBATH':
      return { text: b.annualSabbath, bgClass: 'bg-purple-500/20 border-purple-500/50', textClass: 'text-purple-300' };
    case 'WEEKLY_SABBATH':
      return { text: b.weeklySabbath, bgClass: 'bg-yellow-500/20 border-yellow-500/50', textClass: 'text-yellow-300' };
    case 'NONE':
    default:
      return { text: b.workDay, bgClass: 'bg-slate-800/40 border-slate-700/50', textClass: 'text-slate-200' };
  }
}
