/**
 * @file src/chronology/models.ts
 * Configurable Biblical & Historical Chronology Models in English and Portuguese.
 */

import { ChronologyModel } from '../types/calendar';
import { Language } from '../i18n/translations';

export const CHRONOLOGY_MODELS: ChronologyModel[] = [
  {
    id: 'ussher',
    name: 'Ussher-Style Chronology',
    description: 'Classical chronology derived by Archbishop James Ussher (1650) positioning Creation at 4004 BCE.',
    creationEpochBCE: 4004,
    methodology: 'Genealogical summation from Genesis masoretic text, aligned with classical Babylonian and Persian historical records.',
    status: 'traditional',
    dataSource: 'TRADITIONAL_CHRONOLOGY',
    biblicalBasis: 'Genesis 5, Genesis 11, Kings & Chronicles genealogical reigns.',
  },
  {
    id: 'hebrew-rabbinic',
    name: 'Traditional Rabbinic (Anno Mundi)',
    description: 'Standard Rabbinic calendar chronology (Seder Olam Rabbah) placing Creation epoch at 3761 BCE.',
    creationEpochBCE: 3761,
    methodology: 'Traditional Jewish chronology calculated by Rabbi Jose ben Halafta in 2nd century CE.',
    status: 'traditional',
    dataSource: 'TRADITIONAL_CHRONOLOGY',
    biblicalBasis: 'Masoretic text genealogical summation with shortened Persian empire duration.',
  },
  {
    id: 'septuagint-lxx',
    name: 'Septuagint (LXX) Early Church Chronology',
    description: 'Chronology based on the Greek Septuagint manuscripts positioning Creation c. 5508 BCE.',
    creationEpochBCE: 5508,
    methodology: 'Calculated using patriarch ages recorded in ancient Greek LXX manuscripts preserved by early Church Fathers (Eusebius, Syncellus).',
    status: 'traditional',
    dataSource: 'HISTORICAL_RECORD',
    biblicalBasis: 'Septuagint Genesis patriarch ages before fatherhood.',
  },
  {
    id: 'astronomical-sacred',
    name: 'Astronomical Sacred Epoch (Dimenúveis Model)',
    description: 'Calibrated astronomical-sacred chronology aligning Creation epoch with 4026 BCE spring equinox.',
    creationEpochBCE: 4026,
    methodology: 'Calibrates 6,000 elapsed solar/lunar years with sacred 364-day cycle alignments and spring New Moon conjunctions.',
    status: 'interpretive',
    dataSource: 'INTERPRETIVE_MODEL',
    biblicalBasis: '6,000-year Great Week Sabbath model with astronomical equinox anchoring.',
  },
];

export const CHRONOLOGY_MODELS_PT: ChronologyModel[] = [
  {
    id: 'ussher',
    name: 'Cronologia Clássica de Ussher',
    description: 'Cronologia clássica derivada pelo Arcebispo James Ussher (1650) posicionando a Criação em 4004 a.C.',
    creationEpochBCE: 4004,
    methodology: 'Somatório genealógico do texto massorético de Gênesis, alinhado com registros históricos babilônicos e persas.',
    status: 'traditional',
    dataSource: 'TRADITIONAL_CHRONOLOGY',
    biblicalBasis: 'Gênesis 5, Gênesis 11, reinados genealógicos de Reis e Crônicas.',
  },
  {
    id: 'hebrew-rabbinic',
    name: 'Rabínica Tradicional (Anno Mundi)',
    description: 'Cronologia do calendário rabínico padrão (Seder Olam Rabbah) posicionando a época da Criação em 3761 a.C.',
    creationEpochBCE: 3761,
    methodology: 'Cronologia judaica tradicional calculada pelo Rabino Jose ben Halafta no século II d.C.',
    status: 'traditional',
    dataSource: 'TRADITIONAL_CHRONOLOGY',
    biblicalBasis: 'Somatório genealógico do texto massorético com duração reduzida do período persa.',
  },
  {
    id: 'septuagint-lxx',
    name: 'Cronologia da Septuaginta (LXX)',
    description: 'Cronologia baseada nos manuscritos gregos da Septuaginta posicionando a Criação em c. 5508 a.C.',
    creationEpochBCE: 5508,
    methodology: 'Calculada usando as idades dos patriarcas registradas nos antigos manuscritos gregos LXX preservados pelos Pais da Igreja.',
    status: 'traditional',
    dataSource: 'HISTORICAL_RECORD',
    biblicalBasis: 'Idades dos patriarcas de Gênesis na Septuaginta antes da geração.',
  },
  {
    id: 'astronomical-sacred',
    name: 'Época Sagrada Astronômica (Modelo Dimenúveis)',
    description: 'Cronologia sagrado-astronômica calibrada alinhando a época da Criação com o equinócio da primavera de 4026 a.C.',
    creationEpochBCE: 4026,
    methodology: 'Calibra 6.000 anos solares/lunares decorridos com alinhamentos do ciclo sagrado de 364 dias e conjunções lunares da primavera.',
    status: 'interpretive',
    dataSource: 'INTERPRETIVE_MODEL',
    biblicalBasis: 'Modelo de Sábado da Grande Semana de 6.000 anos com ancoragem astronômica equinocial.',
  },
];

export function getLocalizedChronologyModels(language: Language = 'en'): ChronologyModel[] {
  return language === 'pt' ? CHRONOLOGY_MODELS_PT : CHRONOLOGY_MODELS;
}

export function getChronologyModelById(id: string, language: Language = 'en'): ChronologyModel {
  const list = getLocalizedChronologyModels(language);
  return list.find((m) => m.id === id) || list[0];
}
