#!/usr/bin/env bash
# Pasax Sentinel Provisioning & Installation Script
# Usage:
#   curl -sSL https://pasax.web.id/install.sh | sudo bash -s -- --token=PSK_TOKEN --project=prj_id

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

TOKEN=""
PROJECT="default"
CLOUD_URL="https://pasax.web.id"

while [[ $# -gt 0 ]]; do
  case $1 in
    --token=*)
      TOKEN="${1#*=}"
      shift
      ;;
    --token)
      TOKEN="$2"
      shift 2
      ;;
    --project=*)
      PROJECT="${1#*=}"
      shift
      ;;
    --project)
      PROJECT="$2"
      shift 2
      ;;
    --cloud-url=*)
      CLOUD_URL="${1#*=}"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

echo -e "${BLUE}${BOLD}=====================================================${NC}"
echo -e "${BLUE}${BOLD}          PASAX SENTINEL HOST AGENT INSTALLER        ${NC}"
echo -e "${BLUE}${BOLD}=====================================================${NC}"

if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] Skrip ini harus dijalankan sebagai root (sudo).${NC}"
   exit 1
fi

# Detect Linux Distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=${VERSION_ID:-"unknown"}
    echo -e "${GREEN}[+] Mendeteksi Sistem Operasi: ${OS} ${VER}${NC}"
else
    echo -e "${RED}[ERROR] Sistem operasi tidak didukung (file /etc/os-release tidak ditemukan).${NC}"
    exit 1
fi

# Detect Architecture
ARCH_RAW=$(uname -m)
case "${ARCH_RAW}" in
  x86_64)
    ARCH="amd64"
    ;;
  aarch64|arm64)
    ARCH="arm64"
    ;;
  *)
    echo -e "${RED}[ERROR] Arsitektur CPU ${ARCH_RAW} tidak didukung.${NC}"
    exit 1
    ;;
esac
echo -e "${GREEN}[+] Arsitektur CPU: ${ARCH}${NC}"

# Create Directories
mkdir -p /etc/pasax
mkdir -p /run/pasax
mkdir -p /usr/local/bin

# Install Sentinel Binary
echo -e "${GREEN}[+] Menyiapkan binary /usr/local/bin/pasax-sentinel...${NC}"
BINARY_SRC=""
if [ -f "/usr/local/bin/pasax-sentinel" ] && [ -x "/usr/local/bin/pasax-sentinel" ]; then
    BINARY_SRC="/usr/local/bin/pasax-sentinel"
elif [ -f "./pasax-sentinel-linux-${ARCH}" ]; then
    BINARY_SRC="./pasax-sentinel-linux-${ARCH}"
elif [ -f "./bin/pasax-sentinel-linux-${ARCH}" ]; then
    BINARY_SRC="./bin/pasax-sentinel-linux-${ARCH}"
elif [ -f "./bin/pasax-sentinel" ]; then
    BINARY_SRC="./bin/pasax-sentinel"
elif [ -f "./pasax-sentinel" ]; then
    BINARY_SRC="./pasax-sentinel"
fi

if [ -n "${BINARY_SRC}" ]; then
    echo -e "${GREEN}[+] Menggunakan binary yang sudah tersedia: ${BINARY_SRC}${NC}"
    if [ "${BINARY_SRC}" != "/usr/local/bin/pasax-sentinel" ]; then
        cp "${BINARY_SRC}" /usr/local/bin/pasax-sentinel
    fi
else
    # CDN Fallbacks: pasax.web.id -> github release
    DOWNLOAD_URLS=(
        "https://pasax.web.id/downloads/pasax-sentinel-linux-${ARCH}"
        "https://github.com/pasax-dev/pasax-sentinel/releases/latest/download/pasax-sentinel-linux-${ARCH}"
    )

    DOWNLOADED=0
    for URL in "${DOWNLOAD_URLS[@]}"; do
        echo -e "${GREEN}[+] Mengunduh binary dari: ${URL}...${NC}"
        if curl -sSL --fail -o /usr/local/bin/pasax-sentinel "${URL}"; then
            DOWNLOADED=1
            break
        fi
    done

    if [ ${DOWNLOADED} -eq 0 ]; then
        echo -e "${YELLOW}[!] Unduhan binary gagal. Memeriksa ketersediaan Go compiler...${NC}"
        if command -v go >/dev/null 2>&1; then
            echo -e "${GREEN}[+] Mengompilasi langsung dari source code...${NC}"
            go build -o /usr/local/bin/pasax-sentinel ./cmd/pasax-sentinel
        else
            echo -e "${RED}[ERROR] Gagal mendapatkan binary pasax-sentinel.${NC}"
            exit 1
        fi
    fi
fi
chmod 755 /usr/local/bin/pasax-sentinel

# Generate Configuration
echo -e "${GREEN}[+] Membuat konfigurasi /etc/pasax/sentinel.yaml...${NC}"
cat <<EOF > /etc/pasax/sentinel.yaml
node_id: ""
project_id: "${PROJECT}"
license_key: "${TOKEN}"

cloud:
  base_url: "${CLOUD_URL}"
  activation_token: "${TOKEN}"
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
  driver: "auto"
  dry_run: false
  default_ban_minutes: 1440

log_watcher:
  enabled: true
  files:
    - "/var/log/nginx/access.log"
    - "/var/log/apache2/access.log"
    - "/var/log/apache2/other_vhosts_access.log"

vhost:
  enabled: true
  nginx_dir: "/etc/nginx"
  apache_dir: "/etc/apache2"
EOF

# Install systemd unit
echo -e "${GREEN}[+] Mendaftarkan systemd service...${NC}"
cat <<EOF > /etc/systemd/system/pasax-sentinel.service
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
EOF

# Reload and Enable
systemctl daemon-reload
systemctl enable --now pasax-sentinel.service
echo -e "\n${GREEN}${BOLD}[✓] Instalasi Pasax Sentinel selesai & aktif!${NC}"
echo -e "${BLUE}Periksa status daemon dengan: 'systemctl status pasax-sentinel'${NC}\n"
