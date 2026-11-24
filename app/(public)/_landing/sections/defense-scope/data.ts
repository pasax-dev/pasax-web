export type ProtectionCategory = 'all' | 'web' | 'kernel' | 'fim' | 'fleet';

export interface ThreatVector {
  id: string;
  category: 'web' | 'kernel' | 'fim' | 'fleet';
  title: string;
  badge: string;
  layer: string;
  speed: string;
  threatDescription: string;
  pasaxSolution: string;
  technicalMechanism: string;
  href: string;
  linkText: string;
}

export const CATEGORIES: { id: ProtectionCategory; label: string; count: number }[] = [
  { id: 'all', label: 'Semua Perlindungan', count: 12 },
  { id: 'web', label: 'Aplikasi Web & WAF (L7)', count: 3 },
  { id: 'kernel', label: 'Kernel & Jaringan (L3/L4)', count: 3 },
  { id: 'fim', label: 'Integritas Berkas (FIM)', count: 3 },
  { id: 'fleet', label: 'Armada & Intelijen (SOC)', count: 3 },
];

export const THREAT_VECTORS: ThreatVector[] = [
  // Web & WAF (L7)
  {
    id: 'sqli-injection',
    category: 'web',
    title: 'SQL Injection & Data Extraction',
    badge: 'OWASP TOP 10',
    layer: 'L7 PHP WAF',
    speed: '< 0.15ms',
    threatDescription:
      'Penyerang menyuntikkan payload SQL blind/union pada input form atau query parameter untuk membocorkan database, mengambil password hash, dan data pelanggan.',
    pasaxSolution:
      'Pasax Shield menginspeksi payload HTTP langsung di memori worker secara in-memory, membatalkan request jahat seketika, dan mengisolasi session penyerang.',
    technicalMechanism: 'Pure PHP in-memory token scanner & zero-dependency regex AST analysis.',
    href: '/docs/pasax-secure-monitor',
    linkText: 'Pelajari PHP WAF',
  },
  {
    id: 'xss-rce',
    category: 'web',
    title: 'XSS, RCE & Webshell Injection',
    badge: 'REMOTE CODE EXECUTION',
    layer: 'L7 PHP WAF',
    speed: '< 0.18ms',
    threatDescription:
      'Eksploitasi file upload dan celah deserialisasi yang mencoba mengeksekusi webshell tersembunyi (c99/r57/b374k) atau menyuntikkan skrip jahat pada browser pengguna.',
    pasaxSolution:
      'Mendeteksi pola eksekusi berbahaya seperti system(), passthru(), dan base64 execution, mengunci request sebelum PHP interpreter sempat mengeksekusinya.',
    technicalMechanism: 'Automated opcode filter & multipart upload stream quarantine.',
    href: '/docs/pasax-secure-monitor',
    linkText: 'Inspeksi Payload RCE',
  },
  {
    id: 'stepped-bruteforce',
    category: 'web',
    title: 'Stepped Brute-Force & Credential Stuffing',
    badge: 'ACCOUNT TAKEOVER',
    layer: 'L7 AUTH SHIELD',
    speed: 'Instant Lockout',
    threatDescription:
      'Bot jaringan mencoba ribuan kombinasi password pada rute /login, /admin, atau API autentikasi tanpa henti, menghabiskan koneksi database MySQL.',
    pasaxSolution:
      'Menerapkan penguncian bertingkat cerdas (1m, 15m, 1h, hingga 24h) pada IP penyerang tanpa query database berulang, melindungi akun pengguna dari pengambilalihan.',
    technicalMechanism: 'Decentralized local cache state lockout with progressive penalty multipliers.',
    href: '/docs/pasax-secure-monitor',
    linkText: 'Konfigurasi Brute-Force',
  },

  // Kernel & Network (L3/L4)
  {
    id: 'volumetric-ddos',
    category: 'kernel',
    title: 'Volumetric DDoS & SYN Floods',
    badge: 'LAYER 3/4 MITIGATION',
    layer: 'KERNEL NETFILTER',
    speed: '< 0.04ms Drop',
    threatDescription:
      'Banjir ratusan ribu paket SYN atau UDP flood palsu yang memenuhi antrean socket Linux, menyebabkan CPU 100% dan web server (Nginx/Apache) tidak merespons.',
    pasaxSolution:
      'Pasax Sentinel langsung memasang filter pada Linux nftables netfilter. Paket penyerang di-drop langsung di kernel stack pada kecepatan kawat (wire-speed).',
    technicalMechanism: 'Hardware & nftables set hooks before userspace context-switch overhead.',
    href: '/docs/pasax-sentinel',
    linkText: 'Lihat Kernel Benchmark',
  },
  {
    id: 'port-recon',
    category: 'kernel',
    title: 'Port Scanners & Host Reconnaissance',
    badge: 'RECON BLOCKED',
    layer: 'KERNEL NETFILTER',
    speed: 'Sub-millisecond',
    threatDescription:
      'Pemindai agresif otomatis dari Shodan, Censys, atau Masscan yang memetakan port terbuka untuk mencari layanan database dan celah belum ditambal.',
    pasaxSolution:
      'Secara cerdas memotong pemindaian port beruntun dan membungkam respon TCP ACK/RST (stealth drop), membuat server Anda seolah-olah tidak ada di internet.',
    technicalMechanism: 'Syn-scan rate limiter & stealth silent-drop connection tracking tables.',
    href: '/docs/pasax-sentinel',
    linkText: 'Dokumentasi Sentinel',
  },
  {
    id: 'honeypot-traps',
    category: 'kernel',
    title: 'Honeypot Decoy Traps (.env & phpmyadmin)',
    badge: 'PROACTIVE TRAP',
    layer: 'L4/L7 TRINITY',
    speed: 'Immediate Trap',
    threatDescription:
      'Bot liar merayapi endpoint sensitif umum seperti /.git/config, /.env, /xmlrpc.php, /wp-admin, dan /phpmyadmin untuk mencuri kredensial server.',
    pasaxSolution:
      'Pasax memasang rute umpan palsu (tarpit decoy). Saat bot memanggil rute ini, IP penyerang langsung diidentifikasi sebagai penyerang berbahaya dan diblokir total.',
    technicalMechanism: 'Synthetic honeypot endpoints with immediate IPC trigger to Sentinel firewall.',
    href: '/docs/pasax-sentinel',
    linkText: 'Pelajari Honeypot',
  },

  // File Integrity Monitoring (FIM)
  {
    id: 'env-tampering',
    category: 'fim',
    title: 'Pencurian & Perubahan Berkas .env Kritis',
    badge: 'AUTO-HEALING 11ms',
    layer: 'KERNEL INOTIFY',
    speed: '11ms Response',
    threatDescription:
      'Kerentanan file upload atau malware lokal mencoba membaca, menimpa, atau menyalin berkas .env untuk mengekstrak DB_PASSWORD, JWT_SECRET, dan API keys.',
    pasaxSolution:
      'Sentinel memantau berkas rahasia secara real-time via Linux inotify. Jika ada akses/modifikasi tidak sah, izin berkas langsung dikunci paksa ke 0600 dan snapshot tersimpan.',
    technicalMechanism: 'Inotify kernel subsystem event listener with atomic permission enforcement.',
    href: '/docs/pasax-sentinel/features/fim-realtime',
    linkText: 'Eksplorasi Inotify FIM',
  },
  {
    id: 'config-hijack',
    category: 'fim',
    title: 'Manipulasi Konfigurasi Nginx & PHP-FPM',
    badge: 'SYSTEM TAMPER GUARD',
    layer: 'KERNEL INOTIFY',
    speed: 'Realtime Alert',
    threatDescription:
      'Script jahat atau proses latar belakang yang disusupi mencoba mengubah konfigurasi reverse proxy atau parameter memory_limit pada pool PHP-FPM.',
    pasaxSolution:
      'Melindungi direktori /etc/nginx/ dan /etc/php/ dari penulisan diam-diam, mencatat diff modifikasi berkas, dan memicu peringatan darurat seketika.',
    technicalMechanism: 'Cryptographic SHA-256 baseline hashing & filesystem diff tracking.',
    href: '/docs/pasax-sentinel/features/fim-realtime',
    linkText: 'Lihat Mekanisme FIM',
  },
  {
    id: 'webshell-persistence',
    category: 'fim',
    title: 'Injeksi Backdoor & Web Shell Persistence',
    badge: 'ZERO PERSISTENCE',
    layer: 'FILESYSTEM GUARD',
    speed: '< 20ms Quarantine',
    threatDescription:
      'Penyerang menyusupkan skrip backdoor tersembunyi ke dalam folder public/uploads atau storage/framework/views agar bisa masuk kembali kapan saja.',
    pasaxSolution:
      'Mendeteksi pembuatan berkas eksekusi baru di direktori statis, memotong hak eksekusi berkas secara atomik, dan mengisolasi berkas ke ruang karantina.',
    technicalMechanism: 'Static directory write monitor & automatic execute bit revocation.',
    href: '/docs/pasax-sentinel/features/fim-realtime',
    linkText: 'Pelajari Karantina',
  },

  // Fleet & Collective Intelligence (SOC)
  {
    id: 'crowd-defense',
    category: 'fleet',
    title: 'Pertahanan Kolektif (Crowd Defense Blocklist)',
    badge: 'COLLECTIVE IMMUNITY',
    layer: 'GLOBAL CLOUD SOC',
    speed: 'Sub-second Sync',
    threatDescription:
      'Serangan terdistribusi dari botnet yang menyerang satu server Anda atau server anggota lain di jaringan publik.',
    pasaxSolution:
      'Saat satu node mendeteksi serangan terkonfirmasi, IP penyerang otomatis didistribusikan ke seluruh node armada server Anda sehingga node lain langsung kebal sebelum diserang.',
    technicalMechanism: 'Peer-to-peer cloud telemetry ledger with weighted reputation scoring.',
    href: '/threats-map',
    linkText: 'Buka Threat Map 3D',
  },
  {
    id: 'oom-protection',
    category: 'fleet',
    title: 'Pencegahan OOM Crash & Hemat Memori (<18MB)',
    badge: 'ULTRA LIGHTWEIGHT',
    layer: 'HOST RESILIENCE',
    speed: '< 18MB RAM',
    threatDescription:
      'Tool keamanan konvensional (Wazuh, OSSEC, Java agents) memakan 800MB–2GB RAM, memicu Linux OOM-killer yang mematikan database MySQL atau Nginx Anda.',
    pasaxSolution:
      'Pasax Sentinel dikompilasi statis dalam Go murni dengan konsumsi RAM hanya ~14–18MB dan CPU < 0.2%. VPS hemat 1GB Anda tetap bekerja kencang tanpa risiko crash.',
    technicalMechanism: 'Zero-garbage-collection native Go daemon with zero external C-dependencies.',
    href: '/docs/pasax-sentinel',
    linkText: 'Lihat Arsitektur Ringan',
  },
  {
    id: 'ssl-vhost-recon',
    category: 'fleet',
    title: 'Surveilans Kedaluwarsa SSL/TLS & Virtual Host',
    badge: 'AUTO RECONNAISSANCE',
    layer: 'CENTRAL CONSOLE',
    speed: '24/7 Monitoring',
    threatDescription:
      'Sertifikat SSL/TLS kedaluwarsa tanpa sengaja atau konfigurasi DNS domain rusak yang mengakibatkan situs web Anda ditandai berbahaya oleh Google Chrome.',
    pasaxSolution:
      'Memantau otomatis masa berlaku SSL seluruh domain/vhost Anda dari satu dashboard terpusat, memberikan peringatan dini sebelum sertifikat kedaluwarsa.',
    technicalMechanism: 'Automated TLS handshake inspector & DNS health polling engine.',
    href: '/dashboard',
    linkText: 'Lihat Portal Konsol',
  },
];
