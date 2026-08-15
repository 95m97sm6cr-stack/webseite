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
jobs.html             Stellenanzeige, jobs-en.html auf Englisch
impressum.html        Impressum (Vorlage, muss ausgefüllt werden)
datenschutz.html      Datenschutzerklärung (Vorlage, muss ausgefüllt werden)
404.html              Fehlerseite bei falsch eingetippter Adresse
.htaccess             Servereinstellungen (HTTPS, Caching, Fehlerseite)
assets/css/style.css  Gesamtes Styling
assets/img/           Logo, freigestelltes Logo, Signet und Deko-Motive
assets/img/galerie/   die Fotos der Galerie (620 px breit)
assets/img/galerie/gross/  dieselben Fotos für die Großansicht (1800 px)
assets/js/main.js     Menü, Ansicht-Einstellungen, Öffnungs-Status, Reservierungs-
                      Fenster, Großansicht der Fotos und die Effekte
robots.txt            Regeln für Suchmaschinen
sitemap.xml           Liste aller Seiten für Suchmaschinen
werkzeuge-seo.py      erzeugt beides und die Suchmaschinen-Angaben in den Seiten
```

Die Navigation ist auf allen Seiten gleich aufgebaut. Ab 1160 px Fensterbreite
steht sie als Leiste oben, darunter klappt sie – zusammen mit Sprachwahl und
„Ansicht" – hinter dem Menüknopf zusammen. Ohne JavaScript steht sie offen.

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

## Veröffentlichen bei GitHub Pages (kostenlos)

Die Seite läuft komplett kostenlos über GitHub Pages – keine Hosting-Gebühr,
nur bei Bedarf später eine eigene Domain (siehe unten). Zwei Klicks in den
GitHub-Einstellungen genügen, es ist kein Hochladen nötig.

### Einmalig einrichten

1. **Repo öffentlich machen** (nötig für kostenloses Pages): auf GitHub im
   Repo → **Settings** → ganz unten im Abschnitt **„Danger Zone"** →
   **„Change repository visibility"** → **Public** wählen und bestätigen.
2. **Pages einschalten:** **Settings** → **Pages** (linkes Menü) →
   unter „Build and deployment" → **Source: „Deploy from a branch"** →
   als Branch `claude/cafe-bellers-website-s2m00o` und als Ordner **`/ (root)`**
   auswählen → **Save**.

   (Der ganze Website-Inhalt liegt auf diesem Branch, nicht auf `main` –
   deshalb dort auswählen, nicht `main`.)

3. Kurz warten (meist unter einer Minute), dann ist die Seite erreichbar
   unter **`https://95m97sm6cr-stack.github.io/webseite/`**. HTTPS ist dabei
   automatisch aktiv, ganz ohne Zertifikat oder `.htaccess`.

### Danach: Inhalte ändern

Jede Änderung, die auf den Branch `claude/cafe-bellers-website-s2m00o`
gepusht wird, erscheint automatisch nach kurzer Zeit auf der Live-Seite –
ganz ohne erneutes Hochladen.

### Später: eigene Domain ergänzen

Wenn eine eigene Domain gekauft ist:

