/**
 * @file src/components/DataSourceBadge.tsx
 * Scholarly book-style source citation label with bilingual support and high contrast.
 */

import React from 'react';
import { DataSourceType } from '../types/calendar';
import { Language } from '../i18n/translations';

interface DataSourceBadgeProps {
  source: DataSourceType;
  size?: 'sm' | 'md';
  language?: Language;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  source,
  size = 'sm',
  language = 'en',
}) => {
  const isPt = language === 'pt';

  const getBadgeConfig = () => {
    switch (source) {
      case 'ASTRONOMICAL_CALCULATION':
        return {
          label: isPt ? 'Astronômico' : 'Astronomical',
          style: 'border-blue-500/40 text-blue-300 bg-blue-950/30',
        };
      case 'BIBLICAL_TEXT':
        return {
          label: isPt ? 'Texto Bíblico' : 'Biblical Text',
          style: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
        };
      case 'HISTORICAL_RECORD':
        return {
          label: isPt ? 'Histórico' : 'Historical',
          style: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
        };
      case 'TRADITIONAL_CHRONOLOGY':
        return {
          label: isPt ? 'Cronologia' : 'Chronology',
          style: 'border-purple-500/40 text-purple-300 bg-purple-950/30',
        };
      case 'INTERPRETIVE_MODEL':
        return {
          label: isPt ? 'Interpretativo' : 'Interpretive',
          style: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
        };
      case 'HYPOTHETICAL_MODEL':
        return {
          label: isPt ? 'Hipotético' : 'Hypothetical',
          style: 'border-slate-700 text-slate-300 bg-slate-900',
        };
      default:
        return {
          label: isPt ? 'Geral' : 'General',
          style: 'border-slate-800 text-slate-400 bg-slate-950',
        };
    }
  };

  const config = getBadgeConfig();
  const sizing = size === 'sm' ? 'py-0.5 px-2 text-xs' : 'py-1 px-2.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-serif italic border whitespace-nowrap shrink-0 ${config.style} ${sizing}`}
    >
      <span>§</span>
      <span>{config.label}</span>
    </span>
  );
};
