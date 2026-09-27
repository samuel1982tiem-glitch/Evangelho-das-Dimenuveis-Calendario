/**
 * @file src/chronology/chronologyEngine.ts
 * Mathematical conversion engine between BCE/CE years without Year Zero.
 * Rule 13: 1 BCE -> 1 CE (no Year 0).
 */

import { getChronologyModelById } from './models';
import { MillennialPosition } from '../types/calendar';
import { Language } from '../i18n/translations';

/**
 * Converts a BCE year (e.g. 4004) to astronomical integer year (-4003).
 */
export function bceToAstronomicalYear(bceYear: number): number {
  if (bceYear <= 0) {
    throw new Error('BCE year must be a positive integer.');
  }
  return -(bceYear - 1);
}

/**
 * Converts an astronomical integer year (-4003 or 2026) to human BCE/CE label string.
 */
export function formatAstronomicalYear(astroYear: number, language: Language = 'en'): string {
  if (astroYear > 0) {
    return `${astroYear} ${language === 'pt' ? 'd.C.' : 'CE'}`;
  }
  const bce = Math.abs(astroYear) + 1;
  return `${bce} ${language === 'pt' ? 'a.C.' : 'BCE'}`;
}

/**
 * Calculates total elapsed solar years between a Creation BCE epoch and a target CE/BCE year.
 */
export function calculateElapsedYears(creationBCE: number, targetGregorianYear: number): number {
  if (targetGregorianYear > 0) {
    return creationBCE + targetGregorianYear - 1;
  }
  const targetBCE = Math.abs(targetGregorianYear) + 1;
  return creationBCE - targetBCE;
}

/**
 * Calculates the exact CE year for a given 1,000-year boundary given a Creation BCE epoch.
 */
export function calculateBoundaryCEYear(creationBCE: number, boundaryYearNumber: number): number {
  const elapsed = boundaryYearNumber;
  const ceYear = elapsed - creationBCE + 1;
  return ceYear;
}

/**
 * Calculates Millennial Position (The Great Week) for a given Gregorian year and Chronology model.
 */
export function calculateMillennialPosition(
  gregorianYear: number,
  modelId = 'ussher',
  joshuaAdjustmentDays = 0,
  language: Language = 'en'
): MillennialPosition {
  const model = getChronologyModelById(modelId, language);
  const creationBCE = model.creationEpochBCE;

  const elapsedSolarYears = calculateElapsedYears(creationBCE, gregorianYear);

  if (joshuaAdjustmentDays > 0) {
    // +1 day historical shift tracked in chronology engine
  }

  let millenniumNumber: MillennialPosition['millenniumNumber'] = 1;
  if (elapsedSolarYears <= 1000) millenniumNumber = 1;
  else if (elapsedSolarYears <= 2000) millenniumNumber = 2;
  else if (elapsedSolarYears <= 3000) millenniumNumber = 3;
  else if (elapsedSolarYears <= 4000) millenniumNumber = 4;
  else if (elapsedSolarYears <= 5000) millenniumNumber = 5;
  else if (elapsedSolarYears <= 6000) millenniumNumber = 6;
  else if (elapsedSolarYears <= 7000) millenniumNumber = 7;
  else millenniumNumber = 8;

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const prefix = language === 'pt' ? 'Milênio' : 'Millennium';
  const millenniumName = `${prefix} ${romanNumerals[millenniumNumber - 1]}`;

  const yearOfMillennium = ((elapsedSolarYears - 1) % 1000) + 1;
  const isMillennialSabbath = millenniumNumber === 7;

  const boundary6000CEYear = calculateBoundaryCEYear(creationBCE, 6000);
  const boundary7000CEYear = calculateBoundaryCEYear(creationBCE, 7000);

  const yearsUntil6000Boundary = 6000 - elapsedSolarYears;
  const yearsUntil7000Boundary = 7000 - elapsedSolarYears;

  return {
    creationEpochBCE: creationBCE,
    currentAstronomicalYear: gregorianYear,
    elapsedSolarYears,
    millenniumNumber,
    millenniumName,
    yearOfMillennium,
    isMillennialSabbath,
    yearsUntil6000Boundary,
    yearsUntil7000Boundary,
    boundary6000CEYear,
    boundary7000CEYear,
  };
}
