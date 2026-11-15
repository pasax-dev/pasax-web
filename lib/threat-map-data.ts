export interface SentinelNode {
  id: string
  name: string
  country: string
  flag: string
  lat: number
  lng: number
  role: "PRIMARY_CLUSTER" | "EDGE_GATEWAY" | "CORE_NODE" | "HONEYPOT_MESH"
  layer: "Layer 1 (Shield)" | "Layer 2 (Sentinel eBPF)" | "Layer 3 (Cloud SOC)"
  activeDropsToday: number
  avgLatencyMs: number
}

export interface AttackerOrigin {
  name: string
  country: string
  flag: string
  lat: number
  lng: number
}

export interface CyberAttackEvent {
  id: string
  timestamp: string
  type: string
  severity: "critical" | "high" | "medium"
  attackerIp: string
  origin: AttackerOrigin
  targetNode: SentinelNode
  defenseAction: "DROPPED (nftables)" | "BLOCKED (Shield WAF)" | "TARPIT (Honeypot)"
  latencyMs: number
  rule: string
}

export const SENTINEL_NODES: SentinelNode[] = [
  {
    id: "node-jkt",
    name: "Jakarta Primary Cluster",
    country: "Indonesia",
    flag: "🇮🇩",
    lat: -6.2088,
    lng: 106.8456,
    role: "PRIMARY_CLUSTER",
    layer: "Layer 2 (Sentinel eBPF)",
    activeDropsToday: 482190,
    avgLatencyMs: 0.12,
  },
  {
    id: "node-sin",
    name: "Singapore APAC Gateway",
    country: "Singapore",
    flag: "🇸🇬",
    lat: 1.3521,
    lng: 103.8198,
    role: "EDGE_GATEWAY",
    layer: "Layer 2 (Sentinel eBPF)",
    activeDropsToday: 320140,
    avgLatencyMs: 0.14,
  },
  {
    id: "node-fra",
    name: "Frankfurt EU Core",
    country: "Germany",
    flag: "🇩🇪",
    lat: 50.1109,
    lng: 8.6821,
    role: "CORE_NODE",
    layer: "Layer 2 (Sentinel eBPF)",
    activeDropsToday: 614200,
    avgLatencyMs: 0.15,
  },
  {
    id: "node-lon",
    name: "London UK Node",
    country: "United Kingdom",
    flag: "🇬🇧",
    lat: 51.5074,
    lng: -0.1278,
    role: "EDGE_GATEWAY",
    layer: "Layer 1 (Shield)",
    activeDropsToday: 290110,
    avgLatencyMs: 0.18,
  },
  {
    id: "node-nyc",
    name: "New York US-East",
    country: "United States",
    flag: "🇺🇸",
    lat: 40.7128,
    lng: -74.006,
    role: "CORE_NODE",
    layer: "Layer 2 (Sentinel eBPF)",
    activeDropsToday: 745300,
    avgLatencyMs: 0.11,
  },
  {
    id: "node-sfo",
    name: "San Francisco US-West",
    country: "United States",
    flag: "🇺🇸",
    lat: 37.7749,
    lng: -122.4194,
    role: "EDGE_GATEWAY",
    layer: "Layer 1 (Shield)",
    activeDropsToday: 412890,
    avgLatencyMs: 0.16,
  },
  {
    id: "node-tyo",
    name: "Tokyo East-Asia Hub",
    country: "Japan",
    flag: "🇯🇵",
    lat: 35.6762,
    lng: 139.6503,
    role: "CORE_NODE",
    layer: "Layer 2 (Sentinel eBPF)",
    activeDropsToday: 531200,
    avgLatencyMs: 0.13,
  },
  {
    id: "node-syd",
    name: "Sydney Oceania Node",
    country: "Australia",
    flag: "🇦🇺",
    lat: -33.8688,
    lng: 151.2093,
    role: "HONEYPOT_MESH",
    layer: "Layer 3 (Cloud SOC)",
    activeDropsToday: 189420,
    avgLatencyMs: 0.19,
  },
  {
    id: "node-sao",
    name: "São Paulo LatAm Node",
    country: "Brazil",
    flag: "🇧🇷",
    lat: -23.5505,
    lng: -46.6333,
    role: "EDGE_GATEWAY",
    layer: "Layer 2 (Sentinel eBPF)",
    activeDropsToday: 221800,
    avgLatencyMs: 0.21,
  },
]

