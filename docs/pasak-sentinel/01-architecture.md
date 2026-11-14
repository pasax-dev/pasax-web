# Chapter 01: Architecture & Runtime Design

## 1. Overview
`pasak-sentinel` is a standalone, single-binary daemon written in **Go 1.22+**. It bridges user-space web applications (such as Laravel via `pasak/shield`) with the underlying Linux kernel and web server layer (Nginx, Apache2, nftables, and inotify).

```
                      +------------------------------------------+
                      |         PASAK SENTINEL DAEMON            |
                      |                                          |
                      |  +----------------+  +----------------+  |
                      |  | FIM Controller |  |  IPC Socket    |  |
                      |  |   (fsnotify)   |  |   Server       |  |
                      |  +-------+--------+  +--------+-------+  |
                      |          |                    |          |
                      |  +-------v--------+  +--------v-------+  |
                      |  |   Log Watcher  |  | Firewall Driver|  |
                      |  | (Nginx/Apache) |  |   (nftables)   |  |
                      |  +-------+--------+  +--------+-------+  |
                      |          |                    |          |
                      |  +-------v--------------------v-------+  |
                      |  |      Cloud Telemetry Client        |  |
                      |  +--------------------+---------------+  |
                      +-----------------------|------------------+
                                              | HTTPS / mTLS
                                              v
                                    [ Pasak SaaS Cloud ]
```

## 2. Key Architectural Invariants
1. **Low Memory Footprint**: Standard operational RAM consumption is under **25MB**. All log parsing and file watching use stream generators without reading entire files into RAM.
2. **Egress-Only Network Communication**: The daemon never listens on external TCP ports. It communicates with Pasak Cloud strictly outbound over port `443` (TLS 1.3).
3. **Local IPC via Unix Domain Socket**: The daemon listens on a local Unix socket (`/run/pasak/agent.sock`), accessible only to the webserver process group (`www-data`).
4. **Panic-Safe Concurrency**: All goroutines are wrapped with recover handlers and coordinated via standard Go `context.Context` cancellation.

## 3. Systemd Service Deployment
The daemon runs as a supervised system service on Linux hosts:
```ini
[Unit]
Description=Pasak Sentinel Host Security Daemon
After=network.target nginx.service apache2.service

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/pasak-sentinel --config=/etc/pasak/sentinel.yaml
Restart=always
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```
