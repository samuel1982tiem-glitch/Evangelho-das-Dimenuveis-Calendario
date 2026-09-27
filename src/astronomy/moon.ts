/**
 * @file src/astronomy/moon.ts
 * High-precision astronomical lunar calculations for phase, age, illumination,
 * and lunar anchoring (conjunction & first visible crescent) with bilingual metadata.
 */

import * as SunCalc from 'suncalc';
import { LunarAnchor, LunarAnchorMode, LunarPhaseInfo } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';

export function getLocalizedPhaseName(phaseName: string, language: Language = 'en'): string {
  const dict = TRANSLATIONS[language].phaseNames;
  return (dict as any)[phaseName] || phaseName;
}

// Mean synodic month duration in days
export const LUNAR_SYNODIC_MONTH = 29.53058867;

export type MajorLunarCategory = 'New' | 'Waxing' | 'Full' | 'Waning';

export function getLocalizedCategoryLabel(category: MajorLunarCategory, language: Language = 'en'): string {
  if (language === 'pt') {
    switch (category) {
      case 'New':
        return 'NOVA';
      case 'Waxing':
        return 'CRESCENTE';
      case 'Full':
        return 'CHEIA';
      case 'Waning':
        return 'MINGUANTE';
    }
  }
  return category.toUpperCase();
}

export interface DefinedLunarPhaseMeta {
  phaseName: LunarPhaseInfo['phaseName'];
  category: MajorLunarCategory;
  ageDaysRange: string;
  ageDaysRangePt: string;
  approxAgeStartDays: number;
  approxAgeEndDays: number;
  typicalFraction: number;
  description: string;
  descriptionPt: string;
  symbol: string;
}

export const EIGHT_LUNAR_PHASES_META: DefinedLunarPhaseMeta[] = [
  {
    phaseName: 'New Moon',
    category: 'New',
    ageDaysRange: '0.0 – 1.8 days',
    ageDaysRangePt: '0,0 – 1,8 dias',
    approxAgeStartDays: 0,
    approxAgeEndDays: 1.8,
    typicalFraction: 0.0,
    description: 'Conjunction threshold. The Moon is between Earth and Sun; dark disc against celestial sky.',
    descriptionPt: 'Limiar de conjunção. A Lua está entre a Terra e o Sol; disco escuro contra o céu celestial.',
    symbol: '🌑',
  },
  {
    phaseName: 'Waxing Crescent',
    category: 'Waxing',
    ageDaysRange: '1.8 – 6.8 days',
    ageDaysRangePt: '1,8 – 6,8 dias',
    approxAgeStartDays: 1.8,
    approxAgeEndDays: 6.8,
    typicalFraction: 0.22,
    description: 'First visible silver crescent emerging in western twilight sky after sunset.',
    descriptionPt: 'Primeiro crescente prateado visível emergindo no céu crepuscular ocidental após o pôr do sol.',
    symbol: '🌒',
  },
  {
    phaseName: 'First Quarter',
    category: 'Waxing',
    ageDaysRange: '6.8 – 8.0 days',
    ageDaysRangePt: '6,8 – 8,0 dias',
    approxAgeStartDays: 6.8,
    approxAgeEndDays: 8.0,
    typicalFraction: 0.50,
    description: 'Right half illuminated (50%). Moon reaches 90° angular separation from Sun.',
    descriptionPt: 'Metade direita iluminada (50%). A Lua atinge 90° de separação angular do Sol.',
    symbol: '🌓',
  },
  {
    phaseName: 'Waxing Gibbous',
    category: 'Waxing',
    ageDaysRange: '8.0 – 13.8 days',
    ageDaysRangePt: '8,0 – 13,8 dias',
    approxAgeStartDays: 8.0,
    approxAgeEndDays: 13.8,
    typicalFraction: 0.78,
    description: 'More than half illuminated on right side, swelling toward full illumination.',
    descriptionPt: 'Mais da metade iluminada no lado direito, expandindo-se em direção à iluminação total.',
    symbol: '🌔',
  },
  {
    phaseName: 'Full Moon',
    category: 'Full',
    ageDaysRange: '13.8 – 15.8 days',
    ageDaysRangePt: '13,8 – 15,8 dias',
    approxAgeStartDays: 13.8,
    approxAgeEndDays: 15.8,
    typicalFraction: 1.0,
    description: '100% illuminated face. Moon is opposite the Sun (180° elongation); rises at sunset.',
    descriptionPt: 'Face 100% iluminada. A Lua está oposta ao Sol (elongação de 180°); nasce ao pôr do sol.',
    symbol: '🌕',
  },
  {
    phaseName: 'Waning Gibbous',
    category: 'Waning',
    ageDaysRange: '15.8 – 21.8 days',
    ageDaysRangePt: '15,8 – 21,8 dias',
    approxAgeStartDays: 15.8,
    approxAgeEndDays: 21.8,
    typicalFraction: 0.78,
    description: 'Illumination decreasing; light remains on the left face after full moon.',
    descriptionPt: 'Iluminação diminuindo; a luz permanece na face esquerda após a lua cheia.',
    symbol: '🌖',
  },
  {
    phaseName: 'Last Quarter',
    category: 'Waning',
    ageDaysRange: '21.8 – 23.0 days',
    ageDaysRangePt: '21,8 – 23,0 dias',
    approxAgeStartDays: 21.8,
    approxAgeEndDays: 23.0,
    typicalFraction: 0.50,
    description: 'Left half illuminated (50%). Moon reaches 270° angular separation from Sun.',
    descriptionPt: 'Metade esquerda iluminada (50%). A Lua atinge 270° de separação angular do Sol.',
    symbol: '🌗',
  },
  {
    phaseName: 'Waning Crescent',
    category: 'Waning',
    ageDaysRange: '23.0 – 29.5 days',
    ageDaysRangePt: '23,0 – 29,5 dias',
    approxAgeStartDays: 23.0,
    approxAgeEndDays: 29.5,
    typicalFraction: 0.22,
    description: 'Diminishing crescent on left edge, visible in pre-dawn eastern sky before morning.',
    descriptionPt: 'Crescente diminuindo na borda esquerda, visível no céu oriental antes do amanhecer.',
    symbol: '🌘',
  },
];

