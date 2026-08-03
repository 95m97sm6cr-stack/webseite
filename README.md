# b.ellers – Café Website

Einfache, statische Website für das familiengeführte Café **b.ellers** in Miesbach.
Kein Framework, kein Build-Schritt, keine Datenbank – nur reines HTML/CSS (+ ein
kleines JS für das mobile Menü). Das hält Hosting-Kosten und Wartungsaufwand
minimal.

## Struktur

```
index.html            Startseite (Willkommen, Öffnungszeiten, Anfahrt, Galerie, Kontakt)
speisekarte.html      Speisekarte inkl. Preise und Allergen-Legende
impressum.html        Impressum (Vorlage, muss ausgefüllt werden)
datenschutz.html      Datenschutzerklärung (Vorlage, muss ausgefüllt werden)
404.html              Fehlerseite bei falsch eingetippter Adresse
.htaccess             Servereinstellungen (HTTPS, Caching, Fehlerseite)
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

## Veröffentlichen bei Hostinger

Die Seite besteht aus reinen statischen Dateien – es ist kein Build-Schritt,
keine Datenbank und keine Installation nötig. Hochladen genügt.

### Dateien hochladen

1. Bei [hpanel.hostinger.com](https://hpanel.hostinger.com) einloggen.
2. **Dateien → Dateimanager** öffnen und in den Ordner `public_html`
   wechseln. Das ist das Wurzelverzeichnis der Website.
3. Falls dort noch eine Platzhalterseite von Hostinger liegt (z. B. eine
   `default.php` oder `index.html`), diese Dateien löschen.
4. Folgende Dateien und Ordner hochladen:

   ```
   index.html
   speisekarte.html
   impressum.html
   datenschutz.html
   404.html
   .htaccess
   assets/          (kompletter Ordner mit css/, img/, js/)
   ```

   **Wichtig:** Die Ordnerstruktur muss erhalten bleiben – `style.css` muss
   also unter `public_html/assets/css/style.css` landen, nicht lose im
   Hauptverzeichnis. Am einfachsten lädt man den Ordner `assets` als Ganzes
   hoch bzw. entpackt ein hochgeladenes ZIP direkt im Dateimanager.

   **Zur `.htaccess`:** Der Dateiname beginnt mit einem Punkt, deshalb ist sie
   in manchen Datei-Managern zunächst unsichtbar. Im Hostinger-Dateimanager
   unter den Einstellungen „versteckte Dateien anzeigen" aktivieren.

5. Website im Browser aufrufen – fertig.

### HTTPS aktivieren

Unter **Websites → (Domain wählen) → SSL** ein kostenloses SSL-Zertifikat
ausstellen lassen und anschließend „Force HTTPS" einschalten. Damit ist die
Seite über `https://` erreichbar. (Die mitgelieferte `.htaccess` leitet
zusätzlich selbst von `http://` auf `https://` um.)

### Domain

Bei den meisten Hostinger-Paketen ist im ersten Jahr eine Domain enthalten.
Diese unter **Domains** registrieren bzw. eine vorhandene Domain verbinden.

### Alternative: FTP

Statt des Dateimanagers geht auch FTP, z. B. mit
[FileZilla](https://filezilla-project.org/). Die Zugangsdaten (Server,
Benutzername, Passwort) stehen in hPanel unter **Dateien → FTP-Konten**.

> Falls das Hosting später einmal wegfallen sollte: Die Seite läuft
> unverändert auch auf jedem anderen Webspace oder kostenlos über GitHub
> Pages bzw. Netlify – es sind nur statische Dateien, nichts ist an
> Hostinger gebunden.

## Wichtig vor dem Veröffentlichen

- Alle Platzhalter in `index.html`, `impressum.html` und `datenschutz.html`
  durch echte Angaben ersetzen (siehe `<!-- TODO: ... -->`-Kommentare bzw.
  `INHALTE-BEARBEITEN.md`).
- Das Impressum ist für gewerbliche Websites in Deutschland Pflicht – bitte
  unbedingt vor dem Livegang vollständig ausfüllen.
