/**
 * @file src/tests/calendarTests.ts
 * Automated unit test suite verifying core calendar engine logic (Bilingual).
 */

import { generateSacredYearDays } from '../calendar/sacredCalendar';
import { CalendarDay } from '../types/calendar';
import { calculateElapsedYears, calculateMillennialPosition } from '../chronology/chronologyEngine';
import { getLunarPhaseInfo, getLocalizedPhaseName } from '../astronomy/moon';
import { HISTORICAL_ECLIPSE_EVENTS } from '../astronomy/eclipses';
import { Language } from '../i18n/translations';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

export function runCalendarEngineTests(language: Language = 'en'): TestResult[] {
  const results: TestResult[] = [];
  const isPt = language === 'pt';

  // Test 1: Calendar Mathematics (13 x 28 = 364)
  try {
    const days = generateSacredYearDays(6050, 'CONJUNCTION');
    const totalDays = days.length;
    const numberedDays = days.filter((d) => d.kind === 'NUMBERED_DAY');
    const dayZeroDays = days.filter((d) => d.kind === 'DAY_ZERO');

    const passed = totalDays === 365 && numberedDays.length === 364 && dayZeroDays.length === 1;
    results.push({
      name: isPt
        ? '1. Matemática do Calendário (13 x 28 = 364 + Dia 0)'
        : '1. Calendar Mathematics (13 x 28 = 364 + Day 0)',
      passed,
      message: passed
        ? isPt
          ? 'APROVADO: 364 dias numerados + 1 Dia Zero = 365 dias totais no ano sagrado.'
          : 'PASSED: 364 numbered days + 1 Day Zero = 365 total sacred year days.'
        : isPt
          ? `REPROVADO: esperados 365 dias totais, obtidos ${totalDays}.`
          : `FAILED: expected 365 total days, got ${totalDays}.`,
    });
  } catch (e: any) {
    results.push({
      name: isPt ? '1. Matemática do Calendário' : '1. Calendar Mathematics',
      passed: false,
      message: `ERROR: ${e.message}`,
    });
  }

  // Test 2: Month Boundaries
  try {
    const days = generateSacredYearDays(6050, 'CONJUNCTION');
    const m1d28 = days.find((d) => d.kind === 'NUMBERED_DAY' && d.month === 1 && d.dayOfMonth === 28) as Extract<CalendarDay, { kind: 'NUMBERED_DAY' }> | undefined;
    const m2d1 = days.find((d) => d.kind === 'NUMBERED_DAY' && d.month === 2 && d.dayOfMonth === 1) as Extract<CalendarDay, { kind: 'NUMBERED_DAY' }> | undefined;
    const m13d28 = days.find((d) => d.kind === 'NUMBERED_DAY' && d.month === 13 && d.dayOfMonth === 28) as Extract<CalendarDay, { kind: 'NUMBERED_DAY' }> | undefined;
    const dayZero = days.find((d) => d.kind === 'DAY_ZERO');

    const passed =
      m1d28 !== undefined &&
      m2d1 !== undefined &&
      m13d28 !== undefined &&
      dayZero !== undefined &&
      m1d28.dayOfYear === 28 &&
      m2d1.dayOfYear === 29 &&
      m13d28.dayOfYear === 364;

    results.push({
      name: isPt
        ? '2. Fronteiras de Mês (M1 D28 -> M2 D1 & M13 D28 -> Limiar do Dia Zero)'
        : '2. Month Boundaries (M1 D28 -> M2 D1 & M13 D28 -> Day Zero threshold)',
      passed,
      message: passed
        ? isPt
          ? 'APROVADO: As fronteiras dos meses transitam perfeitamente sem quebrar a numeração dos dias.'
          : 'PASSED: Month boundaries transition seamlessly without breaking day numbering.'
        : isPt
          ? 'REPROVADO: Anomalia detectada no mapeamento de fronteira de mês.'
          : 'FAILED: Month boundary mapping anomaly detected.',
    });
  } catch (e: any) {
    results.push({
      name: isPt ? '2. Fronteiras de Mês' : '2. Month Boundaries',
      passed: false,
      message: `ERROR: ${e.message}`,
    });
  }

  // Test 3: Day Zero Uniqueness
  try {
    const days = generateSacredYearDays(6050, 'CONJUNCTION');
    const dayZero = days[0];
    const isZero = dayZero.kind === 'DAY_ZERO' && dayZero.isSabbath === true;

    results.push({
      name: isPt ? '3. Verificação do Dia Zero' : '3. Day Zero Verification',
      passed: isZero,
      message: isZero
        ? isPt
          ? 'APROVADO: O Dia Zero é preservado corretamente como Sábado Anual do Dia 0.'
          : 'PASSED: Day Zero is correctly preserved as Day 0 Annual Sabbath.'
        : isPt
          ? 'REPROVADO: Dia Zero não formatado corretamente.'
          : 'FAILED: Day Zero is not correctly formatted as Day 0.',
    });
  } catch (e: any) {
    results.push({
      name: isPt ? '3. Verificação do Dia Zero' : '3. Day Zero Verification',
      passed: false,
      message: `ERROR: ${e.message}`,
    });
  }

  // Test 4: Unbroken Sabbath Continuity
  try {
    const days = generateSacredYearDays(6050, 'CONJUNCTION');
    const sabbaths = days.filter((d) => d.kind === 'NUMBERED_DAY' && d.dayOfWeek === 7);
    const passed = sabbaths.length === 52;

    results.push({
      name: isPt ? '4. Ciclo Semanal Contínuo de Sábado' : '4. Continuous Weekly Sabbath Cycle',
      passed,
      message: passed
        ? isPt
          ? 'APROVADO: Exatamente 52 Sábados semanais contínuos gerados em 364 dias numerados.'
          : 'PASSED: Exactly 52 continuous weekly Sabbaths generated in 364 numbered days.'
        : isPt
          ? `REPROVADO: esperados 52 sábados semanais, obtidos ${sabbaths.length}.`
          : `FAILED: expected 52 weekly sabbaths, got ${sabbaths.length}.`,
    });
  } catch (e: any) {
    results.push({
      name: isPt ? '4. Ciclo Semanal Contínuo de Sábado' : '4. Continuous Weekly Sabbath Cycle',
      passed: false,
      message: `ERROR: ${e.message}`,
    });
  }

  // Test 5: BCE/CE No Year Zero Rule
  try {
    const elapsed1 = calculateElapsedYears(4004, 1);
    const elapsed2026 = calculateElapsedYears(4004, 2026);
    const passed = elapsed1 === 4004 && elapsed2026 === 6029;

    results.push({
      name: isPt
        ? '5. Cronologia a.C./d.C. (Regra Sem Ano Zero)'
        : '5. BCE/CE Chronology (No Year Zero Rule)',
      passed,
      message: passed
        ? isPt
          ? 'APROVADO: Transição 1 a.C. -> 1 d.C. calculada corretamente sem inserir Ano 0.'
          : 'PASSED: 1 BCE -> 1 CE correctly calculated without inserting Year 0.'
        : isPt
          ? 'REPROVADO: Erro na transição sem ano zero.'
          : 'FAILED: Year zero calculation mismatch.',
    });
  } catch (e: any) {
    results.push({
      name: isPt ? '5. Cronologia a.C./d.C.' : '5. BCE/CE Chronology',
      passed: false,
      message: `ERROR: ${e.message}`,
    });
  }

  // Test 6: Millennial Great Week Calculation
  try {
    const m1000 = calculateMillennialPosition(-3003, 'ussher', 0, language); // 3004 BCE = 1000 AM
    const m1001 = calculateMillennialPosition(-3002, 'ussher', 0, language); // 3003 BCE = 1001 AM
    const m6000 = calculateMillennialPosition(1997, 'ussher', 0, language);  // 1997 CE = 6000 AM
    const m6001 = calculateMillennialPosition(1998, 'ussher', 0, language);  // 1998 CE = 6001 AM

    const passed =
      m1000.millenniumNumber === 1 &&
      m1001.millenniumNumber === 2 &&
      m6000.millenniumNumber === 6 &&
      m6001.millenniumNumber === 7 &&
      m6001.isMillennialSabbath === true;

    results.push({
      name: isPt
        ? '6. Transições Milenares da Grande Semana (Milênio VI ao Sábado do Milênio VII)'
        : '6. Great Week Millennial Transitions (Millennium VI to VII Sabbath)',
      passed,
      message: passed
        ? isPt
          ? 'APROVADO: O Ano 6000 AM mapeia corretamente para o Milênio VI e o Ano 6001 AM transita para o Sábado do Milênio VII.'
          : 'PASSED: Year 6000 AM correctly maps to Millennium VI and Year 6001 AM transitions into Millennium VII Sabbath.'
        : isPt
          ? 'REPROVADO: Incompatibilidade no cálculo de transição milenar.'
          : 'FAILED: Millennial transition calculation mismatch.',
    });
  } catch (e: any) {
    results.push({
      name: isPt ? '6. Transições Milenares da Grande Semana' : '6. Great Week Millennial Transitions',
      passed: false,
      message: `ERROR: ${e.message}`,
    });
  }

  // Test 7: Lunar Calculation Precision
  try {
    const sampleDate = new Date('2026-03-19T00:00:00Z');
    const lunar = getLunarPhaseInfo(sampleDate);
    const passed = lunar.phaseName !== undefined && lunar.fraction >= 0 && lunar.fraction <= 1;
    const locPhase = getLocalizedPhaseName(lunar.phaseName, language);

    results.push({
      name: isPt ? '7. Cálculos Lunares Astronômicos' : '7. Astronomical Lunar Calculations',
      passed,
      message: passed
        ? isPt
          ? `APROVADO: Fase calculada: ${locPhase}, iluminação: ${Math.round(lunar.fraction * 100)}%, lunação #${lunar.lunationNumber}.`
          : `PASSED: Computed phase: ${locPhase}, illumination: ${Math.round(lunar.fraction * 100)}%, lunation #${lunar.lunationNumber}.`
        : isPt
          ? 'REPROVADO: Cálculos lunares inválidos.'
          : 'FAILED: Invalid lunar calculations.',
    });
  } catch (e: any) {
    results.push({
      name: isPt ? '7. Cálculos Lunares Astronômicos' : '7. Astronomical Lunar Calculations',
      passed: false,
      message: `ERROR: ${e.message}`,
    });
  }

  // Test 8: Joshua 10 Candidate Event Isolation
  try {
    const joshuaEvent = HISTORICAL_ECLIPSE_EVENTS.find((e) => e.id === 'joshua-10-long-day');
    const passed = joshuaEvent !== undefined && joshuaEvent.dateStatus === 'candidate';

    results.push({
      name: isPt
        ? '8. Isolamento do Evento Candidato de Josué 10'
        : '8. Joshua 10 Event Candidate Isolation',
      passed,
      message: passed
        ? isPt
          ? 'APROVADO: Josué 10 é preservado como um evento histórico CANDIDATO sem alteração forçada da cronologia.'
          : 'PASSED: Joshua 10 is preserved as a CANDIDATE historical event without forced chronology alteration.'
        : isPt
          ? 'REPROVADO: Evento de Josué 10 não classificado adequadamente como candidato.'
          : 'FAILED: Joshua 10 event not properly classified as candidate.',
    });
  } catch (e: any) {
    results.push({
      name: isPt ? '8. Isolamento do Evento Candidato de Josué 10' : '8. Joshua 10 Event Candidate Isolation',
      passed: false,
      message: `ERROR: ${e.message}`,
    });
  }

  return results;
}
