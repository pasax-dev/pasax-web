export interface Step {
  tab: string
  status: string
}

export const steps: Step[] = [
  { tab: "Security Policy", status: "parsing security rules" },
  { tab: "Composer Install", status: "installing pasax-secure-monitor" },
  { tab: "Kernel Hook", status: "binding nftables socket" },
  { tab: "Trinity Mesh", status: "routing to live radar" },
]

export const blocks: string[] = [
  `---\ntarget: /api/v1/auth/*\naction: BLOCK_AND_QUARANTINE\nthreshold: 5req/sec\n---`,
  `## Installation\n\n\`\`\`bash\ncomposer require pasax/pasax-secure-monitor\n\`\`\``,
  `\`\`\`php title="bootstrap/app.php"\nuse Pasax\\SecureMonitor\\Middleware\\PasaxWafMiddleware;\n\n$middleware->append(PasaxWafMiddleware::class);\n\`\`\``,
  `<Mermaid\n  chart="\ngraph LR\n  Attacker[Malicious Packet] --> Kernel[nftables Hook <0.02ms]\n  Kernel --> WAF[Pasax PHP WAF]\n  WAF --> Cloud[Pasax Live Radar]\n"\n/>`,
]

export function fileLines(sources: string[]): string[] {
  const out: string[] = []
  for (let i = 0; i < sources.length; i++) {
    if (i > 0) out.push("")
    for (const line of sources[i].trimEnd().split("\n")) out.push(line)
  }
  return out
}
