/**
 * @file src/screens/MoonScreen.tsx
 * Book-like Astronomical Lunar Layer & Phase Almanac screen.
 */

import React, { useState } from 'react';
import { CalendarConfiguration } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  getLunarPhaseInfo,
  getLocalizedPhaseName,
  getLocalizedCategoryLabel,
  LUNAR_SYNODIC_MONTH,
  EIGHT_LUNAR_PHASES_META,
  MajorLunarCategory,
} from '../astronomy/moon';
import { LunarPhaseIcon } from '../components/LunarPhaseIcon';
import { DataSourceBadge } from '../components/DataSourceBadge';

interface MoonScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  onUpdateConfig: (newConfig: Partial<CalendarConfiguration>) => void;
  language: Language;
}

export const MoonScreen: React.FC<MoonScreenProps> = ({
  systemDate,
  config,
  onUpdateConfig,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | MajorLunarCategory>('ALL');
  const lunarInfo = getLunarPhaseInfo(systemDate);
  const localizedPhaseName = getLocalizedPhaseName(lunarInfo.phaseName, language);

  const upcomingPhases = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(systemDate.getTime() + i * 3.69 * 86400 * 1000);
    return {
      date: d,
      info: getLunarPhaseInfo(d),
    };
  });

  const filteredPhases = EIGHT_LUNAR_PHASES_META.filter(
    (p) => categoryFilter === 'ALL' || p.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Primary Lunar Almanac Panel */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 bg-slate-900/60">
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
            {t.moon.title}
          </h2>
          <DataSourceBadge source="ASTRONOMICAL_CALCULATION" size="sm" language={language} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left 5 Cols: Live Lunar Figure */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex items-center gap-4 sm:gap-5 bg-slate-900/20">
            <div className="shrink-0">
              <LunarPhaseIcon fraction={lunarInfo.fraction} phaseName={lunarInfo.phaseName} size={68} />
            </div>
            <div className="space-y-1 font-serif text-xs tabular-nums min-w-0">
              <div className="text-blue-300 uppercase font-semibold tracking-wider whitespace-nowrap">
                {localizedPhaseName}
              </div>
              <div className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
                {(lunarInfo.fraction * 100).toFixed(1)}% <span className="text-xs font-normal italic text-slate-300">{t.today.illuminated}</span>
              </div>
              <div className="text-slate-300 whitespace-nowrap">
                {t.today.lunarAge}: <strong className="text-slate-100">{lunarInfo.ageDays}d</strong> / {LUNAR_SYNODIC_MONTH.toFixed(2)}d
              </div>
              <div className="text-slate-300 italic whitespace-nowrap">
                {isPt ? 'Lunação' : 'Lunation'} #{lunarInfo.lunationNumber} · {lunarInfo.phaseAngle}°
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Anchor Selector & Synodic Specification */}
          <div className="lg:col-span-7 divide-y divide-slate-800">
            <div className="p-4 sm:p-5 space-y-1.5">
              <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold whitespace-nowrap">
                {t.moon.sacredVsSynodic}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {t.moon.sacredVsSynodicDesc}
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-2.5">
              <div className="text-xs font-serif text-slate-300 uppercase tracking-wider font-semibold whitespace-nowrap">
                {t.moon.anchorModeLabel}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 border border-slate-700 divide-y sm:divide-y-0 sm:divide-x divide-slate-700 bg-slate-950 font-serif text-xs">
                {[
                  { mode: 'CONJUNCTION', label: t.moon.modeA, desc: t.moon.modeADesc },
                  { mode: 'VISIBLE_CRESCENT', label: t.moon.modeB, desc: t.moon.modeBDesc },
                  { mode: 'OBSERVATIONAL', label: t.moon.modeC, desc: t.moon.modeCDesc },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => onUpdateConfig({ lunarAnchorMode: item.mode as any })}
                    className={`p-3.5 text-left transition-colors cursor-pointer ${
                      config.lunarAnchorMode === item.mode
                        ? 'bg-blue-950/40 text-blue-200 font-semibold'
                        : 'text-slate-200 hover:text-slate-100 hover:bg-slate-900'
                    }`}
                  >
                    <div className="text-xs font-bold whitespace-nowrap">{item.label}</div>
                    <div className="text-xs italic text-slate-300 mt-0.5 whitespace-nowrap">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8 DEFINED ASTRONOMICAL LUNAR PHASES CATALOG */}
      <div className="border border-slate-800 bg-slate-950 overflow-hidden">
        {/* Section Header */}
        <div className="p-4 sm:p-5 bg-slate-900/50 border-b border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-xl font-serif font-bold text-slate-100 whitespace-nowrap">
                {t.moon.guideTitle}
              </h3>
              <p className="text-xs text-slate-300 font-serif italic mt-0.5">
                {t.moon.guideDesc}
              </p>
            </div>
            <span className="text-xs font-serif italic text-slate-400 tabular-nums shrink-0 whitespace-nowrap">
              {isPt ? 'Ciclo Sinódico: 29,53 Dias' : 'Synodic Cycle: 29.53 Days'}
            </span>
          </div>

          {/* 5-Box Category Filter Bar */}
          <div className="grid grid-cols-5 gap-px bg-slate-700 border border-slate-700 font-serif text-xs">
            {(['ALL', 'New', 'Waxing', 'Full', 'Waning'] as const).map((cat) => {
              const isSelected = categoryFilter === cat;
              const label =
                cat === 'ALL'
                  ? t.moon.all8Phases
                  : cat === 'Waxing' && isPt
                  ? 'CRESC.'
                  : cat === 'Waning' && isPt
                  ? 'MING.'
                  : getLocalizedCategoryLabel(cat, language);

              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-1.5 sm:px-3 py-2 text-[11px] sm:text-xs text-center transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-200 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 Lunar Phase Boxes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800">
          {filteredPhases.map((phase) => {
            const isCurrentlyActive = lunarInfo.phaseName === phase.phaseName;
            const phaseIndex = EIGHT_LUNAR_PHASES_META.findIndex(
              (p) => p.phaseName === phase.phaseName
            );
            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

            return (
              <div
                key={phase.phaseName}
                className={`p-4 sm:p-5 flex flex-col justify-between space-y-3.5 min-w-0 ${
                  isCurrentlyActive ? 'bg-blue-950/30' : 'bg-slate-950'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between gap-2 text-xs font-serif border-b border-slate-800/80 pb-2 whitespace-nowrap">
                    <span className="text-slate-300 italic">
                      <strong className="text-amber-400 not-italic mr-1.5">
                        {romanNumerals[phaseIndex]}.
                      </strong>
                      {isPt
                        ? `Fase ${getLocalizedCategoryLabel(phase.category, language)}`
                        : `${phase.category} Phase`}
                    </span>
                    {isCurrentlyActive ? (
                      <span className="text-xs text-amber-400 font-semibold shrink-0">
                        ● {t.moon.activeNow}
                      </span>
                    ) : (
                      <span className="text-xs font-serif text-slate-200 font-medium tabular-nums shrink-0">
                        {Math.round(phase.typicalFraction * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Icon + Phase Name & Age */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="shrink-0">
                      <LunarPhaseIcon
                        fraction={phase.typicalFraction}
                        phaseName={phase.phaseName}
                        size={42}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-serif font-bold text-slate-100 whitespace-nowrap">
                        {getLocalizedPhaseName(phase.phaseName, language)}
                      </h4>
                      <p className="text-xs font-serif italic text-amber-400 tabular-nums mt-0.5 whitespace-nowrap">
                        {isPt ? 'Idade' : 'Age'}: {isPt ? phase.ageDaysRangePt : phase.ageDaysRange}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 font-serif leading-relaxed pt-2.5 border-t border-slate-800/80">
                  {isPt ? phase.descriptionPt : phase.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next / Previous Phase & 8-Step Horizon */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-slate-800 bg-slate-950 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-serif text-xs tabular-nums">
        <div className="p-4 sm:p-5 flex items-center justify-between gap-3 whitespace-nowrap">
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs italic text-slate-400 block">{t.moon.nextEvent}</span>
            <strong className="text-base font-serif text-amber-300 block">
              {getLocalizedPhaseName(lunarInfo.nextPhaseName, language)}
            </strong>
          </div>
          <span className="text-slate-200 shrink-0">
            {lunarInfo.nextPhaseDate.toISOString().replace('T', ' ').slice(0, 16)} UTC
          </span>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-3 whitespace-nowrap">
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs italic text-slate-400 block">{t.moon.prevEvent}</span>
            <strong className="text-base font-serif text-blue-300 block">
              {getLocalizedPhaseName(lunarInfo.prevPhaseName, language)}
            </strong>
          </div>
          <span className="text-slate-200 shrink-0">
            {lunarInfo.prevPhaseDate.toISOString().replace('T', ' ').slice(0, 16)} UTC
          </span>
        </div>
      </div>

      {/* Upcoming Lunation Horizon Strip */}
      <div className="border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/50 border-b border-slate-800 text-xs font-serif uppercase tracking-wider text-slate-200 font-semibold whitespace-nowrap">
          {t.moon.upcomingHorizon}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-slate-800 text-center font-serif text-xs tabular-nums">
          {upcomingPhases.map((item, idx) => (
            <div key={idx} className="p-3 sm:p-3.5 space-y-1.5 bg-slate-950 min-w-0">
              <span className="text-xs text-slate-300 block whitespace-nowrap">
                {item.date.toISOString().slice(5, 10)}
              </span>
              <div className="flex justify-center">
                <LunarPhaseIcon fraction={item.info.fraction} phaseName={item.info.phaseName} size={26} />
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-blue-300 whitespace-nowrap">
                {getLocalizedPhaseName(item.info.phaseName, language)}
              </p>
              <span className="text-xs italic text-slate-400 block whitespace-nowrap">
                {Math.round(item.info.fraction * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
