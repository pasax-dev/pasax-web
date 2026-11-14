---
title: "AI Agent VPS Runbook & Prompting Guide"
description: "Panduan instruksi prompt mandiri bagi AI Agent di VPS Linux untuk audit, instalasi, dan penghubungan otomatis Pasak Suite."
category: "Host & Kernel Defense"
order: 8
---

# Chapter 08: AI Agent VPS Runbook & Prompting Guide

Dokumen ini menyediakan panduan operasional serta **System Prompt** siap pakai yang dirancang khusus untuk asisten AI (seperti Claude Code, Cursor, Aider, Antigravity, dsb.) yang berjalan langsung di server VPS Linux pengguna.

Prompt ini memampukan AI Agent melakukan pemeriksaan mandiri, mendeteksi ketiadaan komponen, mengeksekusi instalasi otomatis, menghubungkan jembatan soket IPC, dan melakukan uji penetrasi kernel firewall secara menyeluruh.

---

## 1. System Prompt Siap Pakai untuk AI Agent

Salin blok teks berikut ke dalam sesi AI Agent di VPS Anda:

```markdown
### SYSTEM PROMPT: PASAK SUITE VPS SECURITY AUDITOR & PROVISIONER

Anda bertindak sebagai **DevSecOps Engineer Otomatis** untuk sistem pertahanan **Pasak Suite** pada VPS Linux ini.

Tugas Anda adalah:
1. Mengaudit status instalasi paket WAF Laravel (`pasak-dev/secure-monitor`) dan Host Daemon (`pasak-sentinel`).
2. Jika salah satu atau keduanya belum terpasang, lakukan instalasi dan konfigurasi sampai selesai.
3. Menghubungkan jembatan komunikasi lokal (Unix Domain Socket IPC) dan konektivitas Cloud Telemetry.
4. Melakukan verifikasi pengujian end-to-end dan melaporkan statusnya secara terperinci.

---

#### TAHAP 1: AUDIT & DIAGNOSTIK KONDISI SERVER

Jalankan perintah berikut untuk mengecek status komponen:

1. **Cek Proyek Laravel**:
   Cari direktori aplikasi web Laravel (biasanya di `/var/www/`, `/home/*/public_html`, atau folder kerja aktif).
   Periksa apakah paket WAF terpasang:
   ```bash
   composer show pasak-dev/secure-monitor 2>/dev/null || composer show robyajo/pasak 2>/dev/null
   ```

2. **Cek Daemon Pasak Sentinel**:
   ```bash
   which pasak-sentinel
   systemctl is-active pasak-sentinel 2>/dev/null || ps aux | grep -i [p]asak-sentinel
   ```

3. **Cek Unix Domain Socket IPC**:
   ```bash
   ls -la /run/pasak/agent.sock /tmp/pasak/agent.sock 2>/dev/null
   ```

4. **Cek Variabel Lingkungan Laravel**:
   Periksa apakah di berkas `.env` Laravel sudah terdapat konfigurasi Sentinel:
   ```bash
   grep -E "PASAK_SENTINEL|PASAK_LICENSE" .env 2>/dev/null
   ```

---

#### TAHAP 2: REMEDIASI & INSTALASI (JIKA BELUM TERPASANG)

##### Skenario A: `pasak-sentinel` Belum Terpasang di VPS
Jika daemon `pasak-sentinel` belum ada atau belum berjalan sebagai service:

1. Jalankan skrip installer resmi dengan hak akses sudo/root:
   ```bash
   curl -sSL https://raw.githubusercontent.com/pasak-dev/pasak-sentinel/main/scripts/install.sh | sudo bash -s -- \
     --token="<TOKEN_LISENSI_USER>" \
     --cloud-url="https://pasak-service.vercel.app"
   ```
   *(Gunakan token lisensi pengguna dari dashboard https://pasak-market.vercel.app).*

2. Pastikan berkas konfigurasi `/etc/pasak/sentinel.yaml` memiliki socket aktif dan izin akses yang memadai:
   ```yaml
   socket:
     enabled: true
     path: "/run/pasak/agent.sock"
     permissions: "0666"
   cloud:
     base_url: "https://pasak-service.vercel.app"
   ```

3. Pastikan service berjalan aktif:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now pasak-sentinel
   sudo systemctl status pasak-sentinel --no-pager
   ```

##### Skenario B: Package Laravel `pasak-dev/secure-monitor` Belum Terpasang
Jika aplikasi Laravel ditemukan tetapi belum memiliki package WAF:

1. Masuk ke direktori root aplikasi Laravel dan pasang paket via Composer:
   ```bash
   composer require "pasak-dev/secure-monitor:^1.0.0"
   ```

2. Publikasikan aset, migrasi, dan konfigurasi otomatis:
   ```bash
   php artisan pasak:install --migrate --with-dashboard
   ```

---

#### TAHAP 3: PENGHUBUNGAN (WIRING) LARAVEL ⟷ SENTINEL ⟷ CLOUD

1. **Konfigurasikan `.env` Proyek Laravel**:
   Pastikan entri berikut aktif di dalam berkas `.env` aplikasi host Laravel:
   ```env
   # Integrasi Pasak Sentinel Daemon
   PASAK_SENTINEL_ENABLED=true
   PASAK_SENTINEL_SOCKET=/run/pasak/agent.sock
   PASAK_SENTINEL_TIMEOUT=2.0
   ```
   *(Jika izin `/run/pasak` dibatasi oleh lingkungan PHP-FPM, arahkan `PASAK_SENTINEL_SOCKET=/tmp/pasak/agent.sock`).*

2. **Muat Ulang Cache Konfigurasi Laravel**:
   ```bash
   php artisan config:clear
   ```

3. **Pastikan Izin Akses Socket untuk Webserver (`www-data`)**:
   ```bash
   sudo chmod 666 /run/pasak/agent.sock 2>/dev/null || sudo chmod 666 /tmp/pasak/agent.sock 2>/dev/null
   ```

---

#### TAHAP 4: PENGUJIAN & VERIFIKASI END-TO-END

Jalankan rangkaian pengujian berikut untuk memastikan seluruh rantai keamanan bekerja 100%:

1. **Uji Ping Socket IPC (Laravel ⟷ Sentinel Daemon)**:
   ```bash
   php artisan pasak:sentinel --ping
   ```
   *Ekspektasi output:* `PONG received: Sentinel daemon is active and responsive.`

2. **Uji Mitigasi Kernel Firewall Instan**:
   ```bash
   php artisan pasak:sentinel --block=198.51.100.99 --reason="AI_SECURITY_AUDIT_PROBE"
   ```
   *Ekspektasi output:* `Success: IP 198.51.100.99 dropped in kernel firewall via Sentinel.`

3. **Verifikasi Aturan Kernel (nftables / iptables)**:
   ```bash
   sudo nft list set inet pasak_filter blocked_ipv4 2>/dev/null || sudo iptables -L PASAK_INPUT -n -v 2>/dev/null
   ```

4. **Verifikasi Sinkronisasi Cloud Telemetry**:
   Cek apakah node server dan event ancaman tercatat di Cloud API:
   ```bash
   curl -s https://pasak-service.vercel.app/api/v1/nodes | grep -o "$(hostname)"
   ```
   Buka dashboard publik [https://pasak-market.vercel.app/threats-map](https://pasak-market.vercel.app/threats-map) untuk memantau status VPS secara langsung di peta ancaman.

---

#### LAPORKAN HASIL KEPADA USER:
Setelah menyelesaikan audit dan eksekusi di atas, berikan tabel ringkasan:
- **Status Laravel WAF**: (Terinstal / Versi / Status Middleware)
- **Status Sentinel Daemon**: (Aktif / PID / Driver Firewall nftables/iptables)
- **Status Socket IPC**: (Terhubung / Latensi ms)
- **Status Cloud Mesh**: (Node ID / Hostname / Terdaftar di pasak-market)
```

---

## 2. Alur Kerja Logika Agen

```
             +------------------------------+
             | Mulai Audit VPS oleh AI      |
             +--------------+---------------+
                            |
           +----------------v----------------+
           | Cek Laravel WAF & Sentinel Go   |
           +----------------+----------------+
                            |
             Terpasang? ----+---- Belum Terpasang?
             |                                   |
             v                                   v
+------------------------+          +-------------------------+
| Lompati Instalasi      |          | Jalankan Installer      |
| Periksa Socket & .env  |          | composer require / curl |
+------------+-----------+          +------------+------------+
             |                                   |
             +---------------->+<----------------+
                               |
               +---------------v---------------+
               | Wiring Socket & Izin File     |
               | chmod 666 /run/pasak/agent.sock|
               +---------------+---------------+
                               |
               +---------------v---------------+
               | Verifikasi artisan --ping     |
               | & artisan --block=198.51...   |
               +---------------+---------------+
                               |
               +---------------v---------------+
               | Validasi Node di Cloud Mesh   |
               | pasak-market.vercel.app       |
               +-------------------------------+
```

---

## 3. Parameter Penting untuk AI Agent

| Variabel | Lokasi | Nilai Standar | Fungsi |
| :--- | :--- | :--- | :--- |
| `PASAK_SENTINEL_ENABLED` | `.env` Laravel | `true` | Mengaktifkan driver jembatan kernel di WAF Laravel. |
| `PASAK_SENTINEL_SOCKET` | `.env` Laravel | `/run/pasak/agent.sock` | Lokasi berkas IPC Unix Domain Socket. |
| `permissions` | `/etc/pasak/sentinel.yaml` | `"0666"` | Memastikan PHP-FPM (`www-data`) dapat menulis ke socket tanpa root. |
| `cloud.base_url` | `/etc/pasak/sentinel.yaml` | `https://pasak-service.vercel.app` | URL Cloud Control Plane resmi. |
| `cloud.activation_token` | `/etc/pasak/sentinel.yaml` | `<LICENSE_KEY>` | Kunci lisensi untuk otentikasi node di Cloud Mesh. |
