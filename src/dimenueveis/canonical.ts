/**
 * @file src/dimenueveis/canonical.ts
 * Canonical source material for the Gospel of Dimenuous / Evangelho das Dimenúveis.
 * CRITICAL RULE 19: Immutable source content in both English and Portuguese.
 */

import { DimenueveisCanonicalSection } from '../types/calendar';
import { Language } from '../i18n/translations';

export const DIMENUEVEIS_CANONICAL_SECTIONS: DimenueveisCanonicalSection[] = [
  {
    id: 'dimenueveis-prologue',
    title: 'Prologue: The Sovereign Threshold',
    layer: 'DIMENUEVEIS',
    canonicalText: `In the unmeasured beginning, before the celestial spheres declared the counting of hours, the Eternal WORD set the foundations of Time. Not in drift or shadow, but in exact weight, measure, and light.

And it was declared unto the watchers: "Set not your count by the wandering philosophies of earth, but by the Sacred Threshold — where Day Zero meets the renewal of the Moon, and thirteen measures of twenty-eight days declare the unbroken order of the Sanctuary."

For fifty-two weeks shall the witness endure, and every seventh day shall remain an unyielding Sabbath, bridging the centuries until the Seventh Millennium of Peace.`,
    notes: [
      'Canonical Prologue of Dimenuous.',
      'Establishes Day Zero as the divine threshold of renewal.',
      'Affirms the 13 x 28 day architecture (364 numbered days + Day Zero) as the Sacred Calendar measure.',
    ],
  },
  {
    id: 'dimenueveis-day-zero',
    title: 'The Doctrine of Day Zero',
    layer: 'SACRED',
    canonicalText: `And Dimenuous taught concerning the annual threshold, saying: "Call not the head of the year Day One, nor mingle it among the numbered labor of the three hundred and sixty-four days.

For Day Zero is the Sabbath of the Year — the doorway between the old circuit and the new creation. On Day Zero, the Moon renews her countenance in the spring conjunction, and the heavens rest before the first month begins."

Whoever honors Day Zero recognizes the Sovereignty of the Creator over both time and eternity.`,
    notes: [
      'Canonical text defining Day Zero as the annual New Year threshold.',
      'Precludes Day Zero from being numbered among the 364 calendar days.',
      'Classifies Day Zero as an Annual Sabbath.',
    ],
  },
  {
    id: 'dimenueveis-the-great-week',
    title: 'The Great Week of Seven Millennia',
    layer: 'MILLENNIAL',
    canonicalText: `Six days did the Creator labor in forming the cosmos, and on the seventh day He rested and sanctified it. So also in the grand scale of the Ages: six thousand years are appointed unto human historical struggle under the sun, and the Seventh Thousand Years is appointed as the Millennial Sabbath of Christ.

As it is written in the sacred witnesses: One day is with the Lord as a thousand years. When the six thousandth year is fulfilled, the trumpets of the Great Sabbath shall sound across all nations.`,
    notes: [
      'Canonical text describing the 6,000-year work epoch and 7th-Millennium Sabbath rest.',
      'Directly links the 7-day creation week to the 7,000-year Millennial model.',
    ],
  },
  {
    id: 'dimenueveis-celestial-harmony',
    title: 'The Celestial Witness',
    layer: 'CELESTIAL',
    canonicalText: `Let the Sun mark the solar year and the seasonal equinoxes, and let the Moon proclaim the appointed feasts and the annual threshold of Day Zero. 

Though the moon in her synodic journey completes twenty-nine days and a half, let not her drift obscure the twenty-eight days of the sacred month. The sacred calendar is the golden vessel; the astronomical moon is the oil within the lamp. Both declare the majesty of God.`,
    notes: [
      'Canonical text resolving the distinction between 28 calendar days and 29.53 synodic days.',
      'Establishes the astronomical moon as an overlay upon the sacred calendar.',
    ],
  },
];

