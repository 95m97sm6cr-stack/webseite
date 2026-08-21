# Inhalte bearbeiten – Anleitung für b.ellers

Diese Anleitung erklärt in einfachen Worten, wie man Texte, Öffnungszeiten,
Adresse und Fotos auf der Website ändert. Man braucht dafür keine
Programmierkenntnisse – nur einen normalen Texteditor (z. B. Editor unter
Windows, TextEdit unter Mac, oder den Datei-Manager des Hosters mit
eingebautem Editor).

## ⚠️ Zuerst lesen: Es gibt die Seite zweimal

Die Website gibt es auf **Deutsch und Englisch**. Beide Fassungen sind eigene
Dateien. Das heißt: **Eine Änderung muss in beiden gemacht werden**, sonst
stimmen die Angaben irgendwann nicht mehr überein – und falsche Öffnungszeiten
auf der englischen Seite wären schlimmer als gar keine englische Seite.

| Was sich ändert | Wo überall anpassen |
|---|---|
| **Öffnungszeiten** | `index.html`, `index-en.html` **und** `assets/js/main.js` |
| **Preise, Gerichte** | `speisekarte.html` **und** `menu-en.html` |
| **Telefon, Adresse** | `index.html`, `index-en.html`, `speisekarte.html`, `menu-en.html`, `jobs.html`, `jobs-en.html`, `impressum.html`, `datenschutz.html`, `404.html` |
| **E-Mail-Adresse** | `index.html`, `index-en.html`, `jobs.html`, `jobs-en.html`, `impressum.html`, `datenschutz.html` |
| **Fotos in der Galerie** | `index.html`, `index-en.html`, `galerie.html` **und** `gallery-en.html` |
| **Stellenanzeige** | `jobs.html` **und** `jobs-en.html` |
| **Feiern / Events** | `events.html` **und** `events-en.html` |
| **Terminhinweis oben** | `index.html` **und** `index-en.html` |
| **Einträge im Menü oben** | in **allen** Seiten – der Block `<nav class="nav">` ist überall gleich |

Welche Datei zu welcher gehört:

| Deutsch | Englisch |
|---|---|
| `index.html` | `index-en.html` |
| `speisekarte.html` | `menu-en.html` |
| `galerie.html` | `gallery-en.html` |
| `events.html` | `events-en.html` |
| `jobs.html` | `jobs-en.html` |
| `impressum.html`, `datenschutz.html` | *(bleiben deutsch)* |

Impressum und Datenschutz gibt es bewusst nur auf Deutsch – das ist bei
deutschen Websites üblich, und im Zweifelsfall gilt ohnehin die deutsche
Fassung. Auf den englischen Seiten steht ein Hinweis dazu im Fußbereich.

## Wo steht was?

- **`index.html`** – die deutsche Startseite. Hier stehen der Willkommenstext,
  die Öffnungszeiten, die Adresse, die Kontaktdaten und der Text im Footer.
- **`index-en.html`** – dieselbe Seite auf Englisch.
- **`speisekarte.html`** – die deutsche Speisekarte mit allen Speisen,
  Getränken und Preisen sowie der Allergen-Legende.
- **`menu-en.html`** – dieselbe Karte auf Englisch. Die Gerichtnamen bleiben
  dort bewusst deutsch (*Gönnerbrunch*, *Lieblingsbowl*, *Avocado Royal* …) –
  das sind die Eigennamen eurer Karte. Übersetzt sind nur die Beschreibungen.
- **`galerie.html`** – die Galerieseite mit allen Fotos, **`gallery-en.html`**
  dieselbe auf Englisch. Auf den Startseiten steht nur eine Auswahl mit einem
  Knopf „Alle Bilder ansehen".
- **`events.html`** – die Seite „Events" mit den Anlässen zum Feiern und dem
  jeweils nächsten Termin, **`events-en.html`** dieselbe auf Englisch.
- **`jobs.html`** – die Stellenanzeige, **`jobs-en.html`** dieselbe auf
  Englisch. Wenn keine Stelle mehr frei ist, siehe unten „Stellenanzeige".
- **`impressum.html`** – das Impressum (Pflichtangaben).
- **`datenschutz.html`** – die Datenschutzerklärung.
- **`assets/img/galerie/`** – die Fotos der Galerie (`foto-01.jpg` bis
  `foto-10.jpg`)
