/**
 * @file src/screens/ScriptureHistoryScreen.tsx
 * Book-like Biblical Astronomical Events & Scripture History Catalog with Candidate Classifications.
 */

import React from 'react';
import { CalendarConfiguration } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getLocalizedBiblicalEvents } from '../history/biblicalEvents';
import { getLocalizedEclipseEvents } from '../astronomy/eclipses';
import { DataSourceBadge } from '../components/DataSourceBadge';

interface ScriptureHistoryScreenProps {
  config: CalendarConfiguration;
  onUpdateConfig: (newConfig: Partial<CalendarConfiguration>) => void;
  language: Language;
}

export const ScriptureHistoryScreen: React.FC<ScriptureHistoryScreenProps> = ({
  config,
  onUpdateConfig,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const eclipseEvents = getLocalizedEclipseEvents(language);
  const biblicalEvents = getLocalizedBiblicalEvents(language);

  const translateJoshuaStatus = (st: string) => {
    if (!isPt) return st;
    if (st === 'OFF') return 'Desligado';
    if (st === 'PROPOSED') return 'Proposto';
    if (st === 'ACCEPTED') return 'Aceito';
    return st;
  };

  return (
    <div className="space-y-6">
      {/* Header & Joshua 10 Parameter Module */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="p-4 sm:p-5 bg-slate-900/60 space-y-1.5">
          <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold whitespace-nowrap">
            {isPt
              ? 'Arqueoastronomia e Cronologia Bíblica'
              : 'Archaeoastronomy & Biblical Chronology'}
          </div>
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
            {t.scriptureHistory.heroTitle}
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {t.scriptureHistory.heroDesc}
          </p>
        </div>

        {/* Joshua 10 Inspection Row */}
        <div className="p-4 sm:p-5 space-y-3 bg-amber-950/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-serif font-bold text-amber-300 whitespace-nowrap">
              {t.scriptureHistory.joshuaTitle}
            </h3>
            <span className="text-xs font-serif italic text-amber-400 whitespace-nowrap">
              ({t.scriptureHistory.joshuaStatus})
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {t.scriptureHistory.joshuaDesc}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80 text-xs font-serif">
            <span className="text-slate-300 whitespace-nowrap">
              {t.scriptureHistory.joshuaSetting}: <strong className="text-amber-300">{translateJoshuaStatus(config.joshuaAdjustmentStatus)}</strong>
            </span>

            <div className="inline-flex border border-slate-700 divide-x divide-slate-700 bg-slate-950">
              {(['OFF', 'PROPOSED', 'ACCEPTED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateConfig({ joshuaAdjustmentStatus: status })}
                  className={`px-3 py-1.5 text-xs font-serif font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    config.joshuaAdjustmentStatus === status
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  {status === 'OFF' && t.scriptureHistory.offLabel}
                  {status === 'PROPOSED' && t.scriptureHistory.proposedLabel}
                  {status === 'ACCEPTED' && t.scriptureHistory.acceptedLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Astronomical Events Matrix */}
      <div className="border border-slate-800 bg-slate-950">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/50 border-b border-slate-800 text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
          I. {t.scriptureHistory.catalogTitle}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {eclipseEvents.map((evt) => (
            <div key={evt.id} className="p-4 sm:p-5 border-b border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-serif italic text-emerald-400 whitespace-nowrap">
                    {evt.biblicalReferences[0]}
                  </span>
                  <DataSourceBadge source={evt.dataSource} size="sm" language={language} />
                </div>

                <h4 className="text-base font-serif font-bold text-slate-100 whitespace-nowrap">
                  {evt.name}
                </h4>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {evt.astronomicalInterpretation}
                </p>
              </div>

              <div className="text-xs font-serif text-slate-300 space-y-1 border-t border-slate-800 pt-2.5 tabular-nums">
                <div className="whitespace-nowrap">{isPt ? 'Escrituras:' : 'Scripture:'} <span className="text-emerald-400 italic">{evt.biblicalReferences.join(' · ')}</span></div>
                {evt.date && <div className="whitespace-nowrap">{isPt ? 'Data:' : 'Date:'} <span className="text-slate-100 font-semibold">{evt.date}</span></div>}
                <div className="whitespace-nowrap">
                  {isPt ? 'Classificação:' : 'Classification:'}{' '}
                  <span className="italic text-amber-400 font-semibold">
                    {isPt && evt.dateStatus === 'candidate' ? 'Candidato Histórico' : 'Historical Candidate'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biblical History Timeline Ledger */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/50 text-xs font-serif font-bold uppercase tracking-wider text-emerald-400 whitespace-nowrap">
          II. {t.scriptureHistory.timelineTitle}
        </div>

        <div className="divide-y divide-slate-800">
          {biblicalEvents.map((evt) => (
            <div key={evt.id} className="p-4 sm:p-5 space-y-2 hover:bg-slate-900/40 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm sm:text-base font-serif font-bold text-emerald-300 whitespace-nowrap">{evt.title}</h4>
                <DataSourceBadge source={evt.dataSource} size="sm" language={language} />
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{evt.summary}</p>
              <div className="text-xs font-serif italic text-slate-300 whitespace-nowrap">
                {isPt ? 'Escrituras:' : 'Scripture:'} <span className="text-slate-100 not-italic font-semibold">{evt.biblicalRef}</span> · <span className="text-amber-400">{evt.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
