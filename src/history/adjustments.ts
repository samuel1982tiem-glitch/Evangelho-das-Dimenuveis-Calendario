/**
 * @file src/history/adjustments.ts
 * Chronological adjustments manager for testing candidate historical interruptions.
 */

import { ChronologicalAdjustment } from '../types/calendar';

export const INITIAL_CHRONOLOGICAL_ADJUSTMENTS: ChronologicalAdjustment[] = [
  {
    eventId: 'joshua-10-long-day',
    days: 1,
    status: 'PROPOSED',
  },
];

export function getActiveAdjustmentDays(adjustments: ChronologicalAdjustment[]): number {
  return adjustments
    .filter((a) => a.status === 'ACCEPTED')
    .reduce((total, curr) => total + curr.days, 0);
}
