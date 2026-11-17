'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Code2,
} from 'lucide-react';

interface WafPayload {
  name: string;
  category: string;
  request: string;
  vector: string;
  ruleCode: string;
  execTime: string;
  action: string;
}

const ATTACK_PAYLOADS: WafPayload[] = [
  {
    name: 'SQL Injection',
    category: 'SQLi',
    request: 'GET /api/v1/users?id=1%27%20UNION%20SELECT%20null,password_hash%20FROM%20admins--',
    vector: 'UNION-based exfiltration detected in query string',
    ruleCode: 'PASAX-RULE-SQLI-01',
    execTime: '0.038ms',
    action: '403 Forbidden / Instant Drop',
  },
  {
    name: 'Directory Traversal',
    category: 'LFI',
    request: 'GET /download?file=../../../../etc/passwd%00',
    vector: 'Path dot-dot-slash sequence & Null-byte bypass',
    ruleCode: 'PASAX-RULE-LFI-04',
    execTime: '0.022ms',
    action: '403 Forbidden / Logged to SOC',
  },
  {
    name: 'Cross-Site Scripting',
    category: 'XSS',
    request: 'POST /feedback?msg=<img src=x onerror=alert(document.cookie)>',
    vector: 'Inline HTML event handler payload detected',
    ruleCode: 'PASAX-RULE-XSS-12',
    execTime: '0.041ms',
    action: '403 Forbidden / Stripped & Sanitized',
  },
  {
    name: 'Remote Code Injection',
    category: 'RCE',
    request: 'GET /system/ping?host=127.0.0.1;cat+/etc/shadow',
    vector: 'Command separator chaining detected in shell arg',
    ruleCode: 'PASAX-RULE-RCE-09',
    execTime: '0.019ms',
    action: '403 Forbidden / IP Quarantined',
  },
];

export function PhpWafScreen() {
  const [selectedPayload, setSelectedPayload] = React.useState<WafPayload>(ATTACK_PAYLOADS[0]);
  const [, setIsSimulating] = React.useState(false);
  const [blockedCounter, setBlockedCounter] = React.useState(39420);

  const handleTestPayload = (payload: WafPayload) => {
    setIsSimulating(true);
    setSelectedPayload(payload);
    setTimeout(() => {
      setBlockedCounter((prev) => prev + 1);
      setIsSimulating(false);
    }, 200);
  };

  return (
    <div className="flex h-full w-full flex-col bg-lp-paper font-mono text-lp-ink select-none overflow-y-auto">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between border-b border-lp-line-strong bg-lp-paper-2 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-bold tracking-wider text-lp-ink">PURE PHP WAF</span>
          <span className="border border-lp-line bg-lp-paper px-1.5 py-0.5 text-[10px] text-lp-ink/70">
            LARAVEL / PSR-15
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-lp-ink/70">
          <span>
            INTERCEPTED:{' '}
            <strong className="text-amber-600 dark:text-amber-400 font-bold tabular-nums">
              {blockedCounter.toLocaleString()}
            </strong>
          </span>
          <span className="hidden sm:inline">
            OVERHEAD: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">&lt; 0.05ms (ZERO-DEP)</strong>
          </span>
          <span className="border border-lp-line-strong bg-lp-yellow px-2 py-0.5 text-[10px] font-bold text-lp-on-yellow">
            COMPOSER READY
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col gap-3 p-3 text-xs overflow-y-auto">
        {/* Attack Simulator Selector */}
        <div>
          <span className="text-[10px] font-bold text-lp-ink/60 uppercase tracking-wider block mb-1.5">
            Test Vector Simulations (Click to trigger instant WAF intercept)
          </span>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {ATTACK_PAYLOADS.map((p) => {
              const isSelected = selectedPayload.name === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleTestPayload(p)}
                  className={`flex flex-col items-start border p-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-lp-ink bg-lp-paper-2 text-lp-ink shadow-xs'
                      : 'border-lp-line bg-lp-paper text-lp-ink/70 hover:border-lp-line-strong hover:bg-lp-paper-2 hover:text-lp-ink'
                  }`}
                >
                  <div className="flex w-full items-center justify-between text-[10px]">
                    <span className="font-bold text-lp-ink">{p.name}</span>
                    <span className="border border-lp-line bg-lp-paper px-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                      {p.category}
                    </span>
                  </div>
                  <span className="mt-1 font-mono text-[9px] text-lp-ink/60 truncate w-full">
                    {p.ruleCode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Intercept Console */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-12 flex-1">
          {/* Request & Intercept Output */}
          <div className="sm:col-span-7 flex flex-col border border-lp-line-strong bg-lp-paper-2 p-2.5">
            <div className="flex items-center justify-between border-b border-lp-line pb-1.5 text-[10px] text-lp-ink/70">
              <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertTriangle className="size-3" />
                BLOCKED INGRESS HTTP REQUEST
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                LATENCY: {selectedPayload.execTime}
              </span>
            </div>

            <div className="mt-2 space-y-2 font-mono text-[11px]">
              <div className="border border-lp-line bg-lp-paper p-2">
                <span className="text-[10px] text-lp-ink/60 block mb-0.5">RAW HTTP PAYLOAD:</span>
                <span className="text-red-600 dark:text-red-400 font-semibold break-all">{selectedPayload.request}</span>
              </div>

              <div className="border border-lp-line bg-lp-paper p-2">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mb-0.5">
                  DETECTION SIGNATURE:
                </span>
                <span className="text-lp-ink">{selectedPayload.vector}</span>
              </div>

              <div className="flex items-center justify-between border border-lp-line bg-lp-paper p-2 text-[10px]">
                <div>
                  <span className="text-lp-ink/60">ACTION TAKEN:</span>{' '}
                  <strong className="text-red-600 dark:text-red-400 font-bold">{selectedPayload.action}</strong>
                </div>
                <div>
                  <span className="text-lp-ink/60">RULE:</span>{' '}
                  <strong className="text-lp-ink font-bold">{selectedPayload.ruleCode}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* PHP Code Snippet */}
          <div className="sm:col-span-5 flex flex-col border border-lp-line-strong bg-lp-paper-2 p-2.5">
            <div className="flex items-center justify-between border-b border-lp-line pb-1.5 text-[10px] text-lp-ink/70">
              <span className="font-bold text-lp-ink flex items-center gap-1">
                <Code2 className="size-3 text-amber-600 dark:text-amber-400" />
                PasaxSecurityMiddleware.php
              </span>
              <span className="text-lp-ink/60">0 Dependencies</span>
            </div>

            <pre className="mt-2 flex-1 overflow-x-auto font-mono text-[10px] leading-relaxed text-lp-ink/80 border border-lp-line bg-lp-paper p-2">
              <code>{`// app/Http/Middleware/PasaxWaf.php
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Pasax\\Waf\\SecurityEngine;

class PasaxWaf {
  public function handle(Request $req, Closure $next) {
    $verdict = SecurityEngine::inspect($req);
    if ($verdict->isMalicious()) {
      return response()->json([
        'error' => 'Blocked by Pasax WAF',
        'code'  => $verdict->ruleId,
      ], 403);
    }
    return $next($req);
  }
}`}</code>
            </pre>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex items-center justify-between border-t border-lp-line-strong pt-2 text-[11px] text-lp-ink/70">
          <span>Zero-dependency standalone middleware for Laravel & modern PHP:</span>
          <Link
            href="/docs/pasax-secure-monitor"
            className="inline-flex items-center gap-1 font-bold text-lp-ink hover:underline hover:text-amber-600 dark:hover:text-amber-400"
          >
            <span>PHP WAF Docs</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