- **`assets/img/`** – der Ordner mit den übrigen Bildern:
  - `logo.jpeg` – das Original-Logo mit rosa Hintergrund (wird auf der Website
    nicht direkt verwendet, ist aber als Vorlage aufgehoben)
  - `logo-freigestellt.png` – dasselbe Logo mit transparentem Hintergrund,
    so erscheint es auf der Startseite
  - `signet.png` – nur die Tasse, für Navigation, Fußbereich und Browser-Tab
  - `bohne.png`, `brezn.png` – die schwebenden Motive im Kopfbereich

## Text ändern

1. Die passende Datei (z. B. `index.html`) mit einem Texteditor öffnen.
2. Mit der Tastenkombination **Strg+F** (Windows) bzw. **Cmd+F** (Mac) nach
   dem Wort **TODO** suchen. An jeder Stelle mit `<!-- TODO: ... -->` steht,
   was noch angepasst werden muss.
3. Den Platzhaltertext direkt darunter durch den echten Text ersetzen und die
   Datei speichern.

Beispiel – Öffnungszeiten in `index.html` (rund um `id="oeffnungszeiten"`):

```
<tr data-tage="2,3,4,5"><td>Dienstag – Freitag</td><td>7:00 – 17:00 Uhr</td></tr>
```

Einfach die Uhrzeiten bzw. Wochentage ersetzen. Das `data-tage` bitte stehen
lassen – daran erkennt die Seite, welcher Tag heute hervorgehoben wird
(0 = Sonntag, 1 = Montag … 6 = Samstag).

## Öffnungszeiten ändern – bitte an DREI Stellen

Die Öffnungszeiten stehen an drei Orten, und alle drei müssen zusammenpassen:

1. **`index.html`** – die sichtbare Tabelle im Bereich „Öffnungszeiten".
2. **`index-en.html`** – dieselbe Tabelle auf Englisch.
3. **`assets/js/main.js`** – ganz oben in der Liste `OEFFNUNGSZEITEN`. Daraus
   berechnet die Seite den Hinweis „Jetzt geöffnet · bis 17:00 Uhr" bzw.
   „Geschlossen · öffnet in 2 Std 15 Min" und hebt den heutigen Tag hervor.

In `main.js` sieht eine Zeile so aus (die Reihenfolge ist Sonntag, Montag,
Dienstag ... Samstag; `null` bedeutet Ruhetag):

```
{ von: "07:00", bis: "17:00" }, // Dienstag
```

Wenn nur eine Tabelle geändert wird, stimmt der Hinweis oben nicht mehr oder
die englische Seite zeigt falsche Zeiten – deshalb bitte immer alle drei
Stellen anpassen.

## Adresse ändern

Die Adresse steht an zwei Stellen in `index.html`: im Bereich „Anfahrt" und
im Footer ganz unten. Beide Stellen anpassen, damit alles zusammenpasst.

### Karte aktualisieren

Die Karte im Bereich „Anfahrt" zeigt aktuell nur eine Platzhalter-Position in
Miesbach. Sobald die echte Adresse feststeht:

