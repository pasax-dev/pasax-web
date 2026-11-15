# Chapter 03: Unix Domain Socket IPC

## 1. Overview
The IPC subsystem (`internal/ipc/socket.go`) provides an ultra-low latency (<0.2ms) communication channel between the PHP/Laravel application and the Go host daemon running as root.

## 2. Socket Specifications
- **Socket Path**: `/run/pasax/agent.sock`
- **File Mode**: `0660` (`srw-rw----`)
- **Group Ownership**: `www-data` (or Nginx/Apache worker group)
- **Protocol**: Text-based line-delimited commands: `COMMAND [ARGUMENTS]\n`

## 3. Supported Commands
| Command | Arguments | Description | Example Response |
| :--- | :--- | :--- | :--- |
| `PING` | None | Liveness check | `PONG` |
| `STATUS` | None | Host agent stats | `OK: {"uptime":12000, "banned_ips":14}` |
| `BAN_IP` | `<ip> [duration]` | Add IP to kernel firewall drop table | `OK: BANNED 198.51.100.42` |
| `UNBAN_IP`| `<ip>` | Remove IP from drop table | `OK: UNBANNED 198.51.100.42` |
| `CHECK_IP`| `<ip>` | Check if IP is currently banned | `OK: BANNED` or `OK: NOT_BANNED` |

## 4. Offloading Logic
When Laravel WAF detects a high-severity threat (e.g. credential stuffing or SQLi canary), instead of continuing to burn PHP-FPM CPU cycles returning 403 pages, it opens `/run/pasax/agent.sock` and writes:
```text
BAN_IP 198.51.100.42 86400
```
The Sentinel daemon executes an atomic firewall drop rule within **0.15ms**, terminating the TCP connection at the Linux network layer before it reaches PHP.
