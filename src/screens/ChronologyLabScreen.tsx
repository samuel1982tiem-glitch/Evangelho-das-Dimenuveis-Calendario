/**
 * @file src/screens/ChronologyLabScreen.tsx
 * Book-like Chronology Study for comparing chronological models,
 * toggling Joshua 10 historical corrections, and testing lunar anchoring modes.
 */

import React from 'react';
import { CalendarConfiguration } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getLocalizedChronologyModels } from '../chronology/models';
import { calculateMillennialPosition } from '../chronology/chronologyEngine';
import { calculateCalendarDrift } from '../chronology/conversions';
import { DataSourceBadge } from '../components/DataSourceBadge';

interface ChronologyLabScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  onUpdateConfig: (newConfig: Partial<CalendarConfiguration>) => void;
  language: Language;
}

export const ChronologyLabScreen: React.FC<ChronologyLabScreenProps> = ({
  systemDate,
  config,
  onUpdateConfig,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const driftAnalysis = calculateCalendarDrift(language);

  const currentGregorianYear = systemDate.getFullYear();
  const joshuaOffsetDays = config.joshuaAdjustmentStatus === 'ACCEPTED' ? 1 : 0;

  const localizedModels = getLocalizedChronologyModels(language);
  const modelComparisons = localizedModels.map((model) => {
    const pos = calculateMillennialPosition(currentGregorianYear, model.id, joshuaOffsetDays, language);
    return {
      model,
      pos,
    };
  });

  const translateModelStatus = (st: string) => {
    if (!isPt) return st;
    if (st === 'traditional') return 'Tradicional';
    if (st === 'interpretive') return 'Interpretativo';
    if (st === 'hypothetical') return 'Hipotético';
    return st;
  };

  return (
    <div className="space-y-6">
      {/* Header & Parameter Control Matrix */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-slate-900/60">
          <div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
              {t.chronologyLab.heroTitle}
            </h2>
            <p className="text-xs text-slate-300 font-serif italic mt-0.5">
              {t.chronologyLab.description}
            </p>
          </div>
          <DataSourceBadge source="INTERPRETIVE_MODEL" size="sm" language={language} />
        </div>

        {/* 3-Column Parameter Control Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-xs font-serif">
          {/* Active Chronology Model Selector */}
          <div className="p-4 sm:p-5 space-y-2">
            <label className="text-xs text-slate-300 uppercase tracking-wider font-semibold block whitespace-nowrap">
              {t.chronologyLab.activeModelLabel}
            </label>
            <select
              value={config.chronologyModelId}
              onChange={(e) => onUpdateConfig({ chronologyModelId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs font-serif text-amber-300 focus:outline-none focus:border-amber-500"
            >
              {localizedModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.creationEpochBCE} {isPt ? 'a.C.' : 'BCE'})
                </option>
              ))}
            </select>
          </div>

          {/* Joshua 10 Long Day Adjustment Toggle */}
          <div className="p-4 sm:p-5 space-y-2">
            <label className="text-xs text-slate-300 uppercase tracking-wider font-semibold block whitespace-nowrap">
              {t.chronologyLab.joshuaCorrectionLabel}
            </label>
            <div className="grid grid-cols-3 border border-slate-700 divide-x divide-slate-700 bg-slate-900">
              {(['OFF', 'PROPOSED', 'ACCEPTED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateConfig({ joshuaAdjustmentStatus: status })}
                  className={`py-2 px-1 text-[11px] sm:text-xs font-serif font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    config.joshuaAdjustmentStatus === status
                      ? status === 'ACCEPTED'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {status === 'OFF' && (isPt ? 'Desligado' : 'Off')}
                  {status === 'PROPOSED' && (isPt ? 'Proposto' : 'Proposed')}
                  {status === 'ACCEPTED' && (isPt ? 'Aceito (+1d)' : 'Accepted (+1d)')}
                </button>
              ))}
            </div>
          </div>

          {/* Lunar Anchor Mode Selector */}
          <div className="p-4 sm:p-5 space-y-2">
            <label className="text-xs text-slate-300 uppercase tracking-wider font-semibold block whitespace-nowrap">
              {t.chronologyLab.anchorModeLabel}
            </label>
            <select
              value={config.lunarAnchorMode}
              onChange={(e) => onUpdateConfig({ lunarAnchorMode: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs font-serif text-blue-300 focus:outline-none focus:border-blue-500"
            >
              <option value="CONJUNCTION">{t.moon.modeA}</option>
              <option value="VISIBLE_CRESCENT">{t.moon.modeB}</option>
              <option value="OBSERVATIONAL">{t.moon.modeC}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Model Comparison Table */}
      <div className="border border-slate-800 bg-slate-950 overflow-x-auto">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/50 border-b border-slate-800 text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
          {t.chronologyLab.matrixTitle} ({t.chronologyLab.targetYear} {currentGregorianYear} {isPt ? 'd.C.' : 'CE'})
        </div>

        <table className="w-full text-left border-collapse text-xs font-serif tabular-nums whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-300 italic text-xs">
              <th className="p-3.5">{t.chronologyLab.modelNameTh}</th>
              <th className="p-3.5">{t.chronologyLab.creationEpochTh}</th>
              <th className="p-3.5">{t.chronologyLab.elapsedSolarTh}</th>
              <th className="p-3.5">{t.chronologyLab.boundary6000Th}</th>
              <th className="p-3.5">{t.chronologyLab.currentMillenniumTh}</th>
              <th className="p-3.5">{t.chronologyLab.statusTh}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {modelComparisons.map(({ model, pos }) => {
              const isSelected = config.chronologyModelId === model.id;

              return (
                <tr
                  key={model.id}
                  onClick={() => onUpdateConfig({ chronologyModelId: model.id })}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-950/25 font-semibold' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <td className="p-3.5 text-amber-300 font-semibold">
                    {isSelected ? '✦ ' : ''}{model.name}
                  </td>
                  <td className="p-3.5 text-purple-300">{model.creationEpochBCE} {isPt ? 'a.C.' : 'BCE'}</td>
                  <td className="p-3.5 text-slate-100">{pos.elapsedSolarYears} {isPt ? 'Anos' : 'Years'}</td>
                  <td className="p-3.5 text-blue-300">{pos.boundary6000CEYear} {isPt ? 'd.C.' : 'CE'}</td>
                  <td className="p-3.5 text-emerald-300">{pos.millenniumName} ({isPt ? 'Ano' : 'Yr'} {pos.yearOfMillennium})</td>
                  <td className="p-3.5 text-slate-300 italic capitalize">
                    {translateModelStatus(model.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Calendar Drift & Precision Mathematics */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="p-4 sm:p-5 space-y-1.5">
          <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
            {t.chronologyLab.driftTitle}
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            {driftAnalysis.explanation}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 font-serif text-xs tabular-nums">
          <div className="p-4 sm:p-5 space-y-1 whitespace-nowrap">
            <span className="text-slate-400 block text-xs italic">{t.chronologyLab.annualDrift}</span>
            <strong className="text-amber-300 text-lg font-serif">{driftAnalysis.sacredToSolarAnnualDriftDays} {t.chronologyLab.daysYear}</strong>
          </div>
          <div className="p-4 sm:p-5 space-y-1 whitespace-nowrap">
            <span className="text-slate-400 block text-xs italic">{t.chronologyLab.drift100}</span>
            <strong className="text-amber-300 text-lg font-serif">{driftAnalysis.driftIn100YearsDays} {isPt ? 'Dias' : 'Days'}</strong>
          </div>
          <div className="p-4 sm:p-5 space-y-1 whitespace-nowrap">
            <span className="text-slate-400 block text-xs italic">{t.chronologyLab.drift1000}</span>
            <strong className="text-amber-300 text-lg font-serif">{driftAnalysis.driftIn1000YearsDays} {isPt ? 'Dias' : 'Days'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
