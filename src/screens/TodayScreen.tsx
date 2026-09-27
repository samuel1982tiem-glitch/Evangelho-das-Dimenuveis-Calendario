/**
 * @file src/screens/TodayScreen.tsx
 * Book-like "TODAY" almanac readout screen displaying current sacred date,
 * Sabbath status, dynamic feast detection/countdown, astronomical lunar phase, and Millennial position.
 */

import React from 'react';
import { CalendarConfiguration, CalendarDay } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { solarDateToSacredDate } from '../calendar/sacredCalendar';
import { getLunarPhaseInfo, getLocalizedPhaseName } from '../astronomy/moon';
import { getSunTimes } from '../astronomy/sun';
import { calculateMillennialPosition } from '../chronology/chronologyEngine';
import { getSabbathBadgeLabel } from '../calendar/sabbath';
import { getMonthDisplayTitle } from '../calendar/months';
import { getCurrentOrNextFeast, getObservancesForDay } from '../calendar/feastEngine';
import { LunarPhaseIcon } from '../components/LunarPhaseIcon';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { ArrowRight, MapPin } from 'lucide-react';

interface TodayScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  onOpenDayDetail: (day: CalendarDay) => void;
  onNavigateTab: (tab: any) => void;
  language: Language;
  onOpenGpsModal?: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  systemDate,
  config,
  onOpenDayDetail,
  onNavigateTab,
  language,
  onOpenGpsModal,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const currentSacredDay = solarDateToSacredDate(systemDate, config.lunarAnchorMode);
  const isZero = currentSacredDay.kind === 'DAY_ZERO';

  const lunarInfo = getLunarPhaseInfo(systemDate);
  const localizedPhaseName = getLocalizedPhaseName(lunarInfo.phaseName, language);
  const sunTimes = getSunTimes(
    systemDate,
    config.userLocation?.latitude,
    config.userLocation?.longitude
  );
  const rawCity = config.userLocation?.cityName || '';
  const displayCity =
    !rawCity || rawCity === 'Jerusalem (Default)'
      ? isPt
        ? 'Jerusalém (Padrão)'
        : 'Jerusalem (Default)'
      : rawCity;
  const millennialPos = calculateMillennialPosition(
    systemDate.getFullYear(),
    config.chronologyModelId,
    config.joshuaAdjustmentStatus === 'ACCEPTED' ? 1 : 0,
    language
  );

  const sabbathBadge = getSabbathBadgeLabel(currentSacredDay.sabbathType, language);
  const observancesInfo = getObservancesForDay(
    currentSacredDay,
    config.lunarAnchorMode,
    config.feastCalendarModel,
    language
  );
  const { activeFeast, nextFeast } = getCurrentOrNextFeast(
    systemDate,
    config.lunarAnchorMode,
    config.feastCalendarModel,
    language
  );

  const translateAnchorMode = (mode: string) => {
    if (!isPt) {
      if (mode === 'CONJUNCTION') return 'Conjunction';
      if (mode === 'VISIBLE_CRESCENT') return 'Visible Crescent';
      if (mode === 'OBSERVATIONAL') return 'Observational';
      return mode;
    }
    if (mode === 'CONJUNCTION') return 'Conjunção';
    if (mode === 'VISIBLE_CRESCENT') return 'Crescente Visível';
    if (mode === 'OBSERVATIONAL') return 'Observacional';
    return mode;
  };

  return (
    <div className="space-y-6">
      {/* Primary Book Almanac Readout */}
      <div className="border border-slate-800 bg-slate-950">
        {/* Top Epigraph Header Bar */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-2.5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-1.5 text-xs font-serif text-slate-200 whitespace-nowrap min-w-0">
            <span className="text-amber-400">✦</span>
            <span className="uppercase tracking-wider font-semibold text-amber-400">
              {t.today.realtimeClock}
            </span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-300 italic tabular-nums hidden sm:inline">
              {systemDate.toISOString().split('T')[0]}
            </span>
          </div>
          <DataSourceBadge source="ASTRONOMICAL_CALCULATION" size="sm" language={language} />
        </div>

        {/* Main 12-Col Split Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left 7 Cols: Primary Sacred Date & Appointed Time Status */}
          <div className="lg:col-span-7 p-4 sm:p-6 space-y-4 sm:space-y-5 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-serif text-amber-400 uppercase tracking-wider tabular-nums whitespace-nowrap">
                <span className="font-semibold">{t.today.sacredYear} {currentSacredDay.calendarYear}</span>
                <span className="text-slate-500">·</span>
                <span className="italic normal-case text-slate-300">
                  {translateAnchorMode(config.lunarAnchorMode)}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold tracking-normal text-slate-100 tabular-nums whitespace-nowrap">
                {isZero
                  ? t.today.dayZeroTitle
                  : `${getMonthDisplayTitle((currentSacredDay as any).month, config.customMonthNames, language)}, ${isPt ? 'Dia' : 'Day'} ${(currentSacredDay as any).dayOfMonth}`}
              </h1>

              {isZero && (
                <p className="text-sm sm:text-base text-purple-300 font-serif italic whitespace-nowrap">
                  {t.today.dayZeroSubtitle}
                </p>
              )}

              {/* Book Metadata Strip */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1.5 sm:gap-x-4 pt-2 text-xs font-serif text-slate-300 tabular-nums border-t border-slate-800/80">
                {!isZero && (
                  <div className="flex items-center gap-2.5 whitespace-nowrap">
                    <span>
                      {t.today.weekOf}: <strong className="text-slate-100">{(currentSacredDay as any).weekOfYear}/52</strong>
                    </span>
                    <span className="text-slate-500">·</span>
                    <span>
                      {t.today.dayOfWeek}: <strong className="text-slate-100">{(currentSacredDay as any).dayOfWeek}/7</strong>
                    </span>
                    <span className="text-slate-500">·</span>
                    <span>
                      {isPt ? 'Ano' : 'Yr'}: <strong className="text-slate-100">{(currentSacredDay as any).dayOfYear}/364</strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className={sabbathBadge.textClass}>
                    <strong>{sabbathBadge.text}</strong>
                  </span>

                  {observancesInfo.isDoubleObservance && (
                    <>
                      <span className="text-slate-500">·</span>
                      <span className="text-amber-300 font-semibold italic">
                        ({isPt ? 'Dupla Observância' : 'Double Observance'})
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Active or Upcoming Appointed Time Readout */}
            {activeFeast ? (
              <div
                onClick={() => onNavigateTab('FEASTS')}
                className="p-3.5 sm:p-4 bg-amber-950/20 border border-amber-500/50 cursor-pointer hover:bg-amber-950/30 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-serif font-semibold uppercase text-amber-400 tracking-wider whitespace-nowrap">
                    {isPt ? 'Festa Ativa' : 'Active Feast'} · {activeFeast.feast.hebrewName}
                  </div>
                  <div className="text-base sm:text-lg font-serif font-bold text-slate-100 whitespace-nowrap">
                    {activeFeast.feast.name}
                  </div>
                  <div className="text-xs text-slate-300 font-serif italic tabular-nums whitespace-nowrap">
                    {isPt ? 'Dia' : 'Day'} {activeFeast.activeDayIndex}/{activeFeast.durationDays} · {isPt ? 'Até' : 'Ends'} {activeFeast.gregorianEndDate.toISOString().split('T')[0]}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
              </div>
            ) : nextFeast ? (
              <div
                onClick={() => onNavigateTab('FEASTS')}
                className="p-3.5 sm:p-4 bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-serif font-semibold text-amber-400 uppercase tracking-wider whitespace-nowrap">
                    {isPt ? 'Próxima Festa' : 'Next Feast'} · {isPt ? 'Mês' : 'Month'} {nextFeast.feast.sacredMonth}, {isPt ? 'Dia' : 'Day'} {nextFeast.feast.sacredDay}
                  </div>
                  <div className="text-base font-serif font-bold text-slate-100 whitespace-nowrap">
                    {nextFeast.feast.name} <span className="hidden sm:inline font-normal italic text-slate-300">({nextFeast.feast.hebrewName})</span>
                  </div>
                  <div className="text-xs text-slate-300 font-serif italic tabular-nums whitespace-nowrap">
                    {nextFeast.gregorianStartDate.toISOString().split('T')[0]} · {isPt ? `Em ${nextFeast.daysUntilStart} dias` : `In ${nextFeast.daysUntilStart} days`} ({nextFeast.durationDays}d)
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ) : null}

            <div className="pt-1">
              <button
                onClick={() => onOpenDayDetail(currentSacredDay)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.today.inspectDetails}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Astronomical Lunar & Millennial Sub-Panels */}
          <div className="lg:col-span-5 divide-y divide-slate-800 flex flex-col justify-between">
            {/* Sub-Panel 1: Astronomical Moon */}
            <div className="p-4 sm:p-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <LunarPhaseIcon fraction={lunarInfo.fraction} phaseName={lunarInfo.phaseName} size={38} />
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-serif text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    {t.today.astronomicalMoon}
                  </div>
                  <div className="text-base sm:text-lg font-serif font-bold text-blue-300 whitespace-nowrap">
                    {localizedPhaseName}
                  </div>
                  <div className="text-xs font-serif italic text-slate-300 tabular-nums whitespace-nowrap">
                    {(lunarInfo.fraction * 100).toFixed(1)}% · {t.today.lunarAge}: {lunarInfo.ageDays}d
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('MOON')}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-serif font-medium text-blue-300 transition-colors shrink-0 whitespace-nowrap cursor-pointer"
              >
                {isPt ? 'Lua' : 'Moon'} →
              </button>
            </div>

            {/* Sub-Panel 2: Millennial Great Week */}
            <div className="p-4 sm:p-6 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-serif text-slate-300 uppercase tracking-wider whitespace-nowrap">
                  {t.today.theGreatWeek} · {config.chronologyModelId.toUpperCase()}
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-purple-300 whitespace-nowrap">
                  {millennialPos.millenniumName}
                </div>
                <div className="text-xs font-serif italic text-slate-300 tabular-nums whitespace-nowrap">
                  {isPt ? 'Ano' : 'Yr'} {millennialPos.yearOfMillennium}/1000 · {millennialPos.elapsedSolarYears} {t.today.elapsedSolarYears}
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('GREAT_WEEK')}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-serif font-medium text-purple-300 transition-colors shrink-0 whitespace-nowrap cursor-pointer"
              >
                {isPt ? 'Milênio' : 'Epoch'} →
              </button>
            </div>

            {/* Sub-Panel 3: Local Solar Ephemeris (Sunrise & Sunset + GPS Trigger) */}
            <div className="p-4 sm:p-6 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-serif text-slate-300 uppercase tracking-wider whitespace-nowrap truncate">
                  {isPt ? 'Sol Local' : 'Local Sun'} · {displayCity}
                </div>
                <div className="text-sm sm:text-base font-serif font-bold text-amber-300 tabular-nums whitespace-nowrap">
                  ↑ {sunTimes.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ↓ {sunTimes.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs font-serif italic text-slate-300 tabular-nums whitespace-nowrap">
                  {t.modal.solarNoon}: {sunTimes.solarNoon.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {onOpenGpsModal && (
                <button
                  type="button"
                  onClick={onOpenGpsModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-xs font-serif font-medium text-amber-300 transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>GPS</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editorial 3-Column Chapter Index */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-800 bg-slate-950 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Chapter I: 13-Month Sacred Grid */}
        <div
          onClick={() => onNavigateTab('CALENDAR')}
          className="p-5 sm:p-6 hover:bg-slate-900/50 transition-colors cursor-pointer flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1.5">
            <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold whitespace-nowrap">
              I. {isPt ? 'Calendário Sagrado' : 'Sacred Calendar'}
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 whitespace-nowrap">
              {t.today.explore13Month}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.today.explore13MonthDesc}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-serif italic text-amber-400 font-semibold whitespace-nowrap">
            <span>{t.today.exploreGrid}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chapter II: Appointed Times (Moedim) */}
        <div
          onClick={() => onNavigateTab('FEASTS')}
          className="p-5 sm:p-6 hover:bg-slate-900/50 transition-colors cursor-pointer flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1.5">
            <div className="text-xs font-serif text-blue-400 uppercase tracking-wider font-semibold whitespace-nowrap">
              II. {isPt ? 'Solenidades (Levítico 23)' : 'Solemnities (Leviticus 23)'}
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 whitespace-nowrap">
              {isPt ? 'Os Tempos Nomeados' : 'The Appointed Times'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isPt
                ? 'Cálculo determinístico de Páscoa, Pães Asmos, Primícias, Pentecostes, Trombetas, Expiação e Tabernáculos.'
                : 'Deterministic calculation of Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, and Tabernacles.'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-serif italic text-blue-400 font-semibold whitespace-nowrap">
            <span>{isPt ? 'Consultar Festas' : 'Inspect Feasts'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chapter III: 7,000-Year Great Week */}
        <div
          onClick={() => onNavigateTab('GREAT_WEEK')}
          className="p-5 sm:p-6 hover:bg-slate-900/50 transition-colors cursor-pointer flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1.5">
            <div className="text-xs font-serif text-purple-400 uppercase tracking-wider font-semibold whitespace-nowrap">
              III. {isPt ? 'Cronologia Milenar' : 'Millennial Chronology'}
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 whitespace-nowrap">
              {t.today.millennialClock}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.today.millennialClockDesc}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-serif italic text-purple-400 font-semibold whitespace-nowrap">
            <span>{t.today.viewMillennial}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
