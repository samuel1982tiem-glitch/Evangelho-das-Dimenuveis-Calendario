/**
 * @file src/components/LanguageSelector.tsx
 * Simple single-tap flag toggle switching between English ("en") and Portuguese ("pt").
 */

import React from 'react';
import { Language } from '../i18n/translations';

interface LanguageSelectorProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onSelectLanguage,
}) => {
  const toggleLanguage = () => {
    onSelectLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border border-slate-700 bg-slate-900 hover:border-amber-500/60 transition-colors cursor-pointer shrink-0"
      title={language === 'en' ? 'Mudar para Português (BR)' : 'Switch to English (US)'}
      aria-label={language === 'en' ? 'Mudar para Português' : 'Switch to English'}
    >
      {language === 'en' ? (
        /* US Flag SVG */
        <svg className="w-6 h-4 block" viewBox="0 0 36 24" aria-hidden="true">
          <rect width="36" height="24" fill="#b22234" />
          <path d="M0,2.77H36M0,6.46H36M0,10.15H36M0,13.85H36M0,17.54H36M0,21.23H36" stroke="#fff" strokeWidth="1.85" />
          <rect width="15" height="12.92" fill="#3c3b6e" />
          <g fill="#fff">
            <circle cx="2.5" cy="2.2" r="0.8" />
            <circle cx="5.5" cy="2.2" r="0.8" />
            <circle cx="8.5" cy="2.2" r="0.8" />
            <circle cx="11.5" cy="2.2" r="0.8" />
            <circle cx="4" cy="4.3" r="0.8" />
            <circle cx="7" cy="4.3" r="0.8" />
            <circle cx="10" cy="4.3" r="0.8" />
            <circle cx="2.5" cy="6.4" r="0.8" />
            <circle cx="5.5" cy="6.4" r="0.8" />
            <circle cx="8.5" cy="6.4" r="0.8" />
            <circle cx="11.5" cy="6.4" r="0.8" />
            <circle cx="4" cy="8.5" r="0.8" />
            <circle cx="7" cy="8.5" r="0.8" />
            <circle cx="10" cy="8.5" r="0.8" />
            <circle cx="2.5" cy="10.6" r="0.8" />
            <circle cx="5.5" cy="10.6" r="0.8" />
            <circle cx="8.5" cy="10.6" r="0.8" />
            <circle cx="11.5" cy="10.6" r="0.8" />
          </g>
        </svg>
      ) : (
        /* Brazil Flag SVG */
        <svg className="w-6 h-4 block" viewBox="0 0 36 24" aria-hidden="true">
          <rect width="36" height="24" fill="#009b3a" />
          <polygon points="18,2.5 33,12 18,21.5 3,12" fill="#fedf00" />
          <circle cx="18" cy="12" r="5" fill="#002776" />
          <path d="M13.2,10.8 Q18,9.2 22.8,12.5" fill="none" stroke="#fff" strokeWidth="1.1" />
        </svg>
      )}
    </button>
  );
};