1. Beim Domain-Anbieter einen DNS-Eintrag setzen, der auf GitHub Pages zeigt
   (Anleitung dazu bei GitHub: „Managing a custom domain for your GitHub
   Pages site").
2. In **Settings → Pages** unter „Custom domain" die Domain eintragen und
   **„Enforce HTTPS"** aktivieren, sobald verfügbar.
3. **Wichtig:** Sobald die Seite nicht mehr unter `.../webseite/` sondern
   direkt unter der eigenen Domain läuft, muss in `404.html` der Pfad-Anfang
   `/webseite/` wieder zu `/` werden (steht auch als Kommentar direkt in der
   Datei). Alle anderen Seiten verwenden relative Pfade und sind davon nicht
   betroffen.
4. In `werkzeuge-seo.py` ganz oben `BASIS` auf die neue Adresse setzen und das
   Skript einmal laufen lassen (`python3 werkzeuge-seo.py`). Es schreibt die
   Adresse in alle Seiten, in `sitemap.xml` und in `robots.txt`. Das Skript
   kann beliebig oft laufen, es ersetzt jedes Mal seinen eigenen Block.
5. Danach in der Google Search Console die neue Adresse anmelden und die
   Sitemap dort erneut einreichen.

## Damit die Seite gefunden wird

Eine neue Website kennt Google zunächst nicht – sie muss erst entdeckt werden.
Was dafür vorbereitet ist und was noch von Hand zu tun bleibt:

**Ist eingebaut:** Titel und Kurzbeschreibung je Seite, `sitemap.xml`,
`robots.txt`, ein Vorschaubild fürs Teilen in Messengern
(`assets/img/vorschau.jpg`, 1200 × 630 px) sowie strukturierte Daten
(schema.org `CafeOrCoffeeShop`) mit Adresse, Telefon, E-Mail, Instagram und
Öffnungszeiten auf beiden Startseiten. Letztere sind die Angaben, aus denen
Google die Infobox neben dem Suchergebnis baut.

**Bleibt von Hand zu tun:**

1. **Google Unternehmensprofil** anlegen bzw. übernehmen – das ist der
   Eintrag mit der Karte, der bei „Café Miesbach" ganz oben erscheint. Für ein
   lokales Café wirkt das deutlich stärker als alles an der Website selbst.
   Dort auch die Website-Adresse eintragen; damit findet Google die Seite.
2. **Google Search Console** einrichten, die Seite bestätigen und die
   `sitemap.xml` einreichen. Damit lässt sich auch nachsehen, ob und wann
   Google die Seiten aufgenommen hat.
3. **Von Instagram verlinken** – ein Link im Profil ist ein echter Verweis auf
   die Seite und hilft beim Gefundenwerden.

**Zur `robots.txt`:** Suchmaschinen lesen sie nur direkt an der Wurzel einer
Domain. Solange die Seite unter `.../webseite/` liegt, wird sie deshalb
ignoriert – sie liegt für den Domain-Umzug bereit. Bis dahin die Sitemap
direkt in der Search Console einreichen.

**Zur Kartenposition:** Der eingebettete Kartenausschnitt im Bereich „Anfahrt"
zeigt noch eine ungefähre Position in Miesbach, nicht die exakte Adresse
(siehe „Karte aktualisieren" in `INHALTE-BEARBEITEN.md`). Aus demselben Grund
enthalten die strukturierten Daten bewusst **keine** Koordinaten – eine
ungenaue Angabe wäre dort schlechter als gar keine.

## Alternative: Hostinger (bezahlt, ~3 €/Monat)

Die Seite läuft unverändert auch bei jedem klassischen Webhoster. Falls
später doch ein Wechsel weg von GitHub Pages ansteht:

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
   jobs.html
   jobs-en.html
   impressum.html
   datenschutz.html
   404.html
   .htaccess
   assets/          (kompletter Ordner mit css/, img/ inkl. galerie/gross/, js/)
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

> Bei einem Umzug zu Hostinger: In `404.html` den Pfad-Anfang `/webseite/`
> wieder zu `/` ändern (siehe Kommentar in der Datei) – Hostinger liefert die
> Seite ja direkt am Wurzelverzeichnis aus, nicht unter einem Unterordner.

## Wichtig vor dem Veröffentlichen

- Verbliebene Platzhalter suchen (`<!-- TODO: ... -->`) und ersetzen. Offen ist
  derzeit nur noch die Bedeutung des Allergens `(u)` beim Matcha Latte.
- Im Impressum steht die Umsatzsteuer-ID `DE457036331`. Dort gehört nur eine
  echte USt-IdNr. hin (Format `DE` + 9 Ziffern) – die Steuernummer vom
  Finanzamt ist etwas anderes und im Impressum weder vorgeschrieben noch
  ratsam.
- Der Abschnitt „Hosting" in der Datenschutzerklärung beschreibt GitHub Pages
  einschließlich der Datenübermittlung in die USA. Bei einem Hosterwechsel muss
  er entsprechend angepasst werden.
- GitHub stellt für die Auftragsverarbeitung nach Art. 28 DSGVO eine
  [Data Protection Agreement](https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement)
  bereit, die Teil der Nutzungsbedingungen ist. Ob im konkreten Fall etwas
  gesondert abzuschließen ist, sollte im Zweifel fachkundig geprüft werden.
- Das Impressum ist für gewerbliche Websites in Deutschland Pflicht.
