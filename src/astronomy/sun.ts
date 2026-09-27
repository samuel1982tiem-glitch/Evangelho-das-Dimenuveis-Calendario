/**
 * @file src/astronomy/sun.ts
 * Sun position, sunrise, and sunset calculations using suncalc.
 */

import * as SunCalc from 'suncalc';

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  goldenHour: Date;
  dusk: Date;
  dawn: Date;
}

/**
 * Get sunrise and sunset times for a location and date.
 * Default location: Jerusalem (31.7683° N, 35.2137° E) if user location is not set.
 */
export function getSunTimes(
  date: Date,
  latitude = 31.7683,
  longitude = 35.2137
): SunTimes {
  const times = SunCalc.getTimes(date, latitude, longitude);
  return {
    sunrise: times.sunrise || date,
    sunset: times.sunset || date,
    solarNoon: times.solarNoon || date,
    goldenHour: times.goldenHour || date,
    dusk: times.dusk || date,
    dawn: times.dawn || date,
  };
}

/**
 * Get solar position (azimuth and altitude in degrees).
 */
export function getSolarPosition(
  date: Date,
  latitude = 31.7683,
  longitude = 35.2137
): { azimuthDeg: number; altitudeDeg: number } {
  const pos = SunCalc.getPosition(date, latitude, longitude);
  return {
    azimuthDeg: Math.round(((pos.azimuth * 180) / Math.PI + 180) % 360),
    altitudeDeg: Math.round((pos.altitude * 180) / Math.PI),
  };
}
