/**
 * @file src/history/biblicalEvents.ts
 * Biblical history events repository with source classifications (Bilingual).
 */

import { DataSourceType } from '../types/calendar';
import { Language } from '../i18n/translations';

export interface BiblicalHistoryEvent {
  id: string;
  title: string;
  biblicalRef: string;
  sacredMonth?: number;
  sacredDay?: number;
  isDayZero?: boolean;
  approximateBCEYear?: number;
  summary: string;
  dataSource: DataSourceType;
  category: string;
}

export const BIBLICAL_HISTORY_EVENTS: BiblicalHistoryEvent[] = [
  {
    id: 'creation-week',
    title: 'Creation Week & First Sabbath Rest',
    biblicalRef: 'Genesis 1:1 - 2:3',
    sacredMonth: 1,
    sacredDay: 1,
    approximateBCEYear: 4004,
    summary: 'The cosmic origin week culminating in the divine institution of the seventh-day Sabbath.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'CREATION',
  },
  {
    id: 'noah-ark-resting',
    title: 'Noah’s Ark Rests upon Mount Ararat',
    biblicalRef: 'Genesis 8:4',
    sacredMonth: 7,
    sacredDay: 17,
    approximateBCEYear: 2348,
    summary: 'On the 17th day of the 7th month, the Ark rested upon the mountains of Ararat after the Great Flood.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'PATRIARCHS',
  },
  {
    id: 'exodus-night',
    title: 'The Exodus Out of Egypt',
    biblicalRef: 'Exodus 12:41-42, Numbers 33:3',
    sacredMonth: 1,
    sacredDay: 15,
    approximateBCEYear: 1491,
    summary: 'The children of Israel departed Rameses on the 15th day of the 1st month, the day after Passover.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'EXODUS',
  },
  {
    id: 'covenant-at-sinai',
    title: 'Giving of the Ten Commandments at Sinai',
    biblicalRef: 'Exodus 19:1-16',
    sacredMonth: 3,
    sacredDay: 15,
    approximateBCEYear: 1491,
    summary: 'In the third month, Israel arrived at the Wilderness of Sinai and received the Covenant Law.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'EXODUS',
  },
  {
    id: 'joshua-crossing-jordan',
    title: 'Crossing of the Jordan River into Canaan',
    biblicalRef: 'Joshua 4:19',
    sacredMonth: 1,
    sacredDay: 10,
    approximateBCEYear: 1451,
    summary: 'Israel came up out of Jordan on the tenth day of the first month and encamped at Gilgal.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'KINGDOM',
  },
  {
    id: 'joshua-gibeon-long-day',
    title: 'Joshua’s Long Day over Gibeon',
    biblicalRef: 'Joshua 10:12-14',
    sacredMonth: 4,
    sacredDay: 18,
    approximateBCEYear: 1207,
    summary: 'The Sun stood still in the midst of heaven over Gibeon and delayed going down about a whole day.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'KINGDOM',
  },
  {
    id: 'solomon-temple-dedication',
    title: 'Dedication of Solomon’s Temple',
    biblicalRef: '1 Kings 8:2, 2 Chronicles 7:8-10',
    sacredMonth: 7,
    sacredDay: 15,
    approximateBCEYear: 1004,
    summary: 'All the men of Israel assembled unto King Solomon at the feast in the seventh month.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'KINGDOM',
  },
  {
    id: 'ezra-departure',
    title: 'Ezra’s Journey to Jerusalem',
    biblicalRef: 'Ezra 7:9',
    sacredMonth: 1,
    sacredDay: 1,
    approximateBCEYear: 457,
    summary: 'Ezra began his journey on the first day of the first month, arriving safely in Jerusalem on the first day of the fifth month.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'EXILE',
  },
];

export const BIBLICAL_HISTORY_EVENTS_PT: BiblicalHistoryEvent[] = [
  {
    id: 'creation-week',
    title: 'Semana da Criação e 1º Sábado',
    biblicalRef: 'Gênesis 1:1 - 2:3',
    sacredMonth: 1,
    sacredDay: 1,
    approximateBCEYear: 4004,
    summary: 'A semana de origem cósmica culminando na instituição divina do Sábado do sétimo dia.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'CRIAÇÃO',
  },
  {
    id: 'noah-ark-resting',
    title: 'A Arca de Noé no Monte Ararate',
    biblicalRef: 'Gênesis 8:4',
    sacredMonth: 7,
    sacredDay: 17,
    approximateBCEYear: 2348,
    summary: 'No 17º dia do 7º mês, a Arca repousou sobre as montanhas de Ararate após o Grande Dilúvio.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'PATRIARCAS',
  },
  {
    id: 'exodus-night',
    title: 'O Êxodo do Egito',
    biblicalRef: 'Êxodo 12:41-42, Números 33:3',
    sacredMonth: 1,
    sacredDay: 15,
    approximateBCEYear: 1491,
    summary: 'Os filhos de Israel partiram de Ramessés no 15º dia do 1º mês, no dia seguinte à Páscoa.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'ÊXODO',
  },
  {
    id: 'covenant-at-sinai',
    title: 'Os Dez Mandamentos no Sinai',
    biblicalRef: 'Êxodo 19:1-16',
    sacredMonth: 3,
    sacredDay: 15,
    approximateBCEYear: 1491,
    summary: 'No terceiro mês, Israel chegou ao Deserto do Sinai e recebeu a Lei da Aliança.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'ÊXODO',
  },
  {
    id: 'joshua-crossing-jordan',
    title: 'Travessia do Rio Jordão',
    biblicalRef: 'Josué 4:19',
    sacredMonth: 1,
    sacredDay: 10,
    approximateBCEYear: 1451,
    summary: 'O povo subiu do Jordão no décimo dia do primeiro mês e acampou em Gilgal.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'REINO',
  },
  {
    id: 'joshua-gibeon-long-day',
    title: 'O Dia Longo de Josué em Gibeão',
    biblicalRef: 'Josué 10:12-14',
    sacredMonth: 4,
    sacredDay: 18,
    approximateBCEYear: 1207,
    summary: 'O Sol deteve-se no meio do céu sobre Gibeão e não se apressou a pôr-se quase um dia inteiro.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'REINO',
  },
  {
    id: 'solomon-temple-dedication',
    title: 'Dedicação do Templo de Salomão',
    biblicalRef: '1 Reis 8:2, 2 Crônicas 7:8-10',
    sacredMonth: 7,
    sacredDay: 15,
    approximateBCEYear: 1004,
    summary: 'Todos os homens de Israel se congregaram ao Rei Salomão na festa do sétimo mês.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'REINO',
  },
  {
    id: 'ezra-departure',
    title: 'Jornada de Esdras a Jerusalém',
    biblicalRef: 'Esdras 7:9',
    sacredMonth: 1,
    sacredDay: 1,
    approximateBCEYear: 457,
    summary: 'Esdras iniciou sua jornada no primeiro dia do primeiro mês, chegando em segurança a Jerusalém no primeiro dia do quinto mês.',
    dataSource: 'BIBLICAL_TEXT',
    category: 'EXÍLIO',
  },
];

export function getLocalizedBiblicalEvents(language: Language = 'en'): BiblicalHistoryEvent[] {
  return language === 'pt' ? BIBLICAL_HISTORY_EVENTS_PT : BIBLICAL_HISTORY_EVENTS;
}
