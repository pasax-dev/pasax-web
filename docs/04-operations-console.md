# Chapter 04: Security Operations Matrix

## 1. Overview
The Security Operations Matrix ([`PasaxOperationsPanel`](../components/pasax-operations-panel.tsx)) is the main interactive control surface of the dashboard. It unifies four critical operational views into a tabbed layout:

---

## 2. Views Breakdown

### 2.1 Server Fleet (VPS Nodes)
- Visualizes health, CPU load, RAM utilization, Linux OS version, and uptime for every registered host.
- Color-coded progress bars alert operators to resource exhaustion.
- Shows real-time inotify FIM status and total discovered virtual hosts per server.

### 2.2 Threat Incidents Feed
- Continuous chronological stream of security incidents reported across the fleet.
- Severity levels:
  - `CRITICAL` (Red): FIM tampering with secrets (`.env`) or verified remote code execution attempts.
  - `HIGH` (Yellow/Orange): SQL Injection probes, path traversal scans, or webshell uploads.
  - `WARNING` (Neutral/Cyan): Honeypot tripwire triggers and port scanning.
- **Forensic Inspection**: Clicking **Details** opens a dialog displaying full JSON telemetry, attacker IP addresses, process PIDs, and cryptographic SHA-256 before/after hashes.

### 2.3 VHost & SSL Reconnaissance
- Aggregates all domains discovered across Nginx and Apache2 instances on all nodes.
- Shows upstream proxy destinations (e.g. `unix:/run/php/php8.2-fpm.sock` or `127.0.0.1:9000`).
- Monitors X.509 SSL certificate expiration countdowns, highlighting certificates needing renewal within 14 days.

### 2.4 Crowd Defense Blocklist
- Manages the network effect of the Pasax ecosystem: when an attacker targets Node A with an exploit, their IP is flagged here and automatically blocked at the kernel layer across Node B, Node C, and Node D before any request reaches their servers.
- Operators can manually ban or unban IPs directly from the UI.
