/**
 * @file src/data/feastDays.ts
 * Biblical Feasts and Appointed Times in the 364-day sacred calendar.
 */

import { SacredFeastDay } from '../types/calendar';

export const SACRED_FEAST_DAYS: SacredFeastDay[] = [
  {
    id: 'day-zero-new-year',
    name: 'Day Zero — Annual Sacred New Year',
    hebrewName: 'Rosh HaShanah HaMikdash',
    month: 0,
    dayOfMonth: 0,
    isDayZero: true,
    description: 'The annual sacred threshold preceding Month I Day 1. Celebrated as an Annual Sabbath and astronomical lunar anchor point.',
    scriptureRef: 'Exodus 12:2, Ezekiel 45:18',
    sabbathType: 'ANNUAL_SABBATH',
  },
  {
    id: 'passover-memorial',
    name: 'Passover Memorial (Pesach)',
    hebrewName: 'Pesach',
    month: 1,
    dayOfMonth: 14,
    description: 'The twilight Passover memorial. Prepared on Month I Day 14 at even.',
    scriptureRef: 'Leviticus 23:5, Exodus 12:6',
    sabbathType: 'NONE',
  },
  {
    id: 'unleavened-bread-1',
    name: 'Feast of Unleavened Bread — First Day',
    hebrewName: 'Chag HaMatzot (Day 1)',
    month: 1,
    dayOfMonth: 15,
    description: 'First Holy Convocation of Unleavened Bread.',
    scriptureRef: 'Leviticus 23:6-7',
    sabbathType: 'ANNUAL_SABBATH',
  },
  {
    id: 'firstfruits',
    name: 'Feast of Firstfruits (Bikkurim)',
    hebrewName: 'Bikkurim',
    month: 1,
    dayOfMonth: 26,
    description: 'Waving of the sheaf of firstfruits on the day after the weekly Sabbath following Passover in the 364-day cycle.',
    scriptureRef: 'Leviticus 23:10-11',
    sabbathType: 'NONE',
  },
  {
    id: 'unleavened-bread-7',
    name: 'Feast of Unleavened Bread — Seventh Day',
    hebrewName: 'Chag HaMatzot (Day 7)',
    month: 1,
    dayOfMonth: 21,
    description: 'Final Holy Convocation concluding the seven days of Unleavened Bread.',
    scriptureRef: 'Leviticus 23:8',
    sabbathType: 'ANNUAL_SABBATH',
  },
  {
    id: 'feast-of-weeks',
    name: 'Feast of Weeks / Pentecost (Shavuot)',
    hebrewName: 'Shavuot',
    month: 3,
    dayOfMonth: 15,
    description: '50-day count from Firstfruits. Holy Convocation celebrating the Covenant and Wheat Harvest.',
    scriptureRef: 'Leviticus 23:15-21',
    sabbathType: 'ANNUAL_SABBATH',
  },
  {
    id: 'feast-of-trumpets',
    name: 'Day of Trumpets (Yom Teruah)',
    hebrewName: 'Yom Teruah',
    month: 7,
    dayOfMonth: 1,
    description: 'Seventh month memorial of blowing of trumpets. Holy Convocation and sacred Sabbath threshold.',
    scriptureRef: 'Leviticus 23:24-25',
    sabbathType: 'ANNUAL_SABBATH',
  },
  {
    id: 'day-of-atonement',
    name: 'Day of Atonement (Yom Kippur)',
    hebrewName: 'Yom Kippur',
    month: 7,
    dayOfMonth: 10,
    description: 'Sabbath of Sabbaths. Fasting, cleansing of the sanctuary, and sacred reconciliation.',
    scriptureRef: 'Leviticus 23:27-32',
    sabbathType: 'ANNUAL_SABBATH',
  },
  {
    id: 'feast-of-tabernacles-1',
    name: 'Feast of Tabernacles — First Day (Sukkot)',
    hebrewName: 'Sukkot (Day 1)',
    month: 7,
    dayOfMonth: 15,
    description: 'Holy Convocation beginning seven days of dwelling in booths in rejoicing.',
    scriptureRef: 'Leviticus 23:34-35',
    sabbathType: 'ANNUAL_SABBATH',
  },
  {
    id: 'eighth-day-assembly',
    name: 'The Eighth Day Assembly (Shemini Atzeret)',
    hebrewName: 'Shemini Atzeret',
    month: 7,
    dayOfMonth: 22,
    description: 'Great Eighth Day solemn assembly concluding the fall festival season.',
    scriptureRef: 'Leviticus 23:36',
    sabbathType: 'ANNUAL_SABBATH',
  },
];

export function getFeastForSacredDate(month: number, dayOfMonth: number, isDayZero = false): SacredFeastDay | undefined {
  if (isDayZero) {
    return SACRED_FEAST_DAYS.find((f) => f.isDayZero);
  }
  return SACRED_FEAST_DAYS.find((f) => f.month === month && f.dayOfMonth === dayOfMonth);
}
