# Chapter 02: File Integrity Monitoring (FIM)

## 1. Overview
The FIM controller (`internal/fim/watcher.go`) provides real-time detection of unauthorized modifications to mission-critical application files, specifically environment secrets (`.env`), package manifests (`composer.lock`), and application executables (`artisan`).

## 2. Kernel Inotify Integration
FIM utilizes Linux `inotify` system calls via the `github.com/fsnotify/fsnotify` package. It subscribes to:
- `fsnotify.Write` — File contents altered.
- `fsnotify.Create` — New files injected into watched directories.
- `fsnotify.Remove` / `fsnotify.Rename` — Target files deleted or swapped out.
- `fsnotify.Chmod` — File permissions widened (e.g. from `0600` to `0777`).

## 3. Cryptographic State Tracking
When a target file is modified, the watcher immediately:
1. Calculates the new cryptographic **SHA-256 hash**.
2. Compares the hash against the pre-recorded baseline hash in memory.
3. If the hash has changed, it records a `FIM_MODIFICATION` incident with:
   - `file_path`: Absolute path of the affected file.
   - `hash_before`: Baseline SHA-256 hex digest.
   - `hash_after`: New SHA-256 hex digest.
   - `action`: `FILE_MODIFIED`, `FILE_CREATED`, or `FILE_DELETED`.

## 4. Active Mitigation: Automatic Permission Locking
If a watched `.env` file is tampered with:
- The daemon automatically executes `os.Chmod(path, 0600)`.
- It resets ownership so that unauthorized web scripts cannot read database credentials or app secrets.
- An urgent `CRITICAL` threat event is dispatched to Pasax Cloud.
