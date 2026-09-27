/**
 * @file src/screens/CalendarScreen.tsx
 * Book-like 13-Month x 28-Day Sacred Almanac with Day Zero threshold, Sabbath markers,
 * Biblical Appointed Times indicators, and 8-phase astronomical lunar overlays.
 */

import React, { useState, useMemo } from 'react';
import { CalendarConfiguration, CalendarDay } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { generateSacredYearDays } from '../calendar/sacredCalendar';
import { getMonthDisplayTitle } from '../calendar/months';
import { getLunarPhaseInfo, getLocalizedPhaseName, getPhaseCategory, MajorLunarCategory } from '../astronomy/moon';
import { getObservancesForDay } from '../calendar/feastEngine';
import { LunarPhaseIcon } from '../components/LunarPhaseIcon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  onOpenDayDetail: (day: CalendarDay) => void;
  language: Language;
}

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  systemDate,
  config,
  onOpenDayDetail,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const [selectedSacredYear, setSelectedSacredYear] = useState<number>(
    systemDate.getFullYear() + 4024
  );
  const [activeMonthFilter, setActiveMonthFilter] = useState<number | 'ALL'>('ALL');
  const [activeLunarPhaseFilter, setActiveLunarPhaseFilter] = useState<'ALL' | MajorLunarCategory>('ALL');

  const { dayZero, monthsData } = useMemo(() => {
    const sacredDays = generateSacredYearDays(selectedSacredYear, config.lunarAnchorMode);
    const dz = sacredDays.find((d) => d.kind === 'DAY_ZERO') as Extract<CalendarDay, { kind: 'DAY_ZERO' }>;
    const numberedDays = sacredDays.filter(
      (d): d is Extract<CalendarDay, { kind: 'NUMBERED_DAY' }> => d.kind === 'NUMBERED_DAY'
    );

    const months = Array.from({ length: 13 }, (_, idx) => {
      const monthNum = idx + 1;
      const daysInMonth = numberedDays
        .filter((d) => d.month === monthNum)
        .map((numDay) => {
          const isSabbath = numDay.dayOfWeek === 7;
          const lunarInfo = getLunarPhaseInfo(numDay.gregorianDate);
          const phaseCategory = getPhaseCategory(lunarInfo.phaseName);
          const observancesInfo = getObservancesForDay(
            numDay,
            config.lunarAnchorMode,
            config.feastCalendarModel,
            language
          );
          const feastObs = observancesInfo.observances.find(
            (o) => o.type === 'FEAST_DAY' || o.type === 'SOLEMN_ASSEMBLY' || o.type === 'FAST_DAY'
          );
          const isMajorPhaseDay =
            lunarInfo.phaseName === 'New Moon' ||
            lunarInfo.phaseName === 'Full Moon' ||
            lunarInfo.phaseName === 'First Quarter' ||
            lunarInfo.phaseName === 'Last Quarter';

          return {
            numDay,
            isSabbath,
            lunarInfo,
            phaseCategory,
            observancesInfo,
            feastObs,
            isMajorPhaseDay,
          };
        });

      return {
        monthNum,
        roman: ROMAN_MONTHS[idx],
        title: getMonthDisplayTitle(monthNum, config.customMonthNames, language),
        days: daysInMonth,
      };
    });

    return { dayZero: dz, monthsData: months };
  }, [
    selectedSacredYear,
    config.lunarAnchorMode,
    config.feastCalendarModel,
    config.customMonthNames,
    language,
  ]);

  return (
    <div className="space-y-6">
      {/* Book Almanac Header & Control Strip */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-100 tabular-nums">
              {t.calendar.yearTitle} {selectedSacredYear}
            </h2>
            <p className="text-xs text-slate-300 font-serif italic mt-0.5">
              {t.calendar.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Year Stepper */}
            <div className="inline-flex items-center border border-slate-700 bg-slate-900 divide-x divide-slate-700 font-serif text-xs">
              <button
                onClick={() => setSelectedSacredYear((prev) => prev - 1)}
                className="p-2 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                title={isPt ? 'Ano Sagrado Anterior' : 'Previous Sacred Year'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-3.5 py-1.5 font-semibold text-amber-400 tabular-nums">
                {isPt ? 'Ano' : 'Year'} {selectedSacredYear}
              </span>
              <button
                onClick={() => setSelectedSacredYear((prev) => prev + 1)}
                className="p-2 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                title={isPt ? 'Próximo Ano Sagrado' : 'Next Sacred Year'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Month Filter */}
            <select
              value={activeMonthFilter}
              onChange={(e) =>
                setActiveMonthFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))
              }
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-serif text-slate-100 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">{t.calendar.allMonths}</option>
              {monthsData.map((m) => (
                <option key={m.monthNum} value={m.monthNum}>
                  {m.roman}. {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lunar Phase Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 bg-slate-900/40 text-xs font-serif">
          <span className="text-slate-300 italic shrink-0">
            {t.calendar.lunarFilter}
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-slate-700 border border-slate-700 w-full sm:w-auto">
            {[
              { id: 'ALL', label: t.calendar.allPhases },
              { id: 'New', label: isPt ? 'Lua Nova' : 'New' },
              { id: 'Waxing', label: isPt ? 'Crescente' : 'Waxing' },
              { id: 'Full', label: isPt ? 'Lua Cheia' : 'Full' },
              { id: 'Waning', label: isPt ? 'Minguante' : 'Waning' },
            ].map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveLunarPhaseFilter(p.id as any)}
                className={`px-3 py-1.5 text-xs font-serif text-center transition-colors cursor-pointer truncate ${
                  idx === 0 ? 'col-span-2 sm:col-span-1' : 'col-span-1'
                } ${
                  activeLunarPhaseFilter === p.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DAY ZERO THRESHOLD RECORD ROW */}
      <div
        onClick={() => onOpenDayDetail(dayZero)}
        className="border border-purple-500/50 bg-slate-950 hover:bg-slate-900/80 transition-colors cursor-pointer grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800"
      >
        <div className="md:col-span-9 p-5 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider">
            <span className="text-purple-300 font-semibold">
              {isPt ? 'Dia Zero' : 'Day Zero'}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400 font-semibold">{t.calendar.annualSabbathThreshold}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 italic normal-case tabular-nums">
              {dayZero.gregorianDate.toISOString().split('T')[0]}
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-100">
            {t.calendar.dayZeroBannerTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.calendar.dayZeroBannerDesc}
          </p>
        </div>

        <div className="md:col-span-3 p-5 flex items-center gap-3.5 bg-slate-900/30">
          <LunarPhaseIcon
            fraction={dayZero.lunarAnchor.illumination}
            phaseName={dayZero.lunarAnchor.phaseName}
            size={36}
          />
          <div className="text-xs font-serif">
            <span className="text-slate-400 block text-[11px] italic">{t.calendar.springAnchorPhase}</span>
            <strong className="text-purple-300 block text-sm">
              {getLocalizedPhaseName(dayZero.lunarAnchor.phaseName, language)}
            </strong>
            <span className="text-xs text-slate-300 tabular-nums">
              {(dayZero.lunarAnchor.illumination * 100).toFixed(1)}% {isPt ? 'Ilum.' : 'Illum.'}
            </span>
          </div>
        </div>
      </div>

      {/* 13-MONTH ALMANAC MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {monthsData
          .filter((m) => activeMonthFilter === 'ALL' || activeMonthFilter === m.monthNum)
          .map((m) => (
            <div
              key={m.monthNum}
              className="border border-slate-800 bg-slate-950"
            >
              {/* Month Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/70 border-b border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif italic text-sm font-semibold text-amber-400">
                    {m.roman}.
                  </span>
                  <h3 className="text-base font-serif font-bold text-slate-100">
                    {m.title}
                  </h3>
                </div>
                <span className="text-xs font-serif italic text-slate-300 tabular-nums">
                  {t.calendar.days28Weeks4}
                </span>
              </div>

              {/* 7-Column Day Header */}
              <div className="grid grid-cols-7 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/30 text-center text-xs font-serif text-slate-300">
                {t.calendar.daysOfWeek.map((colName, idx) => (
                  <div
                    key={idx}
                    className={`py-2 font-semibold ${idx === 6 ? 'text-amber-400 bg-amber-950/10' : ''}`}
                  >
                    {colName}
                  </div>
                ))}
              </div>

              {/* 28-Day Hairline Grid */}
              <div className="grid grid-cols-7">
                {m.days.map((dayItem, cellIdx) => {
                  const {
                    numDay,
                    isSabbath,
                    lunarInfo,
                    phaseCategory,
                    observancesInfo,
                    feastObs,
                    isMajorPhaseDay,
                  } = dayItem;

                  const matchesPhaseFilter =
                    activeLunarPhaseFilter === 'ALL' || phaseCategory === activeLunarPhaseFilter;

                  const colIdx = cellIdx % 7;
                  const rowIdx = Math.floor(cellIdx / 7);

                  return (
                    <div
                      key={numDay.dayOfYear}
                      onClick={() => onOpenDayDetail(numDay)}
                      className={`p-2 h-16 flex flex-col justify-between cursor-pointer transition-colors ${
                        colIdx < 6 ? 'border-r border-slate-800' : ''
                      } ${rowIdx < 3 ? 'border-b border-slate-800' : ''} ${
                        !matchesPhaseFilter ? 'opacity-25' : 'opacity-100'
                      } ${
                        observancesInfo.isDoubleObservance
                          ? 'bg-amber-950/40 hover:bg-amber-950/60 text-amber-200'
                          : feastObs
                          ? 'bg-amber-950/25 hover:bg-amber-950/40 text-amber-200'
                          : isSabbath
                          ? 'bg-amber-950/10 hover:bg-amber-950/25 text-amber-200'
                          : isMajorPhaseDay
                          ? 'bg-blue-950/15 hover:bg-blue-950/30 text-slate-200'
                          : 'bg-slate-950 hover:bg-slate-900 text-slate-200'
                      }`}
                    >
                      {/* Cell Top Row: Day Number + Moon Phase Icon */}
                      <div className="flex items-start justify-between">
                        <span
                          className={`font-serif font-bold text-sm tabular-nums ${
                            isSabbath ? 'text-amber-400' : 'text-slate-100'
                          }`}
                        >
                          {numDay.dayOfMonth}
                        </span>

                        <LunarPhaseIcon
                          fraction={lunarInfo.fraction}
                          phaseName={lunarInfo.phaseName}
                          size={15}
                        />
                      </div>

                      {/* Cell Bottom Row: Observance / Lunar Readout */}
                      <div className="truncate">
                        {feastObs ? (
                          <div
                            className="text-[10px] font-serif font-semibold text-amber-300 truncate"
                            title={feastObs.label}
                          >
                            {feastObs.feastName}
                          </div>
                        ) : isSabbath ? (
                          <div className="text-[10px] font-serif italic text-amber-400 font-medium">
                            {t.badges.sabbath}
                          </div>
                        ) : isMajorPhaseDay ? (
                          <div
                            className="text-[10px] font-serif italic text-blue-300 truncate"
                            title={getLocalizedPhaseName(lunarInfo.phaseName, language)}
                          >
                            {getLocalizedPhaseName(lunarInfo.phaseName, language)}
                          </div>
                        ) : (
                          <div className="text-[10px] font-serif text-slate-400 tabular-nums">
                            {Math.round(lunarInfo.fraction * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
