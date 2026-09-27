/**
 * @file src/astronomy/seasons.ts
 * Astronomical Equinoxes and Solstices calculations.
 */

import { SolarEvent } from '../types/calendar';

/**
 * Calculates approximate March Equinox, June Solstice, September Equinox, and December Solstice
 * for a given year using astronomical approximation algorithms.
 */
export function getSolarEventsForYear(year: number): SolarEvent[] {
  // Astronomical mean event dates in UTC (approximate Meeus algorithms)
  const marchEquinox = calculateMarchEquinox(year);
  const juneSolstice = calculateJuneSolstice(year);
  const septemberEquinox = calculateSeptemberEquinox(year);
  const decemberSolstice = calculateDecemberSolstice(year);

  return [
    {
      name: 'March Equinox',
      date: marchEquinox,
      description: 'Vernal equinox in Northern Hemisphere. Marks the celestial alignment for sacred year spring threshold.',
    },
    {
      name: 'June Solstice',
      date: juneSolstice,
      description: 'Summer solstice. Longest light of the celestial year.',
    },
    {
      name: 'September Equinox',
      date: septemberEquinox,
      description: 'Autumnal equinox. Equal day and night threshold.',
    },
    {
      name: 'December Solstice',
      date: decemberSolstice,
      description: 'Winter solstice. Shortest light of the celestial year.',
    },
  ];
}

function calculateMarchEquinox(year: number): Date {
  // Approximate March 20/21
  const m = 20.25 + 0.2422 * (year - 2000) - Math.floor((year - 2000) / 4);
  const day = Math.max(19, Math.min(22, Math.floor(m)));
  const hour = Math.floor((m % 1) * 24);
  return new Date(Date.UTC(year, 2, day, hour, 0, 0));
}

function calculateJuneSolstice(year: number): Date {
  const m = 21.25 + 0.2422 * (year - 2000) - Math.floor((year - 2000) / 4);
  const day = Math.max(20, Math.min(22, Math.floor(m)));
  const hour = Math.floor((m % 1) * 24);
  return new Date(Date.UTC(year, 5, day, hour, 0, 0));
}

function calculateSeptemberEquinox(year: number): Date {
  const m = 22.75 + 0.2422 * (year - 2000) - Math.floor((year - 2000) / 4);
  const day = Math.max(21, Math.min(24, Math.floor(m)));
  const hour = Math.floor((m % 1) * 24);
  return new Date(Date.UTC(year, 8, day, hour, 0, 0));
}

function calculateDecemberSolstice(year: number): Date {
  const m = 21.5 + 0.2422 * (year - 2000) - Math.floor((year - 2000) / 4);
  const day = Math.max(20, Math.min(23, Math.floor(m)));
  const hour = Math.floor((m % 1) * 24);
  return new Date(Date.UTC(year, 11, day, hour, 0, 0));
}
