/**
 * @file src/dimenueveis/timeArchitecture.ts
 * 6-Layer Conceptual Architecture tree model for Dimenúveis Time System (Bilingual).
 */

import { Language } from '../i18n/translations';

export interface TimeArchitectureLayer {
  id: string;
  name: string;
  color: string;
  description: string;
  children: {
    name: string;
    description: string;
    status: string;
  }[];
}

export const DIMENUEVEIS_TIME_TREE: TimeArchitectureLayer[] = [
  {
    id: 'sacred-time',
    name: 'SACRED TIME',
    color: '#d97706',
    description: 'The structural 13-month x 28-day sacred calendar framework anchored by Day Zero.',
    children: [
      { name: 'Day Zero', description: 'Annual Sabbath threshold outside the 364 numbered days.', status: 'Active' },
      { name: 'Days', description: '364 numbered days per sacred year.', status: 'Active' },
      { name: 'Weeks', description: '52 unbroken 7-day weekly cycles per year.', status: 'Active' },
      { name: 'Months', description: '13 equal months of 28 days each.', status: 'Active' },
      { name: 'Year', description: '365-day total sacred year cycle.', status: 'Active' },
      { name: 'Sabbath', description: 'Weekly 7th-day Sabbath + Annual Sabbath classification.', status: 'Active' },
    ],
  },
  {
    id: 'celestial-time',
    name: 'CELESTIAL TIME',
    color: '#3b82f6',
    description: 'Astronomical overlay measuring actual physical solar and lunar movements.',
    children: [
      { name: 'Sun', description: 'Solar position, sunrise, sunset, and solar equinox alignment.', status: 'Active' },
      { name: 'Moon', description: 'Actual synodic phase, illumination percentage, age, and lunation number.', status: 'Active' },
      { name: 'Seasons', description: 'March Equinox, June Solstice, September Equinox, December Solstice.', status: 'Active' },
      { name: 'Eclipses', description: 'Astronomical conjunctions and solar/lunar eclipse catalog.', status: 'Active' },
    ],
  },
  {
    id: 'biblical-time',
    name: 'BIBLICAL TIME',
    color: '#10b981',
    description: 'Scriptural history, covenant timeline, and appointed sacred feast days.',
    children: [
      { name: 'Creation', description: 'Genesis creation epoch and primordial Sabbath foundation.', status: 'Active' },
      { name: 'Biblical Chronology', description: 'Ussher, Rabbinic, Septuagint, and Sacred chronology models.', status: 'Active' },
      { name: 'Feasts', description: 'Leviticus 23 appointed Holy Convocations (Passover, Shavuot, Sukkot, etc.).', status: 'Active' },
      { name: 'Prophetic Chronology', description: '70 Weeks of Daniel, prophetic day-year correlations.', status: 'Active' },
    ],
  },
  {
    id: 'millennial-time',
    name: 'MILLENNIAL TIME',
    color: '#8b5cf6',
    description: 'The Great Week of 7,000 years culminating in the Seventh Millennial Sabbath.',
    children: [
      { name: 'Six Millennia', description: '6,000 elapsed solar years of human history.', status: 'Active' },
      { name: 'Seventh-Millennium Sabbath', description: '1,000-year Millennial Sabbath rest (Revelation 20, 2 Peter 3:8).', status: 'Active' },
    ],
  },
  {
    id: 'historical-time',
    name: 'HISTORICAL TIME',
    color: '#ec4899',
    description: 'Documented astronomical events and candidate historical interruptions in Scripture.',
    children: [
      { name: 'Biblical Events', description: 'Exodus, Jordan Crossing, Temple Dedications, Exile.', status: 'Active' },
      { name: 'Astronomical Historical Events', description: 'Joshua 10 Gibeon Long Day (30 Oct 1207 BCE candidate), Hezekiah Sundial.', status: 'Active' },
    ],
  },
  {
    id: 'dimenueveis-time',
    name: 'DIMENÚVEIS TIME',
    color: '#f59e0b',
    description: 'Canonical Gospel of Dimenuous architecture unifying all time domains.',
    children: [
      { name: 'Canonical Gospel Architecture', description: 'Immutable source texts, Day Zero doctrine, celestial witness.', status: 'Active' },
    ],
  },
];

