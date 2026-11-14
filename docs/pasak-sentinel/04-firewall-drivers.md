# Chapter 04: Kernel Firewall Drivers

## 1. Overview
The firewall subsystem (`internal/firewall/firewall.go`) abstracts Linux packet filtering engines so that Pasak Sentinel can enforce IP bans on any standard Linux distribution.

## 2. Driver Hierarchy
Sentinel automatically detects available packet filtering tools at startup:
1. **`nftables` (Preferred)**: Modern Linux firewall standard (Ubuntu 22.04+, Debian 11+, RHEL 8+).
2. **`iptables` (Legacy Fallback)**: Classical Netfilter interface.
3. **`mock` (Development / Test)**: In-memory simulation driver for macOS/BSD development and unit tests.

## 3. Implementation Details

### 3.1 `nftables` Architecture
Uses a dedicated table and named set to achieve $O(1)$ packet matching regardless of whether 10 or 100,000 IPs are banned:
```nft
table inet pasak_filter {
    set pasak_input {
        type ipv4_addr
        flags timeout
    }
    chain input {
        type filter hook input priority -10; policy accept;
        ip saddr @pasak_input drop
    }
}
```
Banning an IP executes:
```bash
nft add element inet pasak_filter pasak_input { 198.51.100.42 timeout 86400s }
```

### 3.2 `iptables` Architecture
Creates an isolated custom chain:
```bash
iptables -N PASAK_BLOCK
iptables -I INPUT -j PASAK_BLOCK
iptables -A PASAK_BLOCK -s 198.51.100.42 -j DROP
```
