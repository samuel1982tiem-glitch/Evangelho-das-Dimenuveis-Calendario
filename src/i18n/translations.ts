/**
 * @file src/i18n/translations.ts
 * Comprehensive bilingual dictionary for English ("en") and Portuguese ("pt").
 * Labels and box titles are calibrated to fit cleanly on a single line on mobile (360px+).
 */

export type Language = 'en' | 'pt';

export const TRANSLATIONS = {
  en: {
    appTitle: 'Gospel of Dimenuous',
    appSubtitle: 'Biblical Lunar & Millennial Calendar',
    sacredStructureTag: '364d + Day 0',
    nightMode: 'Night Mode',
    solarDayMode: 'Solar Day Mode',
    solarTime: 'Solar',
    language: 'Language',
    selectLanguage: 'Select Language',
    english: 'English',
    portuguese: 'Português',

    // Phase Names
    phaseNames: {
      'New Moon': 'New Moon',
      'Waxing Crescent': 'Waxing Crescent',
      'First Quarter': 'First Quarter',
      'Waxing Gibbous': 'Waxing Gibbous',
      'Full Moon': 'Full Moon',
      'Waning Gibbous': 'Waning Gibbous',
      'Last Quarter': 'Last Quarter',
      'Waning Crescent': 'Waning Crescent',
    },

    // Navigation Tabs
    tabs: {
      TODAY: 'Today',
      CALENDAR: '13-Month Calendar',
      FEASTS: 'Appointed Times',
      MOON: 'Moon',
      SABBATH: 'Sabbath',
      GREAT_WEEK: 'Great Week',
      CHRONOLOGY_LAB: 'Chronology Lab',
      SCRIPTURE_HISTORY: 'Scripture & History',
      DIMENUEVEIS: 'Dimenúveis',
      SETTINGS: 'Settings',
      TESTS: 'Engine Tests',
    },

    // Today Screen
    today: {
      realtimeClock: 'SACRED CLOCK',
      sacredYear: 'SACRED YEAR',
      dayZeroTitle: 'DAY ZERO',
      dayZeroSubtitle: 'Sacred New Year & Celestial Threshold',
      weekOf: 'WEEK',
      of52: 'OF 52',
      dayOfWeek: 'DAY',
      inspectDetails: 'Inspect Full Day Details',
      astronomicalMoon: 'Astronomical Moon',
      illuminated: 'Illum.',
      lunarAge: 'Age',
      theGreatWeek: 'The Great Week',
      elapsedSolarYears: 'Solar Yrs',
      explore13Month: '13-Month Sacred Calendar',
      explore13MonthDesc: '13 equal months of 28 days (364 numbered days) + Day Zero New Year threshold. Continuous 7-day weekly Sabbath.',
      exploreGrid: 'Explore 13-Month Grid',
      lunarOverlay: 'Astronomical Lunar Overlay',
      lunarOverlayDesc: 'Actual astronomical lunar phase displayed directly over sacred dates without forcing calendar days to stretch or shrink.',
      inspectLunar: 'Inspect Lunar Cycle',
      millennialClock: '7,000-Year Great Week',
      millennialClockDesc: 'Millennial Sabbath model based on 2 Peter 3:8 & Revelation 20. Track position relative to 6,000-year and 7,000-year boundaries.',
      viewMillennial: 'View Millennial Clock',
    },

    // Calendar Screen
    calendar: {
      yearTitle: 'Sacred Year',
      subtitle: 'Day Zero + 13 Months × 28 Days = 364 Days (52 Weeks)',
      annualSabbathThreshold: 'ANNUAL SABBATH',
      dayZeroBannerTitle: 'Sacred New Year & Celestial Threshold',
      dayZeroBannerDesc: 'Distinct from Month 1 Day 1 and outside the 364 numbered days. Celebrated as an Annual Sabbath linked to the Spring Lunar Conjunction.',
      springAnchorPhase: 'Spring Anchor',
      allMonths: 'All 13 Months',
      days28Weeks4: '28d · 4 Wks',
      daysOfWeek: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Sabbath'],
      lunarFilter: 'Lunar Phase Filter:',
      allPhases: 'All Phases',
      newMoon: '🌑 New',
      waxingPhases: '🌓 Waxing',
      fullMoon: '🌕 Full',
      waningPhases: '🌗 Waning',
    },

    // Moon Screen
    moon: {
      title: 'Astronomical Moon & Phases',
      sacredVsSynodic: 'Sacred vs. Synodic Month',
      sacredVsSynodicDesc: 'The 28-day calendar month is a Sacred Calendar Unit (4 exact 7-day weeks). The actual astronomical synodic lunar period is ~29.53 days. The astronomical moon is rendered directly on top of the sacred calendar without deforming calendar day counts.',
      anchorModeLabel: 'Day Zero Lunar Anchor Mode',
      modeA: 'Mode A — Conjunction',
      modeADesc: 'New Moon Conjunction',
      modeB: 'Mode B — Crescent',
      modeBDesc: '~1.5d Post-Conjunction',
      modeC: 'Mode C — Observational',
      modeCDesc: 'Local Horizon Visibility',
      guideTitle: 'The 8 Defined Lunar Phases',
      guideDesc: 'Exact visual icons and age specifications for all 8 canonical moon phases in synodic order.',
      all8Phases: 'All 8 Phases',
      activeNow: 'ACTIVE',
      nextEvent: 'Next Lunar Phase',
      prevEvent: 'Previous Lunar Phase',
      upcomingHorizon: 'Upcoming 8 Lunar Phases',
      targetDate: 'Target Date:',
      recordedDate: 'Recorded Date:',
    },

    // Sabbath Screen
    sabbath: {
      heroTitle: 'Continuous Sabbath System',
      description: 'Rule 7 of the Sacred Calendar requires an unbroken 7-day weekly Sabbath cycle. Month boundaries do NOT reset or interrupt the weekly Sabbath count. Day Zero is additionally classified as the ANNUAL SABBATH threshold.',
      weeklySabbathLabel: 'WEEKLY SABBATH',
      weeklySabbathDesc: 'Every 7th day (Days 7, 14, 21, 28 of each month) = 52 times/year.',
      annualSabbathLabel: 'ANNUAL SABBATH',
      annualSabbathDesc: 'Day Zero New Year threshold outside 364 numbered days.',
      grandSabbathLabel: 'GRAND SABBATH',
      grandSabbathDesc: 'When Day Zero coincides with the 7th weekly Sabbath day.',
      continuityProofTitle: 'Sabbath Continuity Ledger',
      proofText: 'Because 13 months × 28 days = 364 numbered days, and 364 ÷ 7 = 52 exact weeks, the weekly Sabbath recurs with mathematical perfection every 7th day throughout all 13 months without shifting or day-dropping.',
      annualSabbathsTitle: 'Annual & Weekly Sabbath Log',
      annualNewYearSabbath: 'Annual New Year Sabbath',
    },

    // Great Week Screen
    greatWeek: {
      heroTitle: 'The 7,000-Year Great Week',
      noticeTitle: 'INTERPRETIVE MODEL NOTICE',
      noticeText: 'This is an interpretive chronological model aligning the 7-day creation week with 7,000 years of cosmic history (2 Peter 3:8, Psalm 90:4, Revelation 20). It is presented transparently as a theological model rather than mathematically proven dogma.',
      elapsedYears: 'Elapsed Years',
      sinceCreation: 'Since Creation',
      activeMillennium: 'Active Millennium',
      boundary6000: '6,000-Yr Limit',
      boundary7000: '7,000-Yr Limit',
      sevenMillenniaTitle: 'The Seven Millennia of History',
      scriptureFoundationsTitle: 'Scripture Foundations (2 Pet 3:8)',
    },

    // Chronology Lab
    chronologyLab: {
      heroTitle: 'Chronology Comparison Lab',
      description: 'Compare Biblical chronologies (Ussher, Rabbinic Seder Olam, Septuagint, and Sacred Epoch) side-by-side, toggle historical corrections like Joshua’s Long Day (+1 Day), and observe deterministic recalculations.',
      simulationParameters: 'Simulation Parameters',
      activeModelLabel: 'Active Chronology Model',
      joshuaCorrectionLabel: 'Joshua 10 Correction',
      anchorModeLabel: 'Day Zero Lunar Anchor',
      matrixTitle: 'Chronology Comparison Matrix',
      targetYear: 'Year:',
      modelNameTh: 'Model',
      creationEpochTh: 'Creation',
      elapsedSolarTh: 'Elapsed Yrs',
      boundary6000Th: '6,000 CE',
      currentMillenniumTh: 'Millennium',
      statusTh: 'Status',
      driftTitle: '364-Day vs. Solar Drift Analysis',
      annualDrift: 'Annual Drift',
      drift100: '100-Year Drift',
      drift1000: '1,000-Year Drift',
      daysYear: 'Days/Yr',
    },

    // Scripture History
    scriptureHistory: {
      heroTitle: 'Scripture & Celestial Events',
      heroDesc: 'Scripture records extraordinary celestial events where solar and lunar movements intersected with covenant history. All events are categorized transparently by source data (Biblical Text, Astronomical Calculation, or Historical Candidate).',
      joshuaTitle: 'Joshua 10 — Sun Over Gibeon',
      joshuaStatus: 'CANDIDATE (30 OCT 1207 BCE)',
      joshuaDesc: 'Joshua 10:12-14 records: "Sun, stand thou still upon Gibeon; and thou, Moon, in the valley of Aijalon." Researchers Humphreys & Waddington (2017) proposed an annular solar eclipse over Canaan on 30 October 1207 BCE matching the Merneptah Stele timeline.',
      joshuaSetting: 'Joshua 10 Adjustment (+1d)',
      currentSetting: 'Current:',
      offLabel: 'Off',
      proposedLabel: 'Proposed (+1d)',
      acceptedLabel: 'Accepted (+1d)',
      catalogTitle: 'Astronomical Event Catalog',
      timelineTitle: 'Sacred Biblical Timeline',
    },

    // Dimenúveis Screen
    dimenueveis: {
      heroTitle: 'Dimenuous Architecture',
      subtitle: 'Immutable Canonical Text & 6-Layer Time System',
      integrityProtocol: 'CANONICAL INTEGRITY PROTOCOL: All Gospel of Dimenuous source texts are preserved verbatim in their immutable form without alteration or summary.',
      treeTab: '6-Layer Tree',
      viewerTab: 'Canonical Text',
      lexiconTab: 'Lexicon',
      timeTreeTitle: '6-Layer Time Architecture',
      indexTitle: 'Canonical Gospel Index',
      annotationsTitle: 'Canonical Annotations',
      timeLayer: 'TIME LAYER',
      lexiconTitle: 'Canonical Terminology Lexicon',
      sourceLabel: 'Source:',
    },

    // Settings
    settings: {
      heroTitle: 'Almanac Configuration',
      heroDesc: 'Configure active Day Zero lunar anchor calculations, chronology models, custom month nomenclature, and location parameters for local solar twilight calculation.',
      engineParameters: 'Core Engine Parameters',
      lunarAnchorMode: 'Day Zero Lunar Anchor',
      defaultChronology: 'Default Chronology Model',
      locationLabel: 'Solar Coordinates (Lat / Lon)',
      latitude: 'Latitude',
      longitude: 'Longitude',
      customMonthTitle: '13-Month Nomenclature',
      resetDefaults: 'Reset',
      saveConfig: 'Save',
      savedSuccess: 'Configuration Saved',
      monthNumberLabel: 'Month',
    },

    // Engine Tests
    tests: {
      heroTitle: 'Sacred Engine Verification',
      heroDesc: 'Executes automated tests verifying calendar mathematics (13 x 28 = 364), Month Boundaries, Day Zero preservation, continuous weekly Sabbath cycle, BCE/CE Year Zero rule, Great Week millennial boundaries, and Joshua 10 candidate isolation.',
      runButton: 'Run Tests',
      summaryTitle: 'Test Summary:',
      allPassed: '100% PASSED',
      failures: 'FAILURES',
      passedLabel: 'PASSED',
      failedLabel: 'FAILED',
    },

    // Day Detail Modal
    modal: {
      sacredYear: 'SACRED YEAR',
      gregorianEquiv: 'Gregorian:',
      positionTitle: 'Sacred Calendar Position',
      dayOfYear: 'Day of Year:',
      weekOfYear: 'Week of Year:',
      dayOfWeek: 'Day of Week:',
      dayZeroDesc: 'Annual New Year threshold outside 364 numbered days.',
      lunarOverlay: 'Astronomical Lunar Overlay',
      illumination: 'Illumination:',
      moonAge: 'Moon Age:',
      lunation: 'Lunation',
      solarData: 'Solar Ephemeris',
      sunrise: 'Sunrise',
      solarNoon: 'Solar Noon',
      sunset: 'Sunset',
      dusk: 'Twilight',
      biblicalEvents: 'Biblical Events on This Date',
      canonicalMaterial: 'Canonical Gospel Material',
    },

    // Common Badges
    badges: {
      weeklySabbath: 'WEEKLY SABBATH',
      annualSabbath: 'ANNUAL SABBATH',
      grandSabbath: 'GRAND SABBATH',
      workDay: 'Work Day',
      sabbath: 'Sabbath',
    },

    // Months (Default)
    monthNames: [
      'Month I', 'Month II', 'Month III', 'Month IV', 'Month V', 'Month VI', 'Month VII',
      'Month VIII', 'Month IX', 'Month X', 'Month XI', 'Month XII', 'Month XIII'
    ],
  },

  pt: {
    appTitle: 'Evangelho das Dimenúveis',
    appSubtitle: 'Calendário Bíblico Lunar e Milenar',
    sacredStructureTag: '364d + Dia 0',
    nightMode: 'Modo Noturno',
    solarDayMode: 'Modo Dia Solar',
    solarTime: 'Solar',
    language: 'Idioma',
    selectLanguage: 'Selecionar Idioma',
    english: 'English',
    portuguese: 'Português',

    // Phase Names
    phaseNames: {
      'New Moon': 'Lua Nova',
      'Waxing Crescent': 'Cresc. Côncava',
      'First Quarter': 'Quarto Cresc.',
      'Waxing Gibbous': 'Cresc. Convexa',
      'Full Moon': 'Lua Cheia',
      'Waning Gibbous': 'Ming. Convexa',
      'Last Quarter': 'Quarto Ming.',
      'Waning Crescent': 'Ming. Côncava',
    },

    // Navigation Tabs
    tabs: {
      TODAY: 'Hoje',
      CALENDAR: 'Calendário 13 Meses',
      FEASTS: 'Festas Bíblicas',
      MOON: 'Lua',
      SABBATH: 'Sábado',
      GREAT_WEEK: 'Grande Semana',
      CHRONOLOGY_LAB: 'Cronologia',
      SCRIPTURE_HISTORY: 'Escrituras',
      DIMENUEVEIS: 'Dimenúveis',
      SETTINGS: 'Ajustes',
      TESTS: 'Testes',
    },

    // Today Screen
    today: {
      realtimeClock: 'RELÓGIO SAGRADO',
      sacredYear: 'ANO SAGRADO',
      dayZeroTitle: 'DIA ZERO',
      dayZeroSubtitle: 'Ano Novo Sagrado e Limiar Celestial',
      weekOf: 'SEMANA',
      of52: 'DE 52',
      dayOfWeek: 'DIA',
      inspectDetails: 'Inspecionar Detalhes do Dia',
      astronomicalMoon: 'Lua Astronômica',
      illuminated: 'Ilum.',
      lunarAge: 'Idade',
      theGreatWeek: 'A Grande Semana',
      elapsedSolarYears: 'Anos Solares',
      explore13Month: 'Calendário de 13 Meses',
      explore13MonthDesc: '13 meses iguais de 28 dias (364 dias numerados) + Limiar do Ano Novo Dia Zero. Sábado semanal contínuo de 7 dias.',
      exploreGrid: 'Explorar Grade de 13 Meses',
      lunarOverlay: 'Sobreposição Lunar',
      lunarOverlayDesc: 'Fase lunar astronômica real exibida diretamente sobre as datas sagradas sem forçar os dias do calendário a esticar ou encolher.',
      inspectLunar: 'Inspecionar Ciclo Lunar',
      millennialClock: 'Grande Semana (7.000 Anos)',
      millennialClockDesc: 'Modelo de Sábado Milenar baseado em 2 Pedro 3:8 e Apocalipse 20. Acompanhe a posição relativa às fronteiras de 6.000 e 7.000 anos.',
      viewMillennial: 'Ver Relógio Milenar',
    },

    // Calendar Screen
    calendar: {
      yearTitle: 'Ano Sagrado',
      subtitle: 'Dia Zero + 13 Meses × 28 Dias = 364 Dias (52 Semanas)',
      annualSabbathThreshold: 'SÁBADO ANUAL',
      dayZeroBannerTitle: 'Ano Novo Sagrado & Limiar Celestial',
      dayZeroBannerDesc: 'Distinto do Mês 1 Dia 1 e fora dos 364 dias numerados. Celebrado como um Sábado Anual vinculado à Conjunção Lunar da Primavera.',
      springAnchorPhase: 'Âncora Vernal',
      allMonths: 'Todos os 13 Meses',
      days28Weeks4: '28d · 4 Sem.',
      daysOfWeek: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Sáb.'],
      lunarFilter: 'Filtro de Fase Lunar:',
      allPhases: 'Todas as Fases',
      newMoon: '🌑 Nova',
      waxingPhases: '🌓 Crescente',
      fullMoon: '🌕 Cheia',
      waningPhases: '🌗 Minguante',
    },

    // Moon Screen
    moon: {
      title: 'Efemérides & Fases da Lua',
      sacredVsSynodic: 'Mês Sagrado vs. Mês Sinódico',
      sacredVsSynodicDesc: 'O mês do calendário de 28 dias é uma Unidade de Calendário Sagrado (4 semanas exatas de 7 dias). O período lunar sinódico astronômico real é de ~29,53 dias. A lua astronômica é renderizada diretamente sobre o calendário sagrado sem deformar as contagens de dias.',
      anchorModeLabel: 'Ancoragem Lunar do Dia Zero',
      modeA: 'Modo A — Conjunção',
      modeADesc: 'Conjunção da Lua Nova',
      modeB: 'Modo B — Crescente',
      modeBDesc: '~1,5d Pós-Conjunção',
      modeC: 'Modo C — Observacional',
      modeCDesc: 'Horizonte Local',
      guideTitle: 'As 8 Fases Lunares Definidas',
      guideDesc: 'Ícones visuais exatos e especificações de idade para todas as 8 fases lunares canônicas na ordem sinódica.',
      all8Phases: 'Todas (8)',
      activeNow: 'ATIVA',
      nextEvent: 'Próxima Fase Lunar',
      prevEvent: 'Fase Lunar Anterior',
      upcomingHorizon: 'Próximas 8 Fases Lunares',
      targetDate: 'Data Alvo:',
      recordedDate: 'Data Registrada:',
    },

    // Sabbath Screen
    sabbath: {
      heroTitle: 'Sistema de Sábado Contínuo',
      description: 'A Regra 7 do Calendário Sagrado exige um ciclo de Sábado semanal ininterrupto de 7 dias. As fronteiras dos meses NÃO reiniciam nem interrompem a contagem semanal do Sábado. O Dia Zero é classificado adicionalmente como o limiar do SÁBADO ANUAL.',
      weeklySabbathLabel: 'SÁBADO SEMANAL',
      weeklySabbathDesc: 'A cada 7º dia (Dias 7, 14, 21, 28 de cada mês) = 52 vezes por ano.',
      annualSabbathLabel: 'SÁBADO ANUAL',
      annualSabbathDesc: 'Limiar do Ano Novo Dia Zero fora dos 364 dias numerados.',
      grandSabbathLabel: 'GRANDE SÁBADO',
      grandSabbathDesc: 'Quando o Dia Zero coincide com o 7º dia do Sábado semanal.',
      continuityProofTitle: 'Registro Contínuo de Sábados',
      proofText: 'Como 13 meses × 28 dias = 364 dias numerados, e 364 ÷ 7 = 52 semanas exatas, o Sábado semanal recorre com perfeição matemática a cada 7º dia em todos os 13 meses sem deslocamentos ou dias perdidos.',
      annualSabbathsTitle: 'Registro de Sábados Anuais e Semanais',
      annualNewYearSabbath: 'Sábado do Ano Novo Anual',
    },

    // Great Week Screen
    greatWeek: {
      heroTitle: 'A Grande Semana (7.000 Anos)',
      noticeTitle: 'NOTA DE MODELO INTERPRETATIVO',
      noticeText: 'Este é um modelo cronológico interpretativo alinhando a semana da criação de 7 dias com 7.000 anos de história cósmica (2 Pedro 3:8, Salmo 90:4, Apocalipse 20). É apresentado de forma transparente como um modelo teológico em vez de dogma matematicamente comprovado.',
      elapsedYears: 'Anos Decorridos',
      sinceCreation: 'Desde a Criação',
      activeMillennium: 'Milênio Ativo',
      boundary6000: 'Limiar 6.000 Anos',
      boundary7000: 'Limiar 7.000 Anos',
      sevenMillenniaTitle: 'Os Sete Milênios da História',
      scriptureFoundationsTitle: 'Base Bíblica (2 Pe 3:8 & Sl 90:4)',
    },

    // Chronology Lab
    chronologyLab: {
      heroTitle: 'Laboratório de Cronologia',
      description: 'Compare diferentes cronologias bíblicas (Ussher, Seder Olam Rabínico, Septuaginta e Época Sagrada) lado a lado, alterne correções históricas como o Dia Longo de Josué (+1 Dia) e observe recalculações determinísticas.',
      simulationParameters: 'Parâmetros de Simulação',
      activeModelLabel: 'Modelo Cronológico Ativo',
      joshuaCorrectionLabel: 'Correção de Josué 10',
      anchorModeLabel: 'Ancoragem Lunar do Dia Zero',
      matrixTitle: 'Matriz Cronológica Comparativa',
      targetYear: 'Ano:',
      modelNameTh: 'Modelo',
      creationEpochTh: 'Criação',
      elapsedSolarTh: 'Decorridos',
      boundary6000Th: '6.000 d.C.',
      currentMillenniumTh: 'Milênio',
      statusTh: 'Tipo',
      driftTitle: 'Desvio: Calendário 364d vs. Solar',
      annualDrift: 'Desvio Anual',
      drift100: 'Em 100 Anos',
      drift1000: 'Em 1.000 Anos',
      daysYear: 'Dias/Ano',
    },

    // Scripture History
    scriptureHistory: {
      heroTitle: 'Escrituras & Eventos Celestes',
      heroDesc: 'As Escrituras registram eventos celestes extraordinários onde os movimentos solares e lunares se interconectaram com a história da aliança. Todos os eventos são categorizados transparentemente por dados de origem (Texto Bíblico, Cálculo Astronômico ou Candidato Histórico).',
      joshuaTitle: 'Josué 10 — O Sol em Gibeão',
      joshuaStatus: 'CANDIDATO (30 OUT 1207 a.C.)',
      joshuaDesc: 'Josué 10:12-14 registra: "Sol, detém-te em Gibeão; e tu, Lua, no vale de Aijalão." Os pesquisadores Humphreys & Waddington (2017) propuseram um eclipse solar anular sobre Canaã em 30 de outubro de 1207 a.C. correspondendo à linha do tempo da Estela de Merneptah.',
      joshuaSetting: 'Ajuste de Josué 10 (+1d)',
      currentSetting: 'Atual:',
      offLabel: 'Desligado',
      proposedLabel: 'Proposto (+1d)',
      acceptedLabel: 'Aceito (+1d)',
      catalogTitle: 'Catálogo de Eventos Celestes',
      timelineTitle: 'Linha do Tempo Bíblica',
    },

    // Dimenúveis Screen
    dimenueveis: {
      heroTitle: 'Arquitetura Dimenúveis',
      subtitle: 'Texto Canônico Imutável & Tempo em 6 Camadas',
      integrityProtocol: 'PROTOCOLO DE INTEGRIDADE CANÔNICA: Todos os textos-fonte do Evangelho das Dimenúveis são preservados verbatim em sua forma imutável sem alteração ou resumo.',
      treeTab: 'Árvore (6 Níveis)',
      viewerTab: 'Texto Canônico',
      lexiconTab: 'Léxico',
      timeTreeTitle: 'Arquitetura do Tempo em 6 Camadas',
      indexTitle: 'Índice do Evangelho Canônico',
      annotationsTitle: 'Anotações Canônicas',
      timeLayer: 'CAMADA DE TEMPO',
      lexiconTitle: 'Léxico de Terminologia Canônica',
      sourceLabel: 'Fonte:',
    },

    // Settings
    settings: {
      heroTitle: 'Configurações do Almanaque',
      heroDesc: 'Configure os cálculos de ancoragem lunar do Dia Zero ativos, modelos de cronologia, nomenclatura personalizada de meses e parâmetros de localização para cálculo do crepúsculo solar local.',
      engineParameters: 'Parâmetros do Motor',
      lunarAnchorMode: 'Ancoragem Lunar do Dia Zero',
      defaultChronology: 'Modelo de Cronologia Padrão',
      locationLabel: 'Coordenadas Solares (Lat / Lon)',
      latitude: 'Latitude',
      longitude: 'Longitude',
      customMonthTitle: 'Nomenclatura dos 13 Meses',
      resetDefaults: 'Restaurar',
      saveConfig: 'Salvar',
      savedSuccess: 'Configuração Salva',
      monthNumberLabel: 'Mês',
    },

    // Engine Tests
    tests: {
      heroTitle: 'Verificação do Motor Sagrado',
      heroDesc: 'Executa testes automatizados verificando a matemática do calendário (13 x 28 = 364), limites de mês, preservação do Dia Zero, ciclo semanal contínuo de Sábado, regra de ano zero a.C./d.C., limites milenares da Grande Semana e isolamento do candidato de Josué 10.',
      runButton: 'Executar Testes',
      summaryTitle: 'Resumo dos Testes:',
      allPassed: '100% APROVADO',
      failures: 'FALHAS',
      passedLabel: 'OK',
      failedLabel: 'FALHA',
    },

    // Day Detail Modal
    modal: {
      sacredYear: 'ANO SAGRADO',
      gregorianEquiv: 'Gregoriano:',
      positionTitle: 'Posição no Calendário Sagrado',
      dayOfYear: 'Dia do Ano:',
      weekOfYear: 'Semana do Ano:',
      dayOfWeek: 'Dia da Semana:',
      dayZeroDesc: 'Limiar do Ano Novo Anual fora dos 364 dias numerados.',
      lunarOverlay: 'Sobreposição Lunar',
      illumination: 'Iluminação:',
      moonAge: 'Idade Lunar:',
      lunation: 'Lunação',
      solarData: 'Efemérides Solares',
      sunrise: 'Nascer do Sol',
      solarNoon: 'Meio-dia Solar',
      sunset: 'Pôr do Sol',
      dusk: 'Crepúsculo',
      biblicalEvents: 'Eventos Bíblicos na Data',
      canonicalMaterial: 'Material Canônico Dimenúveis',
    },

    // Common Badges
    badges: {
      weeklySabbath: 'SÁBADO SEMANAL',
      annualSabbath: 'SÁBADO ANUAL',
      grandSabbath: 'GRANDE SÁBADO',
      workDay: 'Dia Útil',
      sabbath: 'Sábado',
    },

    // Months (Default)
    monthNames: [
      'Mês I', 'Mês II', 'Mês III', 'Mês IV', 'Mês V', 'Mês VI', 'Mês VII',
      'Mês VIII', 'Mês IX', 'Mês X', 'Mês XI', 'Mês XII', 'Mês XIII'
    ],
  },
};
