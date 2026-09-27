/**
 * @file src/screens/GreatWeekScreen.tsx
 * Book-like 7,000-Year Great Week (Millennial Sabbath Model) Inspection Screen
 * with Sacred Time Hierarchy (Year -> Month -> Week -> Sabbath -> Feast -> Millennium).
 */

import React from 'react';
import { CalendarConfiguration } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { calculateMillennialPosition } from '../chronology/chronologyEngine';
import { calculateFeastOccurrences } from '../calendar/feastEngine';
import { DataSourceBadge } from '../components/DataSourceBadge';

interface GreatWeekScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  language: Language;
}

export const GreatWeekScreen: React.FC<GreatWeekScreenProps> = ({ systemDate, config, language }) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const millennialPos = calculateMillennialPosition(
    systemDate.getFullYear(),
    config.chronologyModelId,
    config.joshuaAdjustmentStatus === 'ACCEPTED' ? 1 : 0,
    language
  );

  const sacredYear = systemDate.getFullYear() + 4024;
  const feastOccurrences = calculateFeastOccurrences(
    sacredYear,
    config.lunarAnchorMode,
    config.feastCalendarModel,
    systemDate,
    language
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Interpretive Notice */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-slate-900/60">
          <div>
            <div className="text-xs font-serif text-purple-300 uppercase tracking-wider font-semibold whitespace-nowrap">
              {isPt ? 'Macro-Cronologia · 7.000 Anos' : 'Macro-Chronology · 7,000 Years'}
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
              {t.greatWeek.heroTitle}
            </h2>
          </div>
          <DataSourceBadge source="INTERPRETIVE_MODEL" size="sm" language={language} />
        </div>

        <div className="p-4 sm:p-5 bg-amber-950/15 space-y-1">
          <div className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider whitespace-nowrap">
            {t.greatWeek.noticeTitle}
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {t.greatWeek.noticeText}
          </p>
        </div>

        {/* 4-Column Almanac Readout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x divide-slate-800 font-serif tabular-nums">
          <div className="p-3.5 sm:p-5 space-y-1">
            <span className="text-[11px] sm:text-xs italic text-slate-400 block whitespace-nowrap">{t.greatWeek.elapsedYears}</span>
            <strong className="text-lg sm:text-2xl font-serif font-bold text-amber-400 block whitespace-nowrap">
              {millennialPos.elapsedSolarYears} {isPt ? 'Anos' : 'Yrs'}
            </strong>
            <span className="text-[11px] sm:text-xs text-slate-300 block whitespace-nowrap">
              {t.greatWeek.sinceCreation} ({millennialPos.creationEpochBCE} {isPt ? 'a.C.' : 'BCE'})
            </span>
          </div>

          <div className="p-3.5 sm:p-5 space-y-1">
            <span className="text-[11px] sm:text-xs italic text-slate-400 block whitespace-nowrap">{t.greatWeek.activeMillennium}</span>
            <strong className="text-lg sm:text-2xl font-serif font-bold text-purple-300 block whitespace-nowrap">
              {millennialPos.millenniumName}
            </strong>
            <span className="text-[11px] sm:text-xs text-amber-400 font-semibold block whitespace-nowrap">
              {isPt ? 'Ano' : 'Year'} {millennialPos.yearOfMillennium} / 1000
            </span>
          </div>

          <div className="p-3.5 sm:p-5 space-y-1">
            <span className="text-[11px] sm:text-xs italic text-slate-400 block whitespace-nowrap">{t.greatWeek.boundary6000}</span>
            <strong className="text-lg sm:text-2xl font-serif font-bold text-blue-300 block whitespace-nowrap">
              {millennialPos.boundary6000CEYear} {isPt ? 'd.C.' : 'CE'}
            </strong>
            <span className="text-[11px] sm:text-xs text-slate-300 block whitespace-nowrap">
              {isPt ? `Em ${millennialPos.yearsUntil6000Boundary} anos` : `In ${millennialPos.yearsUntil6000Boundary} years`}
            </span>
          </div>

          <div className="p-3.5 sm:p-5 space-y-1">
            <span className="text-[11px] sm:text-xs italic text-slate-400 block whitespace-nowrap">{t.greatWeek.boundary7000}</span>
            <strong className="text-lg sm:text-2xl font-serif font-bold text-emerald-300 block whitespace-nowrap">
              {millennialPos.boundary7000CEYear} {isPt ? 'd.C.' : 'CE'}
            </strong>
            <span className="text-[11px] sm:text-xs text-slate-300 block whitespace-nowrap">
              {isPt ? `Em ${millennialPos.yearsUntil7000Boundary} anos` : `In ${millennialPos.yearsUntil7000Boundary} years`}
            </span>
          </div>
        </div>
      </div>

      {/* SACRED TIME HIERARCHY CHAIN */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/50 flex items-center justify-between gap-2 text-xs font-serif">
          <span className="text-amber-400 font-bold uppercase tracking-wider whitespace-nowrap">
            {isPt ? 'Hierarquia de Tempo Sagrado' : 'Sacred Time Hierarchy'}
          </span>
          <span className="text-slate-300 italic whitespace-nowrap">
            {isPt ? '6 Níveis' : '6 Tiers'}
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-slate-800 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 bg-slate-900/30 font-serif text-xs text-center">
            {[
              { roman: 'I', label: isPt ? 'Ano (364 Dias)' : 'Year (364 Days)' },
              { roman: 'II', label: isPt ? 'Mês (13 × 28d)' : 'Month (13 × 28d)' },
              { roman: 'III', label: isPt ? 'Semana (52 × 7d)' : 'Week (52 × 7d)' },
              { roman: 'IV', label: isPt ? 'Sábado (7º Dia)' : 'Sabbath (7th Day)' },
              { roman: 'V', label: isPt ? 'Festas (Moedim)' : 'Feasts (Moedim)' },
              { roman: 'VI', label: isPt ? 'Milênio (7.000a)' : 'Millennium (7,000y)' },
            ].map((tier, i) => (
              <div key={tier.roman} className={`p-3 whitespace-nowrap ${i === 5 ? 'bg-purple-950/30 text-purple-300 font-semibold' : 'text-slate-200'}`}>
                <span className="text-xs italic text-slate-400 block">{tier.roman}.</span>
                <span className="text-[11px] sm:text-xs">{tier.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-300 font-serif italic">
            {isPt
              ? 'O ciclo anual de festas se repete a cada ano, enquanto o Sábado Milenar representa o sétimo milênio na cronologia interpretativa.'
              : 'The annual feast cycle repeats within each year, while the Millennial Sabbath represents the seventh millennium in the selected chronology.'}
          </p>
        </div>
      </div>

      {/* Annual Feast Cycle Embedded Matrix */}
      <div className="border border-slate-800 bg-slate-950">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/50 border-b border-slate-800 text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
          {isPt ? 'Ciclo Anual de Festas' : 'Annual Feast Cycle'} · {sacredYear}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 font-serif text-xs tabular-nums">
          {feastOccurrences.map((occ) => (
            <div key={occ.feast.id} className="p-3 sm:p-3.5 space-y-1 min-w-0">
              <span className="text-[11px] sm:text-xs text-amber-400 font-semibold block whitespace-nowrap">
                {isPt ? 'Mês' : 'Month'} {occ.feast.sacredMonth}, {isPt ? 'Dia' : 'Day'} {occ.feast.sacredDay}
              </span>
              <strong className="text-[11px] sm:text-xs text-slate-100 block whitespace-nowrap font-serif">
                {occ.feast.name}
              </strong>
              <span className="text-[11px] sm:text-xs italic text-slate-300 block whitespace-nowrap">
                {occ.feast.durationDays}d · {occ.gregorianStartDate.toISOString().slice(5, 10)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Millennia Matrix */}
      <div className="border border-slate-800 bg-slate-950">
        <div className="px-4 sm:px-5 py-3 bg-slate-900/50 border-b border-slate-800 text-xs font-serif font-bold uppercase tracking-wider text-slate-100 whitespace-nowrap">
          {t.greatWeek.sevenMillenniaTitle}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {[
            { num: 1, name: isPt ? 'I. 1º Milênio — Época Adâmica' : 'I. 1st Millennium — Adamic Age', span: '0001 – 1000 AM' },
            { num: 2, name: isPt ? 'II. 2º Milênio — Era Patriarcal' : 'II. 2nd Millennium — Patriarchal Age', span: '1001 – 2000 AM' },
            { num: 3, name: isPt ? 'III. 3º Milênio — Era do Êxodo' : 'III. 3rd Millennium — Exodus Age', span: '2001 – 3000 AM' },
            { num: 4, name: isPt ? 'IV. 4º Milênio — Reis e Profetas' : 'IV. 4th Millennium — Kingdom Age', span: '3001 – 4000 AM' },
            { num: 5, name: isPt ? 'V. 5º Milênio — Era Apostólica' : 'V. 5th Millennium — Apostolic Age', span: '4001 – 5000 AM' },
            { num: 6, name: isPt ? 'VI. 6º Milênio — Era das Nações' : 'VI. 6th Millennium — Nations Age', span: '5001 – 6000 AM' },
            { num: 7, name: isPt ? 'VII. 7º Milênio — Sábado Milenar' : 'VII. 7th Millennium — Sabbath Rest', span: '6001 – 7000 AM', isSabbath: true },
          ].map((m) => {
            const isCurrent = millennialPos.millenniumNumber === m.num;

            return (
              <div
                key={m.num}
                className={`p-4 sm:p-5 border-b border-slate-800 space-y-1.5 ${
                  isCurrent
                    ? 'bg-purple-950/35'
                    : m.isSabbath
                    ? 'bg-amber-950/20'
                    : 'bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-serif italic tabular-nums whitespace-nowrap">
                  <span className="text-slate-300">{m.span}</span>
                  {isCurrent && (
                    <span className="text-purple-300 font-semibold not-italic">
                      ● {isPt ? 'Atual' : 'Active'}
                    </span>
                  )}
                </div>
                <h4 className={`text-sm sm:text-base font-serif font-bold whitespace-nowrap ${m.isSabbath ? 'text-amber-300' : 'text-slate-100'}`}>
                  {m.name}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scriptural Foundations */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="px-5 py-3 bg-slate-900/50 text-xs font-serif font-bold uppercase tracking-wider text-amber-400">
          {t.greatWeek.scriptureFoundationsTitle}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-sm text-slate-200">
          <div className="p-5 space-y-1.5">
            <span className="font-serif text-xs text-emerald-400 font-bold uppercase tracking-wider block">
              {isPt ? '2 Pedro 3:8' : '2 Peter 3:8'}
            </span>
            <p className="leading-relaxed font-serif italic">
              {isPt
                ? '“Mas, amados, não ignoreis uma coisa: que um dia para o Senhor é como mil anos, e mil anos como um dia.”'
                : '“But, beloved, be not ignorant of this one thing, that one day is with the Lord as a thousand years, and a thousand years as one day.”'}
            </p>
          </div>
          <div className="p-5 space-y-1.5">
            <span className="font-serif text-xs text-emerald-400 font-bold uppercase tracking-wider block">
              {isPt ? 'Salmo 90:4' : 'Psalm 90:4'}
            </span>
            <p className="leading-relaxed font-serif italic">
              {isPt
                ? '“Porque mil anos são aos teus olhos como o dia de ontem que passou, e como a vigília da noite.”'
                : '“For a thousand years in thy sight are but as yesterday when it is past, and as a watch in the night.”'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
