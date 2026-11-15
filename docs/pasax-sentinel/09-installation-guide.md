---
title: "Panduan Lengkap Instalasi & Deployment Sentinel"
description: "Langkah-langkah instalasi cepat satu baris (one-line installer), manual systemd, konfigurasi sentinel.yaml, dan integrasi Laravel WAF."
category: "Host & Kernel Defense"
order: 9
---

# Chapter 09: Panduan Lengkap Instalasi & Deployment Sentinel

Panduan resmi untuk memasang, mengonfigurasi, dan mengoperasikan **Pasax Sentinel** pada server VPS Linux (Ubuntu 20.04/22.04/24.04+, Debian 11/12+, RHEL 8/9+, AlmaLinux, Rocky Linux).

---

## 1. Metode 1: One-Line Installer Cepat (Rekomendasi)

Jalankan perintah berikut di terminal server Linux dengan hak akses `root` atau `sudo`:

```bash
curl -sSL https://raw.githubusercontent.com/pasax-dev/pasax-sentinel/main/scripts/install.sh | sudo bash -s -- \
  --token="<TOKEN_LISENSI_ANDA>" \
  --cloud-url="https://pasax-service.vercel.app"
```

### Opsi Parameter Skrip:
- `--token=...` : Token aktivasi lisensi dari dashboard [Pasax Market](https://pasax-web.vercel.app).
- `--cloud-url=...` : URL endpoint Cloud API (default: `https://pasax-service.vercel.app`).
- `--project=...` : ID Proyek (opsional, default: `default`).

Skrip otomatis melakukan:
1. Deteksi arsitektur sistem (AMD64 / ARM64).
2. Pemasangan binary Go ke `/usr/local/bin/pasax-sentinel`.
3. Pembuatan direktori `/etc/pasax` dan berkas konfigurasi `/etc/pasax/sentinel.yaml`.
4. Registrasi service `pasax-sentinel.service` di systemd.
5. Menyalakan daemon dan menguji pembukaan Unix Domain Socket di `/run/pasax/agent.sock`.

---

## 2. Metode 2: Instalasi Manual Step-by-Step

### Langkah 1: Siapkan Binary Sentinel
Kompilasi binary dari source code atau salin binary yang sudah dikompilasi:
```bash
# Jika kompilasi mandiri:
cd pasax-sentinel
make build-linux

# Pindahkan binary ke PATH sistem:
sudo cp bin/pasax-sentinel /usr/local/bin/pasax-sentinel
sudo chmod 755 /usr/local/bin/pasax-sentinel
```

### Langkah 2: Buat Direktori dan File Konfigurasi
```bash
sudo mkdir -p /etc/pasax /run/pasax
sudo nano /etc/pasax/sentinel.yaml
```

Salin template konfigurasi berikut:
```yaml
node_id: ""
license_key: "<TOKEN_LISENSI_ANDA>"

cloud:
  base_url: "https://pasax-service.vercel.app"
  activation_token: "<TOKEN_LISENSI_ANDA>"
  heartbeat_interval: 60s
  timeout: 10s

socket:
  enabled: true
  path: "/run/pasax/agent.sock"
  permissions: "0666"

fim:
  enabled: true
  watch_paths:
    - "/var/www"
  auto_lock_env: true

firewall:
  driver: "auto" # otomatis memilih nftables atau iptables
  dry_run: false
  default_ban_minutes: 1440

log_watcher:
  enabled: true
  files:
    - "/var/log/nginx/access.log"
    - "/var/log/apache2/access.log"

vhost:
  enabled: true
  nginx_dir: "/etc/nginx"
  apache_dir: "/etc/apache2"
```

### Langkah 3: Daftarkan Systemd Service
Buat berkas unit systemd di `/etc/systemd/system/pasax-sentinel.service`:
```ini
[Unit]
Description=Pasax Sentinel - Host Security & Firewall Daemon
After=network.target nginx.service apache2.service

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/pasax-sentinel -config /etc/pasax/sentinel.yaml
Restart=always
RestartSec=5s
LimitNOFILE=65536
CapabilityBoundingSet=CAP_NET_ADMIN CAP_DAC_OVERRIDE CAP_FOWNER
AmbientCapabilities=CAP_NET_ADMIN CAP_DAC_OVERRIDE CAP_FOWNER
RuntimeDirectory=pasax
RuntimeDirectoryMode=0755

[Install]
WantedBy=multi-user.target
```

### Langkah 4: Aktifkan Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now pasax-sentinel
sudo systemctl status pasax-sentinel
```

---

## 3. Menghubungkan Laravel WAF (`pasax/secure-monitor`)

Bila aplikasi Laravel berjalan di server yang sama:

1. Pastikan paket terpasang:
   ```bash
   composer require "pasax/secure-monitor:^1.0.0"
   php artisan pasax:install --migrate --with-dashboard
   ```

2. Tambahkan konfigurasi di `.env` Laravel:
   ```env
   PASAX_SENTINEL_ENABLED=true
   PASAX_SENTINEL_SOCKET=/run/pasax/agent.sock
   PASAX_SENTINEL_TIMEOUT=2.0
   ```

3. Uji komunikasi jembatan:
   ```bash
   php artisan pasax:sentinel --ping
   ```
   Output sukses: `PONG received: Sentinel daemon is active and responsive.`

4. Uji blokir kernel firewall:
   ```bash
   php artisan pasax:sentinel --block=198.51.100.99 --reason="VERIFY_INSTALL"
   ```

---

## 4. Pemantauan di Pasax Market Cloud Console

Setelah Sentinel aktif, buka:
- **Peta Ancaman Real-time**: [https://pasax-web.vercel.app/threats-map](https://pasax-web.vercel.app/threats-map)
- **Status Armada Server**: [https://pasax-web.vercel.app/dashboard](https://pasax-web.vercel.app/dashboard)

VPS Anda akan langsung muncul sebagai node terproteksi dalam status **ONLINE** dengan identifikasi arsitektur OS, beban CPU/RAM, dan status sertifikat SSL domain yang aktif.
