/**
 * @file src/services/googleCalendarService.ts
 * Secret-free Google Calendar integration for mobile (Android APK CalendarContract Intent
 * + Google Calendar universal TEMPLATE deep links + .ICS calendar export with alarms).
 * Requires zero API keys in the repository so GitHub Secret Scanning stays 100% clean.
 */

import { CalculatedFeastOccurrence } from '../types/feasts';
import { Language } from '../i18n/translations';

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
    ? `🕯️ ${f.name} (${f.hebrewName}) — Calendário Dimenúveis`
    : `🕯️ ${f.name} (${f.hebrewName}) — Dimenuous Calendar`;

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
    startDateYMD: startYMD,
    endDateYMD: exclusiveEndYMD,
    startMillis: occ.gregorianStartDate.getTime(),
    endMillis: occ.gregorianStartDate.getTime() + Math.max(1, f.durationDays) * 86400000,
  };
}

/**
 * Builds a universal Google Calendar mobile/web template URL for a single feast.
 */
export function buildGoogleCalendarTemplateUrl(
  occ: CalculatedFeastOccurrence,
  language: Language
): string {
  const payload = buildFeastCalendarEventPayload(occ, language);
  const startCompact = formatDateCompact(payload.startDateYMD);
  const endCompact = formatDateCompact(payload.endDateYMD);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: payload.summary,
    dates: `${startCompact}/${endCompact}`,
    details: payload.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Opens the feast directly in the Android native Google Calendar app (via CalendarContract Intent)
 * or opens the Google Calendar web/mobile template URL.
 */
export function openInGoogleCalendarApp(
  occ: CalculatedFeastOccurrence,
  language: Language
): void {
  const payload = buildFeastCalendarEventPayload(occ, language);
  const url = buildGoogleCalendarTemplateUrl(occ, language);

  if (typeof window !== 'undefined' && window.AndroidBridge?.insertCalendarEvent) {
    window.AndroidBridge.insertCalendarEvent(
      payload.summary,
      payload.description,
      payload.startMillis,
      payload.endMillis,
      url
    );
    return;
  }

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
 * Opens Google Calendar online settings/import page.
 */
export function openGoogleCalendarImportPage(): void {
  const url = 'https://calendar.google.com/calendar/r/settings/export';
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
 * for one-tap import into Google Calendar mobile or any system calendar app.
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
    const dtStart = formatDateCompact(payload.startDateYMD);
    const dtEnd = formatDateCompact(payload.endDateYMD);
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
      'BEGIN:VALARM',
      'TRIGGER:-PT6H',
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