export const ATTACKER_ORIGINS: AttackerOrigin[] = [
  { name: "Moscow", country: "Russia", flag: "🇷🇺", lat: 55.7558, lng: 37.6173 },
  { name: "St. Petersburg", country: "Russia", flag: "🇷🇺", lat: 59.9311, lng: 30.3609 },
  { name: "Beijing", country: "China", flag: "🇨🇳", lat: 39.9042, lng: 116.4074 },
  { name: "Guangzhou", country: "China", flag: "🇨🇳", lat: 23.1291, lng: 113.2644 },
  { name: "Bucharest", country: "Romania", flag: "🇷🇴", lat: 44.4268, lng: 26.1025 },
  { name: "Lagos", country: "Nigeria", flag: "🇳🇬", lat: 6.5244, lng: 3.3792 },
  { name: "Amsterdam", country: "Netherlands", flag: "🇳🇱", lat: 52.3676, lng: 4.9041 },
  { name: "Tehran", country: "Iran", flag: "🇮🇷", lat: 35.6892, lng: 51.389 },
  { name: "Sofia", country: "Bulgaria", flag: "🇧🇬", lat: 42.6977, lng: 23.3219 },
  { name: "Almaty", country: "Kazakhstan", flag: "🇰🇿", lat: 43.222, lng: 76.8512 },
  { name: "Rio de Janeiro", country: "Brazil", flag: "🇧🇷", lat: -22.9068, lng: -43.1729 },
  { name: "Hanoi", country: "Vietnam", flag: "🇻🇳", lat: 21.0285, lng: 105.8542 },
]

export const ATTACK_SIGNATURES = [
  {
    type: "SQL Injection Probe (UNION SELECT)",
    severity: "critical" as const,
    action: "DROPPED (nftables)" as const,
    rule: "PASAX-RULE-SQLI-019",
  },
  {
    type: "SSH Brute-Force Honeypot (Port 2222)",
    severity: "high" as const,
    action: "TARPIT (Honeypot)" as const,
    rule: "PASAX-RULE-SSH-BF-004",
  },
  {
    type: "Spring4Shell / Log4j RCE Probe",
    severity: "critical" as const,
    action: "DROPPED (nftables)" as const,
    rule: "PASAX-CVE-2022-22965",
  },
  {
    type: "Path Traversal Probe (/etc/passwd)",
    severity: "high" as const,
    action: "BLOCKED (Shield WAF)" as const,
    rule: "PASAX-RULE-DIR-TRAV-08",
  },
  {
    type: "WordPress xmlrpc.php Amplification",
    severity: "medium" as const,
    action: "DROPPED (nftables)" as const,
    rule: "PASAX-RULE-WP-XMLRPC",
  },
  {
    type: "Sensitive File Exposure (.env / .git)",
    severity: "high" as const,
    action: "BLOCKED (Shield WAF)" as const,
    rule: "PASAX-RULE-ENV-PROBE",
  },
  {
    type: "Aggressive SYN Flood / Port Sweep",
    severity: "critical" as const,
    action: "DROPPED (nftables)" as const,
    rule: "PASAX-RULE-SYN-FLOOD",
  },
]

export const REGIONS_VIEW = [
  { label: "N. AMERICA", lat: 39.5, lng: -98.35, zoom: 1.8 },
  { label: "S. AMERICA", lat: -14.23, lng: -51.92, zoom: 1.8 },
  { label: "EUROPE", lat: 50.85, lng: 15.25, zoom: 2.1 },
  { label: "AFRICA", lat: 1.65, lng: 17.3, zoom: 1.8 },
  { label: "ASIA", lat: 34.04, lng: 100.61, zoom: 1.8 },
  { label: "OCEANIA", lat: -25.27, lng: 133.77, zoom: 2.0 },
]

export function generateRandomAttack(): CyberAttackEvent {
  const origin = ATTACKER_ORIGINS[Math.floor(Math.random() * ATTACKER_ORIGINS.length)]
  const target = SENTINEL_NODES[Math.floor(Math.random() * SENTINEL_NODES.length)]
  const sig = ATTACK_SIGNATURES[Math.floor(Math.random() * ATTACK_SIGNATURES.length)]
  const ip = `${Math.floor(Math.random() * 200 + 20)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  const latency = parseFloat((0.08 + Math.random() * 0.16).toFixed(2))

  return {
    id: `atk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    type: sig.type,
    severity: sig.severity,
    attackerIp: ip,
    origin,
    targetNode: target,
    defenseAction: sig.action,
    latencyMs: latency,
    rule: sig.rule,
  }
}

