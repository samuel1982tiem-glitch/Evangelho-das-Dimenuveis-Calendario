/**
 * @file src/App.tsx
 * Gospel of Dimenuous / Evangelho das Dimenúveis — Biblical Lunar & Millennial Almanac
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DayDetailModal } from './components/DayDetailModal';
import { TourGuideModal } from './components/TourGuideModal';
import { GpsPermissionModal } from './components/GpsPermissionModal';
import { Language, TRANSLATIONS } from './i18n/translations';
import { CalendarConfiguration, CalendarDay } from './types/calendar';
import { loadStoredConfiguration, saveConfiguration } from './settings/config';
import {
  hasUserDecidedGpsPrompt,
  isUsingDefaultJerusalem,
  ResolvedUserLocation,
} from './services/geolocationService';

import { TodayScreen } from './screens/TodayScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { AppointedTimesScreen } from './screens/AppointedTimesScreen';
import { MoonScreen } from './screens/MoonScreen';
import { SabbathScreen } from './screens/SabbathScreen';
import { GreatWeekScreen } from './screens/GreatWeekScreen';
import { ChronologyLabScreen } from './screens/ChronologyLabScreen';
import { ScriptureHistoryScreen } from './screens/ScriptureHistoryScreen';
import { DimenueveisScreen } from './screens/DimenueveisScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TestsScreen } from './screens/TestsScreen';

const TOUR_STORAGE_KEY = 'dimenueveis_tour_completed_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('TODAY');
  const [systemDate] = useState<Date>(new Date());
  const [config, setConfig] = useState<CalendarConfiguration>(loadStoredConfiguration());
  const [selectedDayModal, setSelectedDayModal] = useState<CalendarDay | null>(null);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => {
    return localStorage.getItem(TOUR_STORAGE_KEY) !== 'true';
  });
  const [isGpsModalOpen, setIsGpsModalOpen] = useState<boolean>(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
    const initialCfg = loadStoredConfiguration();
    return (
      tourCompleted &&
      !hasUserDecidedGpsPrompt() &&
      isUsingDefaultJerusalem(
        initialCfg.userLocation?.cityName,
        initialCfg.userLocation?.latitude,
        initialCfg.userLocation?.longitude
      )
    );
  });

  const handleCloseTour = () => {
    setIsTourOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    if (
      !hasUserDecidedGpsPrompt() &&
      isUsingDefaultJerusalem(
        config.userLocation?.cityName,
        config.userLocation?.latitude,
        config.userLocation?.longitude
      )
    ) {
      setIsGpsModalOpen(true);
    }
  };

  // Language state ('en' | 'pt')
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('dimenueveis_lang');
    if (saved === 'en' || saved === 'pt') return saved;
    const browserLang = navigator.language || '';
    if (browserLang.toLowerCase().startsWith('pt')) return 'pt';
    return 'en';
  });

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('dimenueveis_lang', lang);
  };

  const t = TRANSLATIONS[language];

  // Sync document <title> dynamically with language choice
  useEffect(() => {
    document.title = `${t.appTitle} — ${t.appSubtitle}`;
  }, [language, t]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  // Theme state ('night' vs 'day')
  const [theme, setTheme] = useState<'night' | 'day'>(() => {
    const saved = localStorage.getItem('dimenueveis_theme');
    return (saved === 'day' || saved === 'night') ? saved : 'night';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dimenueveis_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'night' ? 'day' : 'night'));
  };

  // Keep configuration persisted
  const handleUpdateConfig = (newConfig: CalendarConfiguration | Partial<CalendarConfiguration>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated as CalendarConfiguration);
    saveConfiguration(updated as CalendarConfiguration);
  };

  const handleGpsLocationResolved = (loc: ResolvedUserLocation) => {
    handleUpdateConfig({
      userLocation: {
        latitude: loc.latitude,
        longitude: loc.longitude,
        cityName: loc.cityName,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0e14] text-[#f5f2eb] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 transition-colors">
      {/* Top Classical Book Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemDate={systemDate}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onOpenTour={() => setIsTourOpen(true)}
      />

      {/* First-Launch Interactive Tour Guide Modal */}
      <TourGuideModal
        isOpen={isTourOpen}
        onClose={handleCloseTour}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateTab={setActiveTab}
      />

      {/* Android & Web GPS Location Permission Dialog */}
      <GpsPermissionModal
        isOpen={isGpsModalOpen}
        onClose={() => setIsGpsModalOpen(false)}
        language={language}
        currentLocation={config.userLocation}
        onLocationResolved={handleGpsLocationResolved}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'TODAY' && (
          <TodayScreen
            systemDate={systemDate}
            config={config}
            onOpenDayDetail={setSelectedDayModal}
            onNavigateTab={setActiveTab}
            language={language}
            onOpenGpsModal={() => setIsGpsModalOpen(true)}
          />
        )}

        {activeTab === 'CALENDAR' && (
          <CalendarScreen
            systemDate={systemDate}
            config={config}
            onOpenDayDetail={setSelectedDayModal}
            language={language}
          />
        )}

        {activeTab === 'FEASTS' && (
          <AppointedTimesScreen
            systemDate={systemDate}
            config={config}
            language={language}
          />
        )}

        {activeTab === 'MOON' && (
          <MoonScreen
            systemDate={systemDate}
            config={config}
            onUpdateConfig={handleUpdateConfig}
            language={language}
          />
        )}

        {activeTab === 'SABBATH' && (
          <SabbathScreen
            systemDate={systemDate}
            config={config}
            language={language}
          />
        )}

        {activeTab === 'GREAT_WEEK' && (
          <GreatWeekScreen
            systemDate={systemDate}
            config={config}
            language={language}
          />
        )}

        {activeTab === 'CHRONOLOGY_LAB' && (
          <ChronologyLabScreen
            systemDate={systemDate}
            config={config}
            onUpdateConfig={handleUpdateConfig}
            language={language}
          />
        )}

        {activeTab === 'SCRIPTURE_HISTORY' && (
          <ScriptureHistoryScreen
            config={config}
            onUpdateConfig={handleUpdateConfig}
            language={language}
          />
        )}

        {activeTab === 'DIMENUEVEIS' && (
          <DimenueveisScreen
            language={language}
          />
        )}

        {activeTab === 'SETTINGS' && (
          <SettingsScreen
            config={config}
            onUpdateConfig={handleUpdateConfig}
            language={language}
            onOpenGpsModal={() => setIsGpsModalOpen(true)}
          />
        )}

        {activeTab === 'TESTS' && (
          <TestsScreen
            language={language}
          />
        )}
      </main>

      {/* Day Detail Popover Modal */}
      <DayDetailModal
        day={selectedDayModal}
        onClose={() => setSelectedDayModal(null)}
        config={config}
        language={language}
        onOpenGpsModal={() => setIsGpsModalOpen(true)}
      />

      {/* Editorial Colophon Footer (padded for fixed bottom icon navbar) */}
      <footer className="mt-auto border-t border-slate-800 bg-[#0b0e14] pt-6 pb-24 text-sm font-serif text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-slate-100 font-semibold text-base font-serif">
              <a
                href="https://dimenuvel.github.io/Evangelho-das-Dimenuveis-site/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 underline decoration-amber-500/60 underline-offset-4 transition-colors"
              >
                {t.appTitle}
              </a>{' '}
              — {t.appSubtitle}
            </div>
            <div className="text-xs sm:text-sm italic text-slate-300">
              {language === 'pt'
                ? 'Dia Zero + 13 Meses × 28 Dias = 364 Dias · Sábado Contínuo · A Grande Semana de 7.000 Anos'
                : 'Day Zero + 13 Months × 28 Days = 364 Days · Continuous Sabbath · The 7,000-Year Great Week'}
            </div>
          </div>
          <div className="text-sm font-serif font-semibold text-amber-300 tabular-nums shrink-0">
            {language === 'pt' ? 'Versão 1.1' : 'Version 1.1'}
          </div>
        </div>
      </footer>
    </div>
  );
}
