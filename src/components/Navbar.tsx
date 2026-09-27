/**
 * @file src/components/Navbar.tsx
 * Classical book-like navigation header for Gospel of Dimenuous / Evangelho das Dimenúveis.
 */

import React from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { LanguageSelector } from './LanguageSelector';
import { Moon, Sun, HelpCircle } from 'lucide-react';

export type NavTab =
  | 'TODAY'
  | 'CALENDAR'
  | 'FEASTS'
  | 'MOON'
  | 'SABBATH'
  | 'GREAT_WEEK'
  | 'CHRONOLOGY_LAB'
  | 'SCRIPTURE_HISTORY'
  | 'DIMENUEVEIS'
  | 'SETTINGS'
  | 'TESTS';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  systemDate: Date;
  theme: 'night' | 'day';
  onToggleTheme: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  systemDate,
  theme,
  onToggleTheme,
  language,
  onSelectLanguage,
  onOpenTour,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';

  const navItems: { id: NavTab; label: string; roman: string }[] = [
    { id: 'TODAY', label: t.tabs.TODAY, roman: 'I' },
    { id: 'CALENDAR', label: t.tabs.CALENDAR, roman: 'II' },
    { id: 'FEASTS', label: t.tabs.FEASTS, roman: 'III' },
    { id: 'MOON', label: t.tabs.MOON, roman: 'IV' },
    { id: 'SABBATH', label: t.tabs.SABBATH, roman: 'V' },
    { id: 'GREAT_WEEK', label: t.tabs.GREAT_WEEK, roman: 'VI' },
    { id: 'CHRONOLOGY_LAB', label: t.tabs.CHRONOLOGY_LAB, roman: 'VII' },
    { id: 'SCRIPTURE_HISTORY', label: t.tabs.SCRIPTURE_HISTORY, roman: 'VIII' },
    { id: 'DIMENUEVEIS', label: t.tabs.DIMENUEVEIS, roman: 'IX' },
    { id: 'SETTINGS', label: t.tabs.SETTINGS, roman: 'X' },
    { id: 'TESTS', label: t.tabs.TESTS, roman: 'XI' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e14] border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Row: 2-Line Book Title & Top-Right Language + Theme Controls */}
        <div className="flex items-center justify-between gap-2 py-2 min-h-[3.75rem] border-b border-slate-800/80">
          <div className="flex flex-col items-start justify-center min-w-0 flex-1">
            <a
              href="https://dimenuvel.github.io/Evangelho-das-Dimenuveis-site/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15.5px] sm:text-xl md:text-2xl font-serif font-bold leading-tight tracking-normal text-slate-100 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              {t.appTitle}
            </a>
            <button
              type="button"
              onClick={() => setActiveTab('TODAY')}
              className="text-[11.5px] sm:text-sm font-serif italic leading-tight text-slate-200 hover:text-amber-300 transition-colors whitespace-nowrap text-left cursor-pointer focus:outline-none mt-0.5"
            >
              {t.appSubtitle}
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-serif text-slate-200 tabular-nums mr-1 whitespace-nowrap">
              <span className="text-amber-400 font-bold">§</span>
              <span>{t.solarTime}: <strong className="text-slate-100">{systemDate.toISOString().split('T')[0]}</strong></span>
            </div>

            <LanguageSelector
              language={language}
              onSelectLanguage={onSelectLanguage}
            />

            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 border border-slate-700 hover:border-amber-500/60 text-slate-200 transition-colors cursor-pointer shrink-0"
              title={
                theme === 'day'
                  ? isPt
                    ? 'Alternar para Modo Noturno'
                    : 'Switch to Night Mode'
                  : isPt
                    ? 'Alternar para Modo Dia Solar'
                    : 'Switch to Solar Day Mode'
              }
              aria-label={
                theme === 'day'
                  ? isPt
                    ? 'Alternar para Modo Noturno'
                    : 'Switch to Night Mode'
                  : isPt
                    ? 'Alternar para Modo Dia Solar'
                    : 'Switch to Solar Day Mode'
              }
            >
              {theme === 'day' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-300" />
              )}
            </button>

            {onOpenTour && (
              <button
                type="button"
                onClick={onOpenTour}
                className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 border border-slate-700 hover:border-amber-500/60 text-amber-400 transition-colors cursor-pointer shrink-0"
                title={isPt ? 'Abrir Guia de Instruções e Recursos' : 'Open Features & Instructions Tour Guide'}
                aria-label={isPt ? 'Abrir Guia de Instruções' : 'Open Tour Guide'}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Book Chapter Navigation Strip */}
        <nav className="flex items-center overflow-x-auto no-scrollbar -mb-px">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 text-sm font-serif transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-amber-500 text-amber-300 font-semibold bg-slate-900/60'
                    : 'border-transparent text-slate-300 hover:text-slate-100 hover:border-slate-700'
                }`}
              >
                <span className="text-xs italic text-slate-400">{item.roman}.</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