export const DIMENUEVEIS_TIME_TREE_PT: TimeArchitectureLayer[] = [
  {
    id: 'sacred-time',
    name: 'TEMPO SAGRADO',
    color: '#d97706',
    description: 'A estrutura do calendário sagrado de 13 meses x 28 dias ancorada pelo Dia Zero.',
    children: [
      { name: 'Dia Zero', description: 'Limiar do Sábado Anual fora dos 364 dias numerados.', status: 'Ativo' },
      { name: 'Dias', description: '364 dias numerados por ano sagrado.', status: 'Ativo' },
      { name: 'Semanas', description: '52 ciclos semanais ininterruptos de 7 dias por ano.', status: 'Ativo' },
      { name: 'Meses', description: '13 meses iguais de 28 dias cada.', status: 'Ativo' },
      { name: 'Ano', description: 'Ciclo total de 365 dias do ano sagrado.', status: 'Ativo' },
      { name: 'Sábado', description: 'Sábado semanal do 7º dia + classificação de Sábado Anual.', status: 'Ativo' },
    ],
  },
  {
    id: 'celestial-time',
    name: 'TEMPO CELESTIAL',
    color: '#3b82f6',
    description: 'Sobreposição astronômica medindo os movimentos físicos reais do sol e da lua.',
    children: [
      { name: 'Sol', description: 'Posição solar, nascer do sol, pôr do sol e alinhamento de equinócio solar.', status: 'Ativo' },
      { name: 'Lua', description: 'Fase sinódica real, porcentagem de iluminação, idade e número de lunação.', status: 'Ativo' },
      { name: 'Estações', description: 'Equinócio de Março, Solstício de Junho, Equinócio de Setembro, Solstício de Dezembro.', status: 'Ativo' },
      { name: 'Eclipses', description: 'Conjunções astronômicas e catálogo de eclipses solares e lunares.', status: 'Ativo' },
    ],
  },
  {
    id: 'biblical-time',
    name: 'TEMPO BÍBLICO',
    color: '#10b981',
    description: 'História escriturística, linha do tempo da aliança e dias de festas sagradas determinadas.',
    children: [
      { name: 'Criação', description: 'Época da criação em Gênesis e fundamento primordial do Sábado.', status: 'Ativo' },
      { name: 'Cronologia Bíblica', description: 'Modelos cronológicos de Ussher, Rabínico, Septuaginta e Sagrado.', status: 'Ativo' },
      { name: 'Festas (Moedim)', description: 'Santas Convocações determinadas em Levítico 23 (Páscoa, Shavuot, Sukkot, etc.).', status: 'Ativo' },
      { name: 'Cronologia Profética', description: '70 Semanas de Daniel, correlações proféticas dia-ano.', status: 'Ativo' },
    ],
  },
  {
    id: 'millennial-time',
    name: 'TEMPO MILENAR',
    color: '#8b5cf6',
    description: 'A Grande Semana de 7.000 anos culminando no Sétimo Sábado Milenar.',
    children: [
      { name: 'Seis Milênios', description: '6.000 anos solares decorridos da história humana.', status: 'Ativo' },
      { name: 'Sábado do Sétimo Milênio', description: 'Descanso do Sábado Milenar de 1.000 anos (Apocalipse 20, 2 Pedro 3:8).', status: 'Ativo' },
    ],
  },
  {
    id: 'historical-time',
    name: 'TEMPO HISTÓRICO',
    color: '#ec4899',
    description: 'Eventos astronômicos documentados e interrupções históricas candidatas nas Escrituras.',
    children: [
      { name: 'Eventos Bíblicos', description: 'Êxodo, Travessia do Jordão, Dedicações do Templo, Exílio.', status: 'Ativo' },
      { name: 'Eventos Históricos Astronômicos', description: 'Dia Longo de Josué 10 em Gibeão (candidato 30 Out 1207 a.C.), Relógio de Ezequias.', status: 'Ativo' },
    ],
  },
  {
    id: 'dimenueveis-time',
    name: 'TEMPO DIMENÚVEIS',
    color: '#f59e0b',
    description: 'Arquitetura canônica do Evangelho das Dimenúveis unificando todos os domínios do tempo.',
    children: [
      { name: 'Arquitetura Canônica do Evangelho', description: 'Textos-fonte imutáveis, doutrina do Dia Zero, testemunha celestial.', status: 'Ativo' },
    ],
  },
];

export function getLocalizedTimeTree(language: Language = 'en'): TimeArchitectureLayer[] {
  return language === 'pt' ? DIMENUEVEIS_TIME_TREE_PT : DIMENUEVEIS_TIME_TREE;
}
