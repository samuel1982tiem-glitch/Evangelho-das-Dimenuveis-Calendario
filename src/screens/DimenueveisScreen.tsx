/**
 * @file src/screens/DimenueveisScreen.tsx
 * Book-like Gospel of Dimenuous / Evangelho das Dimenúveis Canonical Architecture,
 * Immutable Text Viewer, 6-Layer Time Tree, and Terminology Lexicon.
 */

import React, { useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getLocalizedCanonicalSections } from '../dimenueveis/canonical';
import { getLocalizedLexicon } from '../dimenueveis/terminology';
import { getLocalizedTimeTree } from '../dimenueveis/timeArchitecture';

interface DimenueveisScreenProps {
  language: Language;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const DimenueveisScreen: React.FC<DimenueveisScreenProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const [activeTab, setActiveTab] = useState<'TREE' | 'CANONICAL_TEXT' | 'LEXICON'>('TREE');

  const canonicalSections = getLocalizedCanonicalSections(language);
  const timeTree = getLocalizedTimeTree(language);
  const lexicon = getLocalizedLexicon(language);

  const [selectedSectionId, setSelectedSectionId] = useState(canonicalSections[0].id);
  const selectedSection = canonicalSections.find((s) => s.id === selectedSectionId) || canonicalSections[0];

  useEffect(() => {
    if (!canonicalSections.some((s) => s.id === selectedSectionId)) {
      setSelectedSectionId(canonicalSections[0].id);
    }
  }, [language, canonicalSections, selectedSectionId]);

  const translateLayerTag = (layer: string) => {
    if (!isPt) return layer;
    const map: Record<string, string> = {
      DIMENUEVEIS: 'Dimenúveis',
      SACRED: 'Sagrada',
      MILLENNIAL: 'Milenar',
      CELESTIAL: 'Celestial',
    };
    return map[layer] || layer;
  };

  return (
    <div className="space-y-6">
      {/* Book Header & Sub-Navigation Strip */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800">
        <div className="p-4 sm:p-5 bg-slate-900/60 space-y-1.5">
          <div className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold whitespace-nowrap">
            {isPt
              ? 'Repositório Canônico · Texto Integral'
              : 'Canonical Repository · Unaltered Text'}
          </div>
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 whitespace-nowrap">
            {t.dimenueveis.heroTitle}
          </h2>
          <p className="text-xs text-slate-300 font-serif italic">
            {t.dimenueveis.subtitle}
          </p>
        </div>

        <div className="px-4 sm:px-5 py-3 bg-amber-950/15 text-xs font-serif italic text-amber-300">
          {t.dimenueveis.integrityProtocol}
        </div>

        {/* Book Chapter Sub-Tab Bar */}
        <div className="grid grid-cols-3 border-t border-slate-800 divide-x divide-slate-800 bg-slate-950 text-xs font-serif">
          {[
            { id: 'TREE', roman: 'I', label: t.dimenueveis.treeTab },
            { id: 'CANONICAL_TEXT', roman: 'II', label: t.dimenueveis.viewerTab },
            { id: 'LEXICON', roman: 'III', label: t.dimenueveis.lexiconTab },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2 sm:px-5 py-3 text-[11px] sm:text-xs font-semibold text-center transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              {tab.roman}. {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB I: 6-LAYER TIME TREE */}
      {activeTab === 'TREE' && (
        <div className="border border-slate-800 bg-slate-950">
          <div className="px-4 sm:px-5 py-3 bg-slate-900/50 border-b border-slate-800 text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
            {t.dimenueveis.timeTreeTitle}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {timeTree.map((layer) => (
              <div
                key={layer.id}
                className="p-4 sm:p-5 border-b border-slate-800 space-y-3.5 bg-slate-950"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-base font-serif font-bold text-slate-100 whitespace-nowrap">
                    {layer.name}
                  </h4>
                  <span className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: layer.color }} />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{layer.description}</p>

                <div className="divide-y divide-slate-800 border border-slate-800 bg-slate-900/30">
                  {layer.children.map((child, idx) => (
                    <div key={idx} className="p-3 text-xs space-y-1">
                      <strong className="text-slate-100 font-serif text-xs block whitespace-nowrap">{child.name}</strong>
                      <p className="text-xs text-slate-300 leading-relaxed">{child.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB II: CANONICAL GOSPEL VIEWER */}
      {activeTab === 'CANONICAL_TEXT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-slate-800 bg-slate-950 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Section Selector Sidebar */}
          <div className="lg:col-span-4 divide-y divide-slate-800">
            <div className="px-4 sm:px-5 py-3 bg-slate-900/50 text-xs font-serif text-slate-300 uppercase tracking-wider font-semibold whitespace-nowrap">
              {t.dimenueveis.indexTitle}
            </div>

            {canonicalSections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`w-full px-4 sm:px-5 py-3.5 text-left transition-colors flex items-center justify-between text-xs font-serif cursor-pointer ${
                  selectedSection.id === sec.id
                    ? 'bg-amber-950/30 text-amber-300 font-semibold'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900/50'
                }`}
              >
                <span className="whitespace-nowrap pr-2">{ROMAN_NUMERALS[idx] || idx + 1}. {sec.title}</span>
                <span className="shrink-0">→</span>
              </button>
            ))}
          </div>

          {/* Book Reading Pane */}
          <div className="lg:col-span-8 divide-y divide-slate-800">
            <div className="p-4 sm:p-5 bg-slate-900/40 space-y-1">
              <span className="text-xs font-serif italic text-amber-400 font-semibold whitespace-nowrap block">
                {t.dimenueveis.timeLayer}: {translateLayerTag(selectedSection.layer)}
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-100 whitespace-nowrap">
                {selectedSection.title}
              </h3>
            </div>

            <div className="p-5 sm:p-6 bg-slate-950 text-base text-slate-100 leading-relaxed whitespace-pre-line font-serif max-w-prose">
              {selectedSection.canonicalText}
            </div>

            <div className="p-4 sm:p-5 bg-slate-900/20 space-y-2">
              <h4 className="text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold whitespace-nowrap">
                {t.dimenueveis.annotationsTitle}
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-200 font-serif italic">
                {selectedSection.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB III: CANONICAL LEXICON */}
      {activeTab === 'LEXICON' && (
        <div className="border border-slate-800 bg-slate-950">
          <div className="px-4 sm:px-5 py-3 bg-slate-900/50 border-b border-slate-800 text-xs font-serif font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
            {t.dimenueveis.lexiconTitle}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {lexicon.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-5 border-b border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2 whitespace-nowrap">
                  <h4 className="text-base font-serif font-bold text-amber-300">{item.term}</h4>
                  <span className="text-xs font-serif italic text-slate-300">
                    ({item.category})
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{item.definition}</p>
                <p className="text-xs font-serif italic text-slate-400 pt-1.5 border-t border-slate-800/80 whitespace-nowrap">
                  {t.dimenueveis.sourceLabel} {item.dimenueveisReference}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
