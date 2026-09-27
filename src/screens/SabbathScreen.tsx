/**
 * @file src/screens/SabbathScreen.tsx
 * Book-like Unbroken 7-Day Weekly Sabbath & Annual Sabbath Ledger, Proof, and Schedule.
 */

import React from 'react';
import { CalendarConfiguration } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { generateSacredYearDays } from '../calendar/sacredCalendar';
import { getSabbathBadgeLabel } from '../calendar/sabbath';

interface SabbathScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  language: Language;
}

export const SabbathScreen: React.FC<SabbathScreenProps> = ({ systemDate, config, language }) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const currentSacredYear = systemDate.getFullYear() + 4024;
  const days = generateSacredYearDays(currentSacredYear, config.lunarAnchorMode);

  const sabbathDays = days.filter((d) => d.kind === 'DAY_ZERO' || (d.kind === 'NUMBERED_DAY' && d.isWeeklySabbath));

  return (
    <div className="space-y-6">
      {/* Book Header & Taxonomy Matrix */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="p-5 space-y-1.5 bg-slate-900/60">
          <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
            {isPt ? 'Cadência Sabática · Ordem Perpétua de 13×28' : 'Sabbath Cadence · Perpetual 13×28 Order'}
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-100">
            {t.sabbath.heroTitle}
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {t.sabbath.description}
          </p>
        </div>

        {/* 3-Column Sabbath Classification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-xs">
          <div className="p-5 space-y-1.5">
            <span className="font-serif font-bold text-amber-400 uppercase block text-xs tracking-wider">
              I. {t.sabbath.weeklySabbathLabel}
            </span>
            <p className="text-slate-300 leading-relaxed">{t.sabbath.weeklySabbathDesc}</p>
          </div>
          <div className="p-5 space-y-1.5">
            <span className="font-serif font-bold text-purple-300 uppercase block text-xs tracking-wider">
              II. {t.sabbath.annualSabbathLabel}
            </span>
            <p className="text-slate-300 leading-relaxed">{t.sabbath.annualSabbathDesc}</p>
          </div>
          <div className="p-5 space-y-1.5">
            <span className="font-serif font-bold text-emerald-400 uppercase block text-xs tracking-wider">
              III. {t.sabbath.grandSabbathLabel}
            </span>
            <p className="text-slate-300 leading-relaxed">{t.sabbath.grandSabbathDesc}</p>
          </div>
        </div>
      </div>

      {/* Unbroken Continuity Proof & Full Schedule Ledger */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="p-5 bg-slate-900/40 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-serif font-bold text-slate-100">
              {t.sabbath.continuityProofTitle} — {isPt ? 'Ano Sagrado' : 'Sacred Year'} {currentSacredYear}
            </h3>
            <span className="text-xs font-serif italic text-emerald-400 tabular-nums font-semibold">
              {isPt
                ? `Total de Observâncias: ${sabbathDays.length} (1 Dia Zero + 52 Semanais)`
                : `Total Observances: ${sabbathDays.length} (1 Day Zero + 52 Weekly)`}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.sabbath.proofText}
          </p>
        </div>

        {/* Book Schedule Ledger */}
        <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-800 font-serif text-xs tabular-nums">
          {sabbathDays.map((d, idx) => {
            const isZero = d.kind === 'DAY_ZERO';
            const badge = getSabbathBadgeLabel(d.sabbathType, language);

            return (
              <div
                key={idx}
                className={`px-5 py-3 flex items-center justify-between gap-4 transition-colors ${
                  isZero ? 'bg-purple-950/20' : 'hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-slate-400 italic">
                    {idx === 0 ? '0.' : `${idx}.`}
                  </span>
                  <div>
                    <span className="text-slate-100 font-semibold">
                      {isZero
                        ? `${isPt ? 'Dia Zero — Sábado Anual de Ano Novo' : 'Day Zero — Annual New Year Sabbath'}`
                        : `${isPt ? 'Mês' : 'Month'} ${(d as any).month}, ${isPt ? 'Dia' : 'Day'} ${(d as any).dayOfMonth} (${isPt ? 'Dia do Ano' : 'Day of Year'} ${(d as any).dayOfYear}/364)`}
                    </span>
                    <span className="text-slate-500 mx-2">·</span>
                    <span className="text-slate-300 italic">
                      {d.gregorianDate.toISOString().split('T')[0]}
                    </span>
                  </div>
                </div>

                <span className={`text-xs font-semibold ${badge.textClass}`}>
                  {badge.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
