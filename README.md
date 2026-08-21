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
events.html           Feiern & Events inkl. nächstem Termin, events-en.html englisch
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
CNAME                 die eigene Domain für GitHub Pages (bellers-cafe.de)
robots.txt            Regeln für Suchmaschinen
sitemap.xml           Liste aller Seiten für Suchmaschinen
werkzeuge-seo.py      erzeugt beides und die Suchmaschinen-Angaben in den Seiten
```

Die Navigation ist auf allen Seiten gleich aufgebaut. Ab 1230 px Fensterbreite
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

Die Seite läuft komplett kostenlos über GitHub Pages – keine Hosting-Gebühr.
Bezahlt wird nur die eigene Domain beim Anbieter (hier IONOS, siehe unten).
Zwei Klicks in den GitHub-Einstellungen genügen, es ist kein Hochladen nötig.

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

3. Kurz warten (meist unter einer Minute), dann ist die Seite erreichbar –
   zunächst unter `https://95m97sm6cr-stack.github.io/webseite/`, nach dem
   Domain-Umzug (siehe unten) unter **`https://bellers-cafe.de`**. HTTPS ist
   dabei automatisch aktiv, ganz ohne Zertifikat oder `.htaccess`.

### Danach: Inhalte ändern

Jede Änderung, die auf den Branch `claude/cafe-bellers-website-s2m00o`
gepusht wird, erscheint automatisch nach kurzer Zeit auf der Live-Seite –
ganz ohne erneutes Hochladen.

### Eigene Domain: bellers-cafe.de bei IONOS

Die Domain liegt bei IONOS, die Seite bleibt bei GitHub Pages. Das ist kein
Widerspruch: Eine Domain ist nur ein Wegweiser, gehostet wird woanders. Bei
IONOS wird also **nichts gebaut**, es werden nur DNS-Einträge gesetzt.

> **Wichtig:** Unter `info@bellers-cafe.de` läuft die E-Mail. Deshalb bei IONOS
> **nur** A-, AAAA- und CNAME-Einträge anfassen. Die **Nameserver nicht
> umstellen** und die **MX-Einträge nicht anrühren** – sonst kommen keine
> Mails mehr an.

**Reihenfolge beachten:** erst DNS, dann die Domain bei GitHub eintragen.
Sobald die Domain bei GitHub gesetzt ist, leitet die alte github.io-Adresse
dorthin um – ist das DNS dann noch nicht aktiv, ist die Seite so lange nicht
erreichbar.

1. **Bei IONOS** (Domains & SSL → `bellers-cafe.de` → DNS) auf den Hostnamen
   `@` vier **A**-Einträge anlegen:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   und vier **AAAA**-Einträge, ebenfalls auf `@`:

   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```

   Dazu ein **CNAME** für den Hostnamen `www` mit dem Ziel
   `95m97sm6cr-stack.github.io`. Ein vorhandener Parking- oder
   Weiterleitungseintrag auf `@` wird dabei ersetzt.

2. **Warten**, bis die Änderung greift (laut IONOS bis zu 24 Stunden, meist
   deutlich weniger). Prüfen lässt sich das mit `host bellers-cafe.de` – dort
   müssen die vier Adressen von oben auftauchen.

3. **Im Repo** liegt die Datei `CNAME` mit dem Inhalt `bellers-cafe.de`. Sie
   ist es, die GitHub Pages die Domain mitteilt.

4. **Bei GitHub**: Settings → Pages → „Custom domain" auf `bellers-cafe.de`
   setzen und speichern. GitHub stellt daraufhin ein Zertifikat aus (einige
   Minuten bis zu einer Stunde); danach **„Enforce HTTPS"** anhaken.

5. Danach in der Google Search Console die neue Adresse anmelden, die Sitemap
   erneut einreichen und die Website-Adresse im Google-Unternehmensprofil
   sowie im Instagram-Profil aktualisieren.

**Wenn die Adresse noch einmal wechselt:** In `werkzeuge-seo.py` ganz oben
`BASIS` auf die neue Adresse setzen und das Skript einmal laufen lassen
(`python3 werkzeuge-seo.py`). Es schreibt die Adresse in alle Seiten, in
`sitemap.xml` und in `robots.txt`. Das Skript kann beliebig oft laufen, es
ersetzt jedes Mal seinen eigenen Block. Zusätzlich verwendet `404.html` als
einzige Seite absolute Pfade – liegt die Seite in einem Unterordner statt an
der Wurzel, muss dort der Pfad-Anfang angepasst werden (steht als Kommentar in
der Datei). Alle anderen Seiten verwenden relative Pfade.

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
Domain. Unter `bellers-cafe.de` liegt sie dort und wird ausgewertet. Solange
die Seite noch unter `.../webseite/` erreichbar ist, wird sie ignoriert – in
dieser Zeit die Sitemap direkt in der Search Console einreichen.

**Zur Kartenposition:** Der eingebettete Kartenausschnitt im Bereich „Anfahrt"
zeigt noch eine ungefähre Position in Miesbach, nicht die exakte Adresse
(siehe „Karte aktualisieren" in `INHALTE-BEARBEITEN.md`). Aus demselben Grund
enthalten die strukturierten Daten bewusst **keine** Koordinaten – eine
ungenaue Angabe wäre dort schlechter als gar keine.

## Umzug zu einem anderen Hoster

Die Seite ist reines HTML, CSS und JavaScript ohne Build-Schritt und läuft
deshalb unverändert bei jedem Webhoster – auch beim Webspace-Paket von IONOS.
Nötig wäre dann nur: alle Dateien in das Wurzelverzeichnis hochladen (per FTP
oder Dateimanager), `BASIS` in `werkzeuge-seo.py` anpassen und den Abschnitt
„Hosting" in der Datenschutzerklärung auf den neuen Anbieter umschreiben.
Solange GitHub Pages genügt, kostet es nichts und es gibt keinen Grund dazu.

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
