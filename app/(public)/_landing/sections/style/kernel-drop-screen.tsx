'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Filter,
  Play,
} from 'lucide-react';

interface DroppedPacket {
  id: string;
  time: string;
  proto: string;
  src: string;
  dst: string;
  threat: string;
  hook: string;
  latency: string;
  rule: string;
}

const SAMPLE_PACKETS: DroppedPacket[] = [
  {
    id: 'pkt-1',
    time: '04:19:30.104',
    proto: 'TCP',
    src: '185.220.101.4:44321',
    dst: '10.0.1.5:80',
    threat: 'SYN_FLOOD (180k pps)',
    hook: 'netdev / ingress',
    latency: '1.8μs',
    rule: 'pasax_xdp_syn_ratelimit',
  },
  {
    id: 'pkt-2',
    time: '04:19:30.142',
    proto: 'UDP',
    src: '45.154.255.8:53',
    dst: '10.0.1.5:443',
    threat: 'DNS_AMP_REFLECTION',
    hook: 'inet / prerouting',
    latency: '2.4μs',
    rule: 'pasax_nft_block_reflection',
  },
  {
    id: 'pkt-3',
    time: '04:19:30.201',
    proto: 'TCP',
    src: '194.26.29.112:51920',
    dst: '10.0.1.5:22',
    threat: 'SSH_PORT_SCAN',
    hook: 'inet / input',
    latency: '3.1μs',
    rule: 'pasax_tarpit_quarantine',
  },
  {
    id: 'pkt-4',
    time: '04:19:30.288',
    proto: 'TCP',
    src: '91.240.118.22:38112',
    dst: '10.0.1.5:8080',
    threat: 'CVE-2024-HTTP_SMUGGLING',
    hook: 'netdev / ingress',
    latency: '2.0μs',
    rule: 'pasax_ebpf_parse_header',
  },
];

