/**
 * @file src/components/TourGuideModal.tsx
 * First-launch interactive Tour Guide with live Language & Day/Night Mode switchers,
 * architectural feature walkthrough, and usage instructions (Bilingual EN/PT).
 */

import React, { useState } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { NavTab } from './Navbar';
import {
  Sun,
  Moon,
  BookOpen,
  Calendar,
  Compass,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';

interface TourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  theme: 'night' | 'day';
  onToggleTheme: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const TourGuideModal: React.FC<TourGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectLanguage,
  theme,
  onToggleTheme,
  onNavigateTab,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const isPt = language === 'pt';
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const steps = [
    {
      roman: 'I',
      icon: Sparkles,
      badge: isPt ? 'Prefácio' : 'Preface',
      title: isPt
        ? 'Evangelho das Dimenúveis'
        : 'Gospel of Dimenuous',
      subtitle: isPt
        ? 'Almanaque Bíblico Lunar, Sagrado e Milenar'
        : 'Biblical Lunar, Sacred & Millennial Almanac',
      content: (
        <div className="space-y-5">
          <p className="text-sm font-serif text-slate-200 leading-relaxed">
            {isPt
              ? 'Este instrumento editorial e astronômico integra o Calendário Sagrado de 13 Meses × 28 Dias (364 dias + Dia Zero), o cálculo sinódico real das 8 fases da Lua, as Festas de Levítico 23 e o Relógio Milenar da Grande Semana de 7.000 anos.'
              : 'This editorial and astronomical instrument integrates the 13-Month × 28-Day Sacred Calendar (364 days + Day Zero), real synodic calculations of the 8 lunar phases, Leviticus 23 Appointed Times, and the 7,000-Year Great Week Millennial Clock.'}
          </p>

          {/* Interactive Language & Theme Switcher Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Language Selection Box */}
            <div className="border border-slate-700 bg-slate-900/50 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-serif uppercase tracking-wider text-amber-400 font-semibold whitespace-nowrap">
                  {isPt ? '1. Idioma' : '1. Language'}
                </span>
                <span className="text-xs font-serif italic text-slate-300 whitespace-nowrap">
                  {isPt ? 'Bilingue' : 'Bilingual'}
                </span>
              </div>
              <p className="text-xs font-serif text-slate-300 leading-relaxed">
                {isPt
                  ? 'Alterne entre Português e Inglês a qualquer momento aqui ou no botão de bandeira no topo da página.'
                  : 'Switch between English and Portuguese anytime here or via the flag button in the top navigation bar.'}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectLanguage('pt')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 border text-xs font-serif transition-colors cursor-pointer whitespace-nowrap ${
                    language === 'pt'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-950 text-slate-200 border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <svg className="w-5 h-3.5 shrink-0" viewBox="0 0 36 24" aria-hidden="true">
                    <rect width="36" height="24" fill="#009b3a" />
                    <polygon points="18,2.5 33,12 18,21.5 3,12" fill="#fedf00" />
                    <circle cx="18" cy="12" r="5" fill="#002776" />
                  </svg>
                  <span>Português</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectLanguage('en')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 border text-xs font-serif transition-colors cursor-pointer whitespace-nowrap ${
                    language === 'en'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-950 text-slate-200 border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <svg className="w-5 h-3.5 shrink-0" viewBox="0 0 36 24" aria-hidden="true">
                    <rect width="36" height="24" fill="#b22234" />
                    <path d="M0,2.77H36M0,6.46H36M0,10.15H36M0,13.85H36M0,17.54H36M0,21.23H36" stroke="#fff" strokeWidth="1.85" />
                    <rect width="15" height="12.92" fill="#3c3b6e" />
                  </svg>
                  <span>English</span>
                </button>
              </div>
            </div>

            {/* Day / Night Reading Mode Box */}
            <div className="border border-slate-700 bg-slate-900/50 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-serif uppercase tracking-wider text-amber-400 font-semibold whitespace-nowrap">
                  {isPt ? '2. Modo Dia / Noite' : '2. Day / Night Mode'}
                </span>
                <span className="text-xs font-serif italic text-slate-300 whitespace-nowrap">
                  {theme === 'day'
                    ? isPt
                      ? 'Pergaminho'
                      : 'Parchment'
                    : isPt
                      ? 'Obsidiana'
                      : 'Obsidian'}
                </span>
              </div>
              <p className="text-xs font-serif text-slate-300 leading-relaxed">
                {isPt
                  ? 'Alterne entre o modo Noturno Celestial e o modo Diurno Pergaminho de alto contraste.'
                  : 'Switch between Celestial Night mode and high-contrast Archival Parchment Day mode.'}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'night') onToggleTheme();
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-2 border text-xs font-serif transition-colors cursor-pointer whitespace-nowrap ${
                    theme === 'night'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-950 text-slate-200 border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 shrink-0" />
                  <span>{isPt ? 'Modo Noite' : 'Night Mode'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'day') onToggleTheme();
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-2 border text-xs font-serif transition-colors cursor-pointer whitespace-nowrap ${
                    theme === 'day'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-950 text-slate-200 border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 shrink-0" />
                  <span>{isPt ? 'Modo Dia' : 'Day Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      roman: 'II',
      icon: Calendar,
      badge: isPt ? 'Estrutura' : 'Structure',
      title: isPt
        ? 'Dia Zero + 13 × 28 Dias'
        : 'Day Zero + 13 × 28 Days',
      subtitle: isPt
        ? 'Simetria perpétua de 364 dias e 52 semanas'
        : 'Perpetual symmetry of 364 days and 52 weeks',
      content: (
        <div className="space-y-4 font-serif">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-700 border border-slate-700">
            <div className="bg-slate-950 p-4 space-y-1">
              <span className="text-xs italic text-purple-300 block whitespace-nowrap">
                {isPt ? 'Limiar Anual' : 'Annual Threshold'}
              </span>
              <strong className="text-base text-slate-100 block whitespace-nowrap">
                {isPt ? 'Dia Zero (Dia 0)' : 'Day Zero (Day 0)'}
              </strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isPt
                  ? 'Sábado Anual do Ano Novo Sagrado antes do Mês I Dia 1. Fora dos 364 dias numerados.'
                  : 'Annual Sacred New Year Sabbath preceding Month I Day 1. Outside the 364 numbered days.'}
              </p>
            </div>
            <div className="bg-slate-950 p-4 space-y-1">
              <span className="text-xs italic text-amber-400 block whitespace-nowrap">
                {isPt ? '13 Meses Iguais' : '13 Equal Months'}
              </span>
              <strong className="text-base text-slate-100 block whitespace-nowrap">
                {isPt ? '28 Dias por Mês' : '28 Days per Month'}
              </strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isPt
                  ? 'Cada mês possui exatamente 4 semanas perfeitas (Dias 1 a 28), totalizando 364 dias numerados.'
                  : 'Every month has 4 exact weeks (Days 1 to 28), totaling 364 numbered days.'}
              </p>
            </div>
            <div className="bg-slate-950 p-4 space-y-1">
              <span className="text-xs italic text-emerald-300 block whitespace-nowrap">
                {isPt ? 'Ciclo Perpétuo' : 'Perpetual Cycle'}
              </span>
              <strong className="text-base text-slate-100 block whitespace-nowrap">
                {isPt ? '52 Sábados Semanais' : '52 Weekly Sabbaths'}
              </strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isPt
                  ? 'Os Sábados semanais caem sempre nos Dias 7, 14, 21 e 28 de todos os 13 meses.'
                  : 'Weekly Sabbaths always fall on Days 7, 14, 21, and 28 of all 13 months.'}
              </p>
            </div>
          </div>

          <div className="p-4 border border-slate-800 bg-slate-900/40 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300">
              {isPt ? 'Dica Interativa: ' : 'Interactive Tip: '}
            </strong>
            {isPt
              ? 'Na aba II (Calendário), clique em qualquer célula dos 364 dias ou no banner do Dia Zero para abrir a Ficha Completa do Dia com conversão gregoriana, iluminação lunar e leituras.'
              : 'In Tab II (Calendar), click any of the 364 day cells or the Day Zero banner to open the Full Day Dossier with Gregorian conversion, lunar illumination, and readings.'}
          </div>
        </div>
      ),
    },
    {
      roman: 'III',
      icon: Compass,
      badge: isPt ? 'Lua & Festas' : 'Moon & Feasts',
      title: isPt
        ? 'Camada Lunar & Levítico 23'
        : 'Lunar Overlay & Leviticus 23',
      subtitle: isPt
        ? '8 fases astronômicas e 8 tempos nomeados'
        : '8 astronomical phases and 8 appointed times',
      content: (
        <div className="space-y-4 font-serif">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <h4 className="text-sm font-bold text-blue-300 whitespace-nowrap">
                {isPt ? 'Camada Lunar (Cap. IV — Lua)' : 'Lunar Overlay (Ch. IV — Moon)'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isPt
                  ? 'O mês sinódico astronômico (~29,53 dias) é calculado em tempo real e sobreposto ao calendário de 28 dias sem deformar os meses. Você pode alternar a âncora do Dia Zero entre Conjunção Astronômica, Crescente Visível e Modelo Observacional.'
                  : 'The astronomical synodic month (~29.53 days) is calculated in real time and overlaid onto the 28-day calendar without deforming month boundaries. You can switch the Day Zero anchor between Astronomical Conjunction, Visible Crescent, and Observational.'}
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <h4 className="text-sm font-bold text-amber-300 whitespace-nowrap">
                {isPt ? 'Festas Bíblicas (Cap. III — Festas)' : 'Biblical Feasts (Ch. III — Feasts)'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isPt
                  ? 'Calcula dinamicamente Páscoa, Pães Asmos, Primícias, Pentecostes (Shavuot), Trombetas, Dia da Expiação, Tabernáculos (7 dias) e Oitavo Dia (1 dia), identificando quando coincidem com o Sábado semanal.'
                  : 'Dynamically calculates Passover, Unleavened Bread, Firstfruits, Pentecost (Shavuot), Trumpets, Day of Atonement, Tabernacles (7 days), and Eighth Day (1 day), highlighting Sabbath overlaps.'}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      roman: 'IV',
      icon: Clock,
      badge: isPt ? 'Cronologia' : 'Chronology',
      title: isPt
        ? 'Grande Semana & Cronologia'
        : 'Great Week & Chronology Lab',
      subtitle: isPt
        ? '6.000 anos rumo ao Sábado do 7º Milênio'
        : '6,000 years toward the 7th Millennium Sabbath',
      content: (
        <div className="space-y-4 font-serif">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <h4 className="text-sm font-bold text-amber-300 whitespace-nowrap">
                {isPt ? '4 Modelos Cronológicos (Cap. VI & VII)' : '4 Chronology Models (Ch. VI & VII)'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isPt
                  ? 'Compare Ussher (4004 a.C.), Rabínico Tradicional (3761 a.C.), Septuaginta LXX (5508 a.C.) e Época Sagrada Dimenúveis (4026 a.C.) com transição exata de 1 a.C. para 1 d.C. sem Ano Zero.'
                  : 'Compare Ussher (4004 BCE), Traditional Rabbinic (3761 BCE), Septuagint LXX (5508 BCE), and Dimenuous Sacred Epoch (4026 BCE) with strict 1 BCE to 1 CE transition (no Year Zero).'}
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <h4 className="text-sm font-bold text-purple-300 whitespace-nowrap">
                {isPt ? 'Josué 10 & Eclipses (Cap. VIII)' : 'Joshua 10 & Eclipses (Ch. VIII)'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isPt
                  ? 'Explore o catálogo de eclipses históricos na Terra Santa (incluindo o eclipse candidato de 30 de outubro de 1207 a.C.) e simule o ajuste opcional de +1 dia de Josué 10.'
                  : 'Explore the historical eclipse catalog over the Holy Land (including the 30 October 1207 BCE candidate eclipse) and test the optional +1 day Joshua 10 adjustment.'}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      roman: 'V',
      icon: BookOpen,
      badge: isPt ? 'Capítulos' : 'Chapters',
      title: isPt
        ? 'Navegar pelos 11 Capítulos'
        : 'Navigate the 11 Chapters',
      subtitle: isPt
        ? 'Clique em qualquer capítulo abaixo para abrir'
        : 'Click any chapter below to jump directly',
      content: (
        <div className="space-y-3 font-serif">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {[
              {
                id: 'TODAY' as NavTab,
                roman: 'I',
                title: t.tabs.TODAY,
                desc: isPt ? 'Painel diário sagrado, solar, lunar e milenar' : 'Daily sacred, solar, lunar & millennial overview',
              },
              {
                id: 'CALENDAR' as NavTab,
                roman: 'II',
                title: t.tabs.CALENDAR,
                desc: isPt ? 'Almanaque de 13 meses × 28 dias + Dia Zero' : '13-month × 28-day almanac + Day Zero',
              },
              {
                id: 'FEASTS' as NavTab,
                roman: 'III',
                title: t.tabs.FEASTS,
                desc: isPt ? 'As 8 Festas de Levítico 23 e conversões' : 'The 8 Leviticus 23 Feasts & conversions',
              },
              {
                id: 'MOON' as NavTab,
                roman: 'IV',
                title: t.tabs.MOON,
                desc: isPt ? 'Efemérides lunares e as 8 fases definidas' : 'Lunar ephemeris & the 8 defined phases',
              },
              {
                id: 'SABBATH' as NavTab,
                roman: 'V',
                title: t.tabs.SABBATH,
                desc: isPt ? 'Guardião dos 52 Sábados semanais e Dia Zero' : 'Guardian of the 52 weekly Sabbaths & Day Zero',
              },
              {
                id: 'GREAT_WEEK' as NavTab,
                roman: 'VI',
                title: t.tabs.GREAT_WEEK,
                desc: isPt ? 'Relógio profético dos 7 Milênios' : 'Prophetic clock of the 7 Millennia',
              },
              {
                id: 'CHRONOLOGY_LAB' as NavTab,
                roman: 'VII',
                title: t.tabs.CHRONOLOGY_LAB,
                desc: isPt ? 'Simulador de modelos a.C./d.C. e Josué 10' : 'BCE/CE model simulator & Joshua 10 toggle',
              },
              {
                id: 'SCRIPTURE_HISTORY' as NavTab,
                roman: 'VIII',
                title: t.tabs.SCRIPTURE_HISTORY,
                desc: isPt ? 'Eclipses históricos e registros bíblicos' : 'Historical eclipses & scriptural records',
              },
              {
                id: 'DIMENUEVEIS' as NavTab,
                roman: 'IX',
                title: t.tabs.DIMENUEVEIS,
                desc: isPt ? 'Fundamentos bíblicos, árvore de 6 camadas e léxico' : 'Biblical foundations, 6-layer tree & lexicon',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigateTab(item.id);
                  onClose();
                }}
                className="text-left p-3 border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-amber-500/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 group-hover:text-amber-300 text-sm">
                    <span className="text-amber-400 italic mr-1.5">{item.roman}.</span>
                    {item.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-400" />
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[stepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-guide-title"
    >
      <div className="relative w-full max-w-3xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Utility Header Bar with Persistent Language & Day/Night Switchers */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-serif uppercase tracking-wider text-amber-400 font-semibold whitespace-nowrap">
              {isPt ? 'Guia Interativo' : 'Interactive Guide'}
            </span>
          </div>

          {/* Persistent Quick Controls: Language + Day/Night + Close */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Pill/Box */}
            <div className="inline-flex border border-slate-700 bg-slate-950 text-xs font-serif">
              <button
                type="button"
                onClick={() => onSelectLanguage('pt')}
                className={`px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                  language === 'pt'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
                title="Português"
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage('en')}
                className={`px-2.5 py-1 text-xs transition-colors cursor-pointer border-l border-slate-700 ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Day/Night Mode Switcher Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-slate-700 bg-slate-950 hover:border-amber-500/60 text-xs font-serif text-slate-200 transition-colors cursor-pointer"
              title={
                theme === 'day'
                  ? isPt
                    ? 'Alternar para Modo Noite'
                    : 'Switch to Night Mode'
                  : isPt
                    ? 'Alternar para Modo Dia'
                    : 'Switch to Day Mode'
              }
            >
              {theme === 'day' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">{isPt ? 'Dia' : 'Day'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-300" />
                  <span className="hidden sm:inline">{isPt ? 'Noite' : 'Night'}</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-7 h-7 border border-slate-700 bg-slate-950 hover:border-amber-500/60 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
              title={isPt ? 'Fechar Guia' : 'Close Guide'}
              aria-label={isPt ? 'Fechar Guia' : 'Close Guide'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Strip */}
        <div className="grid grid-cols-5 gap-px bg-slate-800 border-b border-slate-800 font-serif text-xs">
          {steps.map((s, idx) => {
            const isCurrent = idx === stepIndex;
            const isCompleted = idx < stepIndex;
            return (
              <button
                key={s.roman}
                type="button"
                onClick={() => setStepIndex(idx)}
                className={`py-2 px-2 text-center transition-colors cursor-pointer leading-snug ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : isCompleted
                      ? 'bg-slate-900 text-amber-300 hover:bg-slate-800'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <span className="italic mr-1">{s.roman}.</span>
                <span className="hidden sm:inline">{s.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
          <div className="flex items-start gap-3.5 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 border border-amber-500/40 bg-amber-950/20 flex items-center justify-center shrink-0 mt-0.5">
              <StepIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-serif italic text-amber-400">
                {isPt ? `Capítulo ${currentStep.roman} de V` : `Chapter ${currentStep.roman} of V`} — {currentStep.badge}
              </div>
              <h2
                id="tour-guide-title"
                className="text-xl sm:text-2xl font-serif font-bold text-slate-100 leading-snug mt-0.5"
              >
                {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm font-serif italic text-slate-400 mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {currentStep.content}
        </div>

        {/* Modal Footer Navigation */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 bg-slate-900/80 border-t border-slate-800 font-serif text-xs">
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 underline underline-offset-4 cursor-pointer"
          >
            {isPt ? 'Pular Guia' : 'Skip Guide'}
          </button>

          <div className="flex items-center gap-2.5">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => setStepIndex((prev) => prev - 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isPt ? 'Anterior' : 'Previous'}</span>
              </button>
            )}

            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStepIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                <span>{isPt ? 'Próximo' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isPt ? 'Começar a Explorar' : 'Start Exploring'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
