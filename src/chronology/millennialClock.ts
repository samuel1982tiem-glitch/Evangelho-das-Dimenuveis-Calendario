/**
 * @file src/chronology/millennialClock.ts
 * Detailed Great Week analysis and Biblical Sabbath Millennial metadata.
 */

export interface GreatWeekMillenniumInfo {
  number: number; // 1 to 7
  roman: string;
  yearsSpan: string;
  biblicalEra: string;
  description: string;
  isSabbath: boolean;
}

export const GREAT_WEEK_MILLENNIA: GreatWeekMillenniumInfo[] = [
  {
    number: 1,
    roman: 'I',
    yearsSpan: 'Years 1 – 1,000 AM',
    biblicalEra: 'Creation to Noah’s Ante-Diluvian Era',
    description: 'The First Millennium. From the Creation epoch through the early patriarchs (Adam, Seth, Enosh, Enoch, Methuselah).',
    isSabbath: false,
  },
  {
    number: 2,
    roman: 'II',
    yearsSpan: 'Years 1,001 – 2,000 AM',
    biblicalEra: 'The Great Deluge to Abraham',
    description: 'The Second Millennium. Noah’s Ark, the Post-Flood renewal, Tower of Babel, and the call of Abraham.',
    isSabbath: false,
  },
  {
    number: 3,
    roman: 'III',
    yearsSpan: 'Years 2,001 – 3,000 AM',
    biblicalEra: 'Patriarchs, Exodus & Kingdom of Israel',
    description: 'The Third Millennium. Jacob, Joseph, the Exodus from Egypt, Sinai Covenant, King David, and Solomon’s Temple.',
    isSabbath: false,
  },
  {
    number: 4,
    roman: 'IV',
    yearsSpan: 'Years 3,001 – 4,000 AM',
    biblicalEra: 'Divided Kingdom, Prophets & Messianic Advent',
    description: 'The Fourth Millennium. The Prophets, Babylonian Exile, Second Temple rebuild, concluding with the birth and ministry of the Messiah.',
    isSabbath: false,
  },
  {
    number: 5,
    roman: 'V',
    yearsSpan: 'Years 4,001 – 5,000 AM',
    biblicalEra: 'Apostolic Era to Early Middle Ages',
    description: 'The Fifth Millennium. Spread of the Gospel across nations, Roman Empire transition, and early ecclesiastical history.',
    isSabbath: false,
  },
  {
    number: 6,
    roman: 'VI',
    yearsSpan: 'Years 5,001 – 6,000 AM',
    biblicalEra: 'Late Historical Era to 6,000-Year Threshold',
    description: 'The Sixth Millennium. The culmination of human history, technological acceleration, and preparation for the Millennial Sabbath.',
    isSabbath: false,
  },
  {
    number: 7,
    roman: 'VII',
    yearsSpan: 'Years 6,001 – 7,000 AM',
    biblicalEra: 'THE MILLENNIAL SABBATH (Messianic Kingdom)',
    description: 'The Seventh Millennium. The prophetic 1,000-year Sabbath rest described in Revelation 20 and Hebrews 4.',
    isSabbath: true,
  },
];

export const SCRIPTURE_MILLENNIAL_REFERENCES = [
  {
    ref: '2 Peter 3:8',
    text: '“But, beloved, be not ignorant of this one thing, that one day is with the Lord as a thousand years, and a thousand years as one day.”',
    context: 'The interpretive framework connecting the 7-day creation week with the 7,000-year divine chronological plan.',
  },
  {
    ref: 'Revelation 20:4-6',
    text: '“And they lived and reigned with Christ a thousand years... Blessed and holy is he that hath part in the first resurrection: on such the second death hath no power, but they shall be priests of God and of Christ, and shall reign with him a thousand years.”',
    context: 'The Biblical revelation of the 1,000-year Messianic Sabbath reign.',
  },
  {
    ref: 'Hebrews 4:9',
    text: '“There remaineth therefore a rest (sabbatismos) to the people of God.”',
    context: 'The Sabbath rest remaining as the ultimate fulfillment of divine chronology.',
  },
  {
    ref: 'Psalm 90:4',
    text: '“For a thousand years in thy sight are but as yesterday when it is past, and as a watch in the night.”',
    context: 'The divine perspective of millenniums as cosmic days.',
  },
];