export function KernelDropScreen() {
  const [filterType, setFilterType] = React.useState<string>('ALL');
  const [dropCounter, setDropCounter] = React.useState<number>(1842912);
  const [packets, setPackets] = React.useState<DroppedPacket[]>(SAMPLE_PACKETS);
  const [isInjecting, setIsInjecting] = React.useState<boolean>(false);

  const handleSimulateSurge = () => {
    setIsInjecting(true);
    setDropCounter((prev) => prev + 1420);
    const newPkt: DroppedPacket = {
      id: `pkt-${Date.now()}`,
      time: new Date().toISOString().split('T')[1].slice(0, 12),
      proto: 'TCP',
      src: `${Math.floor(Math.random() * 200 + 40)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:${Math.floor(Math.random() * 50000 + 1024)}`,
      dst: '10.0.1.5:443',
      threat: 'VOLUMETRIC_DDoS_BURST',
      hook: 'netdev / ingress (XDP)',
      latency: '1.4μs',
      rule: 'pasax_hardware_bypass_drop',
    };
    setPackets((prev) => [newPkt, ...prev.slice(0, 5)]);
    setTimeout(() => setIsInjecting(false), 500);
  };

  const filteredPackets =
    filterType === 'ALL'
      ? packets
      : packets.filter((p) => p.threat.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="flex h-full w-full flex-col bg-lp-paper font-mono text-lp-ink select-none overflow-y-auto">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-lp-line-strong bg-lp-paper-2 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold tracking-wider text-lp-ink">KERNEL DROP ENGINE</span>
          <span className="border border-lp-line bg-lp-paper px-1.5 py-0.5 text-[10px] text-lp-ink/70">
            eBPF / nftables
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-lp-ink/70">
          <span>
            DROPPED:{' '}
            <strong className="text-red-600 dark:text-red-400 font-bold tabular-nums">
              {dropCounter.toLocaleString()} pkts
            </strong>
          </span>
          <span className="hidden sm:inline">
            RATE: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">10 Gbps WIRE-SPEED</strong>
          </span>
          <button
            type="button"
            onClick={handleSimulateSurge}
            disabled={isInjecting}
            className="flex items-center gap-1 border border-lp-line-strong bg-lp-yellow text-lp-on-yellow hover:bg-lp-ink hover:text-lp-paper px-2 py-0.5 text-[10px] font-bold active:scale-95 transition-all cursor-pointer"
          >
            <Play className={`size-3 ${isInjecting ? 'animate-ping' : ''}`} />
            {isInjecting ? 'DROPPING...' : 'SIMULATE SURGE'}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col gap-3 p-3 text-xs overflow-y-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="border border-lp-line bg-lp-paper-2 p-2">
            <span className="text-[10px] text-lp-ink/60">INTERCEPTION LATENCY</span>
            <div className="mt-0.5 text-base font-bold text-amber-600 dark:text-amber-400">1.8 - 4.2 μs</div>
            <span className="text-[9px] text-lp-ink/50">Zero Context Switch</span>
          </div>
          <div className="border border-lp-line bg-lp-paper-2 p-2">
            <span className="text-[10px] text-lp-ink/60">EBPF XDP HOOK</span>
            <div className="mt-0.5 text-base font-bold text-emerald-600 dark:text-emerald-400">NATIVE TC-INGRESS</div>
            <span className="text-[9px] text-lp-ink/50">Driver Pre-allocation</span>
          </div>
          <div className="border border-lp-line bg-lp-paper-2 p-2">
            <span className="text-[10px] text-lp-ink/60">NFTABLES LEDGER</span>
            <div className="mt-0.5 text-base font-bold text-lp-ink">TABLE pasax_inet</div>
            <span className="text-[9px] text-lp-ink/50">Atomic Set Updates</span>
          </div>
          <div className="border border-lp-line bg-lp-paper-2 p-2">
            <span className="text-[10px] text-lp-ink/60">CPU OVERHEAD</span>
            <div className="mt-0.5 text-base font-bold text-emerald-600 dark:text-emerald-400">&lt; 0.8% TOTAL</div>
            <span className="text-[9px] text-lp-ink/50">Single RingBuffer Core</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-lp-ink/60 flex items-center gap-1 text-[10px]">
            <Filter className="size-3" /> FILTER:
          </span>
          {['ALL', 'SYN_FLOOD', 'DNS_AMP', 'PORT_SCAN', 'CVE'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`px-2 py-0.5 text-[10px] transition-colors border cursor-pointer ${
                filterType === f
                  ? 'border-lp-line-strong bg-lp-yellow font-bold text-lp-on-yellow'
                  : 'border-lp-line bg-lp-paper text-lp-ink/70 hover:bg-lp-paper-2 hover:text-lp-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Live Packet Intercept Table */}
        <div className="flex-1 border border-lp-line-strong bg-lp-paper overflow-hidden flex flex-col">
          <div className="grid grid-cols-12 border-b border-lp-line-strong bg-lp-paper-2 px-2 py-1 text-[10px] font-bold text-lp-ink">
            <span className="col-span-2">TIMESTAMP</span>
            <span className="col-span-1">PROTO</span>
            <span className="col-span-3">SOURCE IP:PORT</span>
            <span className="col-span-3">THREAT VECTOR</span>
            <span className="col-span-2">KERNEL HOOK</span>
            <span className="col-span-1 text-right">LATENCY</span>
          </div>
          <div className="divide-y divide-lp-line overflow-y-auto text-[10px]">
            {filteredPackets.map((pkt) => (
              <div
                key={pkt.id}
                className="grid grid-cols-12 items-center px-2 py-1.5 hover:bg-lp-paper-2 transition-colors"
              >
                <span className="col-span-2 text-lp-ink/60">{pkt.time}</span>
                <span className="col-span-1 font-bold text-amber-600 dark:text-amber-400">{pkt.proto}</span>
                <span className="col-span-3 font-mono text-lp-ink truncate">{pkt.src}</span>
                <span className="col-span-3 text-red-600 dark:text-red-400 font-semibold truncate flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-red-500" />
                  {pkt.threat}
                </span>
                <span className="col-span-2 text-lp-ink/70 truncate">{pkt.hook}</span>
                <span className="col-span-1 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {pkt.latency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info link */}
        <div className="flex items-center justify-between border-t border-lp-line-strong pt-2 text-[11px] text-lp-ink/70">
          <span>Hardware & nftables wire-speed packet drop before user space:</span>
          <Link
            href="/docs/pasax-sentinel"
            className="inline-flex items-center gap-1 font-bold text-lp-ink hover:underline hover:text-orange-600 dark:hover:text-orange-400"
          >
            <span>Sentinel Daemon Docs</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
