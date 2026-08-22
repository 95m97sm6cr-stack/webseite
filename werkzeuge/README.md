# Werkzeuge

Hilfsprogramme für die Wartung der Website. Für normale Inhaltsänderungen
braucht man sie **nicht** – dafür genügt `INHALTE-BEARBEITEN.md`. Sie sind für
den Fall gedacht, dass jemand am Aufbau der Seite arbeitet.

## Die Prüfskripte

Drei Skripte steuern einen echten Browser fern und sehen sich die Seiten an.
Sie haben in der Vergangenheit Fehler gefunden, die beim bloßen Draufschauen
niemandem aufgefallen sind: vertauschte Bildbeschreibungen, ein verzerrtes
Logo, ein Einstellungsfeld, das auf dem Handy nicht erreichbar war, und zwei
Knöpfe ohne einen Pixel Abstand.

| Skript | Was es prüft |
|---|---|
| `pruefen.js` | Alle 13 Seiten in 390, 768 und 1280 px Breite: JavaScript-Fehler, waagerechter Überlauf (auch bei Schriftgröße „sehr groß"), fehlende oder verzerrte Bilder, leere `alt`-Texte, tote Verweise |
| `nav_pruefen.js` | Menü auf- und zuklappen, „Ansicht" auf dem Handy erreichbar, alle Ziele der Navigation existieren wirklich, Inhalte der Jobs- und Events-Seite |
| `gross_pruefen.js` | Großansicht der Fotos samt Beschriftung – auch mit abgeschaltetem JavaScript |

### Ausführen

Die Skripte brauchen die Seite über einen Webserver, nicht über
`file://`. Also im **Wurzelverzeichnis** des Projekts einen kleinen Server
starten und ihn laufen lassen:

```
python3 -m http.server 8765
```

Dann in einem zweiten Fenster, ebenfalls im Wurzelverzeichnis:

```
node werkzeuge/pruefen.js
node werkzeuge/nav_pruefen.js
node werkzeuge/gross_pruefen.js
```

Jedes endet entweder mit `Alles in Ordnung.` oder listet die Fundstellen auf
und gibt einen Fehlercode zurück.

### In einer anderen Umgebung

Die Skripte brauchen [Playwright](https://playwright.dev) und einen
Chromium-Browser. In der Umgebung, in der sie entstanden sind, liegen beide
unter `/opt`; diese Pfade stehen als Vorgabe im Kopf jedes Skripts. Anderswo
setzt man vorher drei Umgebungsvariablen:

```
export PLAYWRIGHT_MODUL=/pfad/zu/node_modules/playwright
export CHROMIUM_PFAD=            # leer = Playwright nimmt seinen eigenen Browser
export BASIS_ADRESSE=http://localhost:8765/
```

Ist Playwright regulär per `npm install playwright` installiert, genügt meist:

```
export PLAYWRIGHT_MODUL=playwright
export CHROMIUM_PFAD=
```

## `nav_bauen.py` – Navigation neu erzeugen

Das Menü oben ist auf allen 13 Seiten identisch und wurde früher von Hand
kopiert. Das ging schief: Auf den Galerieseiten zeigten Links auf Anker wie
`#oeffnungszeiten`, die es dort gar nicht gibt, und ein Eintrag fehlte ganz.
Seitdem gibt es genau eine Quelle dafür.

**Wer einen Menüeintrag ändern will, ändert ihn hier – nicht in den
HTML-Dateien.** Dann:

```
python3 werkzeuge/nav_bauen.py
```

Das Skript schreibt den `<nav>`-Block in allen Seiten neu, deutsch wie
englisch, und setzt für jede Seite die passenden Pfade.

> **Achtung, Fehlerquelle:** `404.html` braucht **absolute** Pfade, weil der
> Browser bei einer falschen Adresse weiter die falsche Adresse anzeigt. Der
> Präfix dafür steht unten in `SEITEN` und muss zum tatsächlichen Ort der
> Website passen – derzeit `"/"`, weil sie unter `bellers-cafe.de` an der
> Wurzel liegt. Genau das war nach dem Domain-Umzug einmal veraltet und hätte
> die Fehlerseite kaputtgemacht.

Nach jedem Lauf lohnt `git diff` – erwartet man keine Änderung, muss die
Ausgabe leer sein.

## `../werkzeuge-seo.py` – Suchmaschinen-Angaben

Liegt im Wurzelverzeichnis, nicht hier. Es trägt in jede Seite die
Adressangaben für Suchmaschinen und das Teilen in Messengern ein und erzeugt
`sitemap.xml` und `robots.txt`.

Die Adresse der Website steht dort **an einer einzigen Stelle** ganz oben:

```python
BASIS = "https://bellers-cafe.de/"
```

Zieht die Seite je auf eine andere Adresse um, ändert man diese Zeile und
lässt das Skript einmal laufen:

```
python3 werkzeuge-seo.py
```

Es kann beliebig oft laufen und ersetzt jedes Mal nur seinen eigenen Block.
