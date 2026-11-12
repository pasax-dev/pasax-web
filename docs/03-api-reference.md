# Chapter 03: Cloud Ingestion API Reference

## 1. Overview
`pasak-dashboard` exposes high-throughput REST API route handlers under `/api/v1/` to communicate seamlessly with `pasak-sentinel` daemons and external automation scripts.

---

## 2. Endpoints

### 2.1 Node Telemetry Ingestion
- **Route**: `POST /api/v1/nodes/telemetry`
- **Purpose**: Periodic heartbeat (default: every 60s) from client hosts.
- **Request Body**:
  ```json
  {
    "node_id": "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
    "project_id": "prj_prod_ecommerce",
    "timestamp": 1773070400,
    "system": {
      "hostname": "prod-vps-sg01",
      "ip_v4": "203.0.113.195",
      "os": "Ubuntu 24.04 LTS",
      "uptime_seconds": 1209600,
      "memory_used_percent": 42.8,
      "cpu_used_percent": 18.4
    },
    "webservers": {
      "nginx": {
        "installed": true,
        "running": true,
        "version": "1.24.0",
        "vhosts": [
          {
            "domain": "app.pasak.is-a.dev",
            "ssl_status": "valid",
            "ssl_expires_at": 1800272266,
            "upstream": "127.0.0.1:9000",
            "root": "/var/www/pasak-app/public"
          }
        ]
      }
    }
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "status": "success",
    "message": "Telemetry ingested",
    "node_id": "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
    "timestamp": 1773070400
  }
  ```

---

### 2.2 Threat Incident Reporting
- **Route**: `POST /api/v1/events/threat`
- **Purpose**: Real-time push notification when a FIM or WAF event occurs.
- **Request Body**:
  ```json
  {
    "node_id": "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
    "project_id": "prj_prod_ecommerce",
    "event_type": "FIM_MODIFICATION",
    "severity": "CRITICAL",
    "details": {
      "file_path": "/var/www/pasak-app/.env",
      "action": "FILE_MODIFIED",
      "hash_before": "e3b0...855",
      "hash_after": "c983...68b",
      "trigger_user": "www-data",
      "mitigation_action_taken": "PERMISSIONS_LOCKED_0600"
    },
    "timestamp": 1773070425
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "status": "success",
    "message": "Threat alert recorded",
    "incident_id": "thr_901a1c"
  }
  ```

---

### 2.3 Global IP Blocklist Sync
- **Route**: `GET /api/v1/threats/global-blocklist`
- **Purpose**: Polled by Sentinel agents to update local `nftables` kernel drop tables.
- **Response**: `200 OK` (JSON array of IPv4 strings)
  ```json
  [
    "198.51.100.42",
    "203.0.113.88",
    "45.134.20.19",
    "185.196.220.14"
  ]
  ```
- **Add IP**: `POST /api/v1/threats/global-blocklist` with `{"ip": "1.2.3.4"}`
- **Remove IP**: `DELETE /api/v1/threats/global-blocklist?ip=1.2.3.4`