export const DIMENUEVEIS_CANONICAL_SECTIONS_PT: DimenueveisCanonicalSection[] = [
  {
    id: 'dimenueveis-prologue',
    title: 'Prólogo: O Limiar Soberano',
    layer: 'DIMENUEVEIS',
    canonicalText: `No princípio imensurável, antes que as esferas celestes declarassem a contagem das horas, o VERBO Eterno estabeleceu os fundamentos do Tempo. Não em desvio ou sombra, mas em peso, medida e luz exatos.

E foi declarado aos vigilantes: "Não estabeleçais a vossa contagem pelas filosofias errantes da terra, mas pelo Limiar Sagrado — onde o Dia Zero encontra a renovação da Lua, e treze medidas de vinte e oito dias declaram a ordem ininterrupta do Santuário."

Por cinquenta e duas semanas perdurará o testemunho, e cada sétimo dia permanecerá como um Sábado inabalável, unindo os séculos até o Sétimo Milênio da Paz.`,
    notes: [
      'Prólogo Canônico das Dimenúveis.',
      'Estabelece o Dia Zero como o limiar divino de renovação.',
      'Afirma a arquitetura de 13 x 28 dias (364 dias numerados + Dia Zero) como a medida do Calendário Sagrado.',
    ],
  },
  {
    id: 'dimenueveis-day-zero',
    title: 'A Doutrina do Dia Zero',
    layer: 'SACRED',
    canonicalText: `E Dimenúveis ensinou acerca do limiar anual, dizendo: "Não chameis a cabeça do ano de Dia Um, nem a mistureis entre o labor numerado dos trezentos e sessenta e quatro dias.

Pois o Dia Zero é o Sábado do Ano — o portal entre o antigo circuito e a nova criação. No Dia Zero, a Lua renova o seu semblante na conjunção da primavera, e os céus descansam antes que o primeiro mês comece."

Quem honra o Dia Zero reconhece a Soberania do Criador sobre o tempo e a eternidade.`,
    notes: [
      'Texto canônico definindo o Dia Zero como o limiar anual do Ano Novo.',
      'Impede que o Dia Zero seja numerado entre os 364 dias do calendário.',
      'Classifica o Dia Zero como um Sábado Anual.',
    ],
  },
  {
    id: 'dimenueveis-the-great-week',
    title: 'A Grande Semana de Sete Milênios',
    layer: 'MILLENNIAL',
    canonicalText: `Seis dias trabalhou o Criador na formação do cosmos, e no sétimo dia descansou e o santificou. Assim também na grande escala das Eras: seis mil anos estão determinados para a luta histórica humana debaixo do sol, e o Sétimo Milênio está determinado como o Sábado Milenar de Cristo.

Como está escrito nas testemunhas sagradas: Um dia para o Senhor é como mil anos. Quando o sexto milênio se cumprir, as trombetas do Grande Sábado soarão sobre todas as nações.`,
    notes: [
      'Texto canônico descrevendo a época de 6.000 anos de trabalho e o descanso sabático do 7º Milênio.',
      'Vincula diretamente a semana da criação de 7 dias ao modelo Milenar de 7.000 anos.',
    ],
  },
  {
    id: 'dimenueveis-celestial-harmony',
    title: 'A Testemunha Celestial',
    layer: 'CELESTIAL',
    canonicalText: `Que o Sol marque o ano solar e os equinócios das estações, e que a Lua proclame as festas determinadas e o limiar anual do Dia Zero.

Embora a lua em sua jornada sinódica complete vinte e nove dias e meio, não permitais que o seu curso obscureça os vinte e oito dias do mês sagrado. O calendário sagrado é o vaso de ouro; a lua astronômica é o azeite dentro da lâmpada. Ambos declaram a majestade de Deus.`,
    notes: [
      'Texto canônico resolvendo a distinção entre 28 dias do calendário e 29,53 dias sinódicos.',
      'Estabelece a lua astronômica como uma sobreposição sobre o calendário sagrado.',
    ],
  },
];

export function getLocalizedCanonicalSections(language: Language = 'en'): DimenueveisCanonicalSection[] {
  return language === 'pt' ? DIMENUEVEIS_CANONICAL_SECTIONS_PT : DIMENUEVEIS_CANONICAL_SECTIONS;
}
