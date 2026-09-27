/**
 * @file src/calendar/months.ts
 * Neutral 13-month system with configurable canonical naming and bilingual localization.
 */

import { Language } from '../i18n/translations';

export interface MonthMeta {
  monthNumber: number; // 1 to 13
  defaultName: string; // "Month I", "Month II", etc.
  hebrewSeason: string; // Spring, Summer, Autumn, Winter
  daysInMonth: 28;
}

export const MONTH_ROMAN_NUMERALS = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII',
  'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'
];

export const DEFAULT_MONTH_METADATA: MonthMeta[] = MONTH_ROMAN_NUMERALS.map((roman, idx) => {
  const mNum = idx + 1;
  let season = 'Spring';
  if (mNum >= 4 && mNum <= 6) season = 'Summer';
  else if (mNum >= 7 && mNum <= 9) season = 'Autumn';
  else if (mNum >= 10 && mNum <= 13) season = 'Winter';

  return {
    monthNumber: mNum,
    defaultName: `Month ${roman}`,
    hebrewSeason: season,
    daysInMonth: 28,
  };
});

/**
 * Gets formatted month name taking custom names and active language into account.
 * Automatically translates default "Month I..XIII" <-> "Mês I..XIII" based on active language.
 */
export function getMonthDisplayTitle(monthNumber: number, customNames?: string[], language: Language = 'en'): string {
  const roman = MONTH_ROMAN_NUMERALS[monthNumber - 1] || String(monthNumber);
  const defaultEn = `Month ${roman}`;
  const defaultPt = `Mês ${roman}`;

  if (customNames && customNames[monthNumber - 1]) {
    const trimmed = customNames[monthNumber - 1].trim();
    if (trimmed.length > 0 && trimmed !== defaultEn && trimmed !== defaultPt) {
      return trimmed;
    }
  }

  return language === 'pt' ? defaultPt : defaultEn;
}
