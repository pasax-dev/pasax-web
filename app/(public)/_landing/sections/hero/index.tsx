import Link from 'next/link';
import { asMarkdown } from 'fumadocs-core/server';
import { ArrowUpRight } from 'lucide-react';
import { command, copy, frameworks, plain } from '../../content';
import { Command } from '../../ui/command';
import { block, url } from '../../markdown';
import { Figure } from '../../ui/figure';
import { Glitch } from './glitch';
import { Stage } from './stage';

const invert =
  'transition-none hover:bg-lp-ink hover:text-lp-paper focus-visible:bg-lp-ink focus-visible:text-lp-paper focus-visible:outline-none';

/** a screen below the menu: the text and the sky over the horizon, the sky beside the text on
 * desktop and under it on phones */
export function Hero() {
  if (asMarkdown())
    return block`
      # Pasax Suite

      > ${plain(copy.hero.title)}

      ${copy.hero.says.flat().join(' ')}

      - [Get started](${url('/docs')})
      - Install: \`${command}\`
      - Runs on: ${frameworks.map((framework) => `[${framework.name}](${url(framework.href)})`).join(', ')}
      - Threat Radar: [Live Threat Map](${url('/threats-map')})
    `;

  return (
    <Figure
      id="pasax"
      aria-label="Pasax Suite"
      status="ready"
      className="grid min-h-[calc(100svh-var(--lp-menu-h))] grid-rows-[auto_1fr_auto] gap-x-12 px-(--lp-gutter) pb-(--lp-status-h) @container lg:grid-cols-2 lg:grid-rows-[1fr_auto]"
    >
      <div className="py-8 lg:self-center">
        <h1 className="text-[clamp(min(2.5rem,100cqw/7.75),7.2vw,5rem)] leading-tight text-nowrap tracking-tight lg:text-[min(7.2vw,(100cqw-3rem)/15.5,5rem)]">
          Autonomous{' '}
          <span className="text-lp-orange font-medium">
            <Glitch>fleet immunity</Glitch>
          </span>
          ,<br />
          in microseconds.
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/docs"
            className={`inline-flex h-11 items-center justify-center border border-lp-line-strong bg-lp-yellow px-5 font-medium text-lp-on-yellow max-sm:w-full ${invert}`}
          >
            Get started
          </Link>
          <Command command={command} className="max-sm:w-full" />
          <Link
            href="/threats-map"
            className={`-ms-2 inline-flex h-11 items-center gap-1 px-2 font-medium underline decoration-lp-line-strong underline-offset-4 ${invert}`}
          >
            Live Threat Map
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
        <p className="mt-5 text-sm text-lp-ink-2">
          Runs on{' '}
          {frameworks.map((framework, i) => (
            <span key={framework.name}>
              {i > 0 && <> ·&nbsp;</>}
              <Link
                href={framework.href}
                prefetch={false}
                className={`whitespace-nowrap text-lp-ink ${invert}`}
              >
                {framework.name}
              </Link>
            </span>
          ))}
        </p>
      </div>
      <Stage />
      <div
        aria-hidden
        className="relative col-span-full -mx-(--lp-gutter) h-10 border-t border-lp-line-strong"
      >
        <div className="h-1.5 bg-[repeating-linear-gradient(to_right,var(--lp-line-strong)_0_1px,transparent_1px_24px)] bg-position-(--lp-gutter)" />
        <div className="absolute inset-x-0 top-0 h-2.5 bg-[repeating-linear-gradient(to_right,var(--lp-line-strong)_0_1px,transparent_1px_240px)] bg-position-(--lp-gutter)" />
      </div>
    </Figure>
  );
}
