/**
 * @file src/components/FeastDetailModal.tsx
 * Book-like editorial modal displaying full Biblical Appointed Time details in English and Portuguese.
 */

import React from 'react';
import { X } from 'lucide-react';
import { CalculatedFeastOccurrence } from '../types/feasts';
import { Language } from '../i18n/translations';
import { getLocalizedPhaseName } from '../astronomy/moon';
import { LunarPhaseIcon } from './LunarPhaseIcon';

interface FeastDetailModalProps {
  occurrence: CalculatedFeastOccurrence | null;
  onClose: () => void;
  language: Language;
}

export const FeastDetailModal: React.FC<FeastDetailModalProps> = ({ occurrence, onClose, language }) => {
  if (!occurrence) return null;

  const { feast } = occurrence;
  const isPt = language === 'pt';

  const translateCategory = (cat: string) => {
    if (!isPt) return cat;
    const map: Record<string, string> = {
      FEAST: 'Festa',
      FAST: 'Jejum',
      SABBATH: 'Sábado',
      SOLEMN_ASSEMBLY: 'Assembleia Solene',
    };
    return map[cat] || cat;
  };

  const translateStatus = (st: string) => {
    if (!isPt) return st;
    const map: Record<string, string> = {
      MANDATORY: 'Obrigatório',
      MEMORIAL: 'Memorial',
      APPOINTED_TIME: 'Tempo Nomeado',
    };
    return map[st] || st;
  };

  const translateBoundary = (b: string) => {
    if (!isPt) return b;
    const map: Record<string, string> = {
      SUNSET: 'Pôr do Sol',
      DAY_START: 'Início do Dia',
      DAY_END: 'Fim do Dia',
      DAY_ZERO: 'Dia Zero',
      LUNAR_ANCHOR: 'Ancoragem Lunar',
    };
    return map[b] || b;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-700 text-slate-100 divide-y divide-slate-800 shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex items-start justify-between p-5 bg-slate-900/70">
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2 text-xs font-serif text-amber-400 uppercase tracking-wider">
              <span>{translateCategory(feast.category)}</span>
              <span className="text-slate-500">·</span>
              <span>{translateStatus(feast.status)}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-100">
              {feast.name} <span className="font-normal italic text-amber-300">({feast.hebrewName})</span>
            </h2>
            {feast.alternateNames && feast.alternateNames.length > 0 && (
              <p className="text-xs text-slate-300 italic font-serif">
                {isPt ? 'Também conhecida como:' : 'Also known as:'} {feast.alternateNames.join(' · ')}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active / Countdown Strip */}
        {(occurrence.isActiveToday || occurrence.isUpcoming) && (
          <div className="px-5 py-3 bg-slate-900/40 flex items-center justify-between text-xs font-serif">
            {occurrence.isActiveToday ? (
              <>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                  ● {isPt ? 'Tempo Nomeado Ativo Hoje' : 'Current Appointed Time'}
                </span>
                <span className="text-slate-200 tabular-nums">
                  {isPt ? 'Dia' : 'Day'} {occurrence.activeDayIndex} {isPt ? 'de' : 'of'} {feast.durationDays}
                </span>
              </>
            ) : (
              <>
                <span className="text-amber-400 font-semibold uppercase tracking-wider">
                  {isPt ? 'Próximo Tempo Nomeado' : 'Next Appointed Time'}
                </span>
                <span className="text-slate-200 tabular-nums italic">
                  {isPt ? `Inicia em ${occurrence.daysUntilStart} dias` : `Begins in ${occurrence.daysUntilStart} days`}
                </span>
              </>
            )}
          </div>
        )}

        {/* 2-Column Data Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 text-xs">
          {/* Sacred Calendar Parameters */}
          <div className="p-5 space-y-2.5">
            <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
              {isPt ? 'Calendário Sagrado' : 'Sacred Calendar'}
            </div>
            <div className="space-y-1.5 text-slate-200 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-400">{isPt ? 'Mês Sagrado:' : 'Sacred Month:'}</span>
                <strong className="text-amber-300">{isPt ? 'Mês' : 'Month'} {feast.sacredMonth}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isPt ? 'Dia de Início:' : 'Start Day:'}</span>
                <strong className="text-amber-300">{isPt ? 'Dia' : 'Day'} {feast.sacredDay}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isPt ? 'Duração:' : 'Duration:'}</span>
                <strong className="text-amber-300">{feast.durationDays} {isPt ? 'Dia(s)' : 'Day(s)'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isPt ? 'Observância:' : 'Observance:'}</span>
                <span className="text-slate-200">{translateBoundary(feast.beginsAt)} → {translateBoundary(feast.endsAt)}</span>
              </div>
            </div>
          </div>

          {/* Lunar Context */}
          <div className="p-5 space-y-2.5">
            <div className="text-xs font-serif text-blue-400 uppercase tracking-wider font-semibold">
              {isPt ? 'Fase Lunar no Início' : 'Lunar Phase at Start'}
            </div>
            <div className="flex items-center gap-3.5 pt-1">
              <LunarPhaseIcon
                fraction={occurrence.lunarIlluminationAtStart}
                phaseName={occurrence.lunarPhaseAtStart as any}
                size={38}
              />
              <div className="space-y-0.5 tabular-nums">
                <div className="text-sm font-serif font-semibold text-blue-300">
                  {getLocalizedPhaseName(occurrence.lunarPhaseAtStart, language)}
                </div>
                <div className="text-slate-200">
                  {(occurrence.lunarIlluminationAtStart * 100).toFixed(1)}% {isPt ? 'Iluminada' : 'Illuminated'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Civil Calendar Conversion Table */}
        <div className="p-5 space-y-2.5 text-xs tabular-nums">
          <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
            {isPt ? 'Correspondência no Calendário Civil' : 'Civil Calendar Correspondence'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">{isPt ? 'Início Gregoriano:' : 'Gregorian Start:'}</span>
              <span className="text-amber-300 font-semibold">{occurrence.gregorianStartDate.toISOString().split('T')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isPt ? 'Término Gregoriano:' : 'Gregorian End:'}</span>
              <span className="text-amber-300 font-semibold">{occurrence.gregorianEndDate.toISOString().split('T')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isPt ? 'Dia Juliano (Início):' : 'Julian Day (Start):'}</span>
              <span className="text-purple-300">{occurrence.julianDayStartNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isPt ? 'Dia Juliano (Fim):' : 'Julian Day (End):'}</span>
              <span className="text-purple-300">{occurrence.julianDayEndNumber}</span>
            </div>
          </div>
        </div>

        {/* Theological Summary */}
        <div className="p-5 space-y-1.5">
          <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
            {isPt ? 'Descrição e Significado' : 'Description & Significance'}
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {feast.description}
          </p>
        </div>

        {/* Scriptural References */}
        <div className="p-5 space-y-2">
          <div className="text-xs font-serif text-emerald-400 uppercase tracking-wider font-semibold">
            {isPt ? 'Referências Bíblicas Primárias' : 'Primary Scriptural References'}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-serif italic">
            {feast.biblicalReferences.map((ref, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-emerald-300">
                {ref}
              </span>
            ))}
          </div>
        </div>

        {/* Gospel of Dimenúveis Connection */}
        {feast.dimenueveisReference && (
          <div className="p-5 bg-slate-900/40 space-y-1.5">
            <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
              {isPt ? 'Conexão Canônica — Evangelho das Dimenúveis' : 'Canonical Connection — Gospel of Dimenuous'}
            </div>
            <p className="text-sm text-slate-200 font-serif italic leading-relaxed">
              {feast.dimenueveisReference}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
