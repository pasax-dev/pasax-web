'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  RefreshCw,
} from 'lucide-react';

interface MeshNode {
  id: string;
  name: string;
  tier: string;
  status: 'ONLINE' | 'SYNCED' | 'ARMED';
  role: string;
  tech: string;
  latency: string;
  activeRules: number;
}

const NODES: MeshNode[] = [
  {
    id: 'php-waf',
    name: 'Pure PHP WAF',
    tier: 'Tier 1: Application Layer',
    status: 'ARMED',
    role: 'Zero-dependency standalone middleware inspecting URI, headers, SQLi, and XSS.',
    tech: 'PHP 8.2+ / PSR-15 / Laravel',
    latency: '0.04ms',
    activeRules: 1420,
  },
  {
    id: 'go-daemon',
    name: 'Sentinel Kernel Daemon',
    tier: 'Tier 2: OS & Kernel Layer',
    status: 'SYNCED',
    role: 'Hardware wire-speed eBPF packet drop, inotify FIM watcher, and nftables hooks.',
    tech: 'Golang / eBPF / nftables',
    latency: '4.2μs',
    activeRules: 89400,
  },
  {
    id: 'cloud-soc',
    name: 'Sentinel Mesh Cloud SOC',
    tier: 'Tier 3: Global Coordination',
    status: 'ONLINE',
    role: 'Global real-time threat telemetry distribution and consensus cluster quarantine.',
    tech: 'Decentralized P2P Gossip / TLS 1.3',
    latency: '14.8ms',
    activeRules: 320500,
  },
];

export function TrinityMeshScreen() {
  const [selectedNode, setSelectedNode] = React.useState<MeshNode>(NODES[1]);
  const [syncCount, setSyncCount] = React.useState(14892);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSyncCount((prev) => prev + 1);
      setIsSyncing(false);
    }, 600);
  };

  return (
    <div className="flex h-full w-full flex-col bg-lp-paper font-mono text-lp-ink select-none overflow-y-auto">
      {/* Top HUD Status Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-lp-line-strong bg-lp-paper-2 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider text-lp-ink">TRINITY MESH</span>
          <span className="border border-lp-line bg-lp-paper px-1.5 py-0.5 text-[10px] text-lp-ink/70">
            3-TIER SYNC
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-lp-ink/70">
          <span>
            HEARTBEAT:{' '}
            <strong className="text-lp-ink tabular-nums">{syncCount.toLocaleString()}</strong>
          </span>
          <span className="hidden sm:inline">
            CLUSTER: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">24/24 HEALTHY</strong>
          </span>
          <button
            type="button"
            onClick={handleSimulateSync}
            disabled={isSyncing}
            className="flex items-center gap-1 border border-lp-line-strong bg-lp-paper px-2 py-0.5 text-[10px] text-lp-ink hover:bg-lp-ink hover:text-lp-paper active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className={`size-3 ${isSyncing ? 'animate-spin text-lp-yellow' : ''}`} />
            {isSyncing ? 'SYNCING...' : 'SYNC MESH'}
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="flex flex-1 flex-col gap-3 p-3 text-xs overflow-y-auto">
        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNode(node)}
                className={`relative flex flex-col justify-between border p-2.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-lp-ink bg-lp-paper-2 shadow-xs'
                    : 'border-lp-line bg-lp-paper hover:bg-lp-paper-2 hover:border-lp-line-strong'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-lp-ink/70">
                    <span>{node.tier}</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      {node.status}
                    </span>
                  </div>
                  <h4 className="mt-1 font-heading text-sm font-bold text-lp-ink">
                    {node.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-lp-ink/70">
                    {node.role}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-lp-line pt-1.5 text-[10px] text-lp-ink/60">
                  <span>{node.tech}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">{node.latency}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Inspector / Diagnostics Console */}
        <div className="flex flex-1 flex-col border border-lp-line-strong bg-lp-paper-2 p-2.5">
          <div className="flex items-center justify-between border-b border-lp-line pb-2 text-[11px]">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-lp-ink">{selectedNode.name}</span>
              <span className="text-lp-ink/60">({selectedNode.tier})</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-lp-ink/70">
                Active Rules:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {selectedNode.activeRules.toLocaleString()}
                </strong>
              </span>
              <span className="text-lp-ink/70">
                Latency: <strong className="text-amber-600 dark:text-amber-400">{selectedNode.latency}</strong>
              </span>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 text-[11px]">
            <div className="border border-lp-line bg-lp-paper p-2">
              <span className="text-[10px] font-bold text-lp-ink/60 uppercase tracking-wider">
                Telemetry Pipeline
              </span>
              <div className="mt-1 space-y-1 font-mono text-[10px] text-lp-ink/80">
                <div className="flex justify-between">
                  <span>Packet RingBuffer:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Zero-Loss</span>
                </div>
                <div className="flex justify-between">
                  <span>IPC Unix Socket:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">/run/pasax.sock</span>
                </div>
                <div className="flex justify-between">
                  <span>Heartbeat Jitter:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">&lt; 0.08ms</span>
                </div>
              </div>
            </div>

            <div className="border border-lp-line bg-lp-paper p-2">
              <span className="text-[10px] font-bold text-lp-ink/60 uppercase tracking-wider">
                Inter-Tier Enforcement
              </span>
              <div className="mt-1 space-y-1 font-mono text-[10px] text-lp-ink/80">
                <div className="flex justify-between">
                  <span>Sync Policy:</span>
                  <span className="text-lp-ink font-semibold">Continuous P2P Gossip</span>
                </div>
                <div className="flex justify-between">
                  <span>Blocklist Broadcast:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Distributed &lt; 20ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Fail-Open Protection:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Self-Healing Armed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time sync trace log */}
          <div className="mt-2 flex-1 border border-lp-line bg-lp-paper p-2 font-mono text-[10px] text-lp-ink/80">
            <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-1">
              [TRINITY-MESH-TRACE] REAL-TIME CROSS-TIER SYNC STREAM:
            </div>
            <div className="space-y-0.5">
              <div>
                [04:19:12] WAF(app) -&gt; DAEMON(kernel): HTTP ingress threat tagged (IP:
                185.220.101.4). Handed off via eBPF map.
              </div>
              <div>
                [04:19:12] DAEMON(kernel) -&gt; HARDWARE(nft): Wire-speed drop activated on
                prerouting hook (0.02ms latency).
              </div>
              <div>
                [04:19:13] DAEMON -&gt; CLOUD(soc): Telemetry broadcasted. 24 VPS nodes updated with
                IP block quarantine.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="flex items-center justify-between border-t border-lp-line-strong pt-2 text-[11px] text-lp-ink/70">
          <span>Explore architecture documentation and layer specification:</span>
          <Link
            href="/docs/core"
            className="inline-flex items-center gap-1 font-bold text-lp-ink hover:underline hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <span>Trinity Mesh Docs</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
