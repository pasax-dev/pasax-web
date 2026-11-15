# Chapter 07: Cloud Telemetry & Sync Client

## 1. Overview
The cloud client (`internal/cloud/client.go`) manages bi-directional telemetry and threat exchange between the Sentinel host daemon and Pasax Cloud Central Console.

## 2. Telemetry Ingestion Contract
Every 60 seconds (configurable), Sentinel dispatches a heartbeat payload:
- **Endpoint**: `POST /api/v1/nodes/telemetry`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <PSK_ACTIVATION_TOKEN>`
- **Payload Schema**:
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
        "vhosts": [...]
      }
    }
  }
  ```

## 3. Threat Incident Reporting
When a FIM violation or log exploit occurs:
- **Endpoint**: `POST /api/v1/events/threat`
- Dispatches immediately without waiting for the heartbeat interval.

## 4. Global Crowdsourced Blocklist Sync
- **Endpoint**: `GET /api/v1/threats/global-blocklist`
- Sentinel periodically pulls the global blocklist and adds any newly identified malicious IPs to the local `nftables` or `iptables` drop set.

## 5. Offline FIFO Queue Buffer
If network connectivity to Pasax Cloud is lost:
1. Threat events are queued in a thread-safe in-memory FIFO ring buffer (max 500 events).
2. Local enforcement (FIM locking, socket IPC, firewall drop) continues without interruption.
3. Once the next telemetry heartbeat succeeds, the offline queue is automatically flushed to the cloud.
