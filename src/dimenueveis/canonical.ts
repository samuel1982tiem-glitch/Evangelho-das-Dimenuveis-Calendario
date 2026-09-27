/**
 * @file src/dimenueveis/canonical.ts
 * Biblical Scripture foundations for the Sacred Calendar, Day Zero / Head of the Year,
 * the 7,000-Year Great Week, and the Celestial Witness of Sun and Moon (Bilingual).
 */

import { DimenueveisCanonicalSection } from '../types/calendar';
import { Language } from '../i18n/translations';

export const DIMENUEVEIS_CANONICAL_SECTIONS: DimenueveisCanonicalSection[] = [
  {
    id: 'dimenueveis-prologue',
    title: 'Genesis 1:14–19 & Exodus 20:8–11 — The Foundation of Sacred Time',
    layer: 'DIMENUEVEIS',
    canonicalText: `"And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for appointed seasons (moedim), and for days, and years." (Genesis 1:14)

"And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made. And God blessed the seventh day, and sanctified it." (Genesis 2:2–3)

"Remember the sabbath day, to keep it holy. Six days shalt thou labour, and do all thy work: But the seventh day is the sabbath of the LORD thy God." (Exodus 20:8–10)`,
    notes: [
      'Genesis 1:14–19 — Establishes the luminaries as divine instruments for signs, appointed times (moedim), days, and years.',
      'Genesis 2:1–3 & Exodus 20:8–11 — Establishes the unbroken 7-day weekly cycle and the sanctification of the seventh-day Sabbath.',
      '1 Chronicles 27:1–15 — Illustrates the structured courses of the sacred year.',
    ],
  },
  {
    id: 'dimenueveis-day-zero',
    title: 'Exodus 12:1–2 & Leviticus 23:1–4 — The Head of the Year & Appointed Times',
    layer: 'SACRED',
    canonicalText: `"And the LORD spake unto Moses and Aaron in the land of Egypt, saying, This month shall be unto you the beginning of months: it shall be the first month of the year to you." (Exodus 12:1–2)

"Speak unto the children of Israel, and say unto them, Concerning the feasts of the LORD, which ye shall proclaim to be holy convocations, even these are my appointed feasts. Six days shall work be done: but the seventh day is the sabbath of rest, an holy convocation; ye shall do no work therein: it is the sabbath of the LORD in all your dwellings. These are the feasts of the LORD, even holy convocations, which ye shall proclaim in their appointed seasons." (Leviticus 23:2–4)`,
    notes: [
      'Exodus 12:1–2 — Anchors the beginning of the Sacred Year in the spring (Abib / Nisan).',
      'Leviticus 23:1–44 — Defines the weekly Sabbath and the annual Holy Convocations (Moedim) in their appointed months and days.',
      'Numbers 28:11–15 — Prescribes the solemn observance at the beginnings of the months.',
    ],
  },
  {
    id: 'dimenueveis-the-great-week',
    title: 'Psalm 90:4, 2 Peter 3:8 & Revelation 20:4–6 — The Millennial Great Week',
    layer: 'MILLENNIAL',
    canonicalText: `"For a thousand years in thy sight are but as yesterday when it is past, and as a watch in the night." (Psalm 90:4)

"But, beloved, be not ignorant of this one thing, that one day is with the Lord as a thousand years, and a thousand years as one day." (2 Peter 3:8)

"There remaineth therefore a sabbath rest (sabbatismos) to the people of God." (Hebrews 4:9)

"And they lived and reigned with Christ a thousand years... Blessed and holy is he that hath part in the first resurrection: on such the second death hath no power, but they shall be priests of God and of Christ, and shall reign with him a thousand years." (Revelation 20:4, 6)`,
    notes: [
      'Psalm 90:4 & 2 Peter 3:8 — Establishes the scriptural day-for-a-thousand-years correspondence.',
      'Hebrews 4:3–11 — Connects the seventh day of Creation rest with the promised eschatological Sabbath rest (sabbatismos).',
      'Revelation 20:1–6 — Foretells the 1,000-year Millennial reign of Christ.',
    ],
  },
  {
    id: 'dimenueveis-celestial-harmony',
    title: 'Psalm 104:19, Psalm 19:1–4 & Isaiah 66:23 — The Celestial Witness',
    layer: 'CELESTIAL',
    canonicalText: `"He appointed the moon for seasons (moedim): the sun knoweth his going down." (Psalm 104:19)

"The heavens declare the glory of God; and the firmament sheweth his handywork. Day unto day uttereth speech, and night unto night sheweth knowledge." (Psalm 19:1–2)

"It shall be established for ever as the moon, and as a faithful witness in heaven." (Psalm 89:37)

"And it shall come to pass, that from one new moon to another, and from one sabbath to another, shall all flesh come to worship before me, saith the LORD." (Isaiah 66:23)`,
    notes: [
      'Psalm 104:19 — Declares that the Moon was appointed for the sacred seasons (moedim) and the Sun marks the evening boundary of the day.',
      'Psalm 19:1–4 & Psalm 89:37 — Identifies the heavens and the Moon as faithful witnesses of the Creator’s order.',
      'Isaiah 66:23 — Links the lunar renewal and the weekly Sabbath in perpetual worship.',
    ],
  },
];

