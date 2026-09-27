/**
 * @file src/dimenueveis/terminology.ts
 * Biblical & Calendar Terminology Lexicon with authentic Scriptural citations (Bilingual).
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
    term: 'Day Zero',
    category: 'CALENDAR',
    definition: 'The annual New-Year/Sabbath threshold day preceding Month I Day 1. It is outside the 364 numbered calendar days.',
    dimenueveisReference: 'Exodus 12:1–2 · Psalm 104:19 · Genesis 1:14',
  },
  {
    term: 'Sacred Year',
    category: 'CALENDAR',
    definition: 'The 365-day total structure consisting of Day Zero + 13 months of 28 days each (364 numbered days).',
    dimenueveisReference: 'Genesis 1:14 · Leviticus 23:4 · 1 Chronicles 27:1–15',
  },
  {
    term: 'The Great Week',
    category: 'CHRONOLOGY',
    definition: 'The 7,000-year chronological model wherein six millennia represent human history and the seventh millennium is the Millennial Sabbath.',
    dimenueveisReference: 'Genesis 2:1–3 · Psalm 90:4 · 2 Peter 3:8',
  },
  {
    term: 'Millennial Sabbath',
    category: 'THEOLOGY',
    definition: 'The 1,000-year Seventh Millennium (Years 6,001 to 7,000 AM) modeled as the prophetic rest reign of Messiah.',
    dimenueveisReference: 'Revelation 20:4–6 · Hebrews 4:9 · 2 Peter 3:8',
  },
  {
    term: 'Lunar Anchor',
    category: 'ASTRONOMY',
    definition: 'The astronomical spring conjunction or visible crescent that anchors Day Zero to celestial reality each solar spring.',
    dimenueveisReference: 'Genesis 1:14–16 · Psalm 104:19 · Psalm 89:37',
  },
  {
    term: 'Unbroken Sabbath Cycle',
    category: 'CALENDAR',
    definition: 'The continuous 7-day weekly cycle that never resets at month or year boundaries.',
    dimenueveisReference: 'Genesis 2:2–3 · Exodus 20:8–11 · Leviticus 23:3',
  },
];

export const CANONICAL_LEXICON_PT: LexiconTerm[] = [
  {
    term: 'Dia Zero',
    category: 'CALENDÁRIO',
    definition: 'O dia limiar de Ano Novo / Sábado Anual que precede o Mês I Dia 1. Permanece fora dos 364 dias numerados do calendário.',
    dimenueveisReference: 'Êxodo 12:1–2 · Salmos 104:19 · Gênesis 1:14',
  },
  {
    term: 'Ano Sagrado',
    category: 'CALENDÁRIO',
    definition: 'A estrutura total de 365 dias composta pelo Dia Zero + 13 meses de 28 dias cada (364 dias numerados).',
    dimenueveisReference: 'Gênesis 1:14 · Levítico 23:4 · 1 Crônicas 27:1–15',
  },
  {
    term: 'A Grande Semana',
    category: 'CRONOLOGIA',
    definition: 'O modelo cronológico de 7.000 anos no qual seis milênios representam a história humana e o sétimo milênio é o Sábado Milenar.',
    dimenueveisReference: 'Gênesis 2:1–3 · Salmos 90:4 · 2 Pedro 3:8',
  },
  {
    term: 'Sábado Milenar',
    category: 'TEOLOGIA',
    definition: 'O Sétimo Milênio de 1.000 anos (Anos 6.001 a 7.000 AM) modelado como o reino profético de descanso do Messias.',
    dimenueveisReference: 'Apocalipse 20:4–6 · Hebreus 4:9 · 2 Pedro 3:8',
  },
  {
    term: 'Ancoragem Lunar',
    category: 'ASTRONOMIA',
    definition: 'A conjunção astronômica da primavera ou primeiro crescente visível que ancora o Dia Zero à realidade celestial a cada primavera solar.',
    dimenueveisReference: 'Gênesis 1:14–16 · Salmos 104:19 · Salmos 89:37',
  },
  {
    term: 'Ciclo Sabático Ininterrupto',
    category: 'CALENDÁRIO',
    definition: 'O ciclo semanal contínuo de 7 dias que nunca reinicia nas fronteiras de mês ou de ano.',
    dimenueveisReference: 'Gênesis 2:2–3 · Êxodo 20:8–11 · Levítico 23:3',
  },
];

export function getLocalizedLexicon(language: Language = 'en'): LexiconTerm[] {
  return language === 'pt' ? CANONICAL_LEXICON_PT : CANONICAL_LEXICON;
}
