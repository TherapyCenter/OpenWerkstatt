# Installing OpenWerkstatt

**English** · [Deutsch](INSTALL.de.md)

OpenWerkstatt is a web application: a small server runs on the workshop PC, and you use it in the browser (also from tablets and other workstations in the network). After installation the database is **empty** – enter your own company details under *Settings* and bring in existing data by import (see [Taking over data](#taking-over-data)).

The installer, the console window and a new installation follow the language of the operating system (the installer: German, Spanish, otherwise English; console and new installation also French, Italian and Dutch; choose with the environment variable `OPENWERKSTATT_LANG=de|en|es|fr|it|nl`). To switch the user interface later, use the menu *OpenWerkstatt → Sprache / Language* or the language box on the login page.

**Where is the data?** Never in the program folder, always in the user profile. Updates leave it untouched; when uninstalling you decide whether to keep it.

| System | Data folder |
|---|---|
| Windows | `%APPDATA%\OpenWerkstatt` (e.g. `C:\Users\<name>\AppData\Roaming\OpenWerkstatt`) |
| macOS | `~/Library/Application Support/OpenWerkstatt` |
| Linux | `~/.local/share/openwerkstatt` (or `$XDG_DATA_HOME/openwerkstatt`) |

The environment variable `OPENWERKSTATT_DATA` sets a different folder, e.g. a second hard disk in the same computer.

> **Never put the data folder on a network drive or NAS.** OpenWerkstatt works in its database all the time. Over a network share (SMB/NFS) the database can get damaged, e.g. during a short network outage. OpenWerkstatt shows a warning at start if the data folder is on a network drive. Network mode is meant for several workstations (one computer holds the data, the others work in the browser). **Backups**, on the other hand, may and should go to a NAS or another drive: *OpenWerkstatt → Back up data* → backup folder.

**Noticing a new version:** at most once a day OpenWerkstatt asks GitHub whether there is a newer [release](https://github.com/TherapyCenter/OpenWerkstatt/releases). If there is, *⬆ Update available* appears at the bottom right of the status bar. Clicking it shows the new version, the download link and the steps to update. Only the version number is requested; no data from OpenWerkstatt is transmitted and nothing is installed automatically. Switch it off under *Settings → Defaults → Updates* (per tenant), where you also find *Check now*. The environment variable `OPENWERKSTATT_UPDATE_CHECK=0` switches the check off for the whole server, e.g. on computers without internet or with software distribution.

---

## Windows

1. Run `OpenWerkstatt-Setup-<version>.exe`.
   - *Install for all users* (default, needs administrator rights) → `C:\Program Files\OpenWerkstatt`
   - *Install only for me* → no administrator rights, in the user profile
2. Optional in the wizard: desktop shortcut, firewall rule for network mode.
3. Start from the start menu: **OpenWerkstatt**. A console window opens (keep it open – closing it stops OpenWerkstatt), and the browser opens `http://127.0.0.1:3700`.

Node.js is included in the installer; nothing else needs to be installed. Windows 10/11 (64 bit) is supported.

**Network mode:** start menu → *OpenWerkstatt (network)* (German installer: *OpenWerkstatt im Netzwerk*). The console window shows the address for the other devices (`http://<IP>:3700`). On the first start Windows may ask for a firewall permission – allow it for "Private networks". Then enable login under *Settings → Defaults* and create users.

**Update:** simply run the new installer. A running OpenWerkstatt is stopped automatically first (the database is closed cleanly) and started again after the update – in the same mode as before (local or network). The data stays unchanged.

**Rolling out without questions** (e.g. by script or software distribution):

```
OpenWerkstatt-Setup-<version>.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
```

- `/CURRENTUSER` or `/ALLUSERS` sets whether to install for the user only or for everyone (default: as in the first installation).
- `/NOSTART` – do not start OpenWerkstatt again after the update.
- `/LOG="C:\Temp\openwerkstatt-setup.log"` – write a log.
- If the installation runs under the system account (software distribution), OpenWerkstatt is stopped but not started again (it would otherwise run in the wrong user profile). Users then start it from the start menu as usual.

**Uninstall:** *Settings → Apps* → OpenWerkstatt, or start the installer again and choose “Uninstall OpenWerkstatt”. A running OpenWerkstatt is stopped first. Then OpenWerkstatt asks whether to delete the data too; a copy can be saved as a ZIP on the desktop first. Silent: `unins000.exe /VERYSILENT` keeps the data, `/DELETEDATA` deletes it after a copy (`/NOBACKUP`: without a copy).

### Building the installer yourself

Requirements: Windows, [Inno Setup 6](https://jrsoftware.org/isdl.php), internet access (Node.js is downloaded from nodejs.org and verified with SHA-256).

```powershell
npm run installer:windows
# or: powershell -ExecutionPolicy Bypass -File installer\windows\build.ps1 [-NodeVersion 24.21.0]
```

Result: `build\OpenWerkstatt-Setup-<version>.exe` (version from `package.json`).

---

## Linux

### 1. Install Node.js (version 22.13 or later)

Check: `node -v` – if it shows `v22.13` or newer, continue with step 2.

| Distribution | Command |
|---|---|
| Debian / Ubuntu / Mint | The package sources are usually too old. Via NodeSource: `curl -fsSL https://deb.nodesource.com/setup_24.x \| sudo -E bash -` and then `sudo apt install -y nodejs` |
| Fedora (41 or later) | `sudo dnf install nodejs` (otherwise NodeSource: `https://rpm.nodesource.com/setup_24.x`) |
| openSUSE | `sudo zypper install nodejs24` |
| Arch / Manjaro | `sudo pacman -S nodejs` |
| all (without root) | [nvm](https://github.com/nvm-sh/nvm): `nvm install 24` |

### 2. Download and install OpenWerkstatt

```sh
git clone <repository URL> openwerkstatt     # or download and unpack the archive
cd openwerkstatt
./installer/unix/install.sh
```

The script installs for the current user without root:

- program to `~/.local/lib/openwerkstatt` (different location: `PREFIX=/opt/openwerkstatt ./installer/unix/install.sh`)
- start command `~/.local/bin/openwerkstatt`
- entry in the application menu ("OpenWerkstatt")

### 3. Start

From the application menu or in the terminal:

```sh
openwerkstatt              # this computer only
openwerkstatt --netzwerk   # share with tablets / other workstations
```

Stop with `Ctrl+C` or by closing the terminal window. Without installation it also runs directly from the unpacked folder: `./openwerkstatt.sh`.

**Update:** download the new version (`git pull`) and run `./installer/unix/install.sh` again.
**Uninstall:** `./installer/unix/install.sh --uninstall` – asks in the terminal whether to delete the data too (after a copy as `.tar.gz` in the home folder); without a terminal it is kept. `--delete-data` deletes without asking after a copy, `--no-backup` without a copy.

### Optional: as a background service (server without a screen)

```sh
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/openwerkstatt.service <<'EOF'
[Unit]
Description=OpenWerkstatt

[Service]
Environment=HOST=0.0.0.0
ExecStart=/usr/bin/env node %h/.local/lib/openwerkstatt/server/index.js
Restart=on-failure

[Install]
WantedBy=default.target
EOF
systemctl --user daemon-reload
systemctl --user enable --now openwerkstatt
loginctl enable-linger "$USER"   # keep the service running without a logged-in user
```

If a firewall is active, open port 3700/TCP (e.g. `sudo ufw allow 3700/tcp`). In network mode, always enable login.

---

## macOS

### 1. Install Node.js (version 22.13 or later)

- download and install the package from [nodejs.org](https://nodejs.org/en) (LTS), **or**
- with Homebrew: `brew install node@24` (follow Homebrew's notes about `PATH`)

Check in the terminal: `node -v`

### 2. Install OpenWerkstatt

In the terminal (Applications → Utilities → Terminal):

```sh
git clone <repository URL> openwerkstatt     # or download the archive and unpack it in the Finder
cd openwerkstatt
./installer/unix/install.sh
```

The script puts the program into `~/.local/lib/openwerkstatt`, the start command `openwerkstatt`, and the app **OpenWerkstatt** into the user's *Applications* folder (`~/Applications`).

### 3. Start

Double-click *OpenWerkstatt* in `~/Applications` (opens a terminal window and the browser) or run `openwerkstatt` in the terminal. Network mode: `openwerkstatt --netzwerk`; the first time macOS asks whether "node" may accept incoming connections – allow it.

When opening the app for the first time, macOS may show a security warning (unsigned app). Then right-click it in the Finder → *Open*, or choose "Open anyway" under *System Settings → Privacy & Security*.

**Update:** download the new version and run `./installer/unix/install.sh` again.
**Uninstall:** `./installer/unix/install.sh --uninstall` – asks in the terminal whether to delete the data too (after a copy as `.tar.gz` in the home folder); without a terminal it is kept. `--delete-data` deletes without asking after a copy, `--no-backup` without a copy.

---

## Container (Docker / Podman)

For Linux servers, NAS systems with container support, Raspberry Pi or Macs: OpenWerkstatt also runs as a container. The image contains Node.js; nothing else needs to be installed. It runs on x86_64 and ARM64 (e.g. Mac with Apple silicon, Raspberry Pi 4/5).

### Build and start

In the OpenWerkstatt folder (where the `Dockerfile` is):

```sh
# Podman
podman build -t openwerkstatt:2.1.0 .
podman run -d --name openwerkstatt --restart unless-stopped -p 3700:3700 -v openwerkstatt-daten:/data openwerkstatt:2.1.0

# Docker
docker build -t openwerkstatt:2.1.0 .
docker run -d --name openwerkstatt --restart unless-stopped -p 3700:3700 -v openwerkstatt-daten:/data openwerkstatt:2.1.0
```

Or with Compose (the file `compose.yaml` is included):

```sh
docker compose up -d --build      # or podman compose up -d --build
```

Then open `http://<computer>:3700` in the browser.

> **Switch on login immediately.** In a container OpenWerkstatt can be reached from the whole network. Enable login under *Settings → Defaults* and create users. If OpenWerkstatt should only be reachable on this computer: `-p 127.0.0.1:3700:3700`.

### Data

- All data lives in the volume `openwerkstatt-daten` (`/data` in the container). It is kept when the container is deleted or rebuilt.
- A folder of your own instead of a volume works too: `-v /srv/openwerkstatt:/data`. The folder must belong to the user with UID 1000 (`sudo chown 1000:1000 /srv/openwerkstatt`). With rootless Podman use `-v /srv/openwerkstatt:/data:Z,U` instead.
- On Fedora, RHEL and other systems with SELinux, a folder of your own needs the suffix `:Z`.
- **Backups** belong on another drive or NAS: e.g. `-v /mnt/nas/openwerkstatt-sicherungen:/sicherungen` and enter the backup folder `/sicherungen` in OpenWerkstatt under *Back up data*. Do not put the data folder itself on a network drive.

### Settings

| Variable | Default | Meaning |
|---|---|---|
| `TZ` | `Europe/Berlin` | time zone for invoice date and time, e.g. `-e TZ=Europe/Madrid` |
| `PORT` | `3700` | port inside the container (mapped to the outside with `-p`) |
| `OPENWERKSTATT_UPDATE_CHECK` | `1` | `0` switches off the notice about new versions |

### Operation

```sh
podman logs -f openwerkstatt        # show the output (docker logs -f openwerkstatt)
podman stop openwerkstatt           # stop – the database is closed cleanly
podman start openwerkstatt          # start again
```

**Update:** get the new version, rebuild the image and create the container again. The data in the volume is kept:

```sh
podman build -t openwerkstatt:2.1.0 .
podman rm -f openwerkstatt
podman run -d --name openwerkstatt --restart unless-stopped -p 3700:3700 -v openwerkstatt-daten:/data openwerkstatt:2.1.0
```

With Compose: `docker compose up -d --build`.

**Automatic start with Podman (systemd, Podman 4.4 or later):** create the file `~/.config/containers/systemd/openwerkstatt.container`:

```ini
[Container]
Image=localhost/openwerkstatt:2.1.0
ContainerName=openwerkstatt
PublishPort=3700:3700
Volume=openwerkstatt-daten:/data

[Service]
Restart=always
TimeoutStopSec=30

[Install]
WantedBy=default.target
```

Then `systemctl --user daemon-reload` and `systemctl --user start openwerkstatt`. To keep OpenWerkstatt running without a logged-in user: `loginctl enable-linger "$USER"`. With Docker, `--restart unless-stopped` is enough.

### Differences from the normal installation

- **Email:** there is no mail program in the container. Choose direct sending (SMTP) under *Settings → Email*. Handing over to Thunderbird only works with a normal installation.
- **Import from KFZ-Faktura:** the direct import from the program folder only exists on Windows. In the container, upload the backup (`*.kfz`) or `DB1.bak`.
- No browser window opens. Open the address yourself.

---

## Umbrel

OpenWerkstatt is available as an app for [umbrelOS](https://umbrel.com) (Umbrel Home, Raspberry Pi, PC) in the community app store
`https://github.com/TherapyCenter/umbrel-app-store`.

1. In umbrelOS open the **App Store**, top right **⋯** → **Community App Stores**.
2. Paste `https://github.com/TherapyCenter/umbrel-app-store` and click **Add**.
3. Open the **TherapyCenter** store and install **OpenWerkstatt**.

OpenWerkstatt then runs at `http://umbrel.local:3700` and can be reached from every device in the network, e.g. the tablet in the
workshop. Access is protected by the Umbrel login; with several staff members also create users in OpenWerkstatt under
*Settings → Defaults*. The data lives on the Umbrel in the app's data folder and is kept during updates. Also make a backup
in OpenWerkstatt under *OpenWerkstatt → Back up data* and keep it elsewhere. umbrelOS offers updates as soon as a new OpenWerkstatt version is in
the store.

## Taking over data

After the first start OpenWerkstatt is empty. The overview offers buttons for the setup:

| Source | Where in OpenWerkstatt |
|---|---|
| your own company details by hand | *Settings* → Company details (name, address, bank, tax number, logo) |
| KFZ-Faktura (`*.kfz`, `DB1.bak`, program folder) | *OpenWerkstatt → Import data* |
| OpenWerkstatt backup (`*.openwerkstatt`) or older KFZ-Faktotum/Schraubwerk backup (`*.kft`, `*.swb`) | *OpenWerkstatt → Restore data* |
| customers, vehicles, articles … from other programs (CSV, DATANORM) | *OpenWerkstatt → Data import* |

Moving to another computer: on the old computer *Back up data* (`*.openwerkstatt`), on the new one *Restore data*.
