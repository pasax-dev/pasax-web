# Chapter 03: Cloud Ingestion API Reference

## 1. Overview
`pasak-dashboard` exposes high-throughput REST API route handlers under `/api/v1/` to communicate seamlessly with `pasak-sentinel` daemons, `pasak-dev/secure-monitor` (`Pasak\SecureMonitor`) Laravel instances, and external automation scripts.

---

## 2. Endpoints

### 2.1 Node & Application Telemetry Ingestion
- **Route**: `POST /api/v1/nodes/telemetry`
- **Purpose**: Periodic heartbeat (default: every 60s) from client hosts and Laravel application instances.
- **Request Body (Host / Node)**:
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
- **Purpose**: Real-time push notification when a FIM (File Integrity Monitoring) or WAF (Web Application Firewall) event occurs.
- **Request Body (FIM Modification Event)**:
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
- **Request Body (WAF Threat from `pasak-dev/secure-monitor`)**:
  ```json
  {
    "node_id": "nd_01HW8P9Y124XQW7V6B9R41ZX9A",
    "project_id": "prj_prod_ecommerce",
    "event_type": "WAF_BLOCK",
    "severity": "HIGH",
    "details": {
      "attacker_ip": "198.51.100.42",
      "threat_type": "SQL_INJECTION",
      "rule_matched": "UNION_SELECT_PROBE",
      "request_uri": "/api/users?id=1' UNION SELECT * FROM users--",
      "user_agent": "sqlmap/1.7#stable",
      "blocked_duration": 2592000,
      "source_package": "pasak-dev/secure-monitor",
      "namespace": "Pasak\\SecureMonitor"
    },
    "timestamp": 1773070430
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
- **Purpose**: Polled by Sentinel agents and Laravel WAF instances to sync malicious attacker IPs.
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
