# Paket Langganan & Matriks Fitur — Pasak Defense Shield
**Target Segmen:** Korporat, BUMN, & Instansi Pemerintahan (Gov & Enterprise Ready)  
**Platform:** `pasak.is-a.dev` (Kernel-Level Linux VPS & Web Fleet Defense)

---

## 1. Ringkasan Skema Harga (Bulanan & Tahunan)

| Paket | Harga Bulanan | Harga Tahunan *(Hemat 2 Bulan)* | Kapasitas Node | Target Pengguna |
| :--- | :--- | :--- | :--- | :--- |
| **Community (Free)** | **Rp 0** *(Gratis Selamanya)* | **Rp 0** | **1 Node** | Uji coba / *Proof of Concept* (POC) & Pemantauan Awal |
| **Pro** | **Rp 399.000** / bulan | **Rp 3.990.000** / tahun *(Setara Rp 332.500/bln)* | **Maks. 2 Node** | Aplikasi Tunggal (1 Production + 1 Staging/DB) |
| **Enterprise** | **Rp 1.950.000** / bulan | **Rp 19.500.000** / tahun *(Setara Rp 1.625.000/bln)* | **Maks. 10 Node** | Korporat, Agensi Besar, & Instansi Pemerintah (SPBE/CSIRT) |

> **Catatan Skalabilitas Enterprise:**  
> * Tersedia *add-on* kapasitas server tambahan sebesar **Rp 150.000 / node / bulan** jika infrastruktur memiliki lebih dari 10 VPS/Server.  
> * Mendukung administrasi pengadaan B2B & Pemerintahan (Penawaran Resmi, Invoice, Kontrak/SPK, dan Faktur Pajak).

---

## 2. Matriks Perbandingan Fitur (Saat Ini / Current Release)

| Kategori & Fitur | Community (Free) | Pro | Enterprise |
| :--- | :---: | :---: | :---: |
| **Kapasitas & Arsitektur** | | | |
| Jumlah Maksimal Server / Node | **1 Node** | **2 Node** | **10 Node** |
| Mode Operasi Utama | **Passive Monitoring Only** *(Hanya Pantau)* | **Active Kernel Defense** *(Proteksi Aktif)* | **Full Autonomous Mesh** *(Proteksi Penuh)* |
| Footprint Agen Ringan (< 20 MB RAM) | Ya | Ya | Ya |
| Zero Open Inbound Ports (Egress-Only mTLS) | Ya | Ya | Ya |
| **Pertahanan Kernel & Jaringan (`nftables`)** | | | |
| Pemantauan Trafik & Deteksi Ancaman | Ya | Ya | Ya |
| Sub-0.2ms `nftables` Auto-Drop (Blokir Otomatis) | Tidak *(Log Only)* | **Ya (Aktif)** | **Ya (Aktif + Prioritas)** |
| Socket Honeypot (Deteksi Scanner & Bot) | Monitoring | **Aktif Blokir** | **Aktif Blokir** |
| Sinkronisasi Global Blacklist Antar-Node | Tidak | Tidak | **Ya (Fleet-Wide Sync)** |
| **Integritas Berkas & Anti-Deface (FIM)** | | | |
| Pemantauan Perubahan File Kritis (`.env`, `wp-config`, dll.) | Deteksi Saja | Deteksi & Blokir | Deteksi & Blokir |
| 11ms Auto-Remediasi & Kunci Izin File (`0600`) | Tidak | **Ya (Otomatis)** | **Ya (Otomatis + Karantina)** |
| Baseline SHA-256 & Pemindai Webshell | Ya (Manual) | Ya (Terjadwal) | **Ya (Real-Time Continuous)** |
| **Dashboard & SOC Console** | | | |
| Akses Cloud SOC Console & 360° Perimeter Radar | Ya (1 Node) | Ya (2 Node) | **Ya (Multi-Node Fleet View)** |
| Live Attack Map & Telemetri Real-Time | Ya | Ya | Ya |
| Retensi Log & Riwayat Insiden | **24 Jam** | **14 Hari** | **90 Hari** |
| **Sistem Notifikasi & Peringatan Dini** | | | |
| Notifikasi di Dashboard Web | Ya | Ya | Ya |
| **Email Alert** (Insiden Kritis & Ringkasan Harian) | Tidak | **Ya** | **Ya** |
| **Telegram Bot Alert** (Instan ke Personal / Grup Tim NOC) | Tidak | Tidak | **Ya (Real-Time)** |
| **Pelaporan, Kepatuhan & Dukungan** | | | |
| Ekspor Laporan Audit Keamanan (PDF / CSV) | Tidak | Tidak | **Ya (Siap Audit SPBE/CSIRT)** |
| Dukungan Teknis & SLA | Komunitas / Dokumentasi | Email Support (2x24 Jam) | **Priority Support (Grup WA/Telegram + SLA)** |

---

## 3. Rincian Mendalam per Paket

