/**
 * @file src/services/geolocationService.ts
 * Handles GPS permission requests and coordinate resolution across Android APK WebView
 * (via AndroidBridge + WebChromeClient geolocation) and standard web browsers.
 */

import { Language } from '../i18n/translations';

declare global {
  interface Window {
    AndroidBridge?: {
      isAndroidApk?: () => boolean;
      hasLocationPermission?: () => boolean;
      requestLocationPermission?: () => void;
      getLastKnownLocationJson?: () => string;
      hasNotificationPermission?: () => boolean;
      requestNotificationPermission?: () => void;
      showNotification?: (title: string, body: string) => void;
      openExternalUrl?: (url: string) => void;
      printPage?: (documentTitle: string) => void;
      saveIcsFile?: (fileName: string, icsContent: string) => void;
      insertCalendarEvent?: (
        title: string,
        description: string,
        startMillis: number,
        endMillis: number,
        fallbackUrl: string
      ) => void;
    };
  }
}

export const GPS_DECISION_STORAGE_KEY = 'dimenueveis_gps_prompt_decided_v1';

export interface ResolvedUserLocation {
  latitude: number;
  longitude: number;
  cityName: string;
}

export function hasUserDecidedGpsPrompt(): boolean {
  try {
    return localStorage.getItem(GPS_DECISION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markGpsPromptDecided(): void {
  try {
    localStorage.setItem(GPS_DECISION_STORAGE_KEY, 'true');
  } catch {
    // ignore storage errors
  }
}

export function isUsingDefaultJerusalem(cityName?: string, latitude?: number, longitude?: number): boolean {
  if (!cityName || cityName.includes('Jerusalem') || cityName.includes('Jerusalém')) {
    if (
      latitude === undefined ||
      longitude === undefined ||
      (Math.abs(latitude - 31.7683) < 0.01 && Math.abs(longitude - 35.2137) < 0.01)
    ) {
      return true;
    }
  }
  return false;
}

function formatCoordinateLabel(lat: number, lon: number, language: Language): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  const prefix = language === 'pt' ? 'GPS Local' : 'Local GPS';
  return `${prefix} (${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir})`;
}

async function reverseGeocodeCityName(lat: number, lon: number, language: Language): Promise<string> {
  const fallback = formatCoordinateLabel(lat, lon, language);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const acceptLang = language === 'pt' ? 'pt-BR,pt' : 'en-US,en';
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=10`,
      {
        headers: {
          'Accept-Language': acceptLang,
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);
    if (response.ok) {
      const data = await response.json();
      const addr = data?.address;
      const city =
        addr?.city ||
        addr?.town ||
        addr?.municipality ||
        addr?.village ||
        addr?.county ||
        addr?.state;
      const countryCode = addr?.country_code ? String(addr.country_code).toUpperCase() : '';
      if (city) {
        return countryCode ? `${city}, ${countryCode}` : String(city);
      }
    }
  } catch {
    // Offline or blocked; fall back to formatted GPS coordinates
  }
  return fallback;
}

function getPositionPromise(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('GEOLOCATION_UNSUPPORTED'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Requests GPS permission and resolves current latitude, longitude, and city label.
 * Supports Android APK native permission dialog + LocationManager fallback as well as browser Geolocation.
 */
export async function requestLocalGpsCoordinates(language: Language): Promise<ResolvedUserLocation> {
  // 1. If running in Android APK and permission is not yet granted, trigger native permission dialog first
  if (typeof window !== 'undefined' && window.AndroidBridge) {
    try {
      const alreadyGranted = window.AndroidBridge.hasLocationPermission?.() ?? false;
      if (!alreadyGranted && window.AndroidBridge.requestLocationPermission) {
        const granted = await new Promise<boolean>((resolve) => {
          let settled = false;
          const handler = (evt: Event) => {
            if (settled) return;
            settled = true;
            window.removeEventListener('androidGpsPermissionResult', handler);
            const detail = (evt as CustomEvent)?.detail;
            resolve(Boolean(detail?.granted));
          };
          window.addEventListener('androidGpsPermissionResult', handler);
          window.AndroidBridge?.requestLocationPermission?.();
          setTimeout(() => {
            if (!settled) {
              settled = true;
              window.removeEventListener('androidGpsPermissionResult', handler);
              resolve(window.AndroidBridge?.hasLocationPermission?.() ?? false);
            }
          }, 15000);
        });

        if (!granted) {
          throw new Error('PERMISSION_DENIED');
        }
      }
    } catch (err: any) {
      if (err?.message === 'PERMISSION_DENIED') {
        throw err;
      }
    }
  }

  let latitude: number | null = null;
  let longitude: number | null = null;

  // 2. Try high-accuracy GPS via standard navigator.geolocation
  try {
    const pos = await getPositionPromise({
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 300000,
    });
    latitude = Number(pos.coords.latitude.toFixed(4));
    longitude = Number(pos.coords.longitude.toFixed(4));
  } catch (highAccErr: any) {
    if (highAccErr?.code === 1) {
      // PERMISSION_DENIED
      throw new Error('PERMISSION_DENIED');
    }

    // 3. Fallback to coarse/network location
    try {
      const pos = await getPositionPromise({
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 600000,
      });
      latitude = Number(pos.coords.latitude.toFixed(4));
      longitude = Number(pos.coords.longitude.toFixed(4));
    } catch (coarseErr: any) {
      if (coarseErr?.code === 1) {
        throw new Error('PERMISSION_DENIED');
      }

      // 4. Fallback to Android LocationManager last known location if running in Android APK
      if (typeof window !== 'undefined' && window.AndroidBridge?.getLastKnownLocationJson) {
        try {
          const rawJson = window.AndroidBridge.getLastKnownLocationJson();
          if (rawJson) {
            const parsed = JSON.parse(rawJson);
            if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
              latitude = Number(parsed.latitude.toFixed(4));
              longitude = Number(parsed.longitude.toFixed(4));
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }

  if (latitude === null || longitude === null) {
    throw new Error('POSITION_UNAVAILABLE');
  }

  const cityName = await reverseGeocodeCityName(latitude, longitude, language);
  markGpsPromptDecided();

  return {
    latitude,
    longitude,
    cityName,
  };
}
