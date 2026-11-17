'use client';
import { type CSSProperties, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import { Chip } from '../../ui/chip';
import { createHero, SKY } from './engine';
import { HeroShield } from './shield';
import { REACH, SATELLITES } from './scene';

/** on phones the sky is as tall as the drawing at its width; beside the text it takes the row */
const sky = { '--fit': `calc(100cqw * ${SKY / (2 * REACH)})` } as CSSProperties;

const scene = { '--feet': '0px' } as CSSProperties;

/** the drawing's box, `REACH` either side of the moon's centre and `SKY` high */
const drawing: CSSProperties = {
  width: `calc(var(--r) * ${2 * REACH})`,
  height: `calc(var(--r) * ${SKY})`,
};

/** the sky over the horizon, its canvas the stars and the moon with its orbital cybersecurity satellites;
 * enveloped by the retro-dithered vector shield */
export function Stage() {
  const reduced = useReducedMotion() === true;
  const ref = useCallback(
    (stage: HTMLDivElement | null) => (stage ? createHero(stage, reduced) : undefined),
    [reduced],
  );

  return (
    <div
      ref={ref}
      style={sky}
      className="pointer-events-none relative overflow-clip max-lg:min-h-(--fit)"
    >
      <div style={scene} className="absolute inset-0 flex items-end justify-center">
        <canvas aria-hidden className="absolute inset-0 size-full" />
        <div style={drawing} className="relative">
          <HeroShield />
        </div>
        {SATELLITES.map((s) => (
          <Chip
            key={s.label}
            layer={s.layer}
            data-satellite
            data-state="off"
            className="pointer-events-auto absolute top-0 left-0 select-text data-[state=off]:invisible data-[state=pop]:bg-lp-ink data-[state=pop]:text-lp-paper"
          >
            {s.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
