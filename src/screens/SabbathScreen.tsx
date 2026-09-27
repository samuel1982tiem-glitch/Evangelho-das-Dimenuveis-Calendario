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
        <div className="p-4 sm:p-5 space-y-1.5 bg-slate-900/60">
          <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold whitespace-nowrap">
            {isPt ? 'Cadência Sabática · Ordem de 13×28' : 'Sabbath Cadence · 13×28 Order'}
          </div>
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
            {t.sabbath.heroTitle}
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {t.sabbath.description}
          </p>
        </div>

        {/* 3-Column Sabbath Classification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-xs">
          <div className="p-4 sm:p-5 space-y-1.5">
            <span className="font-serif font-bold text-amber-400 uppercase block text-xs tracking-wider whitespace-nowrap">
              I. {t.sabbath.weeklySabbathLabel}
            </span>
            <p className="text-slate-300 leading-relaxed">{t.sabbath.weeklySabbathDesc}</p>
          </div>
          <div className="p-4 sm:p-5 space-y-1.5">
            <span className="font-serif font-bold text-purple-300 uppercase block text-xs tracking-wider whitespace-nowrap">
              II. {t.sabbath.annualSabbathLabel}
            </span>
            <p className="text-slate-300 leading-relaxed">{t.sabbath.annualSabbathDesc}</p>
          </div>
          <div className="p-4 sm:p-5 space-y-1.5">
            <span className="font-serif font-bold text-emerald-400 uppercase block text-xs tracking-wider whitespace-nowrap">
              III. {t.sabbath.grandSabbathLabel}
            </span>
            <p className="text-slate-300 leading-relaxed">{t.sabbath.grandSabbathDesc}</p>
          </div>
        </div>
      </div>

      {/* Unbroken Continuity Proof & Full Schedule Ledger */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="p-4 sm:p-5 bg-slate-900/40 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 whitespace-nowrap">
              {t.sabbath.continuityProofTitle} ({currentSacredYear})
            </h3>
            <span className="text-xs font-serif italic text-emerald-400 tabular-nums font-semibold whitespace-nowrap">
              {isPt
                ? `Total: ${sabbathDays.length} (1 Dia Zero + 52 Semanais)`
                : `Total: ${sabbathDays.length} (1 Day Zero + 52 Weekly)`}
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
                className={`px-4 sm:px-5 py-3 flex items-center justify-between gap-2 transition-colors ${
                  isZero ? 'bg-purple-950/20' : 'hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 whitespace-nowrap">
                  <span className="w-6 text-slate-400 italic shrink-0">
                    {idx === 0 ? '0.' : `${idx}.`}
                  </span>
                  <div className="min-w-0">
                    <span className="text-slate-100 font-semibold">
                      {isZero
                        ? `${isPt ? 'Dia Zero' : 'Day Zero'}`
                        : `${isPt ? 'Mês' : 'Month'} ${(d as any).month}, ${isPt ? 'Dia' : 'Day'} ${(d as any).dayOfMonth}`}
                    </span>
                    <span className="text-slate-500 mx-1.5">·</span>
                    <span className="text-slate-300 italic">
                      {d.gregorianDate.toISOString().split('T')[0]}
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] sm:text-xs font-semibold shrink-0 whitespace-nowrap ${badge.textClass}`}>
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
