'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Shield,
  Activity,
  Crosshair,
  Target,
  Terminal,
  Zap,
} from 'lucide-react';

export interface ThreatTarget {
  id: string;
  label: string;
  angle: number; // 0 - 360 deg
  distance: number; // 0.2 - 0.92 radial ratio
  ip: string;
  type: string;
  port: number;
  status: 'DROPPED' | 'TRAPPED' | 'INSPECTING';
  severity: 'critical' | 'high' | 'medium';
  originCountry: string;
  kernelAction: string;
  latencyMs: number;
}

const INITIAL_TARGETS: ThreatTarget[] = [
  {
    id: 'tgt-1',
    label: 'SQLi Injection Probe',
    angle: 38,
    distance: 0.78,
    ip: '194.26.29.112',
    type: "Blind SQLi / ' OR 1=1",
    port: 443,
    status: 'DROPPED',
    severity: 'critical',
    originCountry: 'Russia (St. Petersburg)',
    kernelAction: 'nft add element inet filter pasax_blocklist { 194.26.29.112 timeout 24h }',
    latencyMs: 0.02,
  },
  {
    id: 'tgt-2',
    label: 'SSH Brute-Force',
    angle: 115,
    distance: 0.62,
    ip: '45.148.10.194',
    type: 'SSH Honeypot Tarpit',
    port: 2222,
    status: 'TRAPPED',
    severity: 'high',
    originCountry: 'Netherlands (Amsterdam)',
    kernelAction: 'iptables -A INPUT -p tcp --dport 2222 -j TARPIT',
    latencyMs: 0.08,
  },
  {
    id: 'tgt-3',
    label: 'Spring4Shell RCE',
    angle: 215,
    distance: 0.86,
    ip: '185.220.101.5',
    type: 'CVE-2022-22965 Probe',
    port: 8080,
    status: 'DROPPED',
    severity: 'critical',
    originCountry: 'China (Beijing)',
    kernelAction: 'nft add element inet filter rce_signatures { 185.220.101.5 flags drop }',
    latencyMs: 0.03,
  },
  {
    id: 'tgt-4',
    label: 'Path Traversal Scan',
    angle: 295,
    distance: 0.52,
    ip: '104.196.38.100',
    type: 'etc/passwd Arbitrary Read',
    port: 80,
    status: 'DROPPED',
    severity: 'medium',
    originCountry: 'United States (Ashburn)',
    kernelAction: 'nft drop ip saddr 104.196.38.100 tcp dport 80',
    latencyMs: 0.01,
  },
  {
    id: 'tgt-5',
    label: 'Redis Auth Sweep',
    angle: 340,
    distance: 0.72,
    ip: '89.248.163.78',
    type: 'Redis Unprotected Rogue',
    port: 6379,
    status: 'TRAPPED',
    severity: 'high',
    originCountry: 'Bulgaria (Sofia)',
    kernelAction: 'pasax-sentinel isolate-port --port 6379 --attacker 89.248.163.78',
    latencyMs: 0.05,
  },
];

/**
 * Tactical Perimeter Ship Radar (Radar Kapal 360° Sweep)
 * Authentic marine radar display with rotating gradient beam sweep, compass degree ticks,
 * concentric range rings, and polar illuminated target blips.
 */
