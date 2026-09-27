/**
 * @file src/screens/DimenueveisScreen.tsx
 * Biblical Repository, 6-Layer Time Architecture Tree, and Terminology Lexicon
 * formatted as a classical reference index with responsive, non-overflowing containers.
 */

import React, { useState } from 'react';
import { getLocalizedTimeTree } from '../dimenueveis/timeArchitecture';
import { getLocalizedCanonicalSections } from '../dimenueveis/canonical';
import { getLocalizedLexicon } from '../dimenueveis/terminology';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface DimenueveisScreenProps {
  language: Language;
}

export const DimenueveisScreen: React.FC<DimenueveisScreenProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';
  const [activeSubTab, setActiveSubTab] = useState<'TREE' | 'VIEWER' | 'LEXICON'>('TREE');

  const timeTree = getLocalizedTimeTree(language);
  const canonicalSections = getLocalizedCanonicalSections(language);
  const lexicon = getLocalizedLexicon(language);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    canonicalSections[0]?.id || 'dimenueveis-prologue'
  );

  const activeSection =
    canonicalSections.find((s) => s.id === selectedSectionId) || canonicalSections[0];

  const getStatusLabel = (status: string) => {
    if (isPt) {
      if (status === 'Active' || status === 'Ativo') return 'Ativo';
      if (status === 'Planned' || status === 'Planejado') return 'Planejado';
      if (status === 'Future' || status === 'Futuro') return 'Futuro';
    } else {
      if (status === 'Ativo' || status === 'Active') return 'Active';
      if (status === 'Planejado' || status === 'Planned') return 'Planned';
      if (status === 'Futuro' || status === 'Future') return 'Future';
    }
    return status;
  };

  const getLayerLabel = (layer: string) => {
    if (layer === 'DIMENUEVEIS') return isPt ? 'DIMENÚVEIS' : 'DIMENUOUS';
    if (layer === 'SACRED') return isPt ? 'SAGRADO' : 'SACRED';
    if (layer === 'MILLENNIAL') return isPt ? 'MILENAR' : 'MILLENNIAL';
    if (layer === 'CELESTIAL') return 'CELESTIAL';
    if (layer === 'BIBLICAL') return isPt ? 'BÍBLICO' : 'BIBLICAL';
    if (layer === 'HISTORICAL') return isPt ? 'HISTÓRICO' : 'HISTORICAL';
    return layer;
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Header & Section Selector */}
      <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-900/60 space-y-1.5 min-w-0">
          <div className="text-[11px] sm:text-xs font-serif text-amber-400 uppercase tracking-wider font-semibold break-words leading-snug">
            {isPt
              ? 'Repositório Bíblico · Fundamentos Escriturísticos'
              : 'Biblical Repository · Scriptural Foundations'}
          </div>
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-100 break-words leading-snug">
            {t.dimenueveis.heroTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-serif italic break-words leading-relaxed">
            {t.dimenueveis.subtitle}
          </p>
        </div>

        {/* Scriptural Foundation Note */}
        <div className="px-4 sm:px-5 py-3 bg-amber-950/15 text-xs font-serif text-slate-200 leading-relaxed break-words">
          <strong className="text-amber-400 uppercase tracking-wider mr-1.5">
            {isPt ? 'Nota Editorial:' : 'Editorial Note:'}
          </strong>
          {t.dimenueveis.integrityProtocol}
        </div>

        {/* 3-Tab Index Selector */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 bg-slate-950">
          {[
            { id: 'TREE', roman: 'I', label: t.dimenueveis.treeTab },
            { id: 'VIEWER', roman: 'II', label: t.dimenueveis.viewerTab },
            { id: 'LEXICON', roman: 'III', label: t.dimenueveis.lexiconTab },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as 'TREE' | 'VIEWER' | 'LEXICON')}
              className={`px-2 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm font-serif text-center transition-colors cursor-pointer min-w-0 break-words leading-tight flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <span className="italic shrink-0">{tab.roman}.</span>
              <span className="break-words">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB I: 6-LAYER TIME ARCHITECTURE TREE */}
      {activeSubTab === 'TREE' && (
        <div className="border border-slate-800 bg-slate-950 p-4 sm:p-6 overflow-hidden">
          <h3 className="text-sm sm:text-base font-serif font-bold text-slate-100 uppercase tracking-wider mb-5 pb-3 border-b border-slate-800 break-words leading-snug">
            {t.dimenueveis.timeTreeTitle}
          </h3>

          <div className="space-y-4">
            {timeTree.map((node, index) => (
              <div
                key={node.id}
                className="border border-slate-800 bg-slate-900/25 p-4 sm:p-5 overflow-hidden"
                style={{ borderLeftWidth: '3px', borderLeftColor: node.color }}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3 mb-3 pb-2 border-b border-slate-800/80 min-w-0">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-serif italic font-bold text-amber-400 text-sm shrink-0">
                      {index + 1}.
                    </span>
                    <h4
                      className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider break-words leading-snug"
                      style={{ color: node.color }}
                    >
                      {node.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 font-serif italic break-words leading-relaxed">
                    {node.description}
                  </p>
                </div>

                {node.children && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {node.children.map((child, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 border border-slate-800 flex flex-col justify-between gap-1.5 min-w-0 overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-2 min-w-0">
                          <span className="text-xs font-serif font-bold text-slate-100 break-words leading-snug">
                            {child.name}
                          </span>
                          <span className="text-[10.5px] sm:text-xs font-serif italic text-amber-400 font-semibold shrink-0">
                            {getStatusLabel(child.status)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed break-words">
                          {child.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB II: BIBLICAL TEXTS VIEWER */}
      {activeSubTab === 'VIEWER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-slate-800 bg-slate-950 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-hidden">
          {/* Left Index */}
          <div className="lg:col-span-4 divide-y divide-slate-800 min-w-0">
            <div className="p-4 bg-slate-900/60 min-w-0">
              <h3 className="text-xs font-serif font-bold text-slate-100 uppercase tracking-wider break-words leading-snug">
                {t.dimenueveis.indexTitle}
              </h3>
            </div>
            <div className="divide-y divide-slate-800">
              {canonicalSections.map((sec) => {
                const isSelected = selectedSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer min-w-0 overflow-hidden ${
                      isSelected
                        ? 'bg-amber-950/25 text-amber-200 border-l-2 border-l-amber-400'
                        : 'bg-slate-950 text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-serif font-semibold leading-snug break-words">
                      {sec.title}
                    </div>
                    <div className="text-[10px] sm:text-xs font-serif italic text-slate-300 mt-1.5 uppercase tracking-wider break-words leading-tight">
                      {t.dimenueveis.timeLayer}: {getLayerLabel(sec.layer)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Biblical Passage & Citations Reader */}
          <div className="lg:col-span-8 p-4 sm:p-8 space-y-6 min-w-0 overflow-hidden">
            <div className="border-b border-slate-800 pb-4 min-w-0">
              <span className="text-xs font-serif uppercase tracking-wider text-amber-400 font-semibold block mb-1.5 break-words leading-snug">
                {t.dimenueveis.timeLayer}: {getLayerLabel(activeSection.layer)}
              </span>
              <h3 className="text-base sm:text-2xl font-serif font-bold text-slate-100 break-words leading-snug">
                {activeSection.title}
              </h3>
            </div>

            {/* Biblical Passage Blockquote */}
            <div className="p-4 sm:p-6 bg-slate-900/40 border-l-2 border-amber-500 text-slate-100 font-serif text-sm sm:text-base leading-relaxed whitespace-pre-line break-words overflow-hidden">
              {activeSection.canonicalText}
            </div>

            {/* Scriptural Citations */}
            <div className="pt-4 border-t border-slate-800 min-w-0">
              <h4 className="text-xs font-serif font-bold text-slate-200 uppercase tracking-wider mb-3 break-words leading-snug">
                {t.dimenueveis.annotationsTitle}
              </h4>
              <ul className="space-y-2.5">
                {activeSection.notes.map((note, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed min-w-0"
                  >
                    <span className="font-serif italic text-amber-400 font-bold shrink-0">
                      [{idx + 1}]
                    </span>
                    <span className="break-words min-w-0 flex-1">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB III: TERMINOLOGY LEXICON */}
      {activeSubTab === 'LEXICON' && (
        <div className="border border-slate-800 bg-slate-950 divide-y divide-slate-800 overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-900/60 min-w-0">
            <h3 className="text-sm sm:text-base font-serif font-bold text-slate-100 uppercase tracking-wider break-words leading-snug">
              {t.dimenueveis.lexiconTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {lexicon.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 border-b border-slate-800 space-y-2.5 flex flex-col justify-between min-w-0 overflow-hidden"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 min-w-0">
                    <h4 className="text-sm sm:text-base font-serif font-bold text-slate-100 break-words leading-snug">
                      {item.term}
                    </h4>
                    <span className="text-[11px] sm:text-xs font-serif text-amber-400 uppercase tracking-wider italic shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                    {item.definition}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-xs font-serif text-slate-300 italic break-words leading-relaxed">
                  <strong className="text-slate-200 not-italic mr-1">
                    {t.dimenueveis.sourceLabel}
                  </strong>
                  <span>{item.dimenueveisReference}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
