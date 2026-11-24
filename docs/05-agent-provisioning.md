# Chapter 05: Agent Provisioning & Onboarding

## 1. Overview
The agent provisioning subsystem ([`InstallAgentDialog`](../components/install-agent-dialog.tsx)) enables zero-friction onboarding of new customer Linux servers into the Pasax Cloud mesh.

## 2. Onboarding Workflow
1. An administrator clicks **"+ Deploy Sentinel Agent"** in the top navigation bar.
2. The modal displays a cryptographically signed, single-command installation snippet:
   ```bash
   curl -sSL https://get.pasax.web.id/install.sh | sudo bash -s -- --token=PSK_LIVE_8f9c2d14b
   ```
3. The host installer executes:
   - Linux distro auto-detection (Ubuntu, Debian, RHEL, AlmaLinux).
   - Installs the static Go binary to `/usr/local/bin/pasax-sentinel`.
   - Generates an Ed25519 host keypair.
   - Registers with Pasax Cloud using the activation token.
   - Creates and starts the systemd unit (`pasax-sentinel.service`).
   - Configures `/run/pasax/agent.sock` for local PHP-FPM access.
4. Within 10 seconds of running the command, the new server node and its Nginx/Apache virtual hosts automatically appear on the dashboard.