1. Auf [www.openstreetmap.org](https://www.openstreetmap.org) die Adresse
   suchen.
2. Auf den Button **„Exportieren"** klicken.
3. Den angezeigten HTML-Code (den Text im Feld unter „HTML einbetten")
   kopieren.
4. In `index.html` den bestehenden `<iframe ...>`-Block (im Bereich
   „Anfahrt") durch den neu kopierten Code ersetzen.

## Foto austauschen oder ergänzen

> **Wichtig:** Bitte nur **eigene** Fotos verwenden – also selbst gemachte
> Bilder vom Café, den Speisen usw. Fotos aus dem Internet (z. B. aus der
> Google-Suche, von Bewertungsportalen oder von fremden Instagram-Profilen)
> dürfen nicht einfach übernommen werden. In Deutschland kann das teure
> Abmahnungen nach sich ziehen, selbst wenn das Foto das eigene Café zeigt –
> die Rechte liegen nämlich bei der Person, die das Foto gemacht hat.


Die Fotos liegen in `assets/img/galerie/` und heißen `foto-01.jpg`,
`foto-02.jpg` und so weiter – derzeit sind es zehn. Auf den Galerieseiten
stehen alle zehn, auf den beiden Startseiten sechs davon als Auswahl.

**Jedes Foto gibt es zweimal:**

| Ordner | wofür | Größe |
|---|---|---|
| `assets/img/galerie/` | das kleine Bild in der Galerie | 620 Pixel breit, rund 100 KB |
| `assets/img/galerie/gross/` | die Großansicht beim Anklicken | lange Kante 1800 Pixel, rund 300 KB |

Beide heißen gleich. Wird nur eines getauscht, passen kleines und großes Bild
nicht mehr zusammen.

Ein Eintrag sieht auf allen vier Seiten gleich aus:

```
<figure class="galerie-bild">
  <a class="galerie-lupe" href="assets/img/galerie/gross/foto-03.jpg"
     data-bu="Frühstück in großer Runde">
    <img src="assets/img/galerie/foto-03.jpg" alt="Reich gedeckter Frühstückstisch"
         width="620" height="1101" loading="lazy" decoding="async">
  </a>
</figure>
```

Unter den Fotos steht bewusst **kein** Text. Das ganze Foto ist die Fläche zum
Anklicken, und erst in der Großansicht erscheint die Beschriftung.

Darin stecken **zwei Texte**, und beide werden gebraucht:

- **`data-bu`** – die Beschriftung, die in der Großansicht unter dem Foto
  steht. Kurz halten, drei bis fünf Wörter.
- **`alt`** – die längere Beschreibung. Sie ist auf der Seite nirgends zu
  sehen; sie wird Menschen vorgelesen, die einen Screenreader benutzen, und
  erscheint, falls ein Bild einmal nicht lädt. Ein Satz genügt, der sagt, was
  zu sehen ist. Auf den englischen Seiten bitte beides auf Englisch.

**Ein Foto austauschen:** Je eine neue Datei mit demselben Namen in **beide**
Ordner legen. Wenn das neue Bild ein anderes Seitenverhältnis hat, müssen
`width` und `height` angepasst werden – sonst wird beim Laden zu viel oder zu
wenig Platz freigehalten. Und die Texte natürlich auch.

**Ein Foto hinzufügen:** Einen vorhandenen `<figure>`-Block kopieren, einfügen
und Dateinamen, die Texte sowie `width`/`height` anpassen. Das im Bereich
„Galerie" von `galerie.html` **und** `gallery-en.html` machen; auf den
Startseiten steht nur eine Auswahl.

**Zur Dateigröße:** Das kleine Bild vor dem Hochladen auf etwa 620 Pixel
Breite verkleinern, das große auf 1800 Pixel an der langen Kante, beide als
JPEG mit mittlerer Qualität. Sonst wird die Seite auf dem Handy langsam.

**Tipp:** Beim Handyfoto beim Verkleinern die Bildinformationen („EXIF")
entfernen lassen. Darin steht sonst oft, wo das Foto aufgenommen wurde.

## Speisekarte ändern (Preise, Gerichte)

Die Speisekarte steht in `speisekarte.html` (deutsch) und `menu-en.html`
(englisch). **Preise immer in beiden Dateien ändern.** Jeder Eintrag sieht so
aus:

```
<div class="karte-eintrag">
  <div class="karte-text">
    <span class="karte-name">Cappuccino klein <span class="allergene">(7, g)</span></span>
  </div>
  <span class="karte-preis">3,80&nbsp;€</span>
</div>
```

- **Preis ändern:** die Zahl bei `karte-preis` anpassen (das `&nbsp;` davor
  bitte stehen lassen, es sorgt nur dafür, dass Zahl und € zusammenbleiben).
- **Name ändern:** den Text bei `karte-name` anpassen.
- **Beschreibung ändern:** falls vorhanden, den Text bei `karte-beschreibung`
  anpassen.
- **Gericht entfernen:** den kompletten Block von `<div class="karte-eintrag">`
  bis zum passenden `</div>` löschen.
- **Gericht hinzufügen:** einen bestehenden Block kopieren, einfügen und die
  Texte anpassen.

Auch die Frühstückszeiten und der Mittagstisch stehen ganz oben in den
Speisekarten – und zusätzlich auf beiden Startseiten im Bereich
„Öffnungszeiten". Wenn sich diese Zeiten ändern, bitte überall anpassen.

### Wichtig: Allergen-Legende

Ganz unten auf der Speisekarte steht die Legende mit den Nummern und
Buchstaben. Zwei Anmerkungen dazu:

- **(7) = „mit Koffein"** ist eingetragen, obwohl es auf der gedruckten Karte
  in der Legende fehlt.
- **(u)** steht beim *Matcha Latte*, kommt in der Legende aber nicht vor (die
  geht nur von a bis n). Das ist noch zu klären und dann in
  `speisekarte.html` **und** `menu-en.html` zu ergänzen.
- (5) und (6) fehlen ebenfalls in der gedruckten Legende, werden auf der Karte
  aber nirgends verwendet – das ist also folgenlos.

## Telefonnummer / E-Mail ändern

Im Bereich „Kontakt" (`id="kontakt"`) in `index.html` die Platzhalter-Nummer
bzw. -Adresse ersetzen. Wichtig: auch die Zahlen direkt hinter `tel:` bzw.
`mailto:` mit anpassen, sonst funktioniert der Klick-zum-Anrufen-Link nicht.

## Stellenanzeige (Seite „Jobs")

Die Anzeige steht in `jobs.html` und auf Englisch in `jobs-en.html`. Der
Aufbau ist in beiden gleich:

- die vier Kästchen oben (Umfang, Alter, Start, Wo) – jeweils ein
  `<div class="info-box">`,
- drei Listen: „Das bringst du mit", „Deine Aufgaben", „Wir bieten". Ein
  Punkt ist eine Zeile `<li>…</li>` in der `<ul class="job-liste">`. Zum
  Streichen die ganze Zeile löschen, zum Ergänzen eine kopieren,
- der Kasten „Interesse geweckt?" mit der Bewerbungsadresse.

**Datum ändern:** „ab 1. Oktober 2026" steht im dritten Kästchen, auf der
englischen Seite als „from 1 October 2026".

**Wenn keine Stelle mehr frei ist:** Am einfachsten ist es, den Eintrag
`<li><a href="jobs.html">Jobs</a></li>` aus dem Menü **aller** Seiten zu
entfernen (auf den englischen Seiten `jobs-en.html`). Die Seite selbst bleibt
dann liegen und lässt sich später wieder eintragen. Wer sie ganz abschalten
will, ersetzt den Inhalt durch einen kurzen Satz wie „Zurzeit suchen wir
niemanden – schaut gern später wieder vorbei."

## Wenn sich Adresse, Telefon oder Öffnungszeiten ändern

Diese Angaben stehen zusätzlich noch einmal **maschinenlesbar** im Kopfbereich
von `index.html` und `index-en.html` – in einem Block, der mit
`<script type="application/ld+json">` beginnt. Daraus baut Google die Infobox
neben dem Suchergebnis. Ändert sich etwas, muss es dort mitgeändert werden,
sonst zeigt Google veraltete Angaben an.

Erzeugt wird der Block vom Skript `werkzeuge-seo.py`; wer mag, ändert die
Angaben dort und lässt es einmal laufen. Von Hand geht es aber genauso: Die
Werte stehen im Klartext da (`telephone`, `opens`, `closes` …).

## Terminhinweis oben auf der Startseite

Ganz oben auf beiden Startseiten liegt ein dunkler Balken, der auf den
nächsten Termin hinweist (aktuell das Speed Dating am 2. Oktober 2026). Er
führt auf die Events-Seite direkt zum Termin.

- **Termin ändern:** In `index.html` und `index-en.html` den Block
  `<a class="aktion-banner" …>` suchen und Datum, Uhrzeit und Zielgruppe
  anpassen. Denselben Text auch im Abschnitt `id="speed-dating"` in
  `events.html` bzw. `events-en.html` ändern.
- **Kein Termin mehr:** Den ganzen `<a class="aktion-banner">`-Block aus
  beiden Startseiten löschen – vom öffnenden `<a` bis zum `</a>`. Der Rest
  der Seite bleibt davon unberührt.
- **Neuer Termin später:** Den Block wieder einfügen und den Abschnitt auf
  der Events-Seite entsprechend austauschen.

## Feiern und Events

Die Seite `events.html` (englisch `events-en.html`) hat drei Teile:

1. den **hervorgehobenen Termin** (dunkler Kasten, `id="speed-dating"`),
2. die **Anlässe** – je ein `<div class="anlass">` mit Überschrift und einem
   Satz. Zum Streichen den ganzen Block löschen, zum Ergänzen einen kopieren,
3. den Kasten **„Anfrage stellen"** mit Telefon, E-Mail und Instagram.

Gebucht werden kann hier bewusst nichts – die Seite sammelt nur Anfragen.

## Impressum & Datenschutz ausfüllen

In `impressum.html` und `datenschutz.html` alle Textstellen in eckigen
Klammern (z. B. `[Vor- und Nachname]`) durch die echten Angaben ersetzen und
die eckigen Klammern dabei entfernen. Das Impressum ist in Deutschland für
gewerbliche Websites gesetzlich vorgeschrieben und sollte vor der
Veröffentlichung vollständig ausgefüllt sein.

## Das Menü oben

Auf einem breiten Bildschirm steht die Navigation als Leiste oben. Auf dem
Handy und auf schmalen Fenstern klappt sie hinter dem Knopf mit den drei
Strichen (☰) zusammen – zusammen mit dem Sprachumschalter und „Ansicht",
sodass oben nur noch Logo und Knopf stehen.

Der Block `<nav class="nav">` ist in **allen** Seiten gleich. Wer einen
Menüpunkt hinzufügt oder entfernt, muss das deshalb in jeder Datei tun –
sonst hat eine Seite ein anderes Menü als der Rest.

## Der Sprachumschalter „DE | EN"

Ein Umschalter zwischen der deutschen und der englischen Fassung – auf
breiten Bildschirmen oben rechts, auf dem Handy im aufgeklappten Menü. Das
sind einfach zwei Links, daran muss nichts gepflegt werden. Wichtig ist nur,
dass Änderungen in beiden Fassungen gemacht werden (siehe die Tabelle ganz
oben).

## Der Knopf „Ansicht" oben rechts

Über diesen Knopf können Besucher selbst einstellen:

- **Schriftgröße** – Normal, Groß, Sehr groß
- **Kontrast** – Normal oder Stark (kräftigere Farben, deutlichere Rahmen)
- **Bewegung** – An oder Reduziert (schaltet Dampf, Einblendungen usw. ab)

Die Einstellung wird im Browser des Besuchers gespeichert und gilt auf allen
Seiten. Das ist vor allem für ältere Gäste gedacht. Daran muss nichts gepflegt
werden – es funktioniert von allein.

## Der Knopf „Tisch reservieren"

**Wichtig zu wissen: Darüber kann niemand tatsächlich einen Tisch buchen.**
Der Knopf öffnet nur ein Fenster mit der Telefonnummer und dem Instagram-Link
und sagt ausdrücklich, dass es keine Online-Reservierung gibt. Es kommen also
keine automatischen Reservierungen herein, um die man sich kümmern müsste.

Wenn sich die Telefonnummer ändert, muss sie an diesen Stellen angepasst werden:
im Bereich „Tisch reservieren" und „Kontakt" in `index.html`, im Fenster ganz
unten in `index.html` und `speisekarte.html` (Suche nach `dialog-wege`), im
Fußbereich aller Seiten sowie im Impressum.

## Änderungen ansehen

Nach dem Speichern einfach `index.html` im Browser öffnen (Doppelklick) – so
sieht man sofort, ob alles passt, bevor die Seite hochgeladen wird.

## Änderungen ins Internet stellen

Die Website liegt bei GitHub Pages – kostenlos, aber die Dateien liegen dafür
nicht in einem Dateimanager wie bei einem klassischen Hoster, sondern in einem
**Repository** (einer Art Online-Ordner mit Änderungsverlauf) auf github.com.
Das Hochladen einer geänderten Datei geht trotzdem ganz ohne Kommandozeile,
direkt im Browser:

1. Auf [github.com](https://github.com) einloggen und das Repository
   `95m97sm6cr-stack/webseite` öffnen.
2. Oben sicherstellen, dass der Branch **`claude/cafe-bellers-website-s2m00o`**
   ausgewählt ist (Umschalter links über der Dateiliste) – dort liegt die
   veröffentlichte Seite, nicht auf `main`.
3. **Eine Textdatei ändern** (z. B. `index.html`): die Datei anklicken, oben
   rechts auf das **Stift-Symbol** („Edit this file") klicken, den Text
   ändern, unten auf **„Commit changes…"** und dann noch einmal auf
   **„Commit changes"** klicken.
4. **Ein Foto austauschen oder hinzufügen:** in den Ordner navigieren (z. B.
   `assets/img/galerie/`), oben rechts auf **„Add file" → „Upload files"**,
   die neue Datei per Drag-and-Drop hineinziehen, unten auf
   **„Commit changes…"** klicken.
5. Nach etwa einer Minute ist die Änderung live. Die Website im Browser mit
   **Strg + F5** (am Mac: **Cmd + Shift + R**) neu laden, sonst zeigt der
   Browser eventuell noch die alte, zwischengespeicherte Version.

> **Wenn das zu umständlich ist:** Am einfachsten bleibt es, Änderungswünsche
> einfach hier in diesem Gespräch zu nennen – dann werden sie eingebaut,
> geprüft und veröffentlicht, ohne dass selbst etwas auf github.com bedient
> werden muss.

Wichtig: Immer nur die Dateien austauschen, die man wirklich geändert hat.
Der Ordner `assets` muss dabei so bleiben, wie er ist (dort liegen Bilder und
das Design).