### A. Paket Community (Free) — *Rp 0 / bulan*
Dirancang bagi administrator sistem dan tim IT instansi untuk melakukan instalasi cepat (*one-line installer*) dan melihat visibilitas serangan nyata yang mengarah ke server mereka tanpa risiko pemblokiran yang tidak disengaja.
* **Fitur Utama:**
  * Pemasangan agen pada **1 Node VPS Linux**.
  * Mode **Passive Monitoring**: Mencatat percobaan intrusi, pemindaian port, dan perubahan file ke *SOC Console* tanpa melakukan intervensi pemblokiran.
  * Akses penuh ke *Live Radar* dan *Telemetry Dashboard* dengan penyimpanan log selama 24 jam.

### B. Paket Pro — *Rp 399.000 / bulan* *(atau Rp 3.990.000 / tahun)*
Dirancang untuk mengamankan aplikasi produksi berskala kecil hingga menengah yang memisahkan server aplikasi utama dan server *database/staging*.
* **Fitur Utama:**
  * Perlindungan penuh hingga **2 Node VPS Linux**.
  * **Active Kernel Shield:** Pemblokiran otomatis IP penyerang langsung di level kernel (`nftables`) dalam waktu < 0,2 milidetik.
  * **11ms File Integrity Auto-Lock:** Secara otomatis mengembalikan hak akses (`0600`) dan mencegah modifikasi ilegal pada file konfigurasi sensitif seperti `.env` untuk mencegah penyusupan *webshell* atau halaman judi online.
  * **Notifikasi Email Otomatis:** Peringatan langsung ke email admin ketika terdeteksi serangan tingkat tinggi atau upaya perubahan berkas sistem, dilengkapi retensi log 14 hari.

### C. Paket Enterprise — *Rp 1.950.000 / bulan* *(atau Rp 19.500.000 / tahun)*
Solusi pertahanan siber terpusat kelas *enterprise* untuk perusahaan, BUMN, dan instansi pemerintahan yang membutuhkan proteksi aktif lintas server, respons cepat tim NOC/CSIRT, serta dokumentasi kepatuhan audit.
* **Fitur Utama:**
  * Perlindungan terpusat hingga **10 Node VPS Linux** dalam satu konsol (*Fleet Management*).
  * **Notifikasi Ganda Real-Time (Telegram & Email):** Integrasi langsung dengan **Telegram Bot** untuk mengirim peringatan instan ke grup tim IT/NOC/CSIRT lengkap dengan detail IP penyerang, lokasi geografis, dan status mitigasi.
  * **Autonomous Fleet Mesh:** Jika satu node mendeteksi serangan berbahaya, seluruh 9 node lainnya dalam jaringan otomatis memblokir IP tersebut secara serentak.
  * **Laporan Audit Keamanan Bulanan (PDF/CSV):** Dokumentasi otomatis statistik serangan yang berhasil ditangkal dan status integritas sistem untuk kebutuhan pelaporan manajemen, audit internal, maupun standar SPBE/CSIRT.
  * **Dukungan Prioritas & Administrasi Korporat:** Akses saluran komunikasi langsung dengan tim *engineer* Pasak serta kelengkapan dokumen pengadaan (Invoice resmi, Faktur Pajak, dan kontrak kerja sama).

---

## 4. Roadmap Fitur yang Akan Diadakan (Upcoming Releases)

Berikut adalah daftar pengembangan fitur yang direncanakan untuk meningkatkan nilai tambah pada pembaruan versi mendatang (khususnya bagi pelanggan **Pro** dan **Enterprise**):

### Fase 1: Peningkatan Respons & Otomasi (Q1 – Q2)
1. **Interactive Telegram Command & Action Buttons *(Enterprise)*:**
   * Admin dapat melakukan *unblock* IP, mengunci server (*lockdown mode*), atau mengecek status kesehatan CPU/RAM seluruh node langsung dari tombol interaktif di chat Telegram.
2. **Webhook & SIEM Integration *(Enterprise)*:**
   * Pengiriman log keamanan dalam format standar JSON/Syslog ke platform eksternal seperti Slack, Microsoft Teams, Wazuh, atau Splunk milik instansi.
3. **Custom Whitelist & Geo-Fencing Policy *(Pro & Enterprise)*:**
   * Pengaturan aturan blokir berbasis negara (misal: hanya mengizinkan akses SSH/Admin dari IP Indonesia) dan manajemen daftar putih IP kantor/VPN terpusat dari dashboard.

### Fase 2: Forensik & Kepatuhan Lanjutan (Q3 – Q4)
4. **Forensic File Diff & Auto-Restore Snapshot *(Enterprise)*:**
   * Tidak hanya mengunci izin file `.env` atau *source code*, sistem akan menyimpan cadangan bersih (*clean snapshot*) dan otomatis memulihkan isi file jika terdeteksi injeksi kode berbahaya, disertai laporan perbandingan baris (*diff*).
5. **Multi-User Role-Based Access Control / RBAC *(Enterprise)*:**
   * Pembagian hak akses dashboard berdasarkan peran tim (misal: *Super Admin*, *Security Analyst*, dan *Auditor Read-Only*).
6. **Compliance Readiness Checklist — SPBE & ISO 27001 *(Enterprise)*:**
   * Modul penilaian mandiri (*self-assessment*) otomatis di dalam dashboard yang memetakan konfigurasi keamanan server terhadap standar keamanan informasi pemerintah dan industri.