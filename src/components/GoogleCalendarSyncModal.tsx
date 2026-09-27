/**
 * @file src/components/GoogleCalendarSyncModal.tsx
 * Google Calendar integration modal with official "Sign in with Google" button,
 * mandatory user confirmation dialog before inserting events into Google Calendar,
 * and mobile Google Calendar app / .ICS quick actions.
 */

import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Download,
  LogOut,
  X,
} from 'lucide-react';
import { CalculatedFeastOccurrence } from '../types/feasts';
import { Language } from '../i18n/translations';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  getCurrentGoogleUser,
  insertFeastsToGoogleCalendar,
  openInGoogleCalendarApp,
  exportFeastsToIcs,
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
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [createdCount, setCreatedCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser) => {
        setUser(authedUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSyncStatus('IDLE');
      setStatusMessage('');
      setCreatedCount(0);
      getAccessToken().then((token) => {
        if (token && getCurrentGoogleUser()) {
          setUser(getCurrentGoogleUser());
          setNeedsAuth(false);
        } else {
          setNeedsAuth(true);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setSyncStatus('IDLE');
    setStatusMessage('');
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      setSyncStatus('ERROR');
      setStatusMessage(
        isPt
          ? 'Não foi possível concluir o login com o Google nesta janela. Você também pode usar os botões abaixo para abrir diretamente no app Google Agenda do celular ou baixar o arquivo .ICS.'
          : 'Could not complete Google sign-in in this window. You can also use the buttons below to open directly in your mobile Google Calendar app or download the .ICS file.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setSyncStatus('IDLE');
    setStatusMessage('');
  };

  const handleConfirmInsertEvents = async () => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setSyncStatus('SYNCING');
    setStatusMessage('');
    try {
      const res = await insertFeastsToGoogleCalendar(occurrences, language);
      setCreatedCount(res.createdCount);
      setSyncStatus('SUCCESS');
      setStatusMessage(
        isPt
          ? `${res.createdCount} festa(s) bíblica(s) incluída(s) com sucesso no seu Google Agenda com lembretes automáticos!`
          : `Successfully added ${res.createdCount} Biblical feast(s) to your Google Calendar with automatic reminders!`
      );
    } catch (err: any) {
      if (err?.message === 'NO_ACCESS_TOKEN' || err?.message === 'AUTH_EXPIRED') {
        setNeedsAuth(true);
        setSyncStatus('IDLE');
      } else {
        setSyncStatus('ERROR');
        setStatusMessage(
          isPt
            ? 'Erro ao sincronizar com a API do Google Agenda. Verifique sua permissão ou use o botão de abrir no app abaixo.'
            : 'Error syncing with Google Calendar API. Please check your permissions or use the open in app button below.'
        );
      }
    }
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
              {isPt ? 'Incluir no Google Agenda' : 'Add to Google Calendar'}
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
                  ? `8 Festas Bíblicas · Ano Sagrado ${sacredYear}`
                  : `8 Biblical Feasts · Sacred Year ${sacredYear}`}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isPt
                ? 'Conecte sua conta Google para incluir os eventos diretamente no seu Google Agenda móvel com alertas de véspera (Pôr do Sol), ou abra diretamente no aplicativo do celular.'
                : 'Connect your Google account to insert events directly into your mobile Google Calendar with evening Sunset reminders, or open directly in your phone calendar app.'}
            </p>
          </div>

          {/* List of Feasts to be Added (Confirmation Preview) */}
          <div className="border border-slate-800 bg-slate-900/40 divide-y divide-slate-800 max-h-52 overflow-y-auto">
            <div className="px-3.5 py-2 bg-slate-900/80 text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between whitespace-nowrap">
              <span>
                {isPt ? 'Eventos Selecionados para Inclusão' : 'Events Selected to Add'} ({occurrences.length})
              </span>
              <span className="text-slate-400 italic font-normal">
                {isPt ? 'Datas Gregorianas' : 'Gregorian Dates'}
              </span>
            </div>
            {occurrences.map((occ) => {
              const startISO = occ.gregorianStartDate.toISOString().split('T')[0];
              const endISO = occ.gregorianEndDate.toISOString().split('T')[0];
              return (
                <div
                  key={occ.feast.id}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 whitespace-nowrap truncate">
                      {occ.feast.name} <span className="font-normal italic text-amber-300">({occ.feast.hebrewName})</span>
                    </div>
                    <div className="text-slate-400 tabular-nums whitespace-nowrap">
                      {isPt ? 'Mês' : 'Month'} {occ.feast.sacredMonth}, {isPt ? 'Dia' : 'Day'} {occ.feast.sacredDay} ·{' '}
                      {startISO === endISO ? startISO : `${startISO} → ${endISO}`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openInGoogleCalendarApp(occ, language)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-amber-300 text-xs transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                    title={isPt ? 'Abrir este evento no app Google Agenda' : 'Open this event in Google Calendar app'}
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span>{isPt ? 'Abrir no App' : 'Open in App'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Google Account OAuth Section & Mandatory Confirmation */}
          <div className="border border-slate-800 bg-slate-900/30 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 whitespace-nowrap">
                {isPt ? 'Sincronização Direta (Conta Google)' : 'Direct Sync (Google Account)'}
              </span>
              {user && !needsAuth && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{isPt ? 'Trocar Conta' : 'Switch Account'}</span>
                </button>
              )}
            </div>

            {needsAuth ? (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isPt
                    ? 'Faça login com sua conta do Google para autorizar a inclusão automática das Festas Bíblicas no seu Google Agenda:'
                    : 'Sign in with your Google account to authorize adding the Biblical Feasts directly to your Google Calendar:'}
                </p>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="gsi-material-button inline-flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-sans text-xs sm:text-sm font-medium border border-slate-300 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="w-4 h-4 shrink-0">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-full h-full block"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  </div>
                  <span>
                    {isLoggingIn
                      ? isPt
                        ? 'Conectando ao Google...'
                        : 'Connecting to Google...'
                      : isPt
                        ? 'Entrar com o Google'
                        : 'Sign in with Google'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-emerald-300 flex items-center gap-2 whitespace-nowrap truncate">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    {isPt ? 'Conta conectada:' : 'Connected account:'}{' '}
                    <strong>{user?.email || user?.displayName}</strong>
                  </span>
                </div>

                {/* Mandatory Confirmation Box before creating events */}
                <div className="p-3 border border-amber-500/40 bg-amber-950/20 space-y-2.5 text-xs">
                  <div className="font-bold text-amber-300 whitespace-nowrap">
                    {isPt ? 'Confirmação de Inclusão no Calendário' : 'Calendar Addition Confirmation'}
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {isPt
                      ? `Confirma a criação de ${occurrences.length} evento(s) de Festa Bíblica no calendário principal da sua conta Google (${user?.email || ''})?`
                      : `Do you confirm creating ${occurrences.length} Biblical Feast event(s) in the primary calendar of your Google account (${user?.email || ''})?`}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleConfirmInsertEvents}
                      disabled={syncStatus === 'SYNCING'}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {syncStatus === 'SYNCING' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                          <span>{isPt ? 'Sincronizando...' : 'Syncing...'}</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isPt
                              ? `Confirmar e Incluir (${occurrences.length})`
                              : `Confirm & Add (${occurrences.length})`}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      disabled={syncStatus === 'SYNCING'}
                      className="px-3 py-2 border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {isPt ? 'Cancelar' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Feedback */}
          {syncStatus === 'SUCCESS' && statusMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="leading-relaxed">{statusMessage}</span>
            </div>
          )}

          {syncStatus === 'ERROR' && statusMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Footer with Universal Mobile .ICS Export & Close */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3.5 bg-slate-900/80 text-xs">
          <button
            type="button"
            onClick={() => exportFeastsToIcs(occurrences, sacredYear, language)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 bg-slate-950 hover:border-amber-500/60 text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isPt ? 'Baixar Arquivo .ICS (Calendário Móvel)' : 'Download .ICS (Mobile Calendar)'}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            {isPt ? 'Fechar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
