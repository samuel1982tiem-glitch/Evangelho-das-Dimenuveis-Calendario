/**
 * @file src/screens/AppointedTimesScreen.tsx
 * Book-like screen for "THE APPOINTED TIMES" (Feasts of the Sacred Year).
 * Chronological Spring & Autumn Appointed Times catalog with dynamic calculations.
 */

import React, { useState } from 'react';
import { CalendarConfiguration } from '../types/calendar';
import { Language } from '../i18n/translations';
import { CalculatedFeastOccurrence } from '../types/feasts';
import { calculateFeastOccurrences } from '../calendar/feastEngine';
import { FeastDetailModal } from '../components/FeastDetailModal';
import { GoogleCalendarSyncModal } from '../components/GoogleCalendarSyncModal';
import { LunarPhaseIcon } from '../components/LunarPhaseIcon';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface AppointedTimesScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  language: Language;
}

export const AppointedTimesScreen: React.FC<AppointedTimesScreenProps> = ({
  systemDate,
  config,
  language,
}) => {
  const isPt = language === 'pt';
  const [selectedSacredYear, setSelectedSacredYear] = useState<number>(
    systemDate.getFullYear() + 4024
  );
  const [selectedFeastModal, setSelectedFeastModal] = useState<CalculatedFeastOccurrence | null>(null);
  const [calendarSyncOccurrences, setCalendarSyncOccurrences] = useState<CalculatedFeastOccurrence[] | null>(null);

  const feastOccurrences = calculateFeastOccurrences(
    selectedSacredYear,
    config.lunarAnchorMode,
    config.feastCalendarModel,
    systemDate,
    language
  );

  const springFeasts = feastOccurrences.filter((f) => f.feast.sacredMonth <= 3);
  const autumnFeasts = feastOccurrences.filter((f) => f.feast.sacredMonth >= 7);

  const translateCategory = (cat: string) => {
    if (!isPt) {
      const enMap: Record<string, string> = {
        FEAST: 'Feast',
        FAST: 'Fast',
        SABBATH: 'Sabbath',
        SOLEMN_ASSEMBLY: 'Solemn Assembly',
      };
      return enMap[cat] || cat;
    }
    const map: Record<string, string> = {
      FEAST: 'Festa',
      FAST: 'Jejum',
      SABBATH: 'Sábado',
      SOLEMN_ASSEMBLY: 'Assembleia Solene',
    };
    return map[cat] || cat;
  };

  const translateModel = (m: string) => {
    if (!isPt) {
      if (m === 'BIBLICAL_LUNAR') return 'Biblical Lunar';
      if (m === 'OBSERVATIONAL_LUNAR') return 'Observational';
      if (m === 'CONFIGURED_SACRED_MODEL') return '364-Day Cycle';
      return m;
    }
    if (m === 'BIBLICAL_LUNAR') return 'Lunar Bíblico';
    if (m === 'OBSERVATIONAL_LUNAR') return 'Observacional';
    if (m === 'CONFIGURED_SACRED_MODEL') return 'Ciclo 364 Dias';
    return m;
  };

  const translateAnchor = (a: string) => {
    if (!isPt) {
      if (a === 'CONJUNCTION') return 'Conjunction';
      if (a === 'VISIBLE_CRESCENT') return 'Crescent';
      if (a === 'OBSERVATIONAL') return 'Observational';
      return a;
    }
    if (a === 'CONJUNCTION') return 'Conjunção';
    if (a === 'VISIBLE_CRESCENT') return 'Crescente';
    if (a === 'OBSERVATIONAL') return 'Observacional';
    return a;
  };

  return (
    <div className="space-y-6">
      {/* Book Header & Control Strip */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
          <div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
              {isPt ? 'Os Tempos Nomeados (Moedim)' : 'The Appointed Times (Moedim)'}
            </h2>
            <p className="text-xs text-slate-300 font-serif italic mt-0.5 whitespace-nowrap">
              {isPt
                ? 'Solenidades de Levítico 23 · Ciclo Sagrado'
                : 'Solemnities of Leviticus 23 · Sacred Cycle'}
            </p>
          </div>
          <DataSourceBadge source="ASTRONOMICAL_CALCULATION" size="sm" language={language} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-slate-900/40 text-xs font-serif">
          <div className="flex items-center gap-2.5 text-slate-300 whitespace-nowrap">
            <span>{isPt ? 'Modelo:' : 'Model:'} <strong className="text-amber-400">{translateModel(config.feastCalendarModel)}</strong></span>
            <span className="text-slate-500">·</span>
            <span>{isPt ? 'Âncora:' : 'Anchor:'} <strong className="text-blue-300">{translateAnchor(config.lunarAnchorMode)}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCalendarSyncOccurrences(feastOccurrences)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-serif font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{isPt ? 'Incluir no Google Agenda' : 'Add to Google Calendar'}</span>
            </button>

            <div className="inline-flex items-center border border-slate-700 bg-slate-950 divide-x divide-slate-700 whitespace-nowrap">
              <button
                onClick={() => setSelectedSacredYear((prev) => prev - 1)}
                className="p-1.5 hover:bg-slate-900 text-slate-200 transition-colors cursor-pointer"
                title={isPt ? 'Ano Sagrado Anterior' : 'Previous Sacred Year'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1 font-semibold text-amber-400 tabular-nums">
                {isPt ? 'Ano Sagrado' : 'Sacred Year'} {selectedSacredYear}
              </span>
              <button
                onClick={() => setSelectedSacredYear((prev) => prev + 1)}
                className="p-1.5 hover:bg-slate-900 text-slate-200 transition-colors cursor-pointer"
                title={isPt ? 'Próximo Ano Sagrado' : 'Next Sacred Year'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION I: SPRING APPOINTED TIMES */}
      <div className="border border-slate-800 bg-slate-950">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
            I. {isPt ? 'Festas da Primavera (Meses I–III)' : 'Spring Feasts (Months I–III)'}
          </h3>
          <span className="text-xs font-serif italic text-slate-300 whitespace-nowrap">
            {isPt ? 'Lev 23:4–22' : 'Lev 23:4–22'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {springFeasts.map((occ) => {
            const f = occ.feast;
            return (
              <div
                key={f.id}
                onClick={() => setSelectedFeastModal(occ)}
                className={`p-4 sm:p-5 cursor-pointer transition-colors flex flex-col justify-between space-y-4 ${
                  occ.isActiveToday
                    ? 'bg-amber-950/30 hover:bg-amber-950/40'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-semibold text-amber-400 tabular-nums whitespace-nowrap">
                      {isPt ? 'Mês' : 'Month'} {f.sacredMonth}, {isPt ? 'Dia' : 'Day'} {f.sacredDay}
                    </span>
                    <LunarPhaseIcon fraction={occ.lunarIlluminationAtStart} phaseName={occ.lunarPhaseAtStart as any} size={22} />
                  </div>

                  <div>
                    <h4 className="text-base font-serif font-bold text-slate-100 whitespace-nowrap">
                      {f.name}
                    </h4>
                    <p className="text-xs font-serif italic text-slate-300 whitespace-nowrap">
                      {f.hebrewName} · {translateCategory(f.category)}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-serif text-slate-300 space-y-1.5 pt-2.5 border-t border-slate-800/80 tabular-nums">
                  <div className="flex justify-between whitespace-nowrap">
                    <span className="text-slate-400">{isPt ? 'Gregoriano:' : 'Gregorian:'}</span>
                    <span className="text-slate-100 font-semibold">{occ.gregorianStartDate.toISOString().split('T')[0]}</span>
                  </div>
                  <div className="flex justify-between whitespace-nowrap">
                    <span className="text-slate-400">{isPt ? 'Duração:' : 'Duration:'}</span>
                    <span className="text-slate-200">{f.durationDays} {isPt ? 'dia(s)' : 'day(s)'}</span>
                  </div>
                  <div className="flex justify-between whitespace-nowrap">
                    <span className="text-slate-400">{isPt ? 'Escritura:' : 'Scripture:'}</span>
                    <span className="text-emerald-400 italic">{f.biblicalReferences[0]}</span>
                  </div>

                  {occ.isActiveToday && (
                    <div className="pt-1 text-emerald-400 font-semibold whitespace-nowrap">
                      ● {isPt ? 'Ativo Agora' : 'Active Now'} ({occ.activeDayIndex}/{f.durationDays})
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION II: AUTUMN APPOINTED TIMES */}
      <div className="border border-slate-800 bg-slate-950">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-purple-300 whitespace-nowrap">
            II. {isPt ? 'Festas do Outono (Mês VII)' : 'Autumn Feasts (Month VII)'}
          </h3>
          <span className="text-xs font-serif italic text-slate-300 whitespace-nowrap">
            {isPt ? 'Lev 23:23–44' : 'Lev 23:23–44'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {autumnFeasts.map((occ) => {
            const f = occ.feast;
            const isSukkot = f.id === 'TABERNACLES';
            const isEighthDay = f.id === 'EIGHTH_DAY';

            return (
              <div
                key={f.id}
                onClick={() => setSelectedFeastModal(occ)}
                className={`p-4 sm:p-5 cursor-pointer transition-colors flex flex-col justify-between space-y-4 ${
                  occ.isActiveToday
                    ? 'bg-purple-950/30 hover:bg-purple-950/40'
                    : isSukkot
                    ? 'bg-amber-950/15 hover:bg-amber-950/25'
                    : isEighthDay
                    ? 'bg-purple-950/15 hover:bg-purple-950/25'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-semibold text-purple-300 tabular-nums whitespace-nowrap">
                      {isPt ? 'Mês' : 'Month'} {f.sacredMonth}, {isPt ? 'Dia' : 'Day'} {f.sacredDay}
                      {f.durationDays > 1 ? `–${f.sacredDay + f.durationDays - 1}` : ''}
                    </span>
                    <LunarPhaseIcon fraction={occ.lunarIlluminationAtStart} phaseName={occ.lunarPhaseAtStart as any} size={22} />
                  </div>

                  <div>
                    <h4 className="text-base font-serif font-bold text-slate-100 whitespace-nowrap">
                      {f.name}
                    </h4>
                    <p className="text-xs font-serif italic text-slate-300 whitespace-nowrap">
                      {f.hebrewName} · {translateCategory(f.category)}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-serif text-slate-300 space-y-1.5 pt-2.5 border-t border-slate-800/80 tabular-nums">
                  <div className="flex justify-between whitespace-nowrap">
                    <span className="text-slate-400">{isPt ? 'Gregoriano:' : 'Gregorian:'}</span>
                    <span className="text-slate-100 font-semibold">{occ.gregorianStartDate.toISOString().split('T')[0]}</span>
                  </div>
                  <div className="flex justify-between whitespace-nowrap">
                    <span className="text-slate-400">{isPt ? 'Duração:' : 'Duration:'}</span>
                    <span className="text-slate-200">{f.durationDays} {isPt ? 'dia(s)' : 'day(s)'}</span>
                  </div>
                  <div className="flex justify-between whitespace-nowrap">
                    <span className="text-slate-400">{isPt ? 'Escritura:' : 'Scripture:'}</span>
                    <span className="text-emerald-400 italic">{f.biblicalReferences[0]}</span>
                  </div>

                  {isSukkot && (
                    <div className="pt-1 text-xs italic text-amber-400 whitespace-nowrap">
                      {isPt ? 'Dias 1 a 7 · Festa das Cabanas' : 'Days 1–7 · Feast of Booths'}
                    </div>
                  )}

                  {isEighthDay && (
                    <div className="pt-1 text-xs italic text-purple-300 whitespace-nowrap">
                      {isPt ? 'Dia 8 · Assembleia Solene' : 'Day 8 · Solemn Assembly'}
                    </div>
                  )}

                  {occ.isActiveToday && (
                    <div className="pt-1 text-emerald-400 font-semibold whitespace-nowrap">
                      ● {isPt ? 'Ativo Agora' : 'Active Now'} ({occ.activeDayIndex}/{f.durationDays})
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Popover Modal */}
      <FeastDetailModal
        occurrence={selectedFeastModal}
        onClose={() => setSelectedFeastModal(null)}
        language={language}
        onAddToGoogleCalendar={(occ) => {
          setSelectedFeastModal(null);
          setCalendarSyncOccurrences([occ]);
        }}
      />

      {/* Google Calendar Sync & Confirmation Modal */}
      <GoogleCalendarSyncModal
        isOpen={Boolean(calendarSyncOccurrences && calendarSyncOccurrences.length > 0)}
        onClose={() => setCalendarSyncOccurrences(null)}
        occurrences={calendarSyncOccurrences || []}
        sacredYear={selectedSacredYear}
        language={language}
      />
    </div>
  );
};
