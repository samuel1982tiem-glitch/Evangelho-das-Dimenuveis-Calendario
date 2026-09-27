/**
 * @file src/screens/SettingsScreen.tsx
 * Book-like settings & calibration page for calendar, feast calculation models,
 * notification triggers, astronomical parameters, and local coordinates.
 */

import React, { useState } from 'react';
import { CalendarConfiguration } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getLocalizedChronologyModels } from '../chronology/models';
import { DEFAULT_CALENDAR_CONFIG } from '../settings/config';
import { getMonthDisplayTitle } from '../calendar/months';
import {
  loadStoredNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  sendFeastNotification,
  NotificationSettings,
} from '../notifications/notificationService';
import { calculateFeastOccurrences } from '../calendar/feastEngine';
import { GoogleCalendarSyncModal } from '../components/GoogleCalendarSyncModal';
import { exportFeastsToIcs } from '../services/googleCalendarService';
import { RotateCcw, Save, CheckCircle2, MapPin, Bell, Calendar, Download } from 'lucide-react';

interface SettingsScreenProps {
  config: CalendarConfiguration;
  onUpdateConfig: (newConfig: CalendarConfiguration) => void;
  language: Language;
  onOpenGpsModal?: () => void;
}

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  config,
  onUpdateConfig,
  language,
  onOpenGpsModal,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const [localConfig, setLocalConfig] = useState<CalendarConfiguration>(config);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(loadStoredNotificationSettings());
  const [savedMessage, setSavedMessage] = useState(false);
  const [notifStatusMessage, setNotifStatusMessage] = useState<string>('');
  const [isGoogleCalendarModalOpen, setIsGoogleCalendarModalOpen] = useState(false);

  const currentSacredYear = new Date().getFullYear() + 4024;
  const currentYearFeasts = calculateFeastOccurrences(
    currentSacredYear,
    localConfig.lunarAnchorMode,
    localConfig.feastCalendarModel,
    new Date(),
    language
  );

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const localizedModels = getLocalizedChronologyModels(language);

  const handleSave = () => {
    onUpdateConfig(localConfig);
    saveNotificationSettings(notifSettings);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_CALENDAR_CONFIG);
    onUpdateConfig(DEFAULT_CALENDAR_CONFIG);
  };

  const handleToggleNotifications = async (val: boolean) => {
    const updated: NotificationSettings = { ...notifSettings, enabled: val };
    setNotifSettings(updated);
    saveNotificationSettings(updated);

    if (val) {
      const systemGranted = await requestNotificationPermission();
      if (systemGranted) {
        setNotifStatusMessage(
          isPt
            ? 'Notificações de Festas e Sábados ativadas no dispositivo.'
            : 'Feast and Sabbath notifications enabled on device.'
        );
      } else {
        setNotifStatusMessage(
          isPt
            ? 'Alertas internos ativados. Para alertas na tela de bloqueio do celular, use também "Incluir no Google Agenda" abaixo.'
            : 'In-app alerts enabled. For mobile lock-screen alerts, also use "Add to Google Calendar" below.'
        );
      }
      sendFeastNotification(
        isPt ? 'Calendário Dimenúveis — Alertas Ativos' : 'Dimenuous Calendar — Alerts Active',
        isPt
          ? 'As notificações de Festas Bíblicas, Sábados e Fases da Lua foram ativadas.'
          : 'Biblical Feast, Sabbath, and Lunar Phase notifications are now active.',
        true
      );
    } else {
      setNotifStatusMessage(
        isPt ? 'Notificações de Festas desativadas.' : 'Feast notifications disabled.'
      );
    }
    setTimeout(() => setNotifStatusMessage(''), 4500);
  };

  const handleToggleNotifItem = (key: keyof NotificationSettings, checked: boolean) => {
    const updated: NotificationSettings = { ...notifSettings, [key]: checked };
    setNotifSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleSendTestNotification = () => {
    const nextFeast = currentYearFeasts.find((f) => f.isActiveToday || f.isUpcoming) || currentYearFeasts[0];
    const title = isPt
      ? `🕯️ Lembrete de Festa: ${nextFeast.feast.name}`
      : `🕯️ Feast Reminder: ${nextFeast.feast.name}`;
    const body = isPt
      ? `Mês Sagrado ${nextFeast.feast.sacredMonth}, Dia ${nextFeast.feast.sacredDay} (${nextFeast.gregorianStartDate.toISOString().split('T')[0]})`
      : `Sacred Month ${nextFeast.feast.sacredMonth}, Day ${nextFeast.feast.sacredDay} (${nextFeast.gregorianStartDate.toISOString().split('T')[0]})`;

    sendFeastNotification(title, body, true);
    setNotifStatusMessage(
      isPt
        ? `Alerta de teste enviado: ${nextFeast.feast.name} (${nextFeast.gregorianStartDate.toISOString().split('T')[0]})`
        : `Test alert sent: ${nextFeast.feast.name} (${nextFeast.gregorianStartDate.toISOString().split('T')[0]})`
    );
    setTimeout(() => setNotifStatusMessage(''), 4500);
  };

  const handleCustomMonthChange = (idx: number, val: string) => {
    const nextNames = [...localConfig.customMonthNames];
    nextNames[idx] = val;
    setLocalConfig({ ...localConfig, customMonthNames: nextNames });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="border border-slate-800 bg-slate-950 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3.5">
        <div>
          <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold whitespace-nowrap">
            {isPt ? 'Calibração e Preferências' : 'Calibration & Preferences'}
          </div>
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
            {t.settings.heroTitle}
          </h2>
          <p className="text-xs text-slate-300 font-serif italic mt-0.5">
            {t.settings.heroDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 font-serif text-xs whitespace-nowrap">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t.settings.resetDefaults}
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> {t.settings.saveConfig}
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="px-4 sm:px-5 py-3 bg-emerald-950/30 border border-emerald-500/40 text-xs font-serif text-emerald-300 flex items-center gap-2 whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{t.settings.savedSuccess}</span>
        </div>
      )}

      {/* 2-Column Settings Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border border-slate-800 bg-slate-950 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Left Column: Engine & Ephemeris Calibration */}
        <div className="divide-y divide-slate-800">
          <div className="px-4 sm:px-5 py-3 bg-slate-900/50 text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
            I. {t.settings.engineParameters}
          </div>

          {/* Feast Calculation Model */}
          <div className="p-4 sm:p-5 space-y-2">
            <label className="text-xs font-serif text-slate-200 uppercase tracking-wider font-semibold block whitespace-nowrap">
              {isPt ? 'Modelo de Festas Bíblicas' : 'Biblical Feast Model'}
            </label>
            <select
              value={localConfig.feastCalendarModel}
              onChange={(e) => setLocalConfig({ ...localConfig, feastCalendarModel: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs font-serif text-amber-300 focus:outline-none focus:border-amber-500"
            >
              <option value="BIBLICAL_LUNAR">
                {isPt
                  ? 'Lunar Bíblico — Conjunção e Levítico'
                  : 'Biblical Lunar — Conjunction & Leviticus'}
              </option>
              <option value="OBSERVATIONAL_LUNAR">
                {isPt
                  ? 'Lunar Observacional — Crescente Visível'
                  : 'Observational Lunar — Visible Crescent'}
              </option>
              <option value="CONFIGURED_SACRED_MODEL">
                {isPt
                  ? 'Modelo Sagrado — Ciclo de 364 Dias'
                  : 'Configured Sacred — 364-Day Cycle'}
              </option>
            </select>
            <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
              {isPt
                ? 'Determina como os tempos nomeados de Levítico 23 são ancorados e convertidos para o calendário civil.'
                : 'Determines how Leviticus 23 appointed times are anchored and converted to civil Gregorian dates.'}
            </p>
          </div>

          {/* Lunar Anchor Mode */}
          <div className="p-4 sm:p-5 space-y-2">
            <label className="text-xs font-serif text-slate-200 uppercase tracking-wider font-semibold block whitespace-nowrap">
              {t.settings.lunarAnchorMode}
            </label>
            <select
              value={localConfig.lunarAnchorMode}
              onChange={(e) => setLocalConfig({ ...localConfig, lunarAnchorMode: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs font-serif text-blue-300 focus:outline-none focus:border-amber-500"
            >
              <option value="CONJUNCTION">{t.moon.modeA}</option>
              <option value="VISIBLE_CRESCENT">{t.moon.modeB}</option>
              <option value="OBSERVATIONAL">{t.moon.modeC}</option>
            </select>
          </div>

          {/* Chronology Model */}
          <div className="p-4 sm:p-5 space-y-2">
            <label className="text-xs font-serif text-slate-200 uppercase tracking-wider font-semibold block whitespace-nowrap">
              {t.settings.defaultChronology}
            </label>
            <select
              value={localConfig.chronologyModelId}
              onChange={(e) => setLocalConfig({ ...localConfig, chronologyModelId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs font-serif text-purple-300 focus:outline-none focus:border-amber-500"
            >
              {localizedModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.creationEpochBCE} {isPt ? 'a.C.' : 'BCE'})
                </option>
              ))}
            </select>
          </div>

          {/* Observer Coordinates */}
          <div className="p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-serif text-slate-200 uppercase tracking-wider font-semibold block whitespace-nowrap">
                {t.settings.locationLabel}
              </label>
              {onOpenGpsModal && (
                <button
                  type="button"
                  onClick={onOpenGpsModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/50 text-xs font-serif font-semibold text-amber-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{isPt ? 'Usar GPS Local' : 'Use Local GPS'}</span>
                </button>
              )}
            </div>
            <div className="text-xs font-serif italic text-amber-300/90 whitespace-nowrap truncate">
              {isPt ? 'Local Ativo:' : 'Active Location:'}{' '}
              {!localConfig.userLocation?.cityName || localConfig.userLocation.cityName === 'Jerusalem (Default)'
                ? isPt
                  ? 'Jerusalém (Padrão)'
                  : 'Jerusalem (Default)'
                : localConfig.userLocation.cityName}
            </div>
            <div className="grid grid-cols-2 gap-3 font-serif text-xs tabular-nums">
              <div>
                <span className="text-xs italic text-slate-400 block whitespace-nowrap">{t.settings.latitude}</span>
                <input
                  type="number"
                  step="0.0001"
                  value={localConfig.userLocation?.latitude ?? 31.7683}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      userLocation: {
                        ...localConfig.userLocation!,
                        cityName: isPt ? 'Coordenadas Manuais' : 'Manual Coordinates',
                        latitude: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <span className="text-xs italic text-slate-400 block whitespace-nowrap">{t.settings.longitude}</span>
                <input
                  type="number"
                  step="0.0001"
                  value={localConfig.userLocation?.longitude ?? 35.2137}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      userLocation: {
                        ...localConfig.userLocation!,
                        cityName: isPt ? 'Coordenadas Manuais' : 'Manual Coordinates',
                        longitude: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications & Month Nomenclature */}
        <div className="divide-y divide-slate-800">
          {/* Notifications & Google Calendar Module */}
          <div className="p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
                II. {isPt ? 'Notificações de Festas' : 'Feast Notifications'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {notifSettings.enabled && (
                  <button
                    type="button"
                    onClick={handleSendTestNotification}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-serif border border-amber-500/50 bg-amber-950/30 hover:bg-amber-950/50 text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Bell className="w-3 h-3 shrink-0" />
                    <span>{isPt ? 'Testar Alerta' : 'Test Alert'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleNotifications(!notifSettings.enabled)}
                  aria-pressed={notifSettings.enabled}
                  className={`px-3 py-1 text-xs font-serif font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    notifSettings.enabled
                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  {notifSettings.enabled
                    ? isPt
                      ? '● Ativado'
                      : '● Enabled'
                    : isPt
                      ? '○ Ativar Alertas'
                      : '○ Enable Alerts'}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
              {isPt
                ? 'Ative para receber alertas antes do início e término de Festas Bíblicas, Sábados e Fases Lunares, ou sincronize com o Google Agenda do seu celular.'
                : 'Enable to receive alerts prior to Biblical Feasts, Sabbath days, and Lunar anchors, or sync directly with your mobile Google Calendar.'}
            </p>

            {notifStatusMessage && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 text-xs font-serif text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{notifStatusMessage}</span>
              </div>
            )}

            {notifSettings.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 border border-slate-700 divide-y sm:divide-y-0 sm:divide-x divide-slate-700 bg-slate-900/30 text-xs font-serif">
                {[
                  { key: 'upcomingFeastAlert', label: isPt ? 'Festa Próxima (24h)' : '24h Upcoming Feast' },
                  { key: 'feastBeginningAlert', label: isPt ? 'Início de Festa' : 'Feast Beginning' },
                  { key: 'feastEndingAlert', label: isPt ? 'Término de Festa' : 'Feast Ending' },
                  { key: 'weeklySabbathAlert', label: isPt ? 'Sábado Semanal' : 'Weekly Sabbath' },
                  { key: 'dayZeroAlert', label: isPt ? 'Limiar do Dia Zero' : 'Day Zero Threshold' },
                  { key: 'newMoonAlert', label: isPt ? 'Lua Nova' : 'New Moon Anchor' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 p-2.5 border-b border-slate-800 text-slate-200 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={Boolean((notifSettings as any)[item.key])}
                      onChange={(e) =>
                        handleToggleNotifItem(item.key as keyof NotificationSettings, e.target.checked)
                      }
                      className="accent-amber-500 shrink-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Google Calendar Mobile Sync Box */}
            <div className="p-3.5 border border-slate-800 bg-slate-900/40 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
                  {isPt ? 'Google Agenda Móvel' : 'Google Mobile Calendar'}
                </span>
                <span className="text-xs font-serif italic text-slate-300 whitespace-nowrap">
                  {isPt ? `Ano Sagrado ${currentSacredYear}` : `Sacred Year ${currentSacredYear}`}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-serif leading-relaxed">
                {isPt
                  ? 'Inclua as 8 Festas Bíblicas descritas (Páscoa, Asmos, Primícias, Semanas, Trombetas, Expiação, Tabernáculos e 8º Dia) diretamente no Google Agenda da sua conta Google com lembretes no celular.'
                  : 'Add all 8 described Biblical Feasts (Passover, Unleavened Bread, Firstfruits, Weeks, Trumpets, Atonement, Tabernacles, and 8th Day) directly to your Google account mobile calendar with reminders.'}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 font-serif text-xs">
                <button
                  type="button"
                  onClick={() => setIsGoogleCalendarModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{isPt ? 'Incluir no Google Agenda' : 'Add to Google Calendar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportFeastsToIcs(currentYearFeasts, currentSacredYear, language)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>{isPt ? 'Baixar .ICS' : 'Download .ICS'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Custom Month Nomenclature */}
          <div className="p-4 sm:p-5 space-y-3">
            <div className="text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
              III. {t.settings.customMonthTitle}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 font-serif text-xs tabular-nums">
              {localConfig.customMonthNames.map((name, idx) => {
                const displayVal = getMonthDisplayTitle(idx + 1, localConfig.customMonthNames, language);
                return (
                  <div key={idx} className="flex items-center border border-slate-700 bg-slate-900">
                    <span className="px-2.5 py-1.5 text-xs italic text-amber-400 border-r border-slate-700 shrink-0 w-10 text-center">
                      {ROMAN_MONTHS[idx]}.
                    </span>
                    <input
                      type="text"
                      value={displayVal}
                      onChange={(e) => handleCustomMonthChange(idx, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-transparent text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Google Calendar Sync & Confirmation Modal */}
      <GoogleCalendarSyncModal
        isOpen={isGoogleCalendarModalOpen}
        onClose={() => setIsGoogleCalendarModalOpen(false)}
        occurrences={currentYearFeasts}
        sacredYear={currentSacredYear}
        language={language}
      />
    </div>
  );
};
