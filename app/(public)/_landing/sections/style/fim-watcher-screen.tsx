'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  ArrowUpRight,
  Eye,
  FileCode,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface WatchedFile {
  path: string;
  mask: string;
  sha256: string;
  status: 'PROTECTED' | 'TAMPER_BLOCKED';
  lastChecked: string;
}

const INITIAL_WATCHED_FILES: WatchedFile[] = [
  {
    path: '/var/www/html/.env',
    mask: 'IN_MODIFY | IN_ATTRIB | IN_DELETE',
    sha256: '9a3f81e289bf656a1b0292bc80436d40f5f9038d7281f6d33802901a8ef1a72d',
    status: 'PROTECTED',
    lastChecked: 'Active (kernel hook)',
  },
  {
    path: '/var/www/html/wp-config.php',
    mask: 'IN_MODIFY | IN_ATTRIB',
    sha256: 'd41d8cd98f00b204e9800998ecf8427e3692a71d79860b73c4e9d5622a49219b',
    status: 'PROTECTED',
    lastChecked: 'Active (kernel hook)',
  },
  {
    path: '/etc/nginx/nginx.conf',
    mask: 'IN_MODIFY | IN_CREATE',
    sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    status: 'PROTECTED',
    lastChecked: 'Active (kernel hook)',
  },
  {
    path: '/etc/shadow',
    mask: 'IN_ACCESS | IN_ATTRIB',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    status: 'PROTECTED',
    lastChecked: 'Active (kernel hook)',
  },
];

export function FimWatcherScreen() {
  const [files, setFiles] = React.useState<WatchedFile[]>(INITIAL_WATCHED_FILES);
  const [tamperAlert, setTamperAlert] = React.useState<string | null>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [tamperCount, setTamperCount] = React.useState(382);

  const handleSimulateTamper = () => {
    setIsSimulating(true);
    setTamperCount((prev) => prev + 1);

    // Update .env status temporarily to show instantaneous reaction
    setFiles((prev) =>
      prev.map((f) => (f.path.includes('.env') ? { ...f, status: 'TAMPER_BLOCKED' } : f)),
    );
    setTamperAlert(
      '[TAMPER DETECTED] Unauthorized IN_MODIFY on /var/www/html/.env -> Hash mismatch detected! Rollback completed in 3.4ms from immutable in-memory ledger.',
    );

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => (f.path.includes('.env') ? { ...f, status: 'PROTECTED' } : f)),
      );
      setIsSimulating(false);
    }, 1800);
  };

  return (
    <div className="flex h-full w-full flex-col bg-lp-paper font-mono text-lp-ink select-none overflow-y-auto">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between border-b border-lp-line-strong bg-lp-paper-2 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="font-bold tracking-wider text-lp-ink">FIM WATCHER</span>
          <span className="border border-lp-line bg-lp-paper px-1.5 py-0.5 text-[10px] text-lp-ink/70">
            LINUX INOTIFY REALTIME
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-lp-ink/70">
          <span>
            AUTO-RESTORES:{' '}
            <strong className="text-cyan-600 dark:text-cyan-400 font-bold tabular-nums">
              {tamperCount.toLocaleString()}
            </strong>
          </span>
          <span className="hidden sm:inline">
            REACTION: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">&lt; 3.5ms ROLLBACK</strong>
          </span>
          <button
            type="button"
            onClick={handleSimulateTamper}
            disabled={isSimulating}
            className="flex items-center gap-1 border border-lp-line-strong bg-lp-yellow text-lp-on-yellow hover:bg-lp-ink hover:text-lp-paper px-2 py-0.5 text-[10px] font-bold active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className={`size-3 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'RESTORING...' : 'TEST .ENV TAMPER'}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col gap-3 p-3 text-xs overflow-y-auto">
        {/* Banner Alert when Tamper is Simulated */}
        {tamperAlert && (
          <div className="border border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 p-2 text-[10px] flex items-start gap-2 animate-in fade-in">
            <AlertOctagon className="size-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-bold">{tamperAlert}</div>
          </div>
        )}

        {/* Monitored Critical Files */}
        <div className="flex-1 border border-lp-line-strong bg-lp-paper overflow-hidden flex flex-col">
          <div className="border-b border-lp-line-strong bg-lp-paper-2 px-3 py-1.5 text-[10px] font-bold text-lp-ink flex items-center justify-between">
            <span>PROTECTED CRITICAL TARGETS (INOTIFY DIRECTORY &amp; FILE HOOKS)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">ENFORCING HASH IMMUTABILITY</span>
          </div>

          <div className="divide-y divide-lp-line overflow-y-auto">
            {files.map((file) => {
              const isTampered = file.status === 'TAMPER_BLOCKED';
              return (
                <div
                  key={file.path}
                  className={`flex flex-col gap-1 p-2.5 transition-colors ${
                    isTampered ? 'bg-red-500/10' : 'hover:bg-lp-paper-2'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 font-bold text-lp-ink">
                      <FileCode className="size-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{file.path}</span>
                    </div>
                    <span
                      className={`flex items-center gap-1 border px-1.5 py-0.5 text-[10px] font-bold ${
                        isTampered
                          ? 'border-red-500/40 bg-red-500/20 text-red-700 dark:text-red-300'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      <ShieldCheck className="size-3" />
                      {file.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[9px] text-lp-ink/60">
                    <span className="font-mono text-lp-ink/70">EVENT MASK: {file.mask}</span>
                    <span className="font-mono truncate max-w-[260px] text-lp-ink/50">
                      SHA256: {file.sha256}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{file.lastChecked}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Inotify Audit Stream */}
        <div className="border border-lp-line bg-lp-paper-2 p-2 font-mono text-[10px] text-lp-ink/80">
          <div className="text-cyan-600 dark:text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
            <Eye className="size-3" />
            <span>INOTIFY IMMUTABLE AUDIT TRAIL:</span>
          </div>
          <div className="space-y-0.5 text-[9px]">
            <div>
              [SYS] Sentinel inotify listener registered on epoll queue (fd: 12, flags: 0x800).
            </div>
            <div>
              [WATCH] Monitoring 4 descriptors. Kernel dirty page flush interval: 0ms (SYNC_DIRECT).
            </div>
            <div>
              [LEDGER] In-memory immutable hash table verified: SHA256 integrity 100% matched.
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex items-center justify-between border-t border-lp-line-strong pt-2 text-[11px] text-lp-ink/70">
          <span>Real-time inotify file integrity monitor guarding .env and webroots:</span>
          <Link
            href="/docs/pasax-sentinel/features/fim-realtime"
            className="inline-flex items-center gap-1 font-bold text-lp-ink hover:underline hover:text-cyan-600 dark:hover:text-cyan-400"
          >
            <span>FIM Feature Docs</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
