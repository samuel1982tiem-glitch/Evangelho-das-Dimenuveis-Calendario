/**
 * @file src/components/LunarPhaseIcon.tsx
 * Precision SVG moon phase renderer for the 8 defined astronomical lunar phases
 * (New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent).
 */

import React, { useId } from 'react';

interface LunarPhaseIconProps {
  fraction: number; // 0 to 1
  phaseName: string;
  size?: number;
  className?: string;
  showBadge?: boolean;
}

export const LunarPhaseIcon: React.FC<LunarPhaseIconProps> = React.memo(({
  fraction,
  phaseName,
  size = 32,
  className = '',
  showBadge = false,
}) => {
  const uid = useId();
  const illumPct = Math.round(fraction * 100);
  const isCompact = size <= 22;

  // Classify phase type based on phaseName
  const isNew = phaseName === 'New Moon';
  const isFull = phaseName === 'Full Moon';
  const isWaxing = phaseName.includes('Waxing') || phaseName === 'First Quarter';
  const isWaning = phaseName.includes('Waning') || phaseName === 'Last Quarter';

  // Calculate SVG arc path for intermediate phase shapes
  const R = 46; // Radius inside 100x100 viewBox
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  const rx = Math.max(0.1, Math.abs(1 - 2 * clampedFraction) * R);

  let illuminatedPath = '';

  if (!isNew && !isFull) {
    if (isWaxing) {
      if (clampedFraction <= 0.5) {
        // Waxing Crescent: Right arc, inner arc bends right
        illuminatedPath = `M 50 4 A ${R} ${R} 0 0 1 50 96 A ${rx.toFixed(2)} ${R} 0 0 0 50 4 Z`;
      } else {
        // Waxing Gibbous: Right arc, inner arc bends left
        illuminatedPath = `M 50 4 A ${R} ${R} 0 0 1 50 96 A ${rx.toFixed(2)} ${R} 0 0 1 50 4 Z`;
      }
    } else if (isWaning) {
      if (clampedFraction <= 0.5) {
        // Waning Crescent: Left arc, inner arc bends left
        illuminatedPath = `M 50 4 A ${R} ${R} 0 0 0 50 96 A ${rx.toFixed(2)} ${R} 0 0 1 50 4 Z`;
      } else {
        // Waning Gibbous: Left arc, inner arc bends right
        illuminatedPath = `M 50 4 A ${R} ${R} 0 0 0 50 96 A ${rx.toFixed(2)} ${R} 0 0 0 50 4 Z`;
      }
    }
  }

  // Fast, filter-free vector path for 364-cell calendar grids
  if (isCompact) {
    return (
      <div
        className={`relative inline-flex items-center shrink-0 ${className}`}
        title={`${phaseName} — ${illumPct}% Illuminated`}
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="select-none shrink-0"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="#0f172a"
            stroke={isNew ? '#d97706' : '#475569'}
            strokeWidth="4"
          />
          {isFull && (
            <circle cx="50" cy="50" r="45" fill="#fde047" stroke="#fef08a" strokeWidth="2" />
          )}
          {!isNew && !isFull && illuminatedPath && (
            <path d={illuminatedPath} fill="#fde047" />
          )}
        </svg>
      </div>
    );
  }

  // Visual Category color for badges / glows
  const categoryColor = isNew
    ? 'text-purple-300 bg-purple-950/80 border-purple-500/40'
    : isFull
    ? 'text-amber-300 bg-amber-950/80 border-amber-500/40'
    : isWaxing
    ? 'text-blue-300 bg-blue-950/80 border-blue-500/40'
    : 'text-indigo-300 bg-indigo-950/80 border-indigo-500/40';

  const newGlowId = `newMoonGlow-${uid}`;
  const fullLightId = `fullMoonLight-${uid}`;
  const darkBaseId = `darkMoonBase-${uid}`;

  return (
    <div
      className={`relative inline-flex items-center gap-1.5 shrink-0 ${className}`}
      title={`${phaseName} — ${illumPct}% Illuminated`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible select-none shrink-0"
      >
        <defs>
          {/* New Moon Celestial Ring Glow */}
          <radialGradient id={newGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#0b101f" />
            <stop offset="95%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
          </radialGradient>

          {/* Full Moon Surface Texture Gradient */}
          <radialGradient id={fullLightId} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>

          {/* Dark Disc Base Gradient */}
          <radialGradient id={darkBaseId} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </radialGradient>
        </defs>

        {/* Outer Halo Rim for New Moon */}
        {isNew && (
          <circle cx="50" cy="50" r="48" fill={`url(#${newGlowId})`} stroke="#d97706" strokeWidth="1.5" strokeOpacity="0.6" />
        )}

        {/* Base Dark Moon Sphere */}
        <circle cx="50" cy="50" r="46" fill={`url(#${darkBaseId})`} stroke="#334155" strokeWidth="1.5" />

        {/* Surface Crater Accents on Dark Side */}
        <circle cx="32" cy="38" r="7" fill="#0f172a" opacity="0.4" />
        <circle cx="60" cy="65" r="9" fill="#0f172a" opacity="0.35" />
        <circle cx="68" cy="35" r="5" fill="#0f172a" opacity="0.3" />

        {/* Full Moon Circle */}
        {isFull && (
          <g>
            <circle cx="50" cy="50" r="46" fill={`url(#${fullLightId})`} stroke="#fef08a" strokeWidth="1" />
            {/* Lunar Maria (Crater spots) */}
            <circle cx="38" cy="35" r="8" fill="#ca8a04" opacity="0.18" />
            <circle cx="60" cy="55" r="10" fill="#ca8a04" opacity="0.22" />
            <circle cx="48" cy="68" r="6" fill="#ca8a04" opacity="0.15" />
          </g>
        )}

        {/* Intermediate Phase Path (Crescent, Quarter, Gibbous) */}
        {!isNew && !isFull && illuminatedPath && (
          <g>
            <path d={illuminatedPath} fill={`url(#${fullLightId})`} stroke="#fef08a" strokeWidth="0.5" />
          </g>
        )}
      </svg>

      {/* Optional Phase Name Badge */}
      {showBadge && (
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] font-mono-code font-bold uppercase ${categoryColor}`}
        >
          {phaseName}
        </span>
      )}
    </div>
  );
});