export function getPhaseCategory(phaseName: string): MajorLunarCategory {
  if (phaseName === 'New Moon') return 'New';
  if (phaseName === 'Full Moon') return 'Full';
  if (phaseName.includes('Waxing') || phaseName === 'First Quarter') return 'Waxing';
  return 'Waning';
}

// Module-level caches to prevent redundant astronomical calculations across 365-day grids
const springNewMoonCache = new Map<number, number>();
const lunarAnchorCache = new Map<string, LunarAnchor>();
const lunarPhaseCache = new Map<number, LunarPhaseInfo>();

/**
 * Calculates detailed lunar phase info for a given Date.
 */
export function getLunarPhaseInfo(date: Date): LunarPhaseInfo {
  // Round to nearest minute (60,000 ms) for high-hit-rate caching across calendar renders
  const timeKey = Math.floor(date.getTime() / 60000);
  const cached = lunarPhaseCache.get(timeKey);
  if (cached) {
    return cached;
  }

  const moonIllum = SunCalc.getMoonIllumination(date);
  const fraction = Math.round(moonIllum.fraction * 1000) / 1000;
  const phaseValue = moonIllum.phase;
  const angleDeg = phaseValue * 360;
  const ageDays = Math.round(phaseValue * LUNAR_SYNODIC_MONTH * 10) / 10;

  let phaseName: LunarPhaseInfo['phaseName'];
  if (phaseValue < 0.03 || phaseValue > 0.97) {
    phaseName = 'New Moon';
  } else if (phaseValue < 0.22) {
    phaseName = 'Waxing Crescent';
  } else if (phaseValue < 0.28) {
    phaseName = 'First Quarter';
  } else if (phaseValue < 0.47) {
    phaseName = 'Waxing Gibbous';
  } else if (phaseValue < 0.53) {
    phaseName = 'Full Moon';
  } else if (phaseValue < 0.72) {
    phaseName = 'Waning Gibbous';
  } else if (phaseValue < 0.78) {
    phaseName = 'Last Quarter';
  } else {
    phaseName = 'Waning Crescent';
  }

  const nextPhase = getNextPhaseInfo(date, phaseValue);
  const prevPhase = getPrevPhaseInfo(date, phaseValue);

  const epoch2000NewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const daysSinceEpoch = (date.getTime() - epoch2000NewMoon) / (86400 * 1000);
  const lunationNumber = Math.floor(daysSinceEpoch / LUNAR_SYNODIC_MONTH) + 953;

  const result: LunarPhaseInfo = {
    phaseName,
    phaseAngle: Math.round(angleDeg),
    fraction,
    ageDays,
    lunationNumber,
    nextPhaseName: nextPhase.name,
    nextPhaseDate: nextPhase.date,
    prevPhaseName: prevPhase.name,
    prevPhaseDate: prevPhase.date,
    isApproximate: false,
  };

  if (lunarPhaseCache.size > 2000) {
    lunarPhaseCache.clear();
  }
  lunarPhaseCache.set(timeKey, result);

  return result;
}

