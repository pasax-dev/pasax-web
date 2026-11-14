# Chapter 05: Asynchronous Log Watcher

## 1. Overview
The log watcher (`internal/logwatcher/tailer.go`) asynchronously inspects webserver logs (Nginx & Apache2) in real time to catch probe patterns that bypass PHP (e.g. static asset scans, non-PHP URLs, and webserver-level errors).

## 2. Monitored Log Paths
- Nginx: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- Apache2: `/var/log/apache2/access.log` and `/var/log/apache2/error.log`
- Custom paths configured in `config/sentinel.yaml`

## 3. Exploit Signatures
The tailer evaluates each incoming line against pre-compiled regex tripwires:
- **Path Traversal Probes**: `(?i)(\.\./|\.\.\\|/etc/passwd|/proc/self)`
- **SQL Injection Canary**: `(?i)(union\s+select|information_schema|order\s+by\s+\d+|benchmark\(|sleep\(\d+\))`
- **Webshell Drops**: `(?i)(\.php\.(jpg|png|gif)|\.php%00|/eval-stdin\.php|c99\.php|r57\.php)`
- **WordPress Probes on Laravel**: `(?i)(/wp-admin/|/wp-includes/|/wp-content/|/xmlrpc\.php)`

## 4. Threshold & Ban Trigger
When an offender IP exceeds the configured violation threshold (default: 3 violations in 60 seconds), the watcher:
1. Calls the firewall driver to drop the IP for 24 hours.
2. Emits a `LOG_VIOLATION` event to the Cloud Telemetry queue.
