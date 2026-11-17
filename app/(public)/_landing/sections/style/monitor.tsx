'use client';
import { type KeyboardEvent, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { copy } from '../../content';
import { type LayoutId, TABS, type TabId, type ThemeId } from './data';
import type { InkTable } from './presets';
import { STRIPES } from '../../ui/window';
import { ThreatRadarScreen } from './threat-radar-screen';
import { TrinityMeshScreen } from './trinity-mesh-screen';
import { KernelDropScreen } from './kernel-drop-screen';
import { PhpWafScreen } from './php-waf-screen';
import { FimWatcherScreen } from './fim-watcher-screen';

interface MonitorProps {
  table: InkTable;
  tab: TabId;
  layout: LayoutId;
  theme: ThemeId;
  /** the theme goes on at once, without the print */
  instant: boolean;
  busy: boolean;
  onTab: (tab: TabId) => void;
  onBusy: (busy: boolean) => void;
  className?: string;
}

/** the browser: the hands-on tabs are its top edge, the chosen one's live page its screen */
export function Monitor({
  tab,
  layout,
  theme,
  busy,
  onTab,
  onBusy,
  className,
}: MonitorProps) {
  useEffect(() => {
    onBusy(false);
  }, [tab, layout, theme, onBusy]);

  // the arrows move along the tabs, a click or Enter opens one: each opens a page in full
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const from = TABS.indexOf((event.target as HTMLElement).dataset.tab as TabId);
    let to = from;
    if (event.key === 'ArrowRight') to = (from + 1) % TABS.length;
    else if (event.key === 'ArrowLeft') to = (from - 1 + TABS.length) % TABS.length;
    else if (event.key === 'Home') to = 0;
    else if (event.key === 'End') to = TABS.length - 1;
    else return;
    event.preventDefault();
    event.currentTarget.querySelector<HTMLElement>(`[data-tab="${TABS[to]}"]`)?.focus();
  }

  const tabs = [];
  for (const id of TABS) {
    const on = id === tab;
    tabs.push(
      <button
        key={id}
        type="button"
        role="tab"
        id={`style-tab-${id}`}
        data-tab={id}
        aria-selected={on}
        aria-controls="style-panel"
        tabIndex={on ? 0 : -1}
        onClick={() => onTab(id)}
        className={cn(
          'cursor-pointer border-e border-lp-line-strong px-2 text-xs leading-4 font-medium outline-none focus-visible:outline focus-visible:-outline-offset-4 focus-visible:outline-current sm:px-3 transition-colors',
          on ? 'bg-lp-yellow text-lp-on-yellow font-bold' : 'hover:bg-lp-ink hover:text-lp-paper',
        )}
      >
        {copy.style.tabs[id].label}
      </button>,
    );
  }
  const docs = copy.style.tabs[tab];

  // never taller than the screen between the menu and the status bar: the screen gives way
  return (
    <div
      className={cn(
        'flex max-h-[calc(100svh-var(--lp-menu-h)-var(--lp-status-h))] flex-col border border-lp-line-strong bg-lp-paper text-lp-ink',
        className,
      )}
    >
      {/* the stripes give way to the tabs; a browser narrower than them scrolls its bar */}
      <div className="flex h-7 shrink-0 overflow-x-auto border-b border-lp-line-strong scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div role="tablist" aria-label="Hands-on" onKeyDown={onKeyDown} className="flex shrink-0">
          {tabs}
        </div>
        <span aria-hidden className={`min-w-0 flex-1 ${STRIPES}`} />
        <span className="flex shrink-0 items-center px-1.5">
          {busy ? (
            <span className="animate-[spin_500ms_linear_infinite] motion-reduce:animate-none">
              <svg aria-hidden viewBox="-7 -7 14 14" className="block size-3.5">
                <circle r="6.5" className="fill-lp-paper stroke-lp-ink" />
                <path d="M-6.5 0a6.5 6.5 0 0 0 13 0z" className="fill-lp-ink" />
              </svg>
            </span>
          ) : (
            <a
              href={docs.href}
              aria-label={`${docs.label} docs`}
              className="relative flex size-3.5 items-center justify-center bg-lp-paper text-lp-ink transition-none after:absolute after:-inset-1.25 hover:bg-lp-ink hover:text-lp-paper focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-lp-ink"
            >
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          )}
        </span>
      </div>
      {/* a monitor's screen: a desktop's, 4:3 beside the pickers, a phone's on a phone; the frame
          fits whatever box it is given */}
      <div
        role="tabpanel"
        id="style-panel"
        aria-labelledby={`style-tab-${tab}`}
        className="bg-radial from-lp-line-strong from-[0.75px] to-transparent to-[0.75px] bg-size-[12px_12px] relative aspect-10/16 min-h-0 overflow-hidden bg-lp-paper text-lp-ink sm:aspect-16/10 xl:aspect-4/3"
      >
        {tab === 'layouts' && (
          <div className="absolute inset-0 z-20 overflow-hidden bg-lp-paper text-lp-ink">
            <TrinityMeshScreen />
          </div>
        )}
        {tab === 'story' && (
          <div className="absolute inset-0 z-20 overflow-hidden bg-lp-paper text-lp-ink">
            <KernelDropScreen />
          </div>
        )}
        {tab === 'openapi' && (
          <div className="absolute inset-0 z-20 overflow-hidden bg-lp-paper text-lp-ink">
            <PhpWafScreen />
          </div>
        )}
        {tab === 'graphql' && (
          <div className="absolute inset-0 z-20 overflow-hidden bg-lp-paper text-lp-ink">
            <ThreatRadarScreen />
          </div>
        )}
        {tab === 'asyncapi' && (
          <div className="absolute inset-0 z-20 overflow-hidden bg-lp-paper text-lp-ink">
            <FimWatcherScreen />
          </div>
        )}
      </div>
    </div>
  );
}
