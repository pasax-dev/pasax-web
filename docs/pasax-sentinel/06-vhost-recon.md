# Chapter 06: VHost & SSL Reconnaissance

## 1. Overview
The VHost discovery engine (`internal/vhost/discovery.go`) maps all active domains, upstream targets, and SSL certificates running on the host without requiring manual configuration.

## 2. Discovery Mechanics
- **Nginx Reconnaissance**:
  - Scans `/etc/nginx/sites-enabled/` and `/etc/nginx/conf.d/`.
  - Extracts `server_name` directives.
  - Resolves `fastcgi_pass` or `proxy_pass` upstream targets (e.g. `unix:/run/php/php8.2-fpm.sock` or `127.0.0.1:9000`).
  - Reads `ssl_certificate` paths.
- **Apache2 Reconnaissance**:
  - Executes `apache2ctl -S` (or inspects `/etc/apache2/sites-enabled/`).
  - Extracts `ServerName`, `ServerAlias`, and `SSLCertificateFile`.

## 3. Cryptographic X.509 Certificate Inspection
For every discovered SSL certificate file:
1. Reads the PEM block and parses `x509.Certificate`.
2. Validates `NotBefore` and `NotAfter` timestamps.
3. Evaluates SSL status:
   - `valid`: More than 14 days remaining.
   - `expiring_soon`: Between 0 and 14 days remaining.
   - `expired`: Current timestamp is past `NotAfter`.
4. Transmits discovered metadata in the next telemetry payload so Pasax Cloud can alert administrators before certificates expire.
