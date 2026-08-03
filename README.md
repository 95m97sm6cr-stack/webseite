# b.ellers – Café Website

Einfache, statische Website für das familiengeführte Café **b.ellers** in Miesbach.
Kein Framework, kein Build-Schritt, keine Datenbank – nur reines HTML/CSS (+ ein
kleines JS für das mobile Menü). Das hält Hosting-Kosten und Wartungsaufwand
minimal.

## Struktur

```
index.html          Startseite (Willkommen, Öffnungszeiten, Anfahrt, Galerie, Kontakt)
impressum.html       Impressum (Vorlage, muss ausgefüllt werden)
datenschutz.html      Datenschutzerklärung (Vorlage, muss ausgefüllt werden)
assets/css/style.css  Gesamtes Styling
assets/img/           Bilder (u.a. logo.jpeg)
assets/js/main.js     Kleines Skript fürs mobile Menü
```

Hinweise zum Anpassen der Inhalte (Öffnungszeiten, Adresse, Fotos, ...) stehen
in [`INHALTE-BEARBEITEN.md`](./INHALTE-BEARBEITEN.md) – auf Deutsch und ohne
Technik-Vorwissen verständlich.

## Lokal ansehen

Einfach `index.html` per Doppelklick im Browser öffnen, oder für sauberere
Pfade/iframe-Darstellung einen kleinen lokalen Server starten:

```
python3 -m http.server 8000
```

und dann `http://localhost:8000/` im Browser aufrufen.

## Veröffentlichen (Hosting)

Das Hosting ist noch nicht final entschieden. Da die Seite aus reinen
statischen Dateien besteht, funktionieren beide folgenden Wege ohne
Änderungen am Code:

### Option A: Bestehender Webspace (z. B. Ionos oder Hostinger)

1. Im Kundenportal des Hosters (Ionos/Hostinger) den Datei-Manager öffnen
   oder die FTP-Zugangsdaten heraussuchen.
2. Den kompletten Inhalt dieses Repos (`index.html`, `impressum.html`,
   `datenschutz.html`, den Ordner `assets/`) in das Wurzelverzeichnis des
   Webspace hochladen (oft `public_html/` oder `htdocs/` – Name hängt vom
   Hoster ab, im Kundenportal nachsehen).
3. Fertig – kein Build, keine Installation nötig.

### Option B: GitHub Pages (kostenlos)

1. Im GitHub-Repository unter **Settings → Pages** als Quelle den Branch
   (z. B. `main`) und das Root-Verzeichnis auswählen.
2. GitHub stellt die Seite kostenlos unter einer Adresse wie
   `https://<benutzername>.github.io/webseite/` bereit.
3. Optional kann später eine eigene Domain (z. B. cafe-bellers.de) verbunden
   werden – das verursacht nur die üblichen Domain-Kosten (ca. 10–15 €/Jahr),
   das Hosting selbst bleibt kostenlos.

## Wichtig vor dem Veröffentlichen

- Alle Platzhalter in `index.html`, `impressum.html` und `datenschutz.html`
  durch echte Angaben ersetzen (siehe `<!-- TODO: ... -->`-Kommentare bzw.
  `INHALTE-BEARBEITEN.md`).
- Das Impressum ist für gewerbliche Websites in Deutschland Pflicht – bitte
  unbedingt vor dem Livegang vollständig ausfüllen.
