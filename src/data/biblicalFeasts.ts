/**
 * @file src/data/biblicalFeasts.ts
 * Master definitions of primary Biblical Appointed Times (Leviticus 23) in English and Portuguese.
 */

import { BiblicalFeastDefinition } from '../types/feasts';
import { Language } from '../i18n/translations';

export const PRIMARY_BIBLICAL_FEASTS: BiblicalFeastDefinition[] = [
  {
    id: 'PASSOVER',
    name: 'Passover',
    hebrewName: 'Pesach',
    alternateNames: ['Pesach', 'Pascha', "The Lord's Passover"],
    biblicalReferences: [
      'Leviticus 23:5',
      'Exodus 12:1-14',
      'Numbers 28:16',
      'Deuteronomy 16:1-2'
    ],
    sacredMonth: 1,
    sacredDay: 14,
    durationDays: 1,
    category: 'FEAST',
    status: 'MANDATORY',
    description: 'Memorial of redemption from Egypt. The Passover lamb is prepared at twilight on the 14th day of the first month.',
    beginsAt: 'SUNSET',
    endsAt: 'SUNSET',
  },
  {
    id: 'UNLEAVENED_BREAD',
    name: 'Feast of Unleavened Bread',
    hebrewName: 'Chag HaMatzot',
    alternateNames: ['Chag HaMatzot', 'Days of Unleavened Bread', 'Matzot'],
    biblicalReferences: [
      'Leviticus 23:6-8',
      'Exodus 12:15-20',
      'Exodus 13:3-10',
      'Numbers 28:17-25'
    ],
    sacredMonth: 1,
    sacredDay: 15,
    durationDays: 7,
    category: 'FEAST',
    status: 'MANDATORY',
    description: 'Seven days of eating unleavened bread. The first day (Day 15) and seventh day (Day 21) are Holy Convocations (High Sabbaths).',
    beginsAt: 'SUNSET',
    endsAt: 'SUNSET',
  },
  {
    id: 'FIRSTFRUITS',
    name: 'Firstfruits',
    hebrewName: 'Yom HaBikkurim',
    alternateNames: ['Bikkurim', 'Beginning of Harvest', 'Waving of the Sheaf'],
    biblicalReferences: [
      'Leviticus 23:9-14',
      'Exodus 23:19',
      '1 Corinthians 15:20-23'
    ],
    sacredMonth: 1,
    sacredDay: 16,
    durationDays: 1,
    category: 'FEAST',
    status: 'APPOINTED_TIME',
    description: 'Presentation of the first sheaf of the barley harvest to the Lord on the day after the Sabbath following Passover.',
    beginsAt: 'DAY_START',
    endsAt: 'SUNSET',
  },
  {
    id: 'WEEKS_PENTECOST',
    name: 'Feast of Weeks (Pentecost)',
    hebrewName: 'Shavuot',
    alternateNames: ['Shavuot', 'Pentecost', 'Feast of Harvest', 'Day of Firstfruits'],
    biblicalReferences: [
      'Leviticus 23:15-22',
      'Deuteronomy 16:9-12',
      'Exodus 34:22',
      'Acts 2:1-4'
    ],
    sacredMonth: 3,
    sacredDay: 6,
    durationDays: 1,
    category: 'SOLEMN_ASSEMBLY',
    status: 'MANDATORY',
    description: 'Observed 50 days (7 complete weeks) counting from Firstfruits. Celebrates the wheat harvest and covenant revelation.',
    beginsAt: 'DAY_START',
    endsAt: 'SUNSET',
  },
  {
    id: 'TRUMPETS',
    name: 'Feast of Trumpets',
    hebrewName: 'Yom Teruah',
    alternateNames: ['Yom Teruah', 'Day of Shouting / Trumpet Blast', 'Memorial of Trumpets'],
    biblicalReferences: [
      'Leviticus 23:23-25',
      'Numbers 29:1-6',
      'Psalm 81:3'
    ],
    sacredMonth: 7,
    sacredDay: 1,
    durationDays: 1,
    category: 'SABBATH',
    status: 'MANDATORY',
    description: 'First day of the seventh month. A sacred rest memorialized with shouting and trumpet blasts (shofar).',
    beginsAt: 'SUNSET',
    endsAt: 'SUNSET',
  },
  {
    id: 'DAY_OF_ATONEMENT',
    name: 'Day of Atonement',
    hebrewName: 'Yom Kippur',
    alternateNames: ['Yom Kippur', 'The Fast', 'Sabbath of Sabbaths'],
    biblicalReferences: [
      'Leviticus 23:26-32',
      'Leviticus 16:1-34',
      'Numbers 29:7-11',
      'Hebrews 9:7-14'
    ],
    sacredMonth: 7,
    sacredDay: 10,
    durationDays: 1,
    category: 'FAST',
    status: 'MANDATORY',
    description: 'Tenth day of the seventh month. A solemn day of fasting, humbling of souls, and high atonement. Complete cessation of work.',
    beginsAt: 'SUNSET',
    endsAt: 'SUNSET',
  },
  {
    id: 'TABERNACLES',
    name: 'Feast of Tabernacles',
    hebrewName: 'Sukkot',
    alternateNames: ['Sukkot', 'Feast of Booths', 'Chag HaSukkot', 'Feast of Ingathering'],
    biblicalReferences: [
      'Leviticus 23:33-43',
      'Deuteronomy 16:13-15',
      'Numbers 29:12-34',
      'Nehemiah 8:13-18',
      'Zechariah 14:16-19'
    ],
    sacredMonth: 7,
    sacredDay: 15,
    durationDays: 7,
    category: 'FEAST',
    status: 'MANDATORY',
    description: 'Seven-day pilgrim feast dwelling in temporary booths (sukkot) to commemorate the wilderness journey and harvest ingathering. The 1st day (Day 15) is a High Sabbath.',
    beginsAt: 'SUNSET',
    endsAt: 'SUNSET',
  },
  {
    id: 'EIGHTH_DAY',
    name: 'Eighth Day Assembly',
    hebrewName: 'Shemini Atzeret',
    alternateNames: ['Shemini Atzeret', 'Eighth Day Solemn Assembly', 'The Great Day of the Feast'],
    biblicalReferences: [
      'Leviticus 23:36',
      'Leviticus 23:39',
      'Numbers 29:35-38',
      'John 7:37'
    ],
    sacredMonth: 7,
    sacredDay: 22,
    durationDays: 1,
    category: 'SOLEMN_ASSEMBLY',
    status: 'MANDATORY',
    description: 'A separate, holy solemn assembly immediately following the 7 days of Tabernacles on the 22nd day of Month VII. High Sabbath with no customary work.',
    beginsAt: 'SUNSET',
    endsAt: 'SUNSET',
  },
];

