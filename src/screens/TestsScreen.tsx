/**
 * @file src/screens/TestsScreen.tsx
 * Book-like verification page for executing and inspecting calendar & feast engine unit tests.
 */

import React, { useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { runCalendarEngineTests, TestResult } from '../tests/calendarTests';
import { runFeastEngineTests } from '../tests/feastTests';
import { Play } from 'lucide-react';

interface TestsScreenProps {
  language: Language;
}

export const TestsScreen: React.FC<TestsScreenProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const [testResults, setTestResults] = useState<TestResult[]>(() => [
    ...runCalendarEngineTests(language),
    ...runFeastEngineTests(language),
  ]);

  useEffect(() => {
    setTestResults([
      ...runCalendarEngineTests(language),
      ...runFeastEngineTests(language),
    ]);
  }, [language]);

  const handleReRun = () => {
    setTestResults([
      ...runCalendarEngineTests(language),
      ...runFeastEngineTests(language),
    ]);
  };

  const totalPassed = testResults.filter((test) => test.passed).length;
  const totalTests = testResults.length;
  const allPassed = totalPassed === totalTests;

  return (
    <div className="space-y-6">
      {/* Header & Execution Bar */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3.5 p-4 sm:p-5 bg-slate-900/60">
          <div>
            <div className="text-xs font-serif text-emerald-400 uppercase tracking-wider font-semibold whitespace-nowrap">
              {isPt
                ? 'Verificação de Invariantes'
                : 'Invariant Verification'}
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
              {t.tests.heroTitle}
            </h2>
            <p className="text-xs text-slate-300 font-serif italic mt-0.5">
              {t.tests.heroDesc}
            </p>
          </div>

          <button
            onClick={handleReRun}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-serif font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> {t.tests.runButton}
          </button>
        </div>

        {/* Summary Readout */}
        <div className="px-4 sm:px-5 py-3 bg-slate-900/30 flex items-center justify-between gap-2 font-serif text-xs tabular-nums whitespace-nowrap">
          <span className="text-slate-300 italic">{t.tests.summaryTitle}</span>
          <span className={`font-semibold ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPassed}/{totalTests} · {allPassed ? t.tests.allPassed : t.tests.failures}
          </span>
        </div>
      </div>

      {/* Test Result Ledger */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800 font-serif text-xs tabular-nums">
        {testResults.map((testItem, idx) => (
          <div
            key={idx}
            className={`p-4 flex items-start justify-between gap-4 ${
              testItem.passed ? 'hover:bg-slate-900/40' : 'bg-rose-950/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-slate-400 italic w-6 shrink-0">
                {idx + 1}.
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-bold text-slate-100">
                  {testItem.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{testItem.message}</p>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 text-xs font-serif font-semibold shrink-0 ${
                testItem.passed
                  ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/30'
                  : 'text-rose-400 bg-rose-950/30 border border-rose-500/30'
              }`}
            >
              {testItem.passed ? t.tests.passedLabel : t.tests.failedLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
