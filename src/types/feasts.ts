/**
 * @file src/types/feasts.ts
 * Type definitions for Biblical Appointed Times, Holy Days, and Feasts.
 */

export type FeastCategory =
  | "FEAST"
  | "FAST"
  | "SABBATH"
  | "SOLEMN_ASSEMBLY";

export type FeastStatus =
  | "MANDATORY"
  | "MEMORIAL"
  | "APPOINTED_TIME";

export type FeastBeginsAt =
  | "SUNSET"
  | "DAY_START"
  | "DAY_ZERO"
  | "LUNAR_ANCHOR";

export type FeastEndsAt =
  | "SUNSET"
  | "DAY_END";

export interface BiblicalFeastDefinition {
  id: string;
  name: string; // Primary name (e.g., "Passover", "Feast of Tabernacles")
  hebrewName: string; // Hebrew name (e.g., "Pesach", "Sukkot")
  alternateNames?: string[]; // e.g., ["Feast of Booths", "Chag HaSukkot"]
  biblicalReferences: string[]; // e.g., ["Leviticus 23:33-43", "Deuteronomy 16:13-15"]

  sacredMonth: number; // 1 to 13
  sacredDay: number; // 1 to 28

  durationDays: number; // Number of days (e.g. 7 for Sukkot, 1 for Shemini Atzeret)

  category: FeastCategory;
  status: FeastStatus;

  description: string;

  beginsAt: FeastBeginsAt;
  endsAt: FeastEndsAt;
}

export interface CalculatedFeastOccurrence {
  feast: BiblicalFeastDefinition;
  sacredYear: number;
  startSacredMonth: number;
  startSacredDay: number;
  endSacredMonth: number;
  endSacredDay: number;

  gregorianStartDate: Date;
  gregorianEndDate: Date;
  julianDayStartNumber: number;
  julianDayEndNumber: number;

  durationDays: number;

  // Active state relative to current date
  isActiveToday: boolean;
  activeDayIndex?: number; // 1-indexed (e.g., Day 3 of 7)

  isUpcoming: boolean;
  daysUntilStart?: number;

  lunarPhaseAtStart: string; // e.g., "Full Moon"
  lunarIlluminationAtStart: number; // 0..1
}

export interface DayObservance {
  type: "WEEKLY_SABBATH" | "ANNUAL_SABBATH" | "FEAST_DAY" | "SOLEMN_ASSEMBLY" | "FAST_DAY";
  label: string;
  feastId?: string;
  feastName?: string;
  dayOfFeast?: string; // e.g., "Day 3 of 7"
}

export interface DoubleObservanceInfo {
  isDoubleObservance: boolean;
  observances: DayObservance[];
}
