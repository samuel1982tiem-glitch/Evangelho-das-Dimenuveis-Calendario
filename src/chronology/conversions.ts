/**
 * @file src/chronology/conversions.ts
 * Mathematical drift analysis between 364-day sacred calendar, 365.2422 solar year, and 354.36 lunar year.
 */

import { Language } from '../i18n/translations';

export interface CalendarDriftAnalysis {
  sacredYearDays: number;
  solarYearDays: number;
  lunarYearDays: number;
  sacredToSolarAnnualDriftDays: number;
  sacredToLunarAnnualDifferenceDays: number;
  driftIn100YearsDays: number;
  driftIn1000YearsDays: number;
  explanation: string;
}

export function calculateCalendarDrift(language: Language = 'en'): CalendarDriftAnalysis {
  const sacredYearDays = 364;
  const solarYearDays = 365.24219;
  const lunarYearDays = 12 * 29.53058867;

  const sacredToSolarAnnualDriftDays = sacredYearDays - solarYearDays;
  const sacredToLunarAnnualDifferenceDays = sacredYearDays - lunarYearDays;

  return {
    sacredYearDays: 364,
    solarYearDays,
    lunarYearDays,
    sacredToSolarAnnualDriftDays: Math.round(sacredToSolarAnnualDriftDays * 100000) / 100000,
    sacredToLunarAnnualDifferenceDays: Math.round(sacredToLunarAnnualDifferenceDays * 100000) / 100000,
    driftIn100YearsDays: Math.round(sacredToSolarAnnualDriftDays * 100 * 10) / 10,
    driftIn1000YearsDays: Math.round(sacredToSolarAnnualDriftDays * 1000 * 10) / 10,
    explanation:
      language === 'pt'
        ? 'O Calendário Sagrado mantém um ano estrutural perfeito de 364 dias (52 semanas exatas de 7 dias). Como o ano solar tropical tem ~365,2422 dias, o ciclo de 364 dias desloca-se em ~1,24 dias em relação às estações solares anualmente, sendo ancorado anualmente pelo limiar de conjunção lunar da primavera no Dia Zero.'
        : 'The Sacred Calendar maintains a perfect 364-day structural year (52 exact 7-day weeks). Because the tropical solar year is ~365.2422 days, the 364-day cycle shifts by ~1.24 days relative to solar seasons annually unless anchored by the annual Day Zero spring lunar conjunction threshold.',
  };
}
