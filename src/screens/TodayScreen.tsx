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
import { calculateMillennialPosition } from '../chronology/chronologyEngine';
import { getSabbathBadgeLabel } from '../calendar/sabbath';
import { getMonthDisplayTitle } from '../calendar/months';
import { getCurrentOrNextFeast, getObservancesForDay } from '../calendar/feastEngine';
import { LunarPhaseIcon } from '../components/LunarPhaseIcon';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { ArrowRight } from 'lucide-react';

interface TodayScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  onOpenDayDetail: (day: CalendarDay) => void;
  onNavigateTab: (tab: any) => void;
  language: Language;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  systemDate,
  config,
  onOpenDayDetail,
  onNavigateTab,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const currentSacredDay = solarDateToSacredDate(systemDate, config.lunarAnchorMode);
  const isZero = currentSacredDay.kind === 'DAY_ZERO';

  const lunarInfo = getLunarPhaseInfo(systemDate);
  const localizedPhaseName = getLocalizedPhaseName(lunarInfo.phaseName, language);
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
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-serif text-slate-200">
            <span className="text-amber-400">✦</span>
            <span className="uppercase tracking-wider font-semibold text-amber-400">
              {t.today.realtimeClock}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 italic tabular-nums">
              {systemDate.toISOString().split('T')[0]}
            </span>
          </div>
          <DataSourceBadge source="ASTRONOMICAL_CALCULATION" size="sm" language={language} />
        </div>

        {/* Main 12-Col Split Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left 7 Cols: Primary Sacred Date & Appointed Time Status */}
          <div className="lg:col-span-7 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-serif text-amber-400 uppercase tracking-wider tabular-nums">
                <span className="font-semibold">{t.today.sacredYear} {currentSacredDay.calendarYear}</span>
                <span className="text-slate-500">·</span>
                <span className="italic normal-case text-slate-300">
                  {isPt ? 'Ancoragem:' : 'Anchor:'} {translateAnchorMode(config.lunarAnchorMode)}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-normal text-slate-100 tabular-nums">
                {isZero
                  ? t.today.dayZeroTitle
                  : `${getMonthDisplayTitle((currentSacredDay as any).month, config.customMonthNames, language)}, ${isPt ? 'Dia' : 'Day'} ${(currentSacredDay as any).dayOfMonth}`}
              </h1>

              {isZero && (
                <p className="text-base text-purple-300 font-serif italic">
                  {t.today.dayZeroSubtitle}
                </p>
              )}

              {/* Book Metadata Strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs font-serif text-slate-300 tabular-nums border-t border-slate-800/80">
                {!isZero && (
                  <>
                    <span>
                      {t.today.weekOf}: <strong className="text-slate-100">{(currentSacredDay as any).weekOfYear} {isPt ? 'de' : 'of'} 52</strong>
                    </span>
                    <span className="text-slate-500">·</span>
                    <span>
                      {t.today.dayOfWeek}: <strong className="text-slate-100">{(currentSacredDay as any).dayOfWeek} {isPt ? 'de' : 'of'} 7</strong>
                    </span>
                    <span className="text-slate-500">·</span>
                    <span>
                      {isPt ? 'Dia do Ano' : 'Day of Year'}: <strong className="text-slate-100">{(currentSacredDay as any).dayOfYear} {isPt ? 'de' : 'of'} 364</strong>
                    </span>
                    <span className="text-slate-500">·</span>
                  </>
                )}
                <span className={sabbathBadge.textClass}>
                  <strong>{sabbathBadge.text}</strong>
                </span>

                {observancesInfo.isDoubleObservance && (
                  <>
                    <span className="text-slate-500">·</span>
                    <span className="text-amber-300 font-semibold italic">
                      ({isPt ? 'Dupla Observância: Sábado e Festa' : 'Double Observance: Sabbath & Feast'})
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Active or Upcoming Appointed Time Readout */}
            {activeFeast ? (
              <div
                onClick={() => onNavigateTab('FEASTS')}
                className="p-4 bg-amber-950/20 border border-amber-500/50 cursor-pointer hover:bg-amber-950/30 transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-xs font-serif font-semibold uppercase text-amber-400 tracking-wider">
                    {isPt ? 'Tempo Nomeado Ativo Hoje' : 'Current Appointed Time'} · {activeFeast.feast.hebrewName}
                  </div>
                  <div className="text-lg font-serif font-bold text-slate-100">
                    {activeFeast.feast.name}
                  </div>
                  <div className="text-xs text-slate-300 font-serif italic tabular-nums">
                    {isPt ? 'Dia' : 'Day'} {activeFeast.activeDayIndex} {isPt ? 'de' : 'of'} {activeFeast.durationDays} · {isPt ? 'Término em' : 'Ends on'} {activeFeast.gregorianEndDate.toISOString().split('T')[0]}
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-amber-500 text-slate-950 font-serif text-xs font-semibold shrink-0">
                  {isPt ? 'Ler mais' : 'Read more'} →
                </span>
              </div>
            ) : nextFeast ? (
              <div
                onClick={() => onNavigateTab('FEASTS')}
                className="p-4 bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-xs font-serif font-semibold text-amber-400 uppercase tracking-wider">
                    {isPt ? 'Próximo Tempo Nomeado' : 'Next Appointed Time'} · {isPt ? 'Mês' : 'Month'} {nextFeast.feast.sacredMonth}, {isPt ? 'Dia' : 'Day'} {nextFeast.feast.sacredDay}
                  </div>
                  <div className="text-base font-serif font-bold text-slate-100">
                    {nextFeast.feast.name} <span className="font-normal italic text-slate-300">({nextFeast.feast.hebrewName})</span>
                  </div>
                  <div className="text-xs text-slate-300 font-serif italic tabular-nums">
                    {isPt ? 'Início:' : 'Begins:'} {nextFeast.gregorianStartDate.toISOString().split('T')[0]} · {isPt ? `Em ${nextFeast.daysUntilStart} dias` : `In ${nextFeast.daysUntilStart} days`} ({nextFeast.durationDays} {isPt ? 'dias de duração' : 'days duration'})
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ) : null}

            <div className="pt-1">
              <button
                onClick={() => onOpenDayDetail(currentSacredDay)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {t.today.inspectDetails}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Astronomical Lunar & Millennial Sub-Panels */}
          <div className="lg:col-span-5 divide-y divide-slate-800 flex flex-col justify-between">
            {/* Sub-Panel 1: Astronomical Moon */}
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <LunarPhaseIcon fraction={lunarInfo.fraction} phaseName={lunarInfo.phaseName} size={44} />
                <div className="space-y-1">
                  <div className="text-xs font-serif text-slate-300 uppercase tracking-wider">
                    {t.today.astronomicalMoon}
                  </div>
                  <div className="text-lg font-serif font-bold text-blue-300">
                    {localizedPhaseName}
                  </div>
                  <div className="text-xs font-serif italic text-slate-300 tabular-nums">
                    {(lunarInfo.fraction * 100).toFixed(1)}% {t.today.illuminated} · {t.today.lunarAge}: {lunarInfo.ageDays} {isPt ? 'dias' : 'days'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('MOON')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-serif font-medium text-blue-300 transition-colors shrink-0 cursor-pointer"
              >
                {isPt ? 'Lua' : 'Moon'} →
              </button>
            </div>

            {/* Sub-Panel 2: Millennial Great Week */}
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-serif text-slate-300 uppercase tracking-wider">
                  {t.today.theGreatWeek} · {config.chronologyModelId.toUpperCase()}
                </div>
                <div className="text-lg font-serif font-bold text-purple-300">
                  {millennialPos.millenniumName}
                </div>
                <div className="text-xs font-serif italic text-slate-300 tabular-nums">
                  {isPt ? 'Ano' : 'Year'} {millennialPos.yearOfMillennium} {isPt ? 'de' : 'of'} 1000 · {millennialPos.elapsedSolarYears} {t.today.elapsedSolarYears}
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('GREAT_WEEK')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-serif font-medium text-purple-300 transition-colors shrink-0 cursor-pointer"
              >
                {isPt ? 'Milênio' : 'Epoch'} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial 3-Column Chapter Index */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-800 bg-slate-950 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Chapter I: 13-Month Sacred Grid */}
        <div
          onClick={() => onNavigateTab('CALENDAR')}
          className="p-6 hover:bg-slate-900/50 transition-colors cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
              I. {isPt ? 'O Calendário Sagrado' : 'The Sacred Calendar'}
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100">
              {t.today.explore13Month}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.today.explore13MonthDesc}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-serif italic text-amber-400 font-semibold">
            <span>{t.today.exploreGrid}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chapter II: Appointed Times (Moedim) */}
        <div
          onClick={() => onNavigateTab('FEASTS')}
          className="p-6 hover:bg-slate-900/50 transition-colors cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="text-xs font-serif text-blue-400 uppercase tracking-wider font-semibold">
              II. {isPt ? 'As Solenidades de Levítico 23' : 'Solemnities of Leviticus 23'}
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100">
              {isPt ? 'Os Tempos Nomeados (Festas)' : 'The Appointed Times (Feasts)'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isPt
                ? 'Cálculo determinístico de Páscoa, Pães Asmos, Primícias, Pentecostes, Trombetas, Expiação e Tabernáculos.'
                : 'Deterministic calculation of Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, and Tabernacles.'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-serif italic text-blue-400 font-semibold">
            <span>{isPt ? 'Consultar Festas' : 'Inspect Feasts'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chapter III: 7,000-Year Great Week */}
        <div
          onClick={() => onNavigateTab('GREAT_WEEK')}
          className="p-6 hover:bg-slate-900/50 transition-colors cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="text-xs font-serif text-purple-400 uppercase tracking-wider font-semibold">
              III. {isPt ? 'Cronologia Milenar' : 'Millennial Chronology'}
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100">
              {t.today.millennialClock}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.today.millennialClockDesc}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-serif italic text-purple-400 font-semibold">
            <span>{t.today.viewMillennial}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