export const PRIMARY_BIBLICAL_FEASTS_PT: Record<string, Partial<BiblicalFeastDefinition>> = {
  PASSOVER: {
    name: 'Páscoa',
    alternateNames: ['Pesach', 'Páscoa do Senhor'],
    biblicalReferences: [
      'Levítico 23:5',
      'Êxodo 12:1-14',
      'Números 28:16',
      'Deuteronômio 16:1-2'
    ],
    description: 'Memorial da redenção do Egito. O cordeiro da Páscoa é preparado no crepúsculo do 14º dia do primeiro mês.',
  },
  UNLEAVENED_BREAD: {
    name: 'Festa dos Pães Asmos',
    alternateNames: ['Chag HaMatzot', 'Dias dos Pães Asmos', 'Matzot'],
    biblicalReferences: [
      'Levítico 23:6-8',
      'Êxodo 12:15-20',
      'Êxodo 13:3-10',
      'Números 28:17-25'
    ],
    description: 'Sete dias comendo pães sem fermento. O primeiro dia (Dia 15) e o sétimo dia (Dia 21) são Santas Convocações (Grandes Sábados).',
  },
  FIRSTFRUITS: {
    name: 'Primícias',
    alternateNames: ['Bikkurim', 'Início da Colheita', 'Oferta do Molho Movido'],
    biblicalReferences: [
      'Levítico 23:9-14',
      'Êxodo 23:19',
      '1 Coríntios 15:20-23'
    ],
    description: 'Apresentação do primeiro molho da colheita de cevada ao Senhor no dia seguinte ao Sábado após a Páscoa.',
  },
  WEEKS_PENTECOST: {
    name: 'Festa das Semanas',
    alternateNames: ['Shavuot', 'Pentecostes', 'Festa da Colheita', 'Dia das Primícias'],
    biblicalReferences: [
      'Levítico 23:15-22',
      'Deuteronômio 16:9-12',
      'Êxodo 34:22',
      'Atos 2:1-4'
    ],
    description: 'Observada 50 dias (7 semanas completas) contados a partir das Primícias. Celebra a colheita do trigo e a revelação da aliança.',
  },
  TRUMPETS: {
    name: 'Festa das Trombetas',
    alternateNames: ['Yom Teruah', 'Dia de Aclamação / Toque de Trombeta', 'Memorial das Trombetas'],
    biblicalReferences: [
      'Levítico 23:23-25',
      'Números 29:1-6',
      'Salmo 81:3'
    ],
    description: 'Primeiro dia do sétimo mês. Um descanso sagrado em memorial com aclamação e toques de trombeta (shofar).',
  },
  DAY_OF_ATONEMENT: {
    name: 'Dia da Expiação',
    alternateNames: ['Yom Kippur', 'O Jejum', 'Sábado dos Sábados'],
    biblicalReferences: [
      'Levítico 23:26-32',
      'Levítico 16:1-34',
      'Números 29:7-11',
      'Hebreus 9:7-14'
    ],
    description: 'Décimo dia do sétimo mês. Dia solene de jejum, aflição da alma e alta expiação. Cessação completa de todo trabalho.',
  },
  TABERNACLES: {
    name: 'Festa dos Tabernáculos',
    alternateNames: ['Sukkot', 'Festa das Cabanas', 'Chag HaSukkot', 'Festa da Colheita Final'],
    biblicalReferences: [
      'Levítico 23:33-43',
      'Deuteronômio 16:13-15',
      'Números 29:12-34',
      'Neemias 8:13-18',
      'Zacarias 14:16-19'
    ],
    description: 'Festa de peregrinação de sete dias habitando em cabanas temporárias (sukkot) em memória da jornada no deserto e colheita final. O 1º dia (Dia 15) é um Grande Sábado.',
  },
  EIGHTH_DAY: {
    name: 'Assembleia do 8º Dia',
    alternateNames: ['Shemini Atzeret', 'Oitavo Dia / Assembleia Solene', 'O Grande Dia da Festa'],
    biblicalReferences: [
      'Levítico 23:36',
      'Levítico 23:39',
      'Números 29:35-38',
      'João 7:37'
    ],
    description: 'Uma assembleia solene separada e santa imediatamente após os 7 dias de Tabernáculos, no 22º dia do Mês VII. Grande Sábado sem trabalho servil.',
  },
};

export function getLocalizedBiblicalFeasts(language: Language = 'en'): BiblicalFeastDefinition[] {
  if (language === 'en') return PRIMARY_BIBLICAL_FEASTS;
  return PRIMARY_BIBLICAL_FEASTS.map((feast) => ({
    ...feast,
    ...(PRIMARY_BIBLICAL_FEASTS_PT[feast.id] || {}),
  }));
}