export function ThreatRadarScreen() {
  const [selectedTarget, setSelectedTarget] = React.useState<ThreatTarget>(INITIAL_TARGETS[0]);
  const [visibleTargets] = React.useState<ThreatTarget[]>(INITIAL_TARGETS);
  const [attackCount, setAttackCount] = React.useState(14892590);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const angleRef = React.useRef<number>(0);
  const animFrameRef = React.useRef<number | null>(null);
  const [radarSize, setRadarSize] = React.useState<number>(320);

  // Counter increment
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAttackCount((prev) => prev + 1);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // 360° Marine Ship Radar Sweep Renderer
  const drawRadar = React.useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, sweepAngle: number) => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.max(1, Math.min(width, height) / 2 - 28);

      // 1. Dark circular radar background
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(5, 10, 20, 0.94)';
      ctx.fill();

      // 2. Concentric Range Rings with Radial Glow
      const ringCount = 4;
      for (let i = 1; i <= ringCount; i++) {
        const ringRadius = Math.max(14, (maxRadius * i) / ringCount);
        const innerRadius = Math.max(0, ringRadius - 16);

        const grad = ctx.createRadialGradient(cx, cy, innerRadius, cx, cy, ringRadius);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.03)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.09)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.06)');

        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = i === ringCount ? 'rgba(16, 185, 129, 0.75)' : 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = i === ringCount ? 1.5 : 0.8;
        ctx.stroke();
      }

      // 3. Crosshair Axis Lines with division markers
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 4. Perimeter Compass Degree Ticks (Every 10° with monospace labels)
      const fontSize = Math.max(7, Math.round(maxRadius * 0.046));
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let deg = 0; deg < 360; deg += 10) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 30 === 0;
        const rTickStart = isMajor ? maxRadius - 8 : maxRadius - 4;
        const rTickEnd = maxRadius + 1;

        ctx.beginPath();
        ctx.moveTo(cx + rTickStart * Math.cos(rad), cy + rTickStart * Math.sin(rad));
        ctx.lineTo(cx + rTickEnd * Math.cos(rad), cy + rTickEnd * Math.sin(rad));
        ctx.strokeStyle = isMajor ? 'rgba(16, 185, 129, 0.85)' : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = isMajor ? 1.5 : 0.8;
        ctx.stroke();

        // Degree labels for major ticks
        if (isMajor) {
          const rText = maxRadius + 14;
          const tx = cx + rText * Math.cos(rad);
          const ty = cy + rText * Math.sin(rad);

          ctx.fillStyle = deg === 0 ? '#10b981' : 'rgba(148, 163, 184, 0.85)';
          const textLabel =
            deg === 0 ? '000°N' : deg === 90 ? '090°E' : deg === 180 ? '180°S' : deg === 270 ? '270°W' : `${deg}°`;
          ctx.fillText(textLabel, tx, ty);
        }
      }

      // 5. Authentic Rotating Conic Radar Sweep Beam
      const trailAngle = (55 * Math.PI) / 180; // 55° phosphor decay trail
      const beamSegments = 32;

      for (let s = 0; s < beamSegments; s++) {
        const t0 = (s / beamSegments) * trailAngle;
        const t1 = ((s + 1) / beamSegments) * trailAngle;
        const a0 = sweepAngle - t1;
        const a1 = sweepAngle - t0;
        const alpha = Math.pow(1 - s / beamSegments, 2.2) * 0.38;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxRadius, a0, a1);
        ctx.closePath();
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.fill();
      }

      // 6. Leading Edge Beam Line (Razor Sharp)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxRadius * Math.cos(sweepAngle), cy + maxRadius * Math.sin(sweepAngle));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // 7. Center Transceiver Origin
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    },
    [],
  );

  React.useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const s = Math.min(w, h, 460);
      setRadarSize(Math.max(220, s));
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Animation Loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = radarSize * dpr;
    canvas.height = radarSize * dpr;

    let isRunning = true;
    const loop = () => {
      if (!isRunning) return;
      angleRef.current += 0.016;
      ctx.save();
      ctx.scale(dpr, dpr);
      drawRadar(ctx, radarSize, radarSize, angleRef.current);
      ctx.restore();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [radarSize, drawRadar]);

  const radarRadius = radarSize / 2 - 28;

  return (
    <div className="relative flex size-full flex-col overflow-hidden bg-lp-paper font-mono text-lp-ink">
      {/* Top HUD overlay */}
      <div className="z-10 flex h-8 shrink-0 items-center justify-between border-b border-lp-line-strong bg-lp-paper-2 px-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          </span>
          <span className="font-heading text-xs font-bold tracking-wider text-lp-ink uppercase">
            THREAT RADAR
          </span>
          <span className="text-[10px] text-lp-ink/60">// 360° PERIMETER SWEEP // TELEMETRY MESH</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold sm:inline-flex">
            <Crosshair className="size-3 text-emerald-600 dark:text-emerald-400" />
            <span>RADAR SWEEP ACTIVE</span>
          </span>
          <Link
            href="/threats-map"
            className="flex items-center gap-1 border border-lp-line-strong bg-lp-paper px-2 py-0.5 text-[10px] font-bold text-lp-ink hover:bg-lp-ink hover:text-lp-paper transition-colors"
          >
            <span>Full Map</span>
            <ArrowUpRight className="size-2.5" />
          </Link>
        </div>
      </div>

      {/* Main Radar Screen Layout */}
      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden p-2 sm:p-3 gap-3">
        {/* Left: 360° Marine Radar Sweep Center */}
        <div
          ref={containerRef}
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden border border-lp-line-strong bg-[#030611] p-1 shadow-inner"
        >
          {/* Ambient Conic Ring */}
          <div className="pointer-events-none absolute inset-0 animate-[spin_16s_linear_infinite] rounded-full opacity-30 bg-[conic-gradient(from_0deg,#0000_0deg,rgba(16,185,129,0.7)_50deg,#0000_120deg,rgba(56,189,248,0.5)_240deg,#0000_320deg)]" />

          {/* Canvas Radar Core Engine */}
          <canvas
            ref={canvasRef}
            style={{ width: `${radarSize}px`, height: `${radarSize}px` }}
            className="relative z-10 block"
          />

          {/* Polar-Projected Target Blip Badges */}
          {visibleTargets.map((target) => {
            const rad = (target.angle * Math.PI) / 180;
            const distPx = radarRadius * target.distance;
            const xOffset = Math.cos(rad) * distPx;
            const yOffset = Math.sin(rad) * distPx;

            const isCritical = target.severity === 'critical';
            const isSelected = selectedTarget?.id === target.id;
            const isRightSide = target.angle < 90 || target.angle > 270;
            const labelPositionClass = isRightSide
              ? 'right-3 top-1/2 -translate-y-1/2'
              : 'left-3 top-1/2 -translate-y-1/2';

            return (
              <div
                key={target.id}
                onClick={() => setSelectedTarget(target)}
                style={{
                  transform: `translate(${xOffset}px, ${yOffset}px)`,
                }}
                className="group absolute z-20 cursor-pointer transition-all duration-300"
              >
                <div className="relative flex items-center justify-center">
                  {/* Blip Ping Ring */}
                  <span
                    className={`absolute inline-flex size-4 animate-ping rounded-full opacity-75 ${
                      isCritical ? 'bg-rose-500' : 'bg-amber-400'
                    }`}
                  />
                  {/* Center Blip */}
                  <span
                    className={`relative inline-flex size-2.5 rounded-full border border-white shadow-[0_0_8px_rgba(244,63,94,0.9)] ${
                      isCritical ? 'bg-rose-600' : 'bg-amber-500'
                    }`}
                  />

                  {/* Threat Tag Label */}
                  <div
                    className={`pointer-events-none absolute ${labelPositionClass} whitespace-nowrap border px-1.5 py-0.2 font-mono text-[9px] font-bold shadow-md transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-950/90 text-emerald-200'
                        : isCritical
                          ? 'border-rose-500/40 bg-[#0d0e17]/95 text-rose-300'
                          : 'border-amber-500/40 bg-[#0d0e17]/95 text-amber-300'
                    }`}
                  >
                    {target.type} &middot; {target.ip}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Scanline CRT overlay */}
          <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-35" />

          {/* Quick HUD badge in radar corner */}
          <div className="pointer-events-none absolute bottom-2 left-2 z-30 flex items-center gap-1.5 text-[9px]">
            <span className="inline-flex items-center gap-1 border border-lp-line-strong bg-lp-paper px-1.5 py-0.5 text-lp-ink">
              <Shield className="size-2.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{attackCount.toLocaleString()}</span>
              <span className="text-lp-ink/70">DROPS</span>
            </span>
            <span className="hidden items-center gap-1 border border-lp-line-strong bg-lp-paper px-1.5 py-0.5 text-lp-ink sm:inline-flex">
              <Activity className="size-2.5 text-sky-600 dark:text-sky-400" />
              <span>&lt;0.02ms WIRE-SPEED</span>
            </span>
          </div>
        </div>

        {/* Right: Live Target Diagnostics Bay (Desktop/Tablet) */}
        <div className="hidden lg:flex w-72 shrink-0 flex-col justify-between border border-lp-line-strong bg-lp-paper-2 p-3 text-[11px]">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-lp-line pb-2">
              <span className="flex items-center gap-1.5 text-lp-ink font-bold uppercase tracking-wider text-[10px]">
                <Target className="size-3 text-emerald-600 dark:text-emerald-400" />
                Target Inspector
              </span>
              <span className="border border-red-500/40 bg-red-500/10 px-1 py-0.2 text-[9px] font-bold text-red-700 dark:text-red-400">
                {selectedTarget.status}
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-lp-ink text-xs">{selectedTarget.label}</p>
              <p className="text-lp-ink/60 text-[10px]">{selectedTarget.originCountry}</p>
              <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-lp-ink">
                <span className="text-amber-600 dark:text-amber-400 font-bold">{selectedTarget.ip}</span>
                <span>:</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">{selectedTarget.port}</span>
              </div>
            </div>

            <div className="border border-lp-line bg-lp-paper p-2">
              <div className="flex items-center gap-1 text-[9px] text-lp-ink/70 font-bold mb-1">
                <Terminal className="size-2.5" />
                <span>Kernel Netfilter Hook</span>
              </div>
              <code className="block text-[9px] text-emerald-700 dark:text-emerald-400 break-all leading-relaxed font-mono">
                {selectedTarget.kernelAction}
              </code>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-lp-line font-mono text-[10px]">
            <div className="border border-lp-line bg-lp-paper p-1 text-center">
              <span className="block text-[8px] text-lp-ink/60 uppercase">SEVERITY</span>
              <span className="font-bold text-red-600 dark:text-red-400 uppercase">{selectedTarget.severity}</span>
            </div>
            <div className="border border-lp-line bg-lp-paper p-1 text-center">
              <span className="block text-[8px] text-lp-ink/60 uppercase">DROP TIME</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedTarget.latencyMs}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="z-10 flex h-7 shrink-0 items-center justify-between border-t border-lp-line-strong bg-lp-paper-2 px-3 text-[10px]">
        <div className="flex min-w-0 items-center gap-2 overflow-hidden text-lp-ink/80">
          <span className="shrink-0 border border-red-500/30 bg-red-500/10 px-1 py-0.2 text-[9px] font-bold text-red-700 dark:text-red-400">
            [NFT_DROP]
          </span>
          <span className="truncate">
            <strong className="text-lp-ink">{selectedTarget.label}</strong> from{' '}
            <span className="text-amber-600 dark:text-amber-400">{selectedTarget.originCountry}</span> ➔{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Wire-Speed Filter Active</span>
          </span>
        </div>
        <div className="hidden shrink-0 items-center gap-1 text-[9px] text-lp-ink/60 sm:flex">
          <Zap className="size-2.5 text-amber-600 dark:text-amber-400" />
          <span>Zero User-Space Overhead</span>
        </div>
      </div>
    </div>
  );
}
