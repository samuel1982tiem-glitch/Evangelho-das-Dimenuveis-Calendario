/**
 * @file src/types/calendar.ts
 * Core domain types for DIMENÚVEIS Biblical Lunar & Millennial Calendar
 */

export type LunarAnchorMode = 'CONJUNCTION' | 'VISIBLE_CRESCENT' | 'OBSERVATIONAL';

export type FeastCalendarModel =
  | 'BIBLICAL_LUNAR'
  | 'OBSERVATIONAL_LUNAR'
  | 'CONFIGURED_SACRED_MODEL';

export type SabbathType = 'WEEKLY_SABBATH' | 'ANNUAL_SABBATH' | 'BOTH' | 'NONE';

export type DataSourceType =
  | 'ASTRONOMICAL_CALCULATION'
  | 'BIBLICAL_TEXT'
  | 'HISTORICAL_RECORD'
  | 'TRADITIONAL_CHRONOLOGY'
  | 'INTERPRETIVE_MODEL'
  | 'HYPOTHETICAL_MODEL';

export interface LunarAnchor {
  mode: LunarAnchorMode;
  timestamp: Date;
  conjunctionDate: Date;
  visibleCrescentDate: Date;
  phaseName: string;
  illumination: number; // 0 to 1
  lunationNumber: number;
}

export type CalendarDay =
  | {
      kind: 'DAY_ZERO';
      calendarYear: number;
      isSabbath: true;
      sabbathType: 'ANNUAL_SABBATH' | 'BOTH';
      lunarAnchor: LunarAnchor;
      gregorianDate: Date;
      notes?: string;
    }
  | {
      kind: 'NUMBERED_DAY';
      calendarYear: number;
      dayOfYear: number; // 1–364
      month: number; // 1–13
      dayOfMonth: number; // 1–28
      weekOfYear: number; // 1–52
      dayOfWeek: number; // 1–7 (7 = Sabbath)
      isWeeklySabbath: boolean;
      sabbathType: SabbathType;
      gregorianDate: Date;
    };

export interface LunarPhaseInfo {
  phaseName: 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';
  phaseAngle: number; // 0..360 deg
  fraction: number; // 0..1 (illumination)
  ageDays: number; // 0..29.53
  lunationNumber: number;
  nextPhaseName: string;
  nextPhaseDate: Date;
  prevPhaseName: string;
  prevPhaseDate: Date;
  isApproximate?: boolean;
}

export interface SolarEvent {
  name: 'March Equinox' | 'June Solstice' | 'September Equinox' | 'December Solstice';
  date: Date;
  description: string;
}

export interface ChronologyModel {
  id: string;
  name: string;
  description: string;
  creationEpochBCE: number; // Year BCE for creation epoch (e.g. 4004 for Ussher)
  methodology: string;
  status: 'traditional' | 'interpretive' | 'hypothetical';
  dataSource: DataSourceType;
  biblicalBasis: string;
}

export interface MillennialPosition {
  creationEpochBCE: number;
  currentAstronomicalYear: number; // Negative for BCE, positive for CE (no 0)
  elapsedSolarYears: number;
  millenniumNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  millenniumName: string;
  yearOfMillennium: number; // 1..1000
  isMillennialSabbath: boolean;
  yearsUntil6000Boundary: number;
  yearsUntil7000Boundary: number;
  boundary6000CEYear: number;
  boundary7000CEYear: number;
}

export interface HistoricalAstronomicalEvent {
  id: string;
  name: string;
  biblicalReferences: string[];
  date?: string;
  astronomicalYearBCE?: number;
  dateStatus: 'established' | 'candidate' | 'disputed' | 'unknown';
  astronomicalInterpretation?: string;
  chronologicalEffectDays?: number;
  notes: string[];
  dataSource: DataSourceType;
}

export interface ChronologicalAdjustment {
  eventId: string;
  days: number;
  status: 'OFF' | 'PROPOSED' | 'ACCEPTED';
}

export interface CalendarConfiguration {
  monthsPerYear: 13;
  daysPerMonth: 28;
  numberedDaysPerYear: 364;
  annualDayZero: true;
  lunarAnchorMode: LunarAnchorMode;
  feastCalendarModel: FeastCalendarModel;
  chronologyModelId: string;
  joshuaAdjustmentStatus: 'OFF' | 'PROPOSED' | 'ACCEPTED';
  customMonthNames: string[];
  userLocation?: {
    latitude: number;
    longitude: number;
    cityName?: string;
  };
}

export interface SacredFeastDay {
  id: string;
  name: string;
  hebrewName?: string;
  month: number;
  dayOfMonth: number;
  isDayZero?: boolean;
  description: string;
  scriptureRef: string;
  sabbathType: SabbathType;
}

export interface DimenueveisCanonicalSection {
  id: string;
  title: string;
  canonicalText: string;
  layer: 'SACRED' | 'CELESTIAL' | 'BIBLICAL' | 'MILLENNIAL' | 'HISTORICAL' | 'DIMENUEVEIS';
  notes: string[];
}
