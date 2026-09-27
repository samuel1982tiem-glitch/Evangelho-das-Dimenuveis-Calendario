# DIMENÚVEIS — Calendário Bíblico Lunar & Milenar

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8.svg)](https://tailwindcss.com/)
[![Licença: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Um motor avançado de engenharia de calendários e aplicação web interativa que combina o **Tempo Sagrado Bíblico** (13 meses × 28 dias = 364 dias + Dia Zero = 365 dias), **Cálculos Lunares Astronômicos** de alta precisão, **Cronologia Histórica a.C./d.C.** (sem Ano Zero), a **Grande Semana Milenar de 7.000 Anos** e a árvore arquitetônica temporal do **Evangelho das Dimenúveis**.

---

## 🌟 Principais Funcionalidades

- **Estrutura do Calendário Sagrado (13 × 28 + Dia 0)**:
  - 13 meses sagrados iguais de exatamente 28 dias (4 semanas de 7 dias).
  - **Dia Zero (0)**: O limiar não numerado do Ano Novo Sagrado que antecede o Mês I, Dia 1.
  - **Sábado Semanal Contínuo**: Ciclo ininterrupto de Sábados de 7 dias preservado através de fronteiras de meses e anos (52 Sábados semanais por ano sagrado).
  - **Sábado Anual do Dia Zero**: O Dia Zero é classificado como Sábado Anual, ou *Sábado Maior / Grão-Sábado* quando coincide com o 7º dia semanal.

- **Motor de Camada Lunar Astronômica**:
  - Cálculos sinódicos de fases da Lua de alta precisão (~29,530588 dias) sobrepostos diretamente nas datas do calendário sagrado.
  - 8 fases lunares astronômicas definidas (*Lua Nova*, *Crescente Côncava*, *Quarto Crescente*, *Crescente Convexa*, *Lua Cheia*, *Minguante Convexa*, *Quarto Minguante*, *Minguante Côncava*).
  - Modos de Ancoragem Lunar Configuráveis:
    1. **Conjunção Astronômica** (Lua Nova de Primavera)
    2. **Primeiro Crescente Visível** (~1,5 dias após a conjunção)
    3. **Modelo Observacional** (Visibilidade no crepúsculo do horizonte local)

- **Cronologia Bíblica & Relógio da Grande Semana**:
  - Motor matemático estrito **Sem Ano Zero** (`1 a.C. -> 1 d.C.`).
  - Suporte a múltiplos modelos cronológicos:
    - **Cronologia de Ussher** (Criação c. 4004 a.C.)
    - **Rabínica Tradicional Anno Mundi** (Criação c. 3761 a.C.)
    - **Septuaginta / LXX Igreja Primitiva** (Criação c. 5508 a.C.)
    - **Época Sagrada Astronômica / Modelo Dimenúveis** (Criação c. 4026 a.C.)
  - **A Grande Semana (Modelo Milenar de 7.000 Anos)**: 6.000 anos solares decorridos de história humana culminando no descanso do 7º Sábado Milenar (2 Pedro 3:8, Apocalipse 20).

- **Festas Bíblicas & Tempos Nomeados (Levítico 23)**:
  - Cálculo dinâmico de todas as festas bíblicas de Levítico 23 (*Páscoa / Pesach*, *Pães Asmos*, *Primícias*, *Pentecostes / Shavuot*, *Trombetas / Yom Teruah*, *Dia da Expiação / Yom Kippur*, *Tabernáculos / Sukkot*, *Oitavo Dia / Shemini Atzeret*).
  - Detecção de sobreposição de Sábados e duplas observâncias.

- **Astronomia Histórica & Análise do Evento Candidato de Josué 10**:
  - Catálogo de eclipses históricos com correlação para o "Dia Longo de Josué" (eclipse solar anular de 30 de outubro de 1207 a.C.).
  - Laboratório de Cronologia com alternância opcional do **Ajuste Histórico de +1 Dia** para testar impactos sem alterar fórmulas do calendário base.

- **Arquitetura Canônica do Evangelho das Dimenúveis**:
  - Protocolo de texto canônico imutável (Regra 19).
  - **Árvore do Tempo de 6 Camadas**: Tempo Sagrado, Tempo Celestial, Tempo Bíblico, Tempo Milenar, Tempo Histórico e Tempo Dimenúveis.
  - Léxico completo de termos e selos de classificação de fonte de dados (`ASTRONOMICAL_CALCULATION`, `BIBLICAL_TEXT`, `HISTORICAL_RECORD`, `TRADITIONAL_CHRONOLOGY`, `INTERPRETIVE_MODEL`, `HYPOTHETICAL_MODEL`).

- **Interface Bilingue (Português & Inglês)**:
  - Alternador de idioma de toque único com localização completa de títulos, nomes de meses, descrições de festas e relatórios de testes do motor.

---

## 📐 Matemática do Calendário

$$\text{Ano Sagrado} = 1 \text{ Dia Zero (Sábado Anual)} + (13 \text{ Meses} \times 28 \text{ Dias}) = 365 \text{ Dias}$$

$$\text{Sábados Semanais} = \frac{364 \text{ Dias Numerados}}{7 \text{ Dias / Semana}} = 52 \text{ Sábados Semanais Ininterruptos}$$

---

## 🛠 Tecnologia Utilizada

- **Frontend**: React 19, TypeScript 5, Vite 8, Tailwind CSS v4
- **Tipografia**: Cormorant Garamond, EB Garamond, Lora (Estética editorial de livro antigo)
- **Ícones & Animações**: Lucide React, Motion (Framer Motion)
- **Astronomia**: SunCalc (Motor de posições solares e lunares)
- **Servidor / Proxy**: Express (Suporte a ambiente Node.js)

---

## 📂 Estrutura do Projeto

```
├── src/
│   ├── astronomy/       # Integração com SunCalc, catálogo de eclipses, cálculos lunares
│   ├── calendar/        # Gerador do calendário sagrado, lógica de Sábados, motor de festas de Levítico 23
│   ├── chronology/      # Conversor a.C./d.C., modelos de cronologia (Ussher, Rabínico, LXX, Dimenúveis)
│   ├── components/      # Navbar, LanguageSelector, LunarPhaseIcon, Modais, Badges
│   ├── dimenueveis/     # Textos canônicos do Evangelho das Dimenúveis, Árvore de 6 Camadas, Léxico
│   ├── history/         # Linhas do tempo históricas, análise do candidato de Josué 10
│   ├── i18n/            # Traduções (Português & Inglês)
│   ├── screens/         # Telas principais da aplicação:
│   │   ├── TodayScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── SabbathScreen.tsx
│   │   ├── AppointedTimesScreen.tsx
│   │   ├── MoonScreen.tsx
│   │   ├── GreatWeekScreen.tsx
│   │   ├── ChronologyLabScreen.tsx
│   │   ├── ScriptureHistoryScreen.tsx
│   │   ├── DimenueveisScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── TestsScreen.tsx
│   ├── tests/           # Bateria de testes unitários automatizados (13 testes)
│   ├── types/           # Interfaces TypeScript e modelos de domínio
│   ├── App.tsx          # Roteador principal e contêiner de estado
│   ├── main.tsx         # Ponto de entrada da aplicação
│   └── index.css        # Importações do Tailwind CSS e estilos globais
├── index.html           # Ponto de entrada HTML com fontes serifadas do Google Fonts
├── package.json         # Dependências do Node e scripts de build
├── vite.config.ts       # Configuração do bundler Vite
└── LICENSE              # Licença MIT
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- npm, yarn ou pnpm

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Calendario.git
   cd Evangelho-das-Dimenuveis-Calendario
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000`.

---

## 🧪 Bateria de Testes Automatizados

O projeto inclui uma **Suite de Verificação do Motor** dentro do próprio aplicativo (`src/tests/`) que executa 13 testes unitários verificando:

1. **Matemática do Calendário**: $13 \times 28 = 364 + \text{Dia } 0 = 365 \text{ dias}$.
2. **Fronteiras de Mês**: Transições M1 D28 $\rightarrow$ M2 D1 e M13 D28 $\rightarrow$ limiar do Dia Zero.
3. **Unicidade do Dia Zero**: Preservado como Sábado Anual do Dia 0.
4. **Ciclo Semanal Contínuo**: Exatamente 52 Sábados semanais ininterruptos.
5. **Cronologia a.C./d.C.**: Transição 1 a.C. $\rightarrow$ 1 d.C. sem Ano Zero.
6. **Grande Semana Milenar**: Transições do Milênio VI $\rightarrow$ Sábado do Milênio VII.
7. **Precisão Lunar Astronômica**: Exatidão de fase sinódica e iluminação.
8. **Isolamento de Josué 10**: Evento candidato isolado sem distorção forçada do calendário.
9. **Festas de Levítico 23**: 8 festas bíblicas calculadas dinamicamente.
10. **Integridade de Duração de Festas**: Distinção entre Tabernáculos (7d) e Oitavo Dia (1d).
11. **Sobreposição Sábado / Festa**: Detecção de dupla observância.
12. **Diferenciação Anual de Datas**: Conversões gregorianas dinâmicas entre diferentes anos.
13. **Responsividade da Ancoragem Lunar**: Recálculo automático de deslocamentos ao alterar o modo de ancoragem.

Para rodar a verificação de tipos e sintaxe via terminal:
```bash
npm run lint
```

---

## 📦 Build para Produção (Web & Android APK)

### Build Web
Para gerar os arquivos otimizados de produção (`dist/`):
```bash
npm run build
```

Para visualizar a versão de produção localmente:
```bash
npm run preview
```

### 📱 Geração Automática do Android APK (GitHub Actions)
O projeto inclui uma estrutura nativa Android para o aplicativo **Calendário Dimenuvel** em `/android` (Gradle 8.7, AGP 8.5.2, Java 17, Android SDK 34, `WebViewAssetLoader`, ícone do número 13 sobre espiral arco-íris) e um workflow automatizado em `.github/workflows/android-apk.yml`.

Ao enviar código para a branch `main`/`master` (ou acionar manualmente em **Actions → Build Android APK → Run workflow** no GitHub):
1. O GitHub Actions instala o Node.js 22, compila o aplicativo Vite (`npm run build`) e sincroniza o bundle em `android/app/src/main/assets/public/`.
2. Configura automaticamente o **Java JDK 17 (Temurin)**, **Android SDK 34** e **Gradle 8.7**, baixando todas as dependências Maven/Gradle na nuvem.
3. Gera e assina os arquivos sincronizados com a versão do rodapé (`v1.1`):
   - `Calendario-Dimenuvel-v1.1-release.apk` (Artifact: `Calendario-Dimenuvel-v1.1-release-apk` — APK Release assinado pronto para instalação)
   - `Calendario-Dimenuvel-v1.1-debug.apk` (Artifact: `Calendario-Dimenuvel-v1.1-debug-apk` — APK Debug)
4. Disponibiliza ambos os APKs para download direto na seção **Artifacts** da execução do workflow no GitHub.

---

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT** — consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
