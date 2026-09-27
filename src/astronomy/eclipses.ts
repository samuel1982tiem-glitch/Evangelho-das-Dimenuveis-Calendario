/**
 * @file src/astronomy/eclipses.ts
 * Historical astronomical eclipse catalog including Biblical candidate alignments (Bilingual).
 */

import { HistoricalAstronomicalEvent } from '../types/calendar';
import { Language } from '../i18n/translations';

export const HISTORICAL_ECLIPSE_EVENTS: HistoricalAstronomicalEvent[] = [
  {
    id: 'joshua-10-long-day',
    name: 'Joshua 10 — Sun Over Gibeon',
    biblicalReferences: ['Joshua 10:12-14'],
    date: '30 October 1207 BCE',
    astronomicalYearBCE: 1207,
    dateStatus: 'candidate',
    astronomicalInterpretation:
      'Proposed annular solar eclipse over Canaan (30 Oct 1207 BCE) or extraordinary atmospheric refraction/prolonged solar reflection. Proposed by researchers Sir Colin Humphreys and Graeme Waddington (2017).',
    chronologicalEffectDays: 1,
    dataSource: 'ASTRONOMICAL_CALCULATION',
    notes: [
      'Scripture describes: "Sun, stand still over Gibeon; and Moon, in the Valley of Aijalon."',
      'Candidate date of 30 October 1207 BCE is an astronomical proposal, NOT a proven dogma.',
      'Can be enabled as a +1 Day Chronological Adjustment in Chronology Lab to test historical impact on calendar alignment.',
    ],
  },
  {
    id: 'hezekiah-sundial',
    name: "Hezekiah's Sign — Ahaz Sundial",
    biblicalReferences: ['2 Kings 20:8-11', 'Isaiah 38:7-8'],
    date: 'c. 701 BCE',
    astronomicalYearBCE: 701,
    dateStatus: 'candidate',
    astronomicalInterpretation:
      "Solar alignment / partial eclipse event or miracle during King Hezekiah's illness where solar shadow reversed ten steps on Ahaz's dial.",
    chronologicalEffectDays: 0,
    dataSource: 'BIBLICAL_TEXT',
    notes: [
      'Prophet Isaiah prayed and the shadow went ten steps back.',
      'Sign confirmed to Babylonian ambassadors who came to inquire about the wonder in the land (2 Chron 32:31).',
    ],
  },
  {
    id: 'crucifixion-darkness',
    name: 'Passover Crucifixion Darkness',
    biblicalReferences: ['Luke 23:44-45', 'Joel 2:31', 'Acts 2:20'],
    date: '3 April 33 CE (or 7 April 30 CE)',
    astronomicalYearBCE: undefined,
    dateStatus: 'candidate',
    astronomicalInterpretation:
      'Darkness over the land from the 6th to 9th hour (midday to 3pm) during Passover, accompanied by partial lunar eclipse visible from Jerusalem on 3 April 33 CE.',
    chronologicalEffectDays: 0,
    dataSource: 'HISTORICAL_RECORD',
    notes: [
      'Solar eclipses cannot naturally occur during Full Moon Passover, indicating divine celestial phenomenon.',
      'Lunar eclipse on 3 April 33 CE rose blood-red over Jerusalem at moonrise.',
    ],
  },
];

export const HISTORICAL_ECLIPSE_EVENTS_PT: HistoricalAstronomicalEvent[] = [
  {
    id: 'joshua-10-long-day',
    name: 'Josué 10 — Sol Sobre Gibeão',
    biblicalReferences: ['Josué 10:12-14'],
    date: '30 de Outubro de 1207 a.C.',
    astronomicalYearBCE: 1207,
    dateStatus: 'candidate',
    astronomicalInterpretation:
      'Eclipse solar anular proposto sobre Canaã (30 Out 1207 a.C.) ou refração atmosférica extraordinária / reflexão solar prolongada. Proposto pelos pesquisadores Sir Colin Humphreys e Graeme Waddington (2017).',
    chronologicalEffectDays: 1,
    dataSource: 'ASTRONOMICAL_CALCULATION',
    notes: [
      'A Escritura descreve: "Sol, detém-te sobre Gibeão; e tu, Lua, no vale de Aijalão."',
      'A data candidata de 30 de outubro de 1207 a.C. é uma proposta astronômica, NÃO um dogma comprovado.',
      'Pode ser ativado como um Ajuste Cronológico de +1 Dia no Laboratório de Cronologia.',
    ],
  },
  {
    id: 'hezekiah-sundial',
    name: 'Sinal de Ezequias — Relógio Solar',
    biblicalReferences: ['2 Reis 20:8-11', 'Isaías 38:7-8'],
    date: 'c. 701 a.C.',
    astronomicalYearBCE: 701,
    dateStatus: 'candidate',
    astronomicalInterpretation:
      'Alinhamento solar / evento de eclipse parcial ou milagre durante a enfermidade do Rei Ezequias, onde a sombra solar retrocedeu dez graus no relógio de Acaz.',
    chronologicalEffectDays: 0,
    dataSource: 'BIBLICAL_TEXT',
    notes: [
      'O profeta Isaías orou e a sombra retrocedeu dez graus.',
      'Sinal confirmado aos embaixadores babilônicos que vieram inquirir sobre o prodígio na terra (2 Crônicas 32:31).',
    ],
  },
  {
    id: 'crucifixion-darkness',
    name: 'Trevas da Crucificação na Páscoa',
    biblicalReferences: ['Lucas 23:44-45', 'Joel 2:31', 'Atos 2:20'],
    date: '3 de Abril de 33 d.C. (ou 7 de Abril de 30 d.C.)',
    astronomicalYearBCE: undefined,
    dateStatus: 'candidate',
    astronomicalInterpretation:
      'Trevas sobre toda a terra da hora sexta até a hora nona (meio-dia às 15h) durante a Páscoa, acompanhadas por eclipse lunar parcial visível de Jerusalém em 3 de abril de 33 d.C.',
    chronologicalEffectDays: 0,
    dataSource: 'HISTORICAL_RECORD',
    notes: [
      'Eclipses solares não ocorrem naturalmente durante a Lua Cheia da Páscoa, indicando fenômeno celestial extraordinário.',
      'O eclipse lunar em 3 de abril de 33 d.C. nasceu vermelho-sangue sobre Jerusalém.',
    ],
  },
];

export function getLocalizedEclipseEvents(language: Language = 'en'): HistoricalAstronomicalEvent[] {
  return language === 'pt' ? HISTORICAL_ECLIPSE_EVENTS_PT : HISTORICAL_ECLIPSE_EVENTS;
}
