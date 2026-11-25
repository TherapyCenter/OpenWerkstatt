# OpenWerkstatt installieren

[English](INSTALL.md) · **Deutsch**

OpenWerkstatt ist eine Webanwendung: Ein kleiner Server läuft auf dem Werkstatt-PC, bedient wird im Browser (auch von Tablets und weiteren Arbeitsplätzen im Netzwerk). Nach der Installation ist der Datenbestand **leer** – eigene Firmendaten tragen Sie unter *Einstellungen* ein, vorhandene Daten holen Sie per Import herein (siehe [Daten übernehmen](#daten-übernehmen)).

**Wo liegen die Daten?** Nie im Programmordner, sondern im Benutzerprofil. Updates lassen sie unangetastet; bei der Deinstallation entscheiden Sie, ob sie erhalten bleiben.

| System | Datenordner |
|---|---|
| Windows | `%APPDATA%\OpenWerkstatt` (z. B. `C:\Users\<Name>\AppData\Roaming\OpenWerkstatt`) |
| macOS | `~/Library/Application Support/OpenWerkstatt` |
| Linux | `~/.local/share/openwerkstatt` (bzw. `$XDG_DATA_HOME/openwerkstatt`) |

Mit der Umgebungsvariablen `OPENWERKSTATT_DATA` lässt sich ein anderer Ordner festlegen, z. B. eine zweite Festplatte im selben Rechner.

> **Datenordner nie auf ein Netzlaufwerk oder NAS legen.** OpenWerkstatt arbeitet ständig in seiner Datenbank. Über eine Netzwerkfreigabe (SMB/NFS) kann sie dabei beschädigt werden, z. B. bei einer kurzen Netzwerkstörung. OpenWerkstatt zeigt beim Start eine Warnung, wenn der Datenordner auf einem Netzlaufwerk liegt. Für mehrere Arbeitsplätze ist der Netzwerkbetrieb gedacht (ein Rechner hält die Daten, die anderen arbeiten im Browser). **Sicherungen** dürfen und sollten dagegen auf ein NAS oder einen anderen Datenträger: *OpenWerkstatt → Daten sichern* → Sicherungsordner.

**Neue Version erkennen:** OpenWerkstatt fragt höchstens einmal am Tag bei GitHub nach, ob es ein neueres [Release](https://github.com/TherapyCenter/OpenWerkstatt/releases) gibt. Ist eines da, erscheint unten rechts in der Statusleiste *⬆ Update verfügbar*. Ein Klick darauf zeigt die neue Version, den Link zum Download und die Schritte zum Aktualisieren. Dabei wird nur die Versionsnummer abgefragt; es werden keine Daten aus OpenWerkstatt übertragen und nichts automatisch installiert. Abschalten unter *Einstellungen → Vorgabewerte → Updates* (je Mandant), dort gibt es auch *Jetzt prüfen*. Die Umgebungsvariable `OPENWERKSTATT_UPDATE_CHECK=0` schaltet die Prüfung für den ganzen Server ab, z. B. bei Rechnern ohne Internet oder bei Softwareverteilung.

---

## Windows

1. `OpenWerkstatt-Setup-<Version>.exe` ausführen.
   - *Für alle Benutzer installieren* (Standard, braucht Administratorrechte) → `C:\Programme\OpenWerkstatt`
   - *Nur für mich installieren* → ohne Administratorrechte, im Benutzerprofil
2. Optional im Assistenten: Desktop-Verknüpfung, Firewall-Freigabe für den Netzwerkbetrieb.
3. Start über das Startmenü: **OpenWerkstatt**. Es öffnet sich ein Konsolenfenster (bitte geöffnet lassen – Schließen beendet OpenWerkstatt) und der Browser mit `http://127.0.0.1:3700`.

Node.js ist im Installer enthalten; es muss nichts weiter installiert werden. Unterstützt wird Windows 10/11 (64 Bit).

**Netzwerkbetrieb:** Startmenü → *OpenWerkstatt im Netzwerk*. Das Konsolenfenster zeigt die Adresse für die anderen Geräte (`http://<IP>:3700`). Windows fragt beim ersten Start ggf. nach einer Firewall-Freigabe – für „Private Netzwerke“ zulassen. Danach unter *Einstellungen → Vorgabewerte* die Anmeldung aktivieren und Benutzer anlegen.

**Update:** Einfach den neuen Installer ausführen. Ein laufendes OpenWerkstatt wird vorher automatisch beendet (Datenbank wird sauber geschlossen) und nach dem Update wieder gestartet – im selben Modus wie vorher (lokal bzw. im Netzwerk). Die Daten bleiben unverändert.

**Ausrollen ohne Rückfragen** (z. B. per Skript oder Softwareverteilung):

```
OpenWerkstatt-Setup-<Version>.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
```

- `/CURRENTUSER` bzw. `/ALLUSERS` legt fest, ob nur für den Benutzer oder für alle installiert wird (Standard: wie bei der ersten Installation).
- `/NOSTART` – OpenWerkstatt nach dem Update nicht wieder starten.
- `/LOG="C:\Temp\openwerkstatt-setup.log"` – Protokoll schreiben.
- Läuft die Installation unter dem Systemkonto (Softwareverteilung), wird OpenWerkstatt zwar beendet, aber nicht wieder gestartet (es liefe sonst im falschen Benutzerprofil). Die Benutzer starten es dann wie gewohnt über das Startmenü.

**Deinstallation:** *Einstellungen → Apps* → OpenWerkstatt, oder den Installer erneut starten und „OpenWerkstatt deinstallieren“ wählen. Ein laufendes OpenWerkstatt wird vorher beendet. Danach fragt OpenWerkstatt, ob auch die Daten gelöscht werden sollen; vorher kann eine Kopie als ZIP auf dem Desktop gespeichert werden. Still: `unins000.exe /VERYSILENT` behält die Daten, `/DELETEDATA` löscht sie nach einer Kopie (`/NOBACKUP`: ohne Kopie).

### Installer selbst bauen

Voraussetzungen: Windows, [Inno Setup 6](https://jrsoftware.org/isdl.php), Internetzugang (Node.js wird von nodejs.org geladen und per SHA-256 geprüft).

```powershell
npm run installer:windows
# oder: powershell -ExecutionPolicy Bypass -File installer\windows\build.ps1 [-NodeVersion 24.21.0]
```

Ergebnis: `build\OpenWerkstatt-Setup-<Version>.exe` (Version aus `package.json`).

---

## Linux

### 1. Node.js installieren (ab Version 22.13)

Prüfen: `node -v` – zeigt es `v22.13` oder neuer, weiter mit Schritt 2.

| Distribution | Befehl |
|---|---|
| Debian / Ubuntu / Mint | Paketquellen sind meist zu alt. Über NodeSource: `curl -fsSL https://deb.nodesource.com/setup_24.x \| sudo -E bash -` und danach `sudo apt install -y nodejs` |
| Fedora (ab 41) | `sudo dnf install nodejs` (sonst NodeSource: `https://rpm.nodesource.com/setup_24.x`) |
| openSUSE | `sudo zypper install nodejs24` |
| Arch / Manjaro | `sudo pacman -S nodejs` |
| alle (ohne root) | [nvm](https://github.com/nvm-sh/nvm): `nvm install 24` |

### 2. OpenWerkstatt herunterladen und installieren

```sh
git clone <Repository-URL> openwerkstatt     # oder Archiv herunterladen und entpacken
cd openwerkstatt
./installer/unix/install.sh
```

Das Skript installiert ohne root für den aktuellen Benutzer:

- Programm nach `~/.local/lib/openwerkstatt` (anderer Ort: `PREFIX=/opt/openwerkstatt ./installer/unix/install.sh`)
- Startbefehl `~/.local/bin/openwerkstatt`
- Eintrag im Anwendungsmenü („OpenWerkstatt“)

### 3. Starten

Über das Anwendungsmenü oder im Terminal:

```sh
openwerkstatt              # nur dieser Rechner
openwerkstatt --netzwerk   # für Tablets / weitere Arbeitsplätze freigeben
```

Beenden mit `Strg+C` bzw. durch Schließen des Terminalfensters. Ohne Installation geht es auch direkt aus dem entpackten Ordner: `./openwerkstatt.sh`.

**Update:** neue Version herunterladen (`git pull`) und `./installer/unix/install.sh` erneut ausführen.
**Deinstallation:** `./installer/unix/install.sh --uninstall` – fragt im Terminal, ob auch die Daten gelöscht werden (vorher Kopie als `.tar.gz` im Home-Ordner); ohne Terminal bleiben sie erhalten. `--delete-data` löscht ohne Rückfrage nach einer Kopie, `--no-backup` ohne Kopie.

### Optional: als Dienst im Hintergrund (Server ohne Bildschirm)

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
loginctl enable-linger "$USER"   # Dienst auch ohne angemeldeten Benutzer laufen lassen
```

Bei aktiver Firewall Port 3700/TCP freigeben (z. B. `sudo ufw allow 3700/tcp`). Im Netzwerkbetrieb unbedingt die Anmeldung aktivieren.

---

## macOS

### 1. Node.js installieren (ab Version 22.13)

- Installationspaket von [nodejs.org](https://nodejs.org/de) (LTS) herunterladen und installieren, **oder**
- mit Homebrew: `brew install node@24` (Hinweise von Homebrew zum `PATH` beachten)

Prüfen im Terminal: `node -v`

### 2. OpenWerkstatt installieren

Im Terminal (Programme → Dienstprogramme → Terminal):

```sh
git clone <Repository-URL> openwerkstatt     # oder Archiv herunterladen und im Finder entpacken
cd openwerkstatt
./installer/unix/install.sh
```

Das Skript legt das Programm unter `~/.local/lib/openwerkstatt` ab, den Startbefehl `openwerkstatt` und die App **OpenWerkstatt** im Ordner *Programme* des Benutzers (`~/Applications`).

### 3. Starten

Doppelklick auf *OpenWerkstatt* in `~/Applications` (öffnet ein Terminalfenster und den Browser) oder im Terminal `openwerkstatt`. Netzwerkbetrieb: `openwerkstatt --netzwerk`; macOS fragt beim ersten Mal, ob „node“ eingehende Verbindungen annehmen darf – zulassen.

Beim ersten Öffnen der App kann macOS eine Sicherheitswarnung zeigen (nicht signierte App). Dann im Finder Rechtsklick → *Öffnen* oder unter *Systemeinstellungen → Datenschutz & Sicherheit* „Trotzdem öffnen“ wählen.

**Update:** neue Version herunterladen und `./installer/unix/install.sh` erneut ausführen.
**Deinstallation:** `./installer/unix/install.sh --uninstall` – fragt im Terminal, ob auch die Daten gelöscht werden (vorher Kopie als `.tar.gz` im Home-Ordner); ohne Terminal bleiben sie erhalten. `--delete-data` löscht ohne Rückfrage nach einer Kopie, `--no-backup` ohne Kopie.

---

## Container (Docker / Podman)

Für Linux-Server, NAS-Systeme mit Container-Unterstützung, Raspberry Pi oder Macs: OpenWerkstatt läuft auch als Container. Das Image enthält Node.js, es muss sonst nichts installiert werden. Es läuft auf x86_64 und ARM64 (z. B. Mac mit Apple-Chip, Raspberry Pi 4/5).

### Bauen und starten

Im OpenWerkstatt-Ordner (dort liegt das `Dockerfile`):

```sh
# Podman
podman build -t openwerkstatt:2.1.0 .
podman run -d --name openwerkstatt --restart unless-stopped -p 3700:3700 -v openwerkstatt-daten:/data openwerkstatt:2.1.0

# Docker
docker build -t openwerkstatt:2.1.0 .
docker run -d --name openwerkstatt --restart unless-stopped -p 3700:3700 -v openwerkstatt-daten:/data openwerkstatt:2.1.0
```

Oder mit Compose (Datei `compose.yaml` liegt bei):

```sh
docker compose up -d --build      # bzw. podman compose up -d --build
```

Danach im Browser `http://<Rechner>:3700` öffnen.

> **Sofort die Anmeldung einschalten.** Im Container ist OpenWerkstatt im ganzen Netzwerk erreichbar. Unter *Einstellungen → Vorgabewerte* die Anmeldung aktivieren und Benutzer anlegen. Soll OpenWerkstatt nur auf diesem Rechner erreichbar sein: `-p 127.0.0.1:3700:3700`.

### Daten

- Alle Daten liegen im Volume `openwerkstatt-daten` (im Container `/data`). Beim Löschen oder Neubauen des Containers bleiben sie erhalten.
- Ein eigener Ordner statt Volume geht auch: `-v /srv/openwerkstatt:/data`. Der Ordner muss dem Benutzer mit der UID 1000 gehören (`sudo chown 1000:1000 /srv/openwerkstatt`). Bei Podman ohne root stattdessen `-v /srv/openwerkstatt:/data:Z,U`.
- Auf Fedora, RHEL und anderen Systemen mit SELinux braucht ein eigener Ordner den Zusatz `:Z`.
- **Sicherungen** gehören auf ein anderes Laufwerk oder NAS: z. B. `-v /mnt/nas/openwerkstatt-sicherungen:/sicherungen` und in OpenWerkstatt unter *Daten sichern* den Sicherungsordner `/sicherungen` eintragen. Den Datenordner selbst nicht auf ein Netzlaufwerk legen.

### Einstellungen

| Variable | Standard | Bedeutung |
|---|---|---|
| `TZ` | `Europe/Berlin` | Zeitzone für Rechnungsdatum und Uhrzeit, z. B. `-e TZ=Europe/Vienna` |
| `PORT` | `3700` | Port im Container (Zuordnung nach außen über `-p`) |
| `OPENWERKSTATT_UPDATE_CHECK` | `1` | `0` schaltet den Hinweis auf neue Versionen ab |

### Bedienung

```sh
podman logs -f openwerkstatt        # Ausgabe ansehen (docker logs -f openwerkstatt)
podman stop openwerkstatt           # beenden – die Datenbank wird sauber geschlossen
podman start openwerkstatt          # wieder starten
```

**Update:** neue Version holen, Image neu bauen und den Container neu anlegen. Die Daten im Volume bleiben erhalten:

```sh
podman build -t openwerkstatt:2.1.0 .
podman rm -f openwerkstatt
podman run -d --name openwerkstatt --restart unless-stopped -p 3700:3700 -v openwerkstatt-daten:/data openwerkstatt:2.1.0
```

Mit Compose: `docker compose up -d --build`.

**Automatisch starten mit Podman (systemd, ab Podman 4.4):** Datei `~/.config/containers/systemd/openwerkstatt.container` anlegen:

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

Dann `systemctl --user daemon-reload` und `systemctl --user start openwerkstatt`. Damit OpenWerkstatt auch ohne angemeldeten Benutzer läuft: `loginctl enable-linger "$USER"`. Bei Docker reicht `--restart unless-stopped`.

### Unterschiede zur normalen Installation

- **E-Mail:** Im Container gibt es kein Mailprogramm. Bitte unter *Einstellungen → E-Mail* den direkten Versand (SMTP) wählen. Die Übergabe an Thunderbird geht nur bei einer normalen Installation.
- **Import aus KFZ-Faktura:** Den direkten Import aus dem Programmordner gibt es nur unter Windows. Im Container die Datensicherung (`*.kfz`) oder `DB1.bak` hochladen.
- Es öffnet sich kein Browserfenster. Die Adresse rufen Sie selbst auf.

---

## Umbrel

OpenWerkstatt gibt es als App für [umbrelOS](https://umbrel.com) (Umbrel Home, Raspberry Pi, PC) im Community-App-Store
`https://github.com/TherapyCenter/umbrel-app-store`.

1. In umbrelOS den **App Store** öffnen, oben rechts **⋯** → **Community App Stores**.
2. `https://github.com/TherapyCenter/umbrel-app-store` einfügen und **Add** klicken.
3. Den Store **TherapyCenter** öffnen und **OpenWerkstatt** installieren.

OpenWerkstatt läuft danach unter `http://umbrel.local:3700` und ist von jedem Gerät im Netzwerk erreichbar, z. B. vom Tablet in
der Werkstatt. Der Zugang ist durch die Umbrel-Anmeldung geschützt; wer mehrere Mitarbeiter hat, legt zusätzlich in OpenWerkstatt
unter *Einstellungen → Vorgabewerte* Benutzer an. Die Daten liegen auf dem Umbrel im Datenordner der App und bleiben bei
Updates erhalten. Zusätzlich in OpenWerkstatt unter *OpenWerkstatt → Daten sichern* eine Sicherung anlegen und extern aufbewahren.
Updates bietet umbrelOS an, sobald eine neue OpenWerkstatt-Version im Store steht.

## Daten übernehmen

Nach dem ersten Start ist OpenWerkstatt leer. Auf der Übersicht stehen Schaltflächen für die Einrichtung bereit:

| Quelle | Weg in OpenWerkstatt |
|---|---|
| eigene Firmendaten von Hand | *Einstellungen* → Firmendaten (Name, Anschrift, Bank, Steuernummer, Logo) |
| KFZ-Faktura (`*.kfz`, `DB1.bak`, Programmordner) | *OpenWerkstatt → Daten importieren* |
| OpenWerkstatt-Sicherung (`*.openwerkstatt`) oder ältere KFZ-Faktotum-/Schraubwerk-Sicherung (`*.kft`, `*.swb`) | *OpenWerkstatt → Daten wiederherstellen* |
| Kunden, Fahrzeuge, Artikel … aus anderen Programmen (CSV, DATANORM) | *OpenWerkstatt → Datenimport* |

Umzug auf einen anderen Rechner: auf dem alten Rechner *Daten sichern* (`*.openwerkstatt`), auf dem neuen *Daten wiederherstellen*.
