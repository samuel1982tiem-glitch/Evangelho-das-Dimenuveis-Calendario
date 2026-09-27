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
  NotificationSettings,
} from '../notifications/notificationService';
import { RotateCcw, Save, CheckCircle2 } from 'lucide-react';

interface SettingsScreenProps {
  config: CalendarConfiguration;
  onUpdateConfig: (newConfig: CalendarConfiguration) => void;
  language: Language;
}

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ config, onUpdateConfig, language }) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const [localConfig, setLocalConfig] = useState<CalendarConfiguration>(config);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(loadStoredNotificationSettings());
  const [savedMessage, setSavedMessage] = useState(false);

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
    if (val) {
      const granted = await requestNotificationPermission();
      setNotifSettings({ ...notifSettings, enabled: granted });
    } else {
      setNotifSettings({ ...notifSettings, enabled: false });
    }
  };

  const handleCustomMonthChange = (idx: number, val: string) => {
    const nextNames = [...localConfig.customMonthNames];
    nextNames[idx] = val;
    setLocalConfig({ ...localConfig, customMonthNames: nextNames });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="border border-slate-800 bg-slate-950 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold">
            {isPt ? 'Calibração do Almanaque e Preferências' : 'Almanac Calibration & Preferences'}
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-100">
            {t.settings.heroTitle}
          </h2>
          <p className="text-xs text-slate-300 font-serif italic mt-0.5">
            {t.settings.heroDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 font-serif text-xs">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t.settings.resetDefaults}
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> {t.settings.saveConfig}
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="px-5 py-3 bg-emerald-950/30 border border-emerald-500/40 text-xs font-serif text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{t.settings.savedSuccess}</span>
        </div>
      )}

      {/* 2-Column Settings Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border border-slate-800 bg-slate-950 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Left Column: Engine & Ephemeris Calibration */}
        <div className="divide-y divide-slate-800">
          <div className="px-5 py-3 bg-slate-900/50 text-xs font-serif font-bold uppercase tracking-wider text-amber-400">
            I. {t.settings.engineParameters}
          </div>

          {/* Feast Calculation Model */}
          <div className="p-5 space-y-2">
            <label className="text-xs font-serif text-slate-200 uppercase tracking-wider font-semibold block">
              {isPt ? 'Modelo de Cálculo de Festas Bíblicas' : 'Active Biblical Feast Calculation Model'}
            </label>
            <select
              value={localConfig.feastCalendarModel}
              onChange={(e) => setLocalConfig({ ...localConfig, feastCalendarModel: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-xs font-serif text-amber-300 focus:outline-none focus:border-amber-500"
            >
              <option value="BIBLICAL_LUNAR">
                {isPt
                  ? 'Lunar Bíblico — Conjunção e Regras de Levítico'
                  : 'Biblical Lunar — Conjunction & Leviticus Rules'}
              </option>
              <option value="OBSERVATIONAL_LUNAR">
                {isPt
                  ? 'Lunar Observacional — Crescente Visível e Horizonte'
                  : 'Observational Lunar — Visible Crescent & Horizon'}
              </option>
              <option value="CONFIGURED_SACRED_MODEL">
                {isPt
                  ? 'Modelo Sagrado Configurado — Ciclo Estrito de 364 Dias'
                  : 'Configured Sacred Model — Strict 364-Day Cycle'}
              </option>
            </select>
            <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
              {isPt
                ? 'Determina como os tempos nomeados de Levítico 23 são ancorados e convertidos para o calendário civil.'
                : 'Determines how Leviticus 23 appointed times are anchored and converted to civil Gregorian dates.'}
            </p>
          </div>

          {/* Lunar Anchor Mode */}
          <div className="p-5 space-y-2">
            <label className="text-xs font-serif text-slate-200 uppercase tracking-wider font-semibold block">
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
          <div className="p-5 space-y-2">
            <label className="text-xs font-serif text-slate-200 uppercase tracking-wider font-semibold block">
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
          <div className="p-5 space-y-2">
            <label className="text-xs font-serif text-slate-200 uppercase tracking-wider font-semibold block">
              {t.settings.locationLabel}
            </label>
            <div className="grid grid-cols-2 gap-3 font-serif text-xs tabular-nums">
              <div>
                <span className="text-xs italic text-slate-400 block">{t.settings.latitude}</span>
                <input
                  type="number"
                  step="0.0001"
                  value={localConfig.userLocation?.latitude || 31.7683}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      userLocation: {
                        ...localConfig.userLocation!,
                        latitude: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <span className="text-xs italic text-slate-400 block">{t.settings.longitude}</span>
                <input
                  type="number"
                  step="0.0001"
                  value={localConfig.userLocation?.longitude || 35.2137}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      userLocation: {
                        ...localConfig.userLocation!,
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
          {/* Notifications Module */}
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-400">
                II. {isPt ? 'Notificações de Festas e Sábados' : 'Feast & Sabbath Notifications'}
              </span>
              <button
                onClick={() => handleToggleNotifications(!notifSettings.enabled)}
                className={`px-3 py-1 text-xs font-serif font-semibold border transition-colors cursor-pointer ${
                  notifSettings.enabled
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                {notifSettings.enabled
                  ? isPt
                    ? 'Ativado'
                    : 'Enabled'
                  : isPt
                    ? 'Desligado (Padrão)'
                    : 'Off (Default)'}
              </button>
            </div>

            <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
              {isPt
                ? 'As notificações estão desligadas por padrão. Ative para receber alertas antes do início e término de Festas Bíblicas, Sábados e Fases Lunares.'
                : 'Notifications are off by default. Enable to receive alerts prior to Biblical Feasts, Sabbath days, and Lunar anchors.'}
            </p>

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
                  <label key={item.key} className="flex items-center gap-2 p-2.5 border-b border-slate-800 text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(notifSettings as any)[item.key]}
                      onChange={(e) => setNotifSettings({ ...notifSettings, [item.key]: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span className="truncate">{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Custom Month Nomenclature */}
          <div className="p-5 space-y-3">
            <div className="text-xs font-serif font-bold uppercase tracking-wider text-amber-400">
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
    </div>
  );
};
