'use client';

import { type CSSProperties } from 'react';
import { DITHER_MASKS } from '../../lib/dither';
import { HORIZON } from './scene';

/**
 * An authentic retro-dithered protective forcefield arc enveloping the moon and mascot.
 * Centered exactly at the moon's coordinates: (left: 50%, bottom: HORIZON * r).
 * Styled with fine 1px vector lines, subtle Bayer dither halftone, and delicate perimeter ticks.
 */
const shieldBox: CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: `calc(var(--r) * ${HORIZON})`,
  width: 'calc(var(--r) * 2.36)',
  height: 'calc(var(--r) * 2.36)',
  transform: 'translate(-50%, 50%)',
  pointerEvents: 'none',
};

const ditherCanopy: CSSProperties = {
  maskImage: DITHER_MASKS[2],
  maskSize: '4px 4px',
};

export function HeroShield() {
  return (
    <div style={shieldBox} className="pointer-events-none select-none overflow-visible">
      <svg
        viewBox="0 0 400 400"
        className="size-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle breathing animation container */}
        <g className="transition-opacity duration-1000">
          {/* Halftone Bayer dithered canopy ring */}
          <path
            d="M 10 200 A 190 190 0 0 1 390 200 L 376 200 A 176 176 0 0 0 24 200 Z"
            fill="currentColor"
            style={ditherCanopy}
            className="text-lp-orange/30 dark:text-lp-yellow/25"
          />

          {/* Primary perimeter defense arc (1.5px dashed stipple line) */}
          <path
            d="M 10 200 A 190 190 0 0 1 390 200"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeDasharray="8 6"
            className="text-lp-line-strong"
          />

          {/* Inner concentric boundary arc */}
          <path
            d="M 24 200 A 176 176 0 0 1 376 200"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="2 4"
            className="text-lp-line opacity-70"
          />

          {/* Outer fine radar limit ring */}
          <path
            d="M 2 200 A 198 198 0 0 1 398 200"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="1 10"
            className="text-lp-line opacity-40"
          />

          {/* Tactical perimeter ticks at 30 deg, 60 deg, 90 deg, 120 deg, 150 deg */}
          {/* 90 deg (Zenith - directly above crown) */}
          <line x1="200" y1="2" x2="200" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-lp-orange dark:text-lp-yellow" />
          {/* 60 deg */}
          <line x1="295" y1="35" x2="289" y2="45" stroke="currentColor" strokeWidth="1" className="text-lp-line-strong" />
          {/* 120 deg */}
          <line x1="105" y1="35" x2="111" y2="45" stroke="currentColor" strokeWidth="1" className="text-lp-line-strong" />
          {/* 30 deg */}
          <line x1="365" y1="105" x2="355" y2="111" stroke="currentColor" strokeWidth="1" className="text-lp-line-strong" />
          {/* 150 deg */}
          <line x1="35" y1="105" x2="45" y2="111" stroke="currentColor" strokeWidth="1" className="text-lp-line-strong" />

          {/* Horizon endpoints: anchor brackets */}
          <path d="M 6 200 L 14 200" stroke="currentColor" strokeWidth="2" className="text-lp-ink" />
          <path d="M 386 200 L 394 200" stroke="currentColor" strokeWidth="2" className="text-lp-ink" />

          {/* Intercept blip dots on the perimeter arc */}
          <circle cx="105" cy="45" r="2" fill="currentColor" className="text-lp-orange dark:text-lp-yellow animate-pulse [animation-duration:3s]" />
          <circle cx="289" cy="45" r="2" fill="currentColor" className="text-lp-orange dark:text-lp-yellow animate-pulse [animation-duration:2.4s]" />
        </g>
      </svg>
    </div>
  );
}