export const DIMENUEVEIS_CANONICAL_SECTIONS_PT: DimenueveisCanonicalSection[] = [
  {
    id: 'dimenueveis-prologue',
    title: 'Gênesis 1:14–19 e Êxodo 20:8–11 — O Fundamento do Tempo Sagrado',
    layer: 'DIMENUEVEIS',
    canonicalText: `"E disse Deus: Haja luminares na expansão dos céus, para haver separação entre o dia e a noite; e sejam eles para sinais e para tempos determinados (moedim), e para dias e anos." (Gênesis 1:14)

"E, havendo Deus acabado no dia sétimo a sua obra, que tinha feito, descansou no sétimo dia de toda a sua obra, que tinha feito. E abençoou Deus o dia sétimo e o santificou." (Gênesis 2:2–3)

"Lembra-te do dia do sábado, para o santificar. Seis dias trabalharás, e farás toda a tua obra. Mas o sétimo dia é o sábado do SENHOR teu Deus." (Êxodo 20:8–10)`,
    notes: [
      'Gênesis 1:14–19 — Estabelece os luminares celestes para sinais, tempos determinados (moedim), dias e anos.',
      'Gênesis 2:1–3 e Êxodo 20:8–11 — Estabelece o ciclo semanal ininterrupto de 7 dias e a santificação do Sábado no sétimo dia.',
      '1 Crônicas 27:1–15 — Demonstra a organização estruturada dos turnos ao longo do ano sagrado.',
    ],
  },
  {
    id: 'dimenueveis-day-zero',
    title: 'Êxodo 12:1–2 e Levítico 23:1–4 — O Princípio do Ano e as Festas Fixas',
    layer: 'SACRED',
    canonicalText: `"E falou o SENHOR a Moisés e a Arão na terra do Egito, dizendo: Este mesmo mês vos será o princípio dos meses; este vos será o primeiro dos meses do ano." (Êxodo 12:1–2)

"Fala aos filhos de Israel, e dize-lhes: As solenidades do SENHOR, que convocareis, serão santas convocações; estas são as minhas solenidades: Seis dias trabalho se fará, mas o sétimo dia será o sábado do descanso, santa convocação; nenhuma obra fareis; sábado do SENHOR é em todas as vossas habitações. Estas são as solenidades do SENHOR, as santas convocações, que convocareis ao seu tempo determinado." (Levítico 23:2–4)`,
    notes: [
      'Êxodo 12:1–2 — Ancora o início do Ano Sagrado na primavera (Abibe / Nisã).',
      'Levítico 23:1–44 — Define o Sábado semanal e as Santas Convocações anuais (Moedim) em seus meses e dias determinados.',
      'Números 28:11–15 — Prescreve a observância solene nos princípios dos meses.',
    ],
  },
  {
    id: 'dimenueveis-the-great-week',
    title: 'Salmos 90:4, 2 Pedro 3:8 e Apocalipse 20:4–6 — A Grande Semana Milenar',
    layer: 'MILLENNIAL',
    canonicalText: `"Porque mil anos são aos teus olhos como o dia de ontem que passou, e como a vigília da noite." (Salmos 90:4)

"Mas, amados, não ignoreis uma coisa: que um dia para o Senhor é como mil anos, e mil anos como um dia." (2 Pedro 3:8)

"Portanto, resta ainda um repouso sabático (sabbatismos) para o povo de Deus." (Hebreus 4:9)

"E viveram, e reinaram com Cristo durante mil anos... Bem-aventurado e santo aquele que tem parte na primeira ressurreição; sobre estes não tem poder a segunda morte; mas serão sacerdotes de Deus e de Cristo, e reinarão com ele mil anos." (Apocalipse 20:4, 6)`,
    notes: [
      'Salmos 90:4 e 2 Pedro 3:8 — Estabelecem a correspondência bíblica de um dia como mil anos.',
      'Hebreus 4:3–11 — Conecta o descanso do sétimo dia da Criação com o repouso sabático escatológico prometido (sabbatismos).',
      'Apocalipse 20:1–6 — Profetiza o reino milenar de 1.000 anos de Cristo.',
    ],
  },
  {
    id: 'dimenueveis-celestial-harmony',
    title: 'Salmos 104:19, Salmos 19:1–4 e Isaías 66:23 — O Testemunho Celestial',
    layer: 'CELESTIAL',
    canonicalText: `"Designou a lua para as estações e tempos determinados (moedim); o sol conhece o seu ocaso." (Salmos 104:19)

"Os céus declaram a glória de Deus e o firmamento anuncia a obra das suas mãos. Um dia faz declaração a outro dia, e uma noite mostra sabedoria a outra noite." (Salmos 19:1–2)

"Será estabelecido para sempre como a lua, e como uma testemunha fiel no céu." (Salmos 89:37)

"E será que desde uma lua nova até à outra, e desde um sábado até ao outro, virá toda a carne a adorar perante mim, diz o SENHOR." (Isaías 66:23)`,
    notes: [
      'Salmos 104:19 — Declara que a Lua foi designada para os tempos determinados (moedim) e que o Sol marca o limite vespertino do dia.',
      'Salmos 19:1–4 e Salmos 89:37 — Identificam os céus e a Lua como testemunhas fiéis da ordem do Criador.',
      'Isaías 66:23 — Une a renovação lunar e o Sábado semanal na adoração perpétua.',
    ],
  },
];

export function getLocalizedCanonicalSections(language: Language = 'en'): DimenueveisCanonicalSection[] {
  return language === 'pt' ? DIMENUEVEIS_CANONICAL_SECTIONS_PT : DIMENUEVEIS_CANONICAL_SECTIONS;
}
