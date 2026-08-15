# b.ellers – Café Website

Einfache, statische Website für das familiengeführte Café **b.ellers** in Miesbach.
Kein Framework, kein Build-Schritt, keine Datenbank – nur reines HTML, CSS und
etwas JavaScript. Das hält Hosting-Kosten und Wartungsaufwand minimal.

## Struktur

```
index.html            Startseite deutsch (Willkommen, Speisekarte-Teaser,
                      Öffnungszeiten, Tisch reservieren, Anfahrt, Galerie, Kontakt)
index-en.html         dieselbe Startseite auf Englisch
speisekarte.html      Speisekarte deutsch, inkl. Preise und Allergen-Legende
menu-en.html          dieselbe Karte auf Englisch
galerie.html          Galerie mit allen Fotos, gallery-en.html auf Englisch
impressum.html        Impressum (Vorlage, muss ausgefüllt werden)
datenschutz.html      Datenschutzerklärung (Vorlage, muss ausgefüllt werden)
404.html              Fehlerseite bei falsch eingetippter Adresse
.htaccess             Servereinstellungen (HTTPS, Caching, Fehlerseite)
assets/css/style.css  Gesamtes Styling
assets/img/           Logo, freigestelltes Logo, Signet und Deko-Motive
assets/img/galerie/   die Fotos der Galerie
assets/js/main.js     Menü, Ansicht-Einstellungen, Öffnungs-Status, Reservierungs-
                      Fenster und die Effekte
```

Die Seite ist auf gute Lesbarkeit für ältere Besucher ausgelegt: 18 px
Grundschrift, große Bedienflächen, geprüfte Farbkontraste (mindestens 4,5:1,
im Modus „starker Kontrast" mindestens 7:1) und ein Bedienfeld „Ansicht", über
das sich Schriftgröße, Kontrast und Bewegung umstellen lassen.

Ohne JavaScript bleibt die Seite vollständig lesbar und bedienbar.

Die Seite gibt es auf Deutsch und Englisch, umschaltbar über `DE | EN` oben
rechts. Beides sind eigene Dateien – **Inhaltsänderungen müssen deshalb in
beiden Fassungen gemacht werden**, siehe die Tabelle in
[`INHALTE-BEARBEITEN.md`](./INHALTE-BEARBEITEN.md). Impressum und Datenschutz
bleiben bewusst deutsch.

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
   index-en.html
   speisekarte.html
   menu-en.html
   galerie.html
   gallery-en.html
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

- Verbliebene Platzhalter suchen (`<!-- TODO: ... -->`) und ersetzen. Offen
  sind derzeit: eine etwaige USt-ID im Impressum, der Serverstandort in der
  Datenschutzerklärung und die Bedeutung des Allergens `(u)` beim Matcha Latte.
- Den Auftragsverarbeitungsvertrag (AVV) mit Hostinger abschließen – bei der
  Nutzung eines Hosters nach DSGVO vorgeschrieben.
- Das Impressum ist für gewerbliche Websites in Deutschland Pflicht.