function getNextPhaseInfo(date: Date, currentPhaseValue: number): { name: string; date: Date } {
  const keyPhases = [
    { value: 0.0, name: 'New Moon' },
    { value: 0.25, name: 'First Quarter' },
    { value: 0.5, name: 'Full Moon' },
    { value: 0.75, name: 'Last Quarter' },
    { value: 1.0, name: 'New Moon' },
  ];

  let nextTarget = keyPhases.find((p) => p.value > currentPhaseValue + 0.02);
  if (!nextTarget) {
    nextTarget = { value: 1.0, name: 'New Moon' };
  }

  const phaseDiff = nextTarget.value - currentPhaseValue;
  const daysOffset = phaseDiff * LUNAR_SYNODIC_MONTH;
  const nextDate = new Date(date.getTime() + daysOffset * 86400 * 1000);

  return { name: nextTarget.name, date: nextDate };
}

function getPrevPhaseInfo(date: Date, currentPhaseValue: number): { name: string; date: Date } {
  const keyPhases = [
    { value: 0.0, name: 'New Moon' },
    { value: 0.25, name: 'First Quarter' },
    { value: 0.5, name: 'Full Moon' },
    { value: 0.75, name: 'Last Quarter' },
  ];

  const revKeyPhases = [...keyPhases].reverse();
  let prevTarget = revKeyPhases.find((p) => p.value < currentPhaseValue - 0.02);
  if (!prevTarget) {
    prevTarget = { value: 0.75, name: 'Last Quarter' };
  }

  let phaseDiff = currentPhaseValue - prevTarget.value;
  if (phaseDiff < 0) phaseDiff += 1.0;

  const daysOffset = phaseDiff * LUNAR_SYNODIC_MONTH;
  const prevDate = new Date(date.getTime() - daysOffset * 86400 * 1000);

  return { name: prevTarget.name, date: prevDate };
}

export function getSpringNewMoon(gregorianYear: number): Date {
  const cachedTime = springNewMoonCache.get(gregorianYear);
  if (cachedTime !== undefined) {
    return new Date(cachedTime);
  }

  const equinoxApprox = new Date(Date.UTC(gregorianYear, 2, 20, 12, 0, 0));
  let bestDate = equinoxApprox;
  let minPhase = 1.0;

  const startTime = new Date(Date.UTC(gregorianYear, 2, 5)).getTime();
  const endTime = new Date(Date.UTC(gregorianYear, 3, 20)).getTime();

  for (let t = startTime; t <= endTime; t += 3600 * 1000 * 4) {
    const d = new Date(t);
    const phase = SunCalc.getMoonIllumination(d).phase;
    const distToNew = Math.min(phase, 1 - phase);
    if (distToNew < minPhase) {
      minPhase = distToNew;
      bestDate = d;
    }
  }

  let exactBest = bestDate;
  let minExactPhase = minPhase;
  const centerT = bestDate.getTime();
  for (let t = centerT - 6 * 3600 * 1000; t <= centerT + 6 * 3600 * 1000; t += 15 * 60 * 1000) {
    const d = new Date(t);
    const phase = SunCalc.getMoonIllumination(d).phase;
    const dist = Math.min(phase, 1 - phase);
    if (dist < minExactPhase) {
      minExactPhase = dist;
      exactBest = d;
    }
  }

  springNewMoonCache.set(gregorianYear, exactBest.getTime());
  return new Date(exactBest.getTime());
}

export function calculateLunarAnchor(gregorianYear: number, mode: LunarAnchorMode): LunarAnchor {
  const cacheKey = `${gregorianYear}:${mode}`;
  const cached = lunarAnchorCache.get(cacheKey);
  if (cached) {
    return {
      ...cached,
      timestamp: new Date(cached.timestamp.getTime()),
      conjunctionDate: new Date(cached.conjunctionDate.getTime()),
      visibleCrescentDate: new Date(cached.visibleCrescentDate.getTime()),
    };
  }

  const conjunction = getSpringNewMoon(gregorianYear);
  const visibleCrescent = new Date(conjunction.getTime() + 1.5 * 86400 * 1000);

  let anchorTimestamp = conjunction;
  if (mode === 'VISIBLE_CRESCENT') {
    anchorTimestamp = visibleCrescent;
  } else if (mode === 'OBSERVATIONAL') {
    anchorTimestamp = new Date(conjunction.getTime() + 1.8 * 86400 * 1000);
  }

  const phaseInfo = getLunarPhaseInfo(anchorTimestamp);

  const result: LunarAnchor = {
    mode,
    timestamp: anchorTimestamp,
    conjunctionDate: conjunction,
    visibleCrescentDate: visibleCrescent,
    phaseName: phaseInfo.phaseName,
    illumination: phaseInfo.fraction,
    lunationNumber: phaseInfo.lunationNumber,
  };

  lunarAnchorCache.set(cacheKey, result);
  return {
    ...result,
    timestamp: new Date(result.timestamp.getTime()),
    conjunctionDate: new Date(result.conjunctionDate.getTime()),
    visibleCrescentDate: new Date(result.visibleCrescentDate.getTime()),
  };
}
