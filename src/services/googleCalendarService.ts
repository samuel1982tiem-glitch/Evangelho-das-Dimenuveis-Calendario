/**
 * @file src/services/googleCalendarService.ts
 * Google Calendar integration via Firebase Auth OAuth 2.0 (in-memory token caching)
 * + direct Google Calendar REST API (calendar.events) + mobile Google Calendar deep links & ICS export.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CalculatedFeastOccurrence } from '../types/feasts';
import { Language } from '../i18n/translations';

export const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the access token in memory only (never in localStorage or sessionStorage).
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getCurrentGoogleUser = (): User | null => {
  return auth.currentUser;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

function formatDateYMD(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDaysYMD(date: Date, daysToAdd: number): string {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + daysToAdd);
  return formatDateYMD(d);
}

function formatDateCompact(ymd: string): string {
  return ymd.replace(/-/g, '');
}

export function buildFeastCalendarEventPayload(
  occ: CalculatedFeastOccurrence,
  language: Language
) {
  const isPt = language === 'pt';
  const f = occ.feast;
  const startYMD = formatDateYMD(occ.gregorianStartDate);
  // Google Calendar all-day end date is exclusive, so add durationDays to start date
  const exclusiveEndYMD = addDaysYMD(occ.gregorianStartDate, Math.max(1, f.durationDays));

  const summary = isPt
    ? `🕯️ ${f.name} (${f.hebrewName}) — Calendário Dimenúvel`
    : `🕯️ ${f.name} (${f.hebrewName}) — Dimenúveis Calendar`;

  const descriptionLines = isPt
    ? [
        `${f.name} (${f.hebrewName})`,
        `Calendário Sagrado (Ano ${occ.sacredYear}): Mês ${f.sacredMonth}, Dia ${f.sacredDay}${
          f.durationDays > 1 ? `–${f.sacredDay + f.durationDays - 1}` : ''
        }`,
        `Duração: ${f.durationDays} dia(s) · Observância inicia ao Pôr do Sol da véspera.`,
        `Referências Bíblicas: ${f.biblicalReferences.join(', ')}`,
        '',
        f.description,
      ]
    : [
        `${f.name} (${f.hebrewName})`,
        `Sacred Calendar (Year ${occ.sacredYear}): Month ${f.sacredMonth}, Day ${f.sacredDay}${
          f.durationDays > 1 ? `–${f.sacredDay + f.durationDays - 1}` : ''
        }`,
        `Duration: ${f.durationDays} day(s) · Observance begins at Sunset on the prior evening.`,
        `Biblical References: ${f.biblicalReferences.join(', ')}`,
        '',
        f.description,
      ];

  return {
    summary,
    description: descriptionLines.join('\n'),
    start: {
      date: startYMD,
    },
    end: {
      date: exclusiveEndYMD,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 24 * 60 }, // 24 hours prior
        { method: 'popup', minutes: 6 * 60 },  // Evening sunset reminder (6pm prior day)
      ],
    },
  };
}

export interface CalendarSyncResult {
  createdCount: number;
  eventLinks: string[];
}

/**
 * Inserts one or more Biblical Feast occurrences into the authenticated user's primary Google Calendar.
 * Caller MUST show an explicit confirmation dialog to the user before invoking this function.
 */
export async function insertFeastsToGoogleCalendar(
  occurrences: CalculatedFeastOccurrence[],
  language: Language
): Promise<CalendarSyncResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('NO_ACCESS_TOKEN');
  }

  let createdCount = 0;
  const eventLinks: string[] = [];

  for (const occ of occurrences) {
    const payload = buildFeastCalendarEventPayload(occ, language);
    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (res.status === 401 || res.status === 403) {
      cachedAccessToken = null;
      throw new Error('AUTH_EXPIRED');
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GOOGLE_API_ERROR: ${errText}`);
    }

    const data = await res.json();
    createdCount += 1;
    if (data?.htmlLink) {
      eventLinks.push(data.htmlLink);
    }
  }

  return { createdCount, eventLinks };
}

/**
 * Builds a universal Google Calendar mobile/web template URL for a single feast.
 */
export function buildGoogleCalendarTemplateUrl(
  occ: CalculatedFeastOccurrence,
  language: Language
): string {
  const payload = buildFeastCalendarEventPayload(occ, language);
  const startCompact = formatDateCompact(payload.start.date);
  const endCompact = formatDateCompact(payload.end.date);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: payload.summary,
    dates: `${startCompact}/${endCompact}`,
    details: payload.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Opens the Google Calendar template link in the Android native Google Calendar app or a browser tab.
 */
export function openInGoogleCalendarApp(
  occ: CalculatedFeastOccurrence,
  language: Language
): void {
  const url = buildGoogleCalendarTemplateUrl(occ, language);
  if (typeof window !== 'undefined' && window.AndroidBridge?.openExternalUrl) {
    window.AndroidBridge.openExternalUrl(url);
    return;
  }
  if (typeof window !== 'undefined') {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 * Exports a standard .ics calendar file containing all selected Biblical Feasts
 * for import into Google Calendar mobile or any system calendar app.
 */
export function exportFeastsToIcs(
  occurrences: CalculatedFeastOccurrence[],
  sacredYear: number,
  language: Language
): void {
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calendario Dimenuvel//Biblical Feasts//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const occ of occurrences) {
    const payload = buildFeastCalendarEventPayload(occ, language);
    const dtStart = formatDateCompact(payload.start.date);
    const dtEnd = formatDateCompact(payload.end.date);
    const uid = `feast-${occ.feast.id}-${sacredYear}@dimenueveis.calendar`;
    const escapedDesc = payload.description.replace(/\n/g, '\\n').replace(/,/g, '\\,');
    const escapedSummary = payload.summary.replace(/,/g, '\\,');

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:${escapedSummary}`,
      `DESCRIPTION:${escapedDesc}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapedSummary}`,
      'END:VALARM',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Festas-Biblicas-Ano-Sagrado-${sacredYear}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
