/**
 * @file src/screens/CalendarScreen.tsx
 * Book-like 13-Month x 28-Day Sacred Almanac with Day Zero threshold, Sabbath markers,
 * Biblical Appointed Times indicators, and 8-phase astronomical lunar overlays.
 */

import React, { useState, useMemo } from 'react';
import { CalendarConfiguration, CalendarDay } from '../types/calendar';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { generateSacredYearDays } from '../calendar/sacredCalendar';
import { getMonthDisplayTitle } from '../calendar/months';
import { getLunarPhaseInfo, getLocalizedPhaseName, getPhaseCategory, MajorLunarCategory } from '../astronomy/moon';
import { getObservancesForDay, calculateFeastOccurrences } from '../calendar/feastEngine';
import { LunarPhaseIcon } from '../components/LunarPhaseIcon';
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react';

type PrintPaperSize =
  | 'AUTO'
  | 'A4 portrait'
  | 'A4 landscape'
  | 'letter portrait'
  | 'letter landscape'
  | 'A3 portrait';

interface CalendarScreenProps {
  systemDate: Date;
  config: CalendarConfiguration;
  onOpenDayDetail: (day: CalendarDay) => void;
  language: Language;
}

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  systemDate,
  config,
  onOpenDayDetail,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const [selectedSacredYear, setSelectedSacredYear] = useState<number>(
    systemDate.getFullYear() + 4024
  );
  const [activeMonthFilter, setActiveMonthFilter] = useState<number | 'ALL'>('ALL');
  const [activeLunarPhaseFilter, setActiveLunarPhaseFilter] = useState<'ALL' | MajorLunarCategory>('ALL');
  const [paperSize, setPaperSize] = useState<PrintPaperSize>('AUTO');

  const annualFeasts = useMemo(
    () =>
      calculateFeastOccurrences(
        selectedSacredYear,
        config.lunarAnchorMode,
        config.feastCalendarModel,
        systemDate,
        language
      ),
    [selectedSacredYear, config.lunarAnchorMode, config.feastCalendarModel, systemDate, language]
  );

  const { dayZero, monthsData } = useMemo(() => {
    const sacredDays = generateSacredYearDays(selectedSacredYear, config.lunarAnchorMode);
    const dz = sacredDays.find((d) => d.kind === 'DAY_ZERO') as Extract<CalendarDay, { kind: 'DAY_ZERO' }>;
    const numberedDays = sacredDays.filter(
      (d): d is Extract<CalendarDay, { kind: 'NUMBERED_DAY' }> => d.kind === 'NUMBERED_DAY'
    );

    const months = Array.from({ length: 13 }, (_, idx) => {
      const monthNum = idx + 1;
      const daysInMonth = numberedDays
        .filter((d) => d.month === monthNum)
        .map((numDay) => {
          const isSabbath = numDay.dayOfWeek === 7;
          const lunarInfo = getLunarPhaseInfo(numDay.gregorianDate);
          const phaseCategory = getPhaseCategory(lunarInfo.phaseName);
          const observancesInfo = getObservancesForDay(
            numDay,
            config.lunarAnchorMode,
            config.feastCalendarModel,
            language
          );
          const feastObs = observancesInfo.observances.find(
            (o) => o.type === 'FEAST_DAY' || o.type === 'SOLEMN_ASSEMBLY' || o.type === 'FAST_DAY'
          );
          const isMajorPhaseDay =
            lunarInfo.phaseName === 'New Moon' ||
            lunarInfo.phaseName === 'Full Moon' ||
            lunarInfo.phaseName === 'First Quarter' ||
            lunarInfo.phaseName === 'Last Quarter';

          return {
            numDay,
            isSabbath,
            lunarInfo,
            phaseCategory,
            observancesInfo,
            feastObs,
            isMajorPhaseDay,
          };
        });

      return {
        monthNum,
        roman: ROMAN_MONTHS[idx],
        title: getMonthDisplayTitle(monthNum, config.customMonthNames, language),
        days: daysInMonth,
      };
    });

    return { dayZero: dz, monthsData: months };
  }, [
    selectedSacredYear,
    config.lunarAnchorMode,
    config.feastCalendarModel,
    config.customMonthNames,
    language,
  ]);

  const getShortFeastLabel = (feastId?: string, fullName?: string) => {
    if (!feastId) return fullName || '';
    if (isPt) {
      const ptMap: Record<string, string> = {
        PASSOVER: 'Páscoa',
        UNLEAVENED_BREAD: 'Asmos',
        FIRSTFRUITS: 'Primíc.',
        WEEKS_PENTECOST: 'Pentec.',
        TRUMPETS: 'Tromb.',
        DAY_OF_ATONEMENT: 'Expiaç.',
        TABERNACLES: 'Tabern.',
        EIGHTH_DAY: '8º Dia',
      };
      return ptMap[feastId] || fullName || '';
    }
    const enMap: Record<string, string> = {
      PASSOVER: 'Passover',
      UNLEAVENED_BREAD: 'Matzot',
      FIRSTFRUITS: '1stFruit',
      WEEKS_PENTECOST: 'Shavuot',
      TRUMPETS: 'Trumpet',
      DAY_OF_ATONEMENT: 'Kippur',
      TABERNACLES: 'Sukkot',
      EIGHTH_DAY: '8th Day',
    };
    return enMap[feastId] || fullName || '';
  };

  const getShortPhaseLabel = (phaseName: string) => {
    if (isPt) {
      if (phaseName === 'New Moon') return 'Nova';
      if (phaseName === 'First Quarter') return 'Cres.';
      if (phaseName === 'Full Moon') return 'Cheia';
      if (phaseName === 'Last Quarter') return 'Ming.';
      return getLocalizedPhaseName(phaseName, language);
    }
    if (phaseName === 'New Moon') return 'New';
    if (phaseName === 'First Quarter') return '1st Q';
    if (phaseName === 'Full Moon') return 'Full';
    if (phaseName === 'Last Quarter') return 'Last Q';
    return getLocalizedPhaseName(phaseName, language);
  };

  const handlePrintAlmanac = () => {
    if (typeof window === 'undefined') return;

    const selectedMonthObj =
      activeMonthFilter === 'ALL'
        ? null
        : monthsData.find((m) => m.monthNum === activeMonthFilter) || null;

    const pdfTitle = selectedMonthObj
      ? isPt
        ? `Almanaque-Dimenuveis-Ano-${selectedSacredYear}-Mes-${selectedMonthObj.roman}-${selectedMonthObj.title}`
        : `Dimenuous-Almanac-Year-${selectedSacredYear}-Month-${selectedMonthObj.roman}-${selectedMonthObj.title}`
      : isPt
        ? `Almanaque-Dimenuveis-Ano-Sagrado-${selectedSacredYear}`
        : `Dimenuous-Sacred-Almanac-Year-${selectedSacredYear}`;

    const rootEl = document.documentElement;
    const prevTheme = rootEl.getAttribute('data-theme');
    rootEl.setAttribute('data-theme', 'day');
    rootEl.setAttribute('data-printing', 'true');

    // If running inside Android APK WebView, invoke native Android Print / Save as PDF spooler
    if (window.AndroidBridge?.printPage) {
      window.AndroidBridge.printPage(pdfTitle);
      setTimeout(() => {
        if (prevTheme) {
          rootEl.setAttribute('data-theme', prevTheme);
        } else {
          rootEl.removeAttribute('data-theme');
        }
        rootEl.removeAttribute('data-printing');
      }, 2500);
      return;
    }

    const originalTitle = document.title;
    document.title = pdfTitle;

    let restored = false;
    const restorePrintState = () => {
      if (restored) return;
      restored = true;
      document.title = originalTitle;
      if (prevTheme) {
        rootEl.setAttribute('data-theme', prevTheme);
      } else {
        rootEl.removeAttribute('data-theme');
      }
      rootEl.removeAttribute('data-printing');
      window.removeEventListener('afterprint', restorePrintState);
    };

    window.addEventListener('afterprint', restorePrintState);
    window.print();
    setTimeout(restorePrintState, 3500);
  };

  const firstGregorianDate = dayZero.gregorianDate.toISOString().split('T')[0];
  const lastMonthDays = monthsData[12]?.days;
  const lastGregorianDate =
    lastMonthDays && lastMonthDays.length > 0
      ? lastMonthDays[lastMonthDays.length - 1].numDay.gregorianDate.toISOString().split('T')[0]
      : '';

  const visibleMonths = monthsData.filter(
    (m) => activeMonthFilter === 'ALL' || activeMonthFilter === m.monthNum
  );

  // Helper to render a single month card inside the print sheet so it stretches to fill available grid space
  const renderPrintMonthCard = (m: (typeof monthsData)[number], isSingleMonthFullPage: boolean) => {
    const monthStartGreg = m.days[0]?.numDay.gregorianDate.toISOString().split('T')[0] || '';
    const monthEndGreg =
      m.days[m.days.length - 1]?.numDay.gregorianDate.toISOString().split('T')[0] || '';

    return (
      <div
        key={`print-month-${m.monthNum}`}
        className={`print-month-card ${isSingleMonthFullPage ? 'print-month-card-single' : ''}`}
      >
        {/* Month Header */}
        <div className="print-month-header">
          <div className="print-month-header-left">
            <span className="print-month-roman">{m.roman}.</span>
            <span className="print-month-title">{m.title}</span>
          </div>
          <div className="print-month-header-right">
            <span>
              {monthStartGreg} → {monthEndGreg}
            </span>
            <span>·</span>
            <span>{t.calendar.days28Weeks4}</span>
          </div>
        </div>

        {/* 7-Column Weekday Header */}
        <div className="print-weekday-header">
          {t.calendar.daysOfWeek.map((colName, idx) => (
            <div
              key={idx}
              className={`print-weekday-cell ${idx === 6 ? 'print-sabbath-col' : ''}`}
            >
              {colName}
            </div>
          ))}
        </div>

        {/* 28-Day Stretchable Grid (4 rows × 7 columns) */}
        <div className="print-days-grid">
          {m.days.map((dayItem, cellIdx) => {
            const {
              numDay,
              isSabbath,
              lunarInfo,
              observancesInfo,
              feastObs,
              isMajorPhaseDay,
            } = dayItem;

            const colIdx = cellIdx % 7;
            const rowIdx = Math.floor(cellIdx / 7);
            const gregDateStr = isSingleMonthFullPage
              ? numDay.gregorianDate.toISOString().split('T')[0]
              : numDay.gregorianDate.toISOString().slice(5, 10);

            return (
              <div
                key={`print-day-${numDay.dayOfYear}`}
                className={`print-day-cell ${colIdx < 6 ? 'print-border-r' : ''} ${
                  rowIdx < 3 ? 'print-border-b' : ''
                } ${
                  observancesInfo.isDoubleObservance || feastObs
                    ? 'print-cell-feast'
                    : isSabbath
                      ? 'print-cell-sabbath'
                      : isMajorPhaseDay
                        ? 'print-cell-lunar'
                        : ''
                }`}
              >
                <div className="print-day-cell-top">
                  <div className="print-day-num-group">
                    <span className="print-day-number">{numDay.dayOfMonth}</span>
                    <span className="print-day-greg">{gregDateStr}</span>
                  </div>
                  <div className="print-day-moon">
                    <LunarPhaseIcon
                      fraction={lunarInfo.fraction}
                      phaseName={lunarInfo.phaseName}
                      size={isSingleMonthFullPage ? 18 : 11}
                    />
                    <span className="print-day-illum">
                      {Math.round(lunarInfo.fraction * 100)}%
                    </span>
                  </div>
                </div>

                <div className="print-day-cell-bottom">
                  {feastObs ? (
                    <div className="print-cell-badge-feast">
                      {isSingleMonthFullPage
                        ? feastObs.feastName
                        : getShortFeastLabel(feastObs.feastId, feastObs.feastName)}
                    </div>
                  ) : isSabbath ? (
                    <div className="print-cell-badge-sabbath">{t.badges.sabbath}</div>
                  ) : isMajorPhaseDay ? (
                    <div className="print-cell-badge-phase">
                      {isSingleMonthFullPage
                        ? getLocalizedPhaseName(lunarInfo.phaseName, language)
                        : getShortPhaseLabel(lunarInfo.phaseName)}
                    </div>
                  ) : isSingleMonthFullPage ? (
                    <div className="print-cell-badge-phase-subtle">
                      {getLocalizedPhaseName(lunarInfo.phaseName, language)}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 print-calendar-view">
      {/* Dynamic @page Paper Size Injection */}
      <style>
        {`@media print { @page { ${
          paperSize !== 'AUTO' ? `size: ${paperSize};` : ''
        } margin: 6mm; } }`}
      </style>

      {/* ================================================================== */}
      {/* PRINT-ONLY ADAPTIVE FULL-PAGE SHEETS                               */}
      {/* Fills 100% of each page whether exporting 1 month or all 13 months */}
      {/* ================================================================== */}
      <div className="print-only print-document-sheets">
        {activeMonthFilter !== 'ALL' && visibleMonths.length === 1 ? (
          /* SINGLE MONTH FULL-PAGE SHEET (100% Page Fill) */
          <section className="print-sheet print-sheet-single">
            <div className="print-masthead">
              <div className="print-masthead-row">
                <div>
                  <div className="print-masthead-kicker">
                    {isPt
                      ? 'EVANGELHO DAS DIMENÚVEIS · ALMANAQUE SAGRADO DE 13 MESES'
                      : 'GOSPEL OF DIMENUOUS · 13-MONTH SACRED ALMANAC'}
                  </div>
                  <h1 className="print-masthead-title">
                    {visibleMonths[0].roman}. {visibleMonths[0].title} — {t.calendar.yearTitle}{' '}
                    {selectedSacredYear}
                  </h1>
                </div>
                <div className="print-masthead-right">
                  <div>
                    <strong>{isPt ? 'Dia Zero:' : 'Day Zero:'}</strong> {firstGregorianDate} (
                    {getLocalizedPhaseName(dayZero.lunarAnchor.phaseName, language)} ·{' '}
                    {(dayZero.lunarAnchor.illumination * 100).toFixed(1)}%)
                  </div>
                  <div>
                    <strong>{isPt ? 'Âncora:' : 'Anchor:'}</strong> {config.lunarAnchorMode} ·{' '}
                    <strong>{isPt ? 'Modelo:' : 'Model:'}</strong> {config.feastCalendarModel}
                  </div>
                </div>
              </div>
            </div>

            <div className="print-single-month-wrapper">
              {renderPrintMonthCard(visibleMonths[0], true)}
            </div>

            <div className="print-colophon">
              {isPt
                ? `Evangelho das Dimenúveis · Ano Sagrado ${selectedSacredYear} · Mês ${visibleMonths[0].roman} (${visibleMonths[0].title}) · 28 Dias / 4 Semanas Perfeitas`
                : `Gospel of Dimenuous · Sacred Year ${selectedSacredYear} · Month ${visibleMonths[0].roman} (${visibleMonths[0].title}) · 28 Days / 4 Perfect Weeks`}
            </div>
          </section>
        ) : (
          /* ALL 13 MONTHS MULTI-PAGE FULL-BLEED SHEETS (4 Pages, 100% Filled) */
          <>
            {/* PAGE 1: Masthead + Day Zero + Months I–IV */}
            <section className="print-sheet">
              <div className="print-masthead">
                <div className="print-masthead-row">
                  <div>
                    <div className="print-masthead-kicker">
                      {isPt
                        ? 'EVANGELHO DAS DIMENÚVEIS · ALMANAQUE SAGRADO DE 13 MESES (PÁG. 1/4)'
                        : 'GOSPEL OF DIMENUOUS · 13-MONTH SACRED ALMANAC (PAGE 1/4)'}
                    </div>
                    <h1 className="print-masthead-title">
                      {t.calendar.yearTitle} {selectedSacredYear} ({firstGregorianDate} —{' '}
                      {lastGregorianDate})
                    </h1>
                  </div>
                  <div className="print-masthead-right">
                    <div>
                      <strong>{isPt ? 'Dia Zero (Sábado Anual):' : 'Day Zero (Annual Sabbath):'}</strong>{' '}
                      {firstGregorianDate} ·{' '}
                      {getLocalizedPhaseName(dayZero.lunarAnchor.phaseName, language)} (
                      {(dayZero.lunarAnchor.illumination * 100).toFixed(1)}%)
                    </div>
                    <div>
                      <strong>{isPt ? 'Âncora Lunar:' : 'Lunar Anchor:'}</strong>{' '}
                      {config.lunarAnchorMode} · <strong>{isPt ? 'Festas:' : 'Feasts:'}</strong>{' '}
                      {config.feastCalendarModel}
                    </div>
                  </div>
                </div>
              </div>

              <div className="print-sheet-grid-2x2">
                {monthsData.slice(0, 4).map((m) => renderPrintMonthCard(m, false))}
              </div>

              <div className="print-colophon">
                {isPt
                  ? `Evangelho das Dimenúveis · Ano Sagrado ${selectedSacredYear} · Meses I a IV`
                  : `Gospel of Dimenuous · Sacred Year ${selectedSacredYear} · Months I to IV`}
              </div>
            </section>

            {/* PAGE 2: Months V–VIII */}
            <section className="print-sheet">
              <div className="print-running-header">
                <span>
                  {isPt
                    ? `EVANGELHO DAS DIMENÚVEIS · ANO SAGRADO ${selectedSacredYear}`
                    : `GOSPEL OF DIMENUOUS · SACRED YEAR ${selectedSacredYear}`}
                </span>
                <span>
                  {isPt ? 'MESES V A VIII (PÁG. 2/4)' : 'MONTHS V TO VIII (PAGE 2/4)'}
                </span>
              </div>

              <div className="print-sheet-grid-2x2">
                {monthsData.slice(4, 8).map((m) => renderPrintMonthCard(m, false))}
              </div>

              <div className="print-colophon">
                {isPt
                  ? `Evangelho das Dimenúveis · Ano Sagrado ${selectedSacredYear} · Meses V a VIII`
                  : `Gospel of Dimenuous · Sacred Year ${selectedSacredYear} · Months V to VIII`}
              </div>
            </section>

            {/* PAGE 3: Months IX–XII */}
            <section className="print-sheet">
              <div className="print-running-header">
                <span>
                  {isPt
                    ? `EVANGELHO DAS DIMENÚVEIS · ANO SAGRADO ${selectedSacredYear}`
                    : `GOSPEL OF DIMENUOUS · SACRED YEAR ${selectedSacredYear}`}
                </span>
                <span>
                  {isPt ? 'MESES IX A XII (PÁG. 3/4)' : 'MONTHS IX TO XII (PAGE 3/4)'}
                </span>
              </div>

              <div className="print-sheet-grid-2x2">
                {monthsData.slice(8, 12).map((m) => renderPrintMonthCard(m, false))}
              </div>

              <div className="print-colophon">
                {isPt
                  ? `Evangelho das Dimenúveis · Ano Sagrado ${selectedSacredYear} · Meses IX a XII`
                  : `Gospel of Dimenuous · Sacred Year ${selectedSacredYear} · Months IX to XII`}
              </div>
            </section>

            {/* PAGE 4: Month XIII + Complete Table of Appointed Biblical Feasts */}
            <section className="print-sheet print-sheet-last">
              <div className="print-running-header">
                <span>
                  {isPt
                    ? `EVANGELHO DAS DIMENÚVEIS · ANO SAGRADO ${selectedSacredYear}`
                    : `GOSPEL OF DIMENUOUS · SACRED YEAR ${selectedSacredYear}`}
                </span>
                <span>
                  {isPt
                    ? 'MÊS XIII E TABELA ANUAL DE FESTAS BÍBLICAS (PÁG. 4/4)'
                    : 'MONTH XIII & ANNUAL BIBLICAL FEASTS TABLE (PAGE 4/4)'}
                </span>
              </div>

              <div className="print-sheet-page4-split">
                {/* Top Half: Month XIII Expanded */}
                <div className="print-page4-month13">
                  {monthsData[12] ? renderPrintMonthCard(monthsData[12], true) : null}
                </div>

                {/* Bottom Half: Complete 8 Appointed Feasts & Day Zero Reference Table */}
                <div className="print-feasts-summary-card">
                  <div className="print-month-header">
                    <div className="print-month-header-left">
                      <span className="print-month-roman">★</span>
                      <span className="print-month-title">
                        {isPt
                          ? `Tempos Determinados (Moedim) e Limiar do Dia Zero — Ano Sagrado ${selectedSacredYear}`
                          : `Appointed Times (Moedim) & Day Zero Threshold — Sacred Year ${selectedSacredYear}`}
                      </span>
                    </div>
                    <div className="print-month-header-right">
                      <span>
                        {isPt
                          ? 'Início da Observância: Pôr do Sol da Véspera'
                          : 'Observance Boundary: Evening Sunset'}
                      </span>
                    </div>
                  </div>

                  <table className="print-feasts-table">
                    <thead>
                      <tr>
                        <th>{isPt ? 'Festa / Solenidade' : 'Appointed Feast'}</th>
                        <th>{isPt ? 'Data Sagrada' : 'Sacred Date'}</th>
                        <th>{isPt ? 'Data Gregoriana' : 'Gregorian Date'}</th>
                        <th>{isPt ? 'Fase Lunar' : 'Lunar Phase'}</th>
                        <th>{isPt ? 'Referências Bíblicas' : 'Scriptural References'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>{isPt ? 'Dia Zero (Ano Novo)' : 'Day Zero (New Year)'}</strong>
                        </td>
                        <td>{isPt ? 'Fora dos 13 Meses' : 'Outside 13 Months'}</td>
                        <td>{firstGregorianDate}</td>
                        <td>
                          {getLocalizedPhaseName(dayZero.lunarAnchor.phaseName, language)} (
                          {Math.round(dayZero.lunarAnchor.illumination * 100)}%)
                        </td>
                        <td>Êxodo 12:2 · Salmos 104:19</td>
                      </tr>
                      {annualFeasts.map((occ) => {
                        const sDate = occ.gregorianStartDate.toISOString().split('T')[0];
                        const eDate = occ.gregorianEndDate.toISOString().split('T')[0];
                        return (
                          <tr key={`print-feast-${occ.feast.id}`}>
                            <td>
                              <strong>{occ.feast.name}</strong> ({occ.feast.hebrewName})
                            </td>
                            <td>
                              {isPt ? 'Mês' : 'Month'} {occ.feast.sacredMonth},{' '}
                              {isPt ? 'Dia' : 'Day'} {occ.feast.sacredDay}
                              {occ.feast.durationDays > 1
                                ? `–${occ.feast.sacredDay + occ.feast.durationDays - 1}`
                                : ''}
                            </td>
                            <td>{sDate === eDate ? sDate : `${sDate} → ${eDate}`}</td>
                            <td>
                              {getLocalizedPhaseName(occ.lunarPhaseAtStart.phaseName, language)} (
                              {Math.round(occ.lunarPhaseAtStart.fraction * 100)}%)
                            </td>
                            <td>{occ.feast.biblicalReferences.slice(0, 2).join(', ')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="print-colophon">
                {isPt
                  ? `Almanaque Arquivístico — Evangelho das Dimenúveis · Ano Sagrado ${selectedSacredYear} (13 Meses × 28 Dias = 364 Dias + Dia Zero)`
                  : `Archival Almanac — Gospel of Dimenuous · Sacred Year ${selectedSacredYear} (13 Months × 28 Days = 364 Days + Day Zero)`}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Book Almanac Header & Control Strip (Screen Only) */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800 print-calendar-header no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 sm:p-5">
          <div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 tabular-nums whitespace-nowrap">
              {t.calendar.yearTitle} {selectedSacredYear}
            </h2>
            <p className="text-xs text-slate-300 font-serif italic mt-0.5 whitespace-nowrap">
              {t.calendar.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Year Stepper */}
            <div className="inline-flex items-center border border-slate-700 bg-slate-900 divide-x divide-slate-700 font-serif text-xs shrink-0">
              <button
                onClick={() => setSelectedSacredYear((prev) => prev - 1)}
                className="p-2 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                title={isPt ? 'Ano Sagrado Anterior' : 'Previous Sacred Year'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1.5 font-semibold text-amber-400 tabular-nums whitespace-nowrap">
                {isPt ? 'Ano' : 'Year'} {selectedSacredYear}
              </span>
              <button
                onClick={() => setSelectedSacredYear((prev) => prev + 1)}
                className="p-2 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                title={isPt ? 'Próximo Ano Sagrado' : 'Next Sacred Year'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Month Filter */}
            <select
              value={activeMonthFilter}
              onChange={(e) =>
                setActiveMonthFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))
              }
              aria-label={isPt ? 'Selecionar Mês' : 'Select Month'}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-xs font-serif text-slate-100 focus:outline-none focus:border-amber-500 min-w-0"
            >
              <option value="ALL">{t.calendar.allMonths}</option>
              {monthsData.map((m) => (
                <option key={m.monthNum} value={m.monthNum}>
                  {m.roman}. {m.title}
                </option>
              ))}
            </select>

            {/* Paper Size Selector for Print / PDF */}
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as PrintPaperSize)}
              aria-label={isPt ? 'Tamanho do Papel para PDF' : 'PDF Paper Size'}
              title={isPt ? 'Tamanho do Papel para Exportação PDF' : 'Paper Size for PDF Export'}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-xs font-serif text-slate-100 focus:outline-none focus:border-amber-500 min-w-0"
            >
              <option value="AUTO">
                {isPt ? 'Papel: Adaptável (Auto)' : 'Paper: Adaptive (Auto)'}
              </option>
              <option value="A4 portrait">
                {isPt ? 'A4 Retrato' : 'A4 Portrait'}
              </option>
              <option value="A4 landscape">
                {isPt ? 'A4 Paisagem' : 'A4 Landscape'}
              </option>
              <option value="letter portrait">
                {isPt ? 'Carta (Letter) Retrato' : 'Letter Portrait'}
              </option>
              <option value="letter landscape">
                {isPt ? 'Carta (Letter) Paisagem' : 'Letter Landscape'}
              </option>
              <option value="A3 portrait">
                {isPt ? 'A3 Retrato' : 'A3 Portrait'}
              </option>
            </select>

            {/* Archival Print-to-PDF Button */}
            <button
              type="button"
              onClick={handlePrintAlmanac}
              aria-label={isPt ? 'Imprimir ou Salvar em PDF' : 'Print or Save as PDF'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-serif font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title={
                isPt
                  ? 'Imprimir Almanaque ou Salvar como PDF preenchido em página inteira'
                  : 'Print Almanac or Save as full-page PDF'
              }
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{isPt ? 'Imprimir / PDF' : 'Print / PDF'}</span>
            </button>
          </div>
        </div>

        {/* Lunar Phase Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-3 bg-slate-900/40 text-xs font-serif">
          <span className="text-slate-300 italic shrink-0 whitespace-nowrap">
            {t.calendar.lunarFilter}
          </span>

          <div className="grid grid-cols-5 gap-px bg-slate-700 border border-slate-700 w-full sm:w-auto">
            {[
              { id: 'ALL', label: t.calendar.allPhases },
              { id: 'New', label: isPt ? 'Nova' : 'New' },
              { id: 'Waxing', label: isPt ? 'Cresc.' : 'Waxing' },
              { id: 'Full', label: isPt ? 'Cheia' : 'Full' },
              { id: 'Waning', label: isPt ? 'Ming.' : 'Waning' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveLunarPhaseFilter(p.id as any)}
                className={`px-1.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-serif text-center transition-colors cursor-pointer whitespace-nowrap ${
                  activeLunarPhaseFilter === p.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DAY ZERO THRESHOLD RECORD ROW (Screen Only) */}
      <div
        onClick={() => onOpenDayDetail(dayZero)}
        className="no-print border border-purple-500/50 bg-slate-950 hover:bg-slate-900/80 transition-colors cursor-pointer grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800"
      >
        <div className="md:col-span-9 p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider whitespace-nowrap">
            <span className="text-purple-300 font-semibold">
              {isPt ? 'Dia Zero' : 'Day Zero'}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400 font-semibold">{t.calendar.annualSabbathThreshold}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 italic normal-case tabular-nums">
              {dayZero.gregorianDate.toISOString().split('T')[0]}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 whitespace-nowrap">
            {t.calendar.dayZeroBannerTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.calendar.dayZeroBannerDesc}
          </p>
        </div>

        <div className="md:col-span-3 p-4 sm:p-5 flex items-center gap-3.5 bg-slate-900/30">
          <LunarPhaseIcon
            fraction={dayZero.lunarAnchor.illumination}
            phaseName={dayZero.lunarAnchor.phaseName}
            size={38}
          />
          <div className="text-xs font-serif whitespace-nowrap">
            <span className="text-slate-300 block text-xs italic">{t.calendar.springAnchorPhase}</span>
            <strong className="text-purple-300 block text-sm sm:text-base">
              {getLocalizedPhaseName(dayZero.lunarAnchor.phaseName, language)}
            </strong>
            <span className="text-xs text-slate-200 tabular-nums font-medium">
              {(dayZero.lunarAnchor.illumination * 100).toFixed(1)}% {isPt ? 'Ilum.' : 'Illum.'}
            </span>
          </div>
        </div>
      </div>

      {/* 13-MONTH ALMANAC MATRIX (Screen Interactive View) */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-2 gap-6">
        {monthsData
          .filter((m) => activeMonthFilter === 'ALL' || activeMonthFilter === m.monthNum)
          .map((m, visibleIdx) => {
            const monthStartGreg = m.days[0]?.numDay.gregorianDate.toISOString().split('T')[0] || '';
            const monthEndGreg =
              m.days[m.days.length - 1]?.numDay.gregorianDate.toISOString().split('T')[0] || '';
            // Insert a clean page break after every 4th month when printing all months (so Page 1 has Day Zero + Months I–IV, Page 2 has Months V–VIII, Page 3 has Months IX–XII, Page 4 has Month XIII + Colophon)
            const shouldBreakPageAfter =
              activeMonthFilter === 'ALL' && (visibleIdx === 3 || visibleIdx === 7 || visibleIdx === 11);

            return (
              <div
                key={m.monthNum}
                className={`border border-slate-800 bg-slate-950 print-month-card ${
                  shouldBreakPageAfter ? 'print-page-break-after' : ''
                }`}
              >
                {/* Month Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900/70 border-b border-slate-800 print-month-header">
                  <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className="font-serif italic text-base font-bold text-amber-400">
                      {m.roman}.
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100">
                      {m.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-serif italic text-slate-200 tabular-nums whitespace-nowrap">
                    <span className="print-only text-[10px] not-italic">
                      {monthStartGreg} → {monthEndGreg} ·
                    </span>
                    <span>{t.calendar.days28Weeks4}</span>
                  </div>
                </div>

                {/* 7-Column Day Header */}
                <div className="grid grid-cols-7 divide-x divide-slate-800 border-b border-slate-800 bg-slate-900/40 text-center text-[10.5px] sm:text-xs font-serif text-slate-200 print-weekday-header">
                  {t.calendar.daysOfWeek.map((colName, idx) => (
                    <div
                      key={idx}
                      className={`py-2 px-0.5 font-bold whitespace-nowrap ${
                        idx === 6 ? 'text-amber-400 bg-amber-950/15 print-sabbath-col' : ''
                      }`}
                    >
                      <span className="sm:hidden print-hide-mobile-abbr">
                        {idx === 6 ? (isPt ? 'Sáb' : 'Sab') : `D${idx + 1}`}
                      </span>
                      <span className="hidden sm:inline print-show-full-weekday">{colName}</span>
                    </div>
                  ))}
                </div>

                {/* 28-Day Hairline Grid */}
                <div className="grid grid-cols-7 print-days-grid">
                  {m.days.map((dayItem, cellIdx) => {
                    const {
                      numDay,
                      isSabbath,
                      lunarInfo,
                      phaseCategory,
                      observancesInfo,
                      feastObs,
                      isMajorPhaseDay,
                    } = dayItem;

                    const matchesPhaseFilter =
                      activeLunarPhaseFilter === 'ALL' || phaseCategory === activeLunarPhaseFilter;

                    const colIdx = cellIdx % 7;
                    const rowIdx = Math.floor(cellIdx / 7);
                    const gregShort = numDay.gregorianDate.toISOString().slice(5, 10);

                    return (
                      <div
                        key={numDay.dayOfYear}
                        onClick={() => onOpenDayDetail(numDay)}
                        className={`print-day-cell p-1.5 sm:p-2.5 min-h-[4.25rem] sm:min-h-[5rem] h-auto flex flex-col justify-between gap-1 cursor-pointer transition-colors ${
                          colIdx < 6 ? 'border-r border-slate-800' : ''
                        } ${rowIdx < 3 ? 'border-b border-slate-800' : ''} ${
                          !matchesPhaseFilter ? 'opacity-35' : 'opacity-100'
                        } ${
                          observancesInfo.isDoubleObservance
                            ? 'bg-amber-950/40 hover:bg-amber-950/60 text-amber-200 print-cell-feast'
                            : feastObs
                            ? 'bg-amber-950/25 hover:bg-amber-950/40 text-amber-200 print-cell-feast'
                            : isSabbath
                            ? 'bg-amber-950/15 hover:bg-amber-950/30 text-amber-200 print-cell-sabbath'
                            : isMajorPhaseDay
                            ? 'bg-blue-950/20 hover:bg-blue-950/35 text-slate-100 print-cell-lunar'
                            : 'bg-slate-950 hover:bg-slate-900 text-slate-100'
                        }`}
                      >
                        {/* Cell Top Row: Day Number + Moon Phase Icon */}
                        <div className="flex items-start justify-between gap-0.5">
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`font-serif font-bold text-sm sm:text-base tabular-nums leading-none ${
                                isSabbath ? 'text-amber-400' : 'text-slate-100'
                              }`}
                            >
                              {numDay.dayOfMonth}
                            </span>
                            <span className="print-only text-[8.5px] tabular-nums text-slate-500">
                              {gregShort}
                            </span>
                          </div>

                          <LunarPhaseIcon
                            fraction={lunarInfo.fraction}
                            phaseName={lunarInfo.phaseName}
                            size={14}
                          />
                        </div>

                        {/* Cell Bottom Row: Single-Line Observance / Lunar Readout */}
                        <div className="min-w-0 overflow-hidden">
                          {feastObs ? (
                            <div
                              className="text-[9.5px] sm:text-xs font-serif font-semibold text-amber-300 leading-tight whitespace-nowrap"
                              title={feastObs.label}
                            >
                              {getShortFeastLabel(feastObs.feastId, feastObs.feastName)}
                            </div>
                          ) : isSabbath ? (
                            <div className="text-[9.5px] sm:text-xs font-serif italic text-amber-400 font-semibold leading-tight whitespace-nowrap">
                              <span className="sm:hidden print-hide-mobile-abbr">{isPt ? 'Sáb' : 'Sab'}</span>
                              <span className="hidden sm:inline print-show-full-weekday">{t.badges.sabbath}</span>
                            </div>
                          ) : isMajorPhaseDay ? (
                            <div
                              className="text-[9.5px] sm:text-xs font-serif italic text-blue-300 font-medium leading-tight whitespace-nowrap"
                              title={getLocalizedPhaseName(lunarInfo.phaseName, language)}
                            >
                              {getShortPhaseLabel(lunarInfo.phaseName)}
                            </div>
                          ) : (
                            <div className="text-[10px] sm:text-xs font-serif text-slate-300 tabular-nums font-medium leading-tight whitespace-nowrap">
                              {Math.round(lunarInfo.fraction * 100)}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
