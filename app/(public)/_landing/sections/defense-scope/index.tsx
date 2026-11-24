'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Zap,
  Lock,
  Server,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Globe,
  Database,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Figure, FigureHeader, Status } from '../../ui/figure';
import { CATEGORIES, ProtectionCategory, THREAT_VECTORS, ThreatVector } from './data';

const getCategoryIcon = (category: ThreatVector['category']) => {
  switch (category) {
    case 'web':
      return FileCode2;
    case 'kernel':
      return Zap;
    case 'fim':
      return Lock;
    case 'fleet':
      return Server;
    default:
      return ShieldAlert;
  }
};

const getBadgeStyle = (category: ThreatVector['category']) => {
  switch (category) {
    case 'web':
      return 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400';
    case 'kernel':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'fim':
      return 'border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400';
    case 'fleet':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  }
};

export function DefenseScope() {
  const [activeCategory, setActiveCategory] = React.useState<ProtectionCategory>('all');
  const [viewMode, setViewMode] = React.useState<'grid' | 'matrix'>('grid');

  const filteredVectors = React.useMemo(() => {
    if (activeCategory === 'all') return THREAT_VECTORS;
    return THREAT_VECTORS.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  return (
    <Figure
      id="what-pasax-defends"
      aria-label="What Pasax Defends"
      status={`guarding ${THREAT_VECTORS.length} threat vectors across web, host & fleet`}
      className="pb-20"
    >
      <div className="px-(--lp-gutter) pt-16 pb-10 md:pb-14">
        {/* Header Section */}
        <div className="flex flex-col gap-3">
          <Status>threat vector catalog</Status>
          <FigureHeader
            title={[
              'Apa saja yang ',
              { term: 'ditangani Pasak' },
              ' untuk Anda,\nlintas ',
              { term: 'web, kernel & armada' },
              '.',
            ]}
            className="max-w-4xl! text-balance!"
          />
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-pretty text-lp-ink-2">
            Pasak dirancang khusus untuk membebaskan tim teknis dan pengembang dari beban serangan siber harian.
            Mulai dari injeksi payload aplikasi web, banjir paket DDoS pada level kernel Linux, pencurian berkas{' '}
            <code className="font-mono text-xs font-semibold text-lp-ink">.env</code>, hingga pencegahan server OOM crash
            pada VPS berkapasitas hemat.
          </p>
        </div>

        {/* Tactical Control Bar: Category Filter & View Mode */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-lp-line pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 border px-3 text-xs font-medium transition-none cursor-pointer',
                    isActive
                      ? 'border-lp-line-strong bg-lp-ink text-lp-paper shadow-xs'
                      : 'border-lp-line bg-lp-paper text-lp-ink hover:border-lp-line-strong hover:bg-lp-paper-2',
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.2 font-mono text-[10px]',
                      isActive ? 'bg-lp-paper text-lp-ink font-bold' : 'bg-lp-paper-2 text-lp-ink-2',
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex items-center border border-lp-line bg-lp-paper p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-3 py-1 cursor-pointer transition-none',
                viewMode === 'grid' ? 'bg-lp-ink text-lp-paper font-semibold' : 'text-lp-ink-2 hover:text-lp-ink',
              )}
            >
              Tampilan Kartu
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={cn(
                'px-3 py-1 cursor-pointer transition-none',
                viewMode === 'matrix' ? 'bg-lp-ink text-lp-paper font-semibold' : 'text-lp-ink-2 hover:text-lp-ink',
              )}
            >
              Matriks Komparasi
            </button>
          </div>
        </div>

        {/* VIEW 1: Grid of Threat Cards */}
        {viewMode === 'grid' && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVectors.map((item) => {
              const Icon = getCategoryIcon(item.category);
              const badgeStyle = getBadgeStyle(item.category);

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between border border-lp-line bg-lp-paper p-6 transition-all hover:border-lp-line-strong hover:bg-lp-paper-2"
                >
                  <div>
                    {/* Card Header: Icon, Layer, and Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-9 items-center justify-center border border-lp-line-strong bg-lp-paper text-lp-ink group-hover:bg-lp-ink group-hover:text-lp-paper transition-none">
                        <Icon className="size-4.5" />
                      </div>
                      <span className={cn('rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-tight', badgeStyle)}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Speed Tag */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-lp-orange">
                          {item.layer}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-lp-ink bg-lp-paper-2 border border-lp-line px-1.5 py-0.5">
                          {item.speed}
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold tracking-tight text-lp-ink">
                        {item.title}
                      </h3>
                    </div>

                    {/* Threat Narrative (The Problem) */}
                    <div className="mt-4 border-l-2 border-rose-500/50 bg-rose-500/5 p-3 text-xs leading-relaxed text-lp-ink">
                      <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="size-3" />
                        <span>ANCAMAN TANPA PASAK:</span>
                      </div>
                      <p>{item.threatDescription}</p>
                    </div>

                    {/* Pasax Solution (The Action) */}
                    <div className="mt-3 border-l-2 border-emerald-500/60 bg-emerald-500/5 p-3 text-xs leading-relaxed text-lp-ink">
                      <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        <span>TINDAKAN OTOMATIS PASAK:</span>
                      </div>
                      <p>{item.pasaxSolution}</p>
                    </div>

                    {/* Technical Mechanism */}
                    <div className="mt-3 font-mono text-[11px] text-lp-ink-2">
                      <span className="font-bold text-lp-ink">Mekanisme:</span> {item.technicalMechanism}
                    </div>
                  </div>

                  {/* Card Footer: Documentation Link */}
                  <div className="mt-6 border-t border-lp-line pt-3">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-lp-ink hover:text-lp-orange transition-none"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: Matrix Comparison Table */}
        {viewMode === 'matrix' && (
          <div className="mt-8 overflow-x-auto border border-lp-line-strong bg-lp-paper">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-lp-line-strong bg-lp-paper-2 font-mono text-[11px] font-bold uppercase tracking-wider text-lp-ink">
                <tr>
                  <th className="p-3.5">Vektor Ancaman</th>
                  <th className="p-3.5">Lapis Pertahanan</th>
                  <th className="p-3.5">Kondisi Tanpa Pasak</th>
                  <th className="p-3.5">Penanganan Otomatis Pasak</th>
                  <th className="p-3.5">Latensi Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lp-line">
                {filteredVectors.map((v) => (
                  <tr key={v.id} className="hover:bg-lp-paper-2 transition-none">
                    <td className="p-3.5 font-bold text-lp-ink whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-lp-orange" />
                        <span>{v.title}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-lp-ink-2 whitespace-nowrap">
                      {v.layer}
                    </td>
                    <td className="p-3.5 text-lp-ink-2 min-w-[280px]">
                      {v.threatDescription}
                    </td>
                    <td className="p-3.5 text-lp-ink font-medium min-w-[320px]">
                      <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                        <span>{v.pasaxSolution}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-lp-ink whitespace-nowrap">
                      {v.speed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Highlights: 4 Core Pillars for Users */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-lp-line bg-lp-paper p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-lp-orange">
              <FileCode2 className="size-4" />
              <span>PENGEMBANG LARAVEL & PHP</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-lp-ink-2">
              Tidak perlu lagi memasang puluhan package keamanan terpisah. 13 security middleware siap pakai menangkal SQLi, XSS, dan stepped brute-force login.
            </p>
          </div>

          <div className="border border-lp-line bg-lp-paper p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-lp-orange">
              <Zap className="size-4" />
              <span>PENGELOLA WORDPRESS VPS</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-lp-ink-2">
              Kebal dari serangan xmlrpc.php, brute-force wp-login, dan eksploitasi plugin rentan dengan pemblokiran paket instan di level kernel sebelum menyentuh PHP.
            </p>
          </div>

          <div className="border border-lp-line bg-lp-paper p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-lp-orange">
              <Lock className="size-4" />
              <span>API & DOCKER MICROSERVICES</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-lp-ink-2">
              Meringankan event-loop Node.js dan runtime container dari serangan banjir traffic. Pemantauan berkas .env dan config otomatis tanpa downtime.
            </p>
          </div>

          <div className="border border-lp-line bg-lp-paper p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-lp-orange">
              <Server className="size-4" />
              <span>TIM DEVOPS & FLEET SOC</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-lp-ink-2">
              Satu server diserang, seluruh armada terlindungi otomatis via Crowd Defense Blocklist sync. Beban memori hemat (&lt; 18MB RAM) mencegah OOM-killer.
            </p>
          </div>
        </div>
      </div>
    </Figure>
  );
}
