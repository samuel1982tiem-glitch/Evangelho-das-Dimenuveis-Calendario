/**
 * @file src/components/DayDetailModal.tsx
 * Book-like editorial modal displaying full multi-layered information when selecting any calendar day.
 */

import React from 'react';
import { X, MapPin } from 'lucide-react';
import { CalendarConfiguration, CalendarDay } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getLunarPhaseInfo, getLocalizedPhaseName } from '../astronomy/moon';
import { getSunTimes } from '../astronomy/sun';
import { getSabbathBadgeLabel } from '../calendar/sabbath';
import { getMonthDisplayTitle } from '../calendar/months';
import { getFeastOccurrenceForDay, getObservancesForDay } from '../calendar/feastEngine';
import { getLocalizedBiblicalEvents } from '../history/biblicalEvents';
import { getLocalizedCanonicalSections } from '../dimenueveis/canonical';
import { LunarPhaseIcon } from './LunarPhaseIcon';
import { DataSourceBadge } from './DataSourceBadge';

interface DayDetailModalProps {
  day: CalendarDay | null;
  onClose: () => void;
  config: CalendarConfiguration;
  language: Language;
  onOpenGpsModal?: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  onClose,
  config,
  language,
  onOpenGpsModal,
}) => {
  if (!day) return null;

  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const isZero = day.kind === 'DAY_ZERO';
  const lunarInfo = getLunarPhaseInfo(day.gregorianDate);
  const localizedPhaseName = getLocalizedPhaseName(lunarInfo.phaseName, language);
  const sunTimes = getSunTimes(
    day.gregorianDate,
    config.userLocation?.latitude,
    config.userLocation?.longitude
  );

  const sabbathBadge = getSabbathBadgeLabel(day.sabbathType, language);
  const feastMatch = getFeastOccurrenceForDay(day, config.lunarAnchorMode, config.feastCalendarModel, language);
  const observancesInfo = getObservancesForDay(day, config.lunarAnchorMode, config.feastCalendarModel, language);

  const allBiblicalEvents = getLocalizedBiblicalEvents(language);
  const biblicalEvents = allBiblicalEvents.filter((e) => {
    if (isZero && e.isDayZero) return true;
    if (!isZero && e.sacredMonth === (day as any).month && e.sacredDay === (day as any).dayOfMonth) return true;
    return false;
  });

  const allCanonical = getLocalizedCanonicalSections(language);
  const canonicalPassages = allCanonical.filter((s) => {
    if (isZero && s.id.includes('day-zero')) return true;
    return false;
  });

  const rawCity = config.userLocation?.cityName || '';
  const displayCity =
    !rawCity || rawCity === 'Jerusalem (Default)'
      ? isPt
        ? 'Jerusalém (Padrão)'
        : 'Jerusalem (Default)'
      : rawCity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-700 text-slate-100 divide-y divide-slate-800 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 bg-slate-900/70">
          <div className="space-y-1.5 pr-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-serif uppercase tracking-wider tabular-nums whitespace-nowrap">
              <span className="text-amber-400 font-semibold">
                {t.modal.sacredYear} {day.calendarYear}
              </span>
              <span className="text-slate-500">·</span>
              <span className={sabbathBadge.textClass}>
                {sabbathBadge.text}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 tabular-nums whitespace-nowrap">
              {isZero
                ? t.today.dayZeroTitle
                : `${getMonthDisplayTitle((day as any).month, config.customMonthNames, language)}, ${isPt ? 'Dia' : 'Day'} ${(day as any).dayOfMonth}`}
            </h2>

            <p className="text-xs text-slate-300 italic font-serif tabular-nums whitespace-nowrap">
              {t.modal.gregorianEquiv} {day.gregorianDate.toISOString().split('T')[0]}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feast Highlight if applicable */}
        {feastMatch && (
          <div className="p-5 bg-amber-950/20 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-serif text-amber-400 uppercase tracking-wider">
              <span className="font-semibold">
                {isPt ? 'Tempo Nomeado' : 'Appointed Time'} · {feastMatch.occurrence.feast.hebrewName}
              </span>
              <span className="tabular-nums font-semibold">
                {isPt
                  ? `Dia ${feastMatch.dayIndexInFeast} de ${feastMatch.occurrence.durationDays}`
                  : `Day ${feastMatch.dayIndexInFeast} of ${feastMatch.occurrence.durationDays}`}
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-slate-100">
              {feastMatch.occurrence.feast.name}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {feastMatch.occurrence.feast.description}
            </p>
            <p className="text-xs font-serif italic text-emerald-400 pt-1">
              {isPt ? 'Escrituras:' : 'Scripture:'} {feastMatch.occurrence.feast.biblicalReferences.join(' · ')}
            </p>
          </div>
        )}

        {/* 2-Column Data Matrix: Sacred Position + Lunar Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 text-sm">
          {/* Sacred Calendar Coordinates */}
          <div className="p-5 space-y-2.5">
            <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
              {t.modal.positionTitle}
            </div>
            {isZero ? (
              <p className="text-sm text-purple-300 leading-relaxed">{t.modal.dayZeroDesc}</p>
            ) : (
              <div className="space-y-1.5 text-slate-200 tabular-nums text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.modal.dayOfYear}</span>
                  <strong className="text-amber-300">{(day as any).dayOfYear} / 364</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.modal.weekOfYear}</span>
                  <strong className="text-amber-300">{isPt ? 'Semana' : 'Week'} {(day as any).weekOfYear} / 52</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.modal.dayOfWeek}</span>
                  <strong className="text-amber-300">{isPt ? 'Dia' : 'Day'} {(day as any).dayOfWeek} / 7</strong>
                </div>
              </div>
            )}
          </div>

          {/* Astronomical Lunar Overlay */}
          <div className="p-5 space-y-2.5">
            <div className="text-xs font-serif text-blue-400 uppercase tracking-wider font-semibold">
              {t.modal.lunarOverlay}
            </div>
            <div className="flex items-center gap-3.5">
              <LunarPhaseIcon fraction={lunarInfo.fraction} phaseName={lunarInfo.phaseName} size={38} />
              <div className="space-y-0.5 tabular-nums text-xs">
                <div className="text-sm font-serif font-semibold text-blue-300">{localizedPhaseName}</div>
                <div className="text-slate-200">
                  {t.modal.illumination} <strong>{(lunarInfo.fraction * 100).toFixed(1)}%</strong>
                </div>
                <div className="text-slate-400 italic">
                  {t.modal.moonAge} {lunarInfo.ageDays} {isPt ? 'dias' : 'days'} · #{lunarInfo.lunationNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solar Ephemeris Table */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold whitespace-nowrap truncate">
              {t.modal.solarData} ({displayCity})
            </div>
            {onOpenGpsModal && (
              <button
                type="button"
                onClick={onOpenGpsModal}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-xs font-serif text-amber-300 transition-colors shrink-0 whitespace-nowrap cursor-pointer"
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{isPt ? 'GPS Local' : 'Local GPS'}</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-slate-800 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 bg-slate-900/40 text-xs tabular-nums">
            <div className="p-3.5 space-y-0.5">
              <span className="text-slate-300 block text-xs italic font-serif">{t.modal.sunrise}</span>
              <span className="text-amber-300 font-bold text-base">{sunTimes.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="p-3.5 space-y-0.5">
              <span className="text-slate-300 block text-xs italic font-serif">{t.modal.solarNoon}</span>
              <span className="text-amber-300 font-bold text-base">{sunTimes.solarNoon.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="p-3.5 space-y-0.5">
              <span className="text-slate-300 block text-xs italic font-serif">{t.modal.sunset}</span>
              <span className="text-amber-300 font-bold text-base">{sunTimes.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="p-3.5 space-y-0.5">
              <span className="text-slate-300 block text-xs italic font-serif">{t.modal.dusk}</span>
              <span className="text-amber-300 font-bold text-base">{sunTimes.dusk.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Biblical Events Section */}
        {biblicalEvents.length > 0 && (
          <div className="p-5 space-y-2.5">
            <div className="text-xs font-serif text-emerald-400 uppercase tracking-wider font-semibold">
              {t.modal.biblicalEvents}
            </div>
            <div className="divide-y divide-slate-800 border border-slate-800">
              {biblicalEvents.map((evt) => (
                <div key={evt.id} className="p-3.5 bg-slate-900/30 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-serif font-semibold text-emerald-300">{evt.title}</h4>
                    <DataSourceBadge source={evt.dataSource} size="sm" language={language} />
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{evt.summary}</p>
                  <p className="text-xs font-serif italic text-slate-400">{isPt ? 'Escrituras:' : 'Scripture:'} {evt.biblicalRef}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canonical Gospel Material Section */}
        {canonicalPassages.length > 0 && (
          <div className="p-5 bg-slate-900/30 space-y-2.5">
            <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
              {t.modal.canonicalMaterial}
            </div>
            <div className="space-y-2">
              {canonicalPassages.map((sec) => (
                <div key={sec.id} className="p-4 bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed font-serif">
                  {sec.canonicalText}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
