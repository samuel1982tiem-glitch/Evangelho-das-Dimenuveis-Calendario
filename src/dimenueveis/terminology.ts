/**
 * @file src/dimenueveis/terminology.ts
 * Canonical Terminology Lexicon for DIMENÚVEIS architecture (Bilingual).
 */

import { Language } from '../i18n/translations';

export interface LexiconTerm {
  term: string;
  category: string;
  definition: string;
  dimenueveisReference: string;
}

export const CANONICAL_LEXICON: LexiconTerm[] = [
  {
    term: 'Day Zero (Dia Zero)',
    category: 'CALENDAR',
    definition: 'The annual New-Year/Sabbath threshold day preceding Month I Day 1. It is outside the 364 numbered calendar days.',
    dimenueveisReference: 'Gospel of Dimenuous — Section II',
  },
  {
    term: 'Sacred Year (Ano Sagrado)',
    category: 'CALENDAR',
    definition: 'The 365-day total structure consisting of Day Zero + 13 months of 28 days each (364 numbered days).',
    dimenueveisReference: 'Gospel of Dimenuous — Prologue',
  },
  {
    term: 'The Great Week (A Grande Semana)',
    category: 'CHRONOLOGY',
    definition: 'The 7,000-year chronological model wherein six millennia represent human history and the seventh millennium is the Millennial Sabbath.',
    dimenueveisReference: 'Gospel of Dimenuous — Section III',
  },
  {
    term: 'Millennial Sabbath (Sábado Milenar)',
    category: 'THEOLOGY',
    definition: 'The 1,000-year Seventh Millennium (Years 6,001 to 7,000 AM) modeled as the prophetic rest reign of Messiah.',
    dimenueveisReference: 'Gospel of Dimenuous — Section III, Revelation 20',
  },
  {
    term: 'Lunar Anchor (Ancoragem Lunar)',
    category: 'ASTRONOMY',
    definition: 'The astronomical spring conjunction or visible crescent that anchors Day Zero to celestial reality each solar spring.',
    dimenueveisReference: 'Gospel of Dimenuous — Section IV',
  },
  {
    term: 'Unbroken Sabbath Cycle (Ciclo Sabático Ininterrupto)',
    category: 'CALENDAR',
    definition: 'The continuous 7-day weekly cycle that never resets at month or year boundaries.',
    dimenueveisReference: 'Gospel of Dimenuous — Section I',
  },
];

export const CANONICAL_LEXICON_PT: LexiconTerm[] = [
  {
    term: 'Dia Zero',
    category: 'CALENDÁRIO',
    definition: 'O dia limiar de Ano Novo / Sábado Anual que precede o Mês I Dia 1. Permanece fora dos 364 dias numerados do calendário.',
    dimenueveisReference: 'Evangelho das Dimenúveis — Seção II',
  },
  {
    term: 'Ano Sagrado',
    category: 'CALENDÁRIO',
    definition: 'A estrutura total de 365 dias composta pelo Dia Zero + 13 meses de 28 dias cada (364 dias numerados).',
    dimenueveisReference: 'Evangelho das Dimenúveis — Prólogo',
  },
  {
    term: 'A Grande Semana',
    category: 'CRONOLOGIA',
    definition: 'O modelo cronológico de 7.000 anos no qual seis milênios representam a história humana e o sétimo milênio é o Sábado Milenar.',
    dimenueveisReference: 'Evangelho das Dimenúveis — Seção III',
  },
  {
    term: 'Sábado Milenar',
    category: 'TEOLOGIA',
    definition: 'O Sétimo Milênio de 1.000 anos (Anos 6.001 a 7.000 AM) modelado como o reino profético de descanso do Messias.',
    dimenueveisReference: 'Evangelho das Dimenúveis — Seção III, Apocalipse 20',
  },
  {
    term: 'Ancoragem Lunar',
    category: 'ASTRONOMIA',
    definition: 'A conjunção astronômica da primavera ou primeiro crescente visível que ancora o Dia Zero à realidade celestial a cada primavera solar.',
    dimenueveisReference: 'Evangelho das Dimenúveis — Seção IV',
  },
  {
    term: 'Ciclo Sabático Ininterrupto',
    category: 'CALENDÁRIO',
    definition: 'O ciclo semanal contínuo de 7 dias que nunca reinicia nas fronteiras de mês ou de ano.',
    dimenueveisReference: 'Evangelho das Dimenúveis — Seção I',
  },
];

export function getLocalizedLexicon(language: Language = 'en'): LexiconTerm[] {
  return language === 'pt' ? CANONICAL_LEXICON_PT : CANONICAL_LEXICON;
}
