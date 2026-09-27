/**
 * @file src/components/GoogleCalendarSyncModal.tsx
 * Secret-free Google Calendar modal allowing users to add individual Biblical Feasts
 * directly into their Google Calendar mobile app (via Android CalendarContract Intent or
 * Google Calendar TEMPLATE deep link) or export/import all 8 Feasts via .ICS.
 */

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Download,
  X,
} from 'lucide-react';
import { CalculatedFeastOccurrence } from '../types/feasts';
import { Language } from '../i18n/translations';
import {
  openInGoogleCalendarApp,
  exportFeastsToIcs,
  openGoogleCalendarImportPage,
} from '../services/googleCalendarService';

interface GoogleCalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  occurrences: CalculatedFeastOccurrence[];
  sacredYear: number;
  language: Language;
}

export const GoogleCalendarSyncModal: React.FC<GoogleCalendarSyncModalProps> = ({
  isOpen,
  onClose,
  occurrences,
  sacredYear,
  language,
}) => {
  const isPt = language === 'pt';
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [icsDownloaded, setIcsDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleAddSingleFeast = (occ: CalculatedFeastOccurrence) => {
    openInGoogleCalendarApp(occ, language);
    setAddedIds((prev) => ({ ...prev, [occ.feast.id]: true }));
  };

  const handleDownloadAllIcs = () => {
    exportFeastsToIcs(occurrences, sacredYear, language);
    setIcsDownloaded(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-calendar-modal-title"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl divide-y divide-slate-800 font-serif">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3.5 bg-slate-900">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span
              id="google-calendar-modal-title"
              className="text-xs uppercase tracking-wider text-amber-400 font-semibold whitespace-nowrap truncate"
            >
              {isPt ? 'Incluir no Google Agenda Móvel' : 'Add to Google Mobile Calendar'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-7 h-7 border border-slate-700 bg-slate-950 hover:border-amber-500/60 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer shrink-0"
            title={isPt ? 'Fechar' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Summary Description */}
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 whitespace-nowrap">
              {occurrences.length === 1
                ? occurrences[0].feast.name
                : isPt
                  ? `Festas Bíblicas · Ano Sagrado ${sacredYear}`
                  : `Biblical Feasts · Sacred Year ${sacredYear}`}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isPt
                ? 'Toque em "Incluir no Google Agenda" ao lado de qualquer festa para abrir diretamente no aplicativo Google Agenda da sua conta no celular, ou baixe o arquivo .ICS com todas as festas e alertas de Pôr do Sol.'
                : 'Tap "Add to Google Calendar" next to any feast to open it directly in your mobile Google Calendar app for your Google account, or download the .ICS file with all feasts and Sunset alerts.'}
            </p>
          </div>

          {/* List of Feasts with 1-Tap Add to Google Calendar */}
          <div className="border border-slate-800 bg-slate-900/40 divide-y divide-slate-800 max-h-64 overflow-y-auto">
            <div className="px-3.5 py-2 bg-slate-900/80 text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between whitespace-nowrap">
              <span>
                {isPt ? 'Festas Bíblicas Descritas' : 'Described Biblical Feasts'} ({occurrences.length})
              </span>
              <span className="text-slate-400 italic font-normal">
                {isPt ? 'Toque para incluir' : 'Tap to add'}
              </span>
            </div>
            {occurrences.map((occ) => {
              const startISO = occ.gregorianStartDate.toISOString().split('T')[0];
              const endISO = occ.gregorianEndDate.toISOString().split('T')[0];
              const wasAdded = Boolean(addedIds[occ.feast.id]);
              return (
                <div
                  key={occ.feast.id}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs hover:bg-slate-900/60 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 whitespace-nowrap truncate">
                      {occ.feast.name}{' '}
                      <span className="font-normal italic text-amber-300">({occ.feast.hebrewName})</span>
                    </div>
                    <div className="text-slate-400 tabular-nums whitespace-nowrap">
                      {isPt ? 'Mês' : 'Month'} {occ.feast.sacredMonth}, {isPt ? 'Dia' : 'Day'}{' '}
                      {occ.feast.sacredDay} · {startISO === endISO ? startISO : `${startISO} → ${endISO}`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSingleFeast(occ)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold transition-colors shrink-0 whitespace-nowrap cursor-pointer ${
                      wasAdded
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-amber-500 hover:bg-amber-400 border-amber-500 text-slate-950'
                    }`}
                  >
                    {wasAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{isPt ? 'Aberto no Agenda' : 'Opened in Calendar'}</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span>{isPt ? 'Incluir no Google Agenda' : 'Add to Google Calendar'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bulk .ICS Export for All 8 Feasts */}
          <div className="border border-slate-800 bg-slate-900/30 p-4 space-y-2.5">
            <div className="text-xs uppercase tracking-wider font-semibold text-amber-400 whitespace-nowrap">
              {isPt
                ? 'Importar Todas as Festas de Uma Vez (.ICS)'
                : 'Import All Feasts at Once (.ICS)'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isPt
                ? 'Baixe o pacote .ICS contendo todas as festas selecionadas com lembretes de 24h e Pôr do Sol. Ao abrir o arquivo .ICS no celular, o aplicativo Google Agenda importa todas as festas para sua conta Google.'
                : 'Download the .ICS bundle containing all selected feasts with 24h and Sunset reminders. Opening the .ICS file on your phone imports all feasts into your Google Calendar account.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={handleDownloadAllIcs}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isPt
                    ? `Baixar Arquivo .ICS (${occurrences.length} Festas)`
                    : `Download .ICS File (${occurrences.length} Feasts)`}
                </span>
              </button>

              <button
                type="button"
                onClick={openGoogleCalendarImportPage}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-700 bg-slate-950 hover:border-amber-500/60 text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>{isPt ? 'Página de Importação Google' : 'Google Import Page'}</span>
              </button>
            </div>

            {icsDownloaded && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  {isPt
                    ? 'Arquivo .ICS gerado! Abra o arquivo baixado para importar no seu Google Agenda.'
                    : '.ICS file generated! Open the downloaded file to import into your Google Calendar.'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 sm:px-5 py-3 bg-slate-900/80 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            {isPt ? 'Fechar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
