# Inhalte bearbeiten – Anleitung für b.ellers

Diese Anleitung erklärt in einfachen Worten, wie man Texte, Öffnungszeiten,
Adresse und Fotos auf der Website ändert. Man braucht dafür keine
Programmierkenntnisse – nur einen normalen Texteditor (z. B. Editor unter
Windows, TextEdit unter Mac, oder den Datei-Manager des Hosters mit
eingebautem Editor).

## Wo steht was?

- **`index.html`** – die Startseite. Hier stehen der Willkommenstext, die
  Öffnungszeiten, die Adresse, die Kontaktdaten und der Text im Footer.
- **`speisekarte.html`** – die Speisekarte mit allen Speisen, Getränken und
  Preisen sowie der Allergen-Legende.
- **`impressum.html`** – das Impressum (Pflichtangaben).
- **`datenschutz.html`** – die Datenschutzerklärung.
- **`assets/img/`** – der Ordner mit allen Bildern, z. B. `logo.jpeg`.

## Text ändern

1. Die passende Datei (z. B. `index.html`) mit einem Texteditor öffnen.
2. Mit der Tastenkombination **Strg+F** (Windows) bzw. **Cmd+F** (Mac) nach
   dem Wort **TODO** suchen. An jeder Stelle mit `<!-- TODO: ... -->` steht,
   was noch angepasst werden muss.
3. Den Platzhaltertext direkt darunter durch den echten Text ersetzen und die
   Datei speichern.

Beispiel – Öffnungszeiten in `index.html` (rund um `id="oeffnungszeiten"`):

```
<tr><td>Montag – Freitag</td><td>08:00 – 18:00 Uhr</td></tr>
```

Einfach die Uhrzeiten bzw. Wochentage durch die echten Werte ersetzen.

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


1. Das neue Foto in den Ordner `assets/img/` kopieren (z. B. `foto1.jpg`).
   Tipp: Fotos vorher nicht zu groß speichern (unter 500 KB reicht für die
   Website völlig aus), damit die Seite schnell lädt.
2. In `index.html` im Bereich „Galerie" (`id="galerie"`) eine der
   Platzhalter-Boxen suchen:

   ```
   <div class="galerie-bild"><div class="galerie-platzhalter">Foto folgt</div></div>
   ```

3. Diese Zeile ersetzen durch:

   ```
   <div class="galerie-bild"><img src="assets/img/foto1.jpg" alt="Kurze Bildbeschreibung"></div>
   ```

   (Dateinamen jeweils an das eigene Foto anpassen.)

## Speisekarte ändern (Preise, Gerichte)

Die Speisekarte steht in der Datei `speisekarte.html`. Jeder Eintrag sieht so
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

Auch die Frühstückszeiten und der Mittagstisch stehen ganz oben in
`speisekarte.html` – und zusätzlich auf der Startseite im Bereich
„Öffnungszeiten". Wenn sich diese Zeiten ändern, bitte an **beiden** Stellen
anpassen.

### Wichtig: Allergen-Legende

Ganz unten auf der Speisekarte steht die Legende mit den Nummern und
Buchstaben. Auf der gedruckten Karte fehlen dort aktuell die Nummern (5), (6)
und (7) – obwohl (7) bei allen Kaffees verwendet wird. Das sollte geprüft und
ergänzt werden (in `speisekarte.html` bei `class="legende"`).

## Telefonnummer / E-Mail ändern

Im Bereich „Kontakt" (`id="kontakt"`) in `index.html` die Platzhalter-Nummer
bzw. -Adresse ersetzen. Wichtig: auch die Zahlen direkt hinter `tel:` bzw.
`mailto:` mit anpassen, sonst funktioniert der Klick-zum-Anrufen-Link nicht.

## Impressum & Datenschutz ausfüllen

In `impressum.html` und `datenschutz.html` alle Textstellen in eckigen
Klammern (z. B. `[Vor- und Nachname]`) durch die echten Angaben ersetzen und
die eckigen Klammern dabei entfernen. Das Impressum ist in Deutschland für
gewerbliche Websites gesetzlich vorgeschrieben und sollte vor der
Veröffentlichung vollständig ausgefüllt sein.

## Änderungen ansehen

Nach dem Speichern einfach `index.html` im Browser öffnen (Doppelklick) – so
sieht man sofort, ob alles passt, bevor die Seite hochgeladen wird.

## Änderungen ins Internet stellen

Die Website liegt bei Hostinger. Damit eine Änderung auch für Besucher
sichtbar wird, muss die geänderte Datei dort hochgeladen werden:

1. Bei [hpanel.hostinger.com](https://hpanel.hostinger.com) einloggen.
2. **Dateien → Dateimanager** öffnen und in den Ordner `public_html` gehen.
3. Die geänderte Datei hochladen – z. B. `index.html`. Die Nachfrage, ob die
   vorhandene Datei überschrieben werden soll, mit Ja beantworten.
4. Die Website im Browser öffnen und die Ansicht mit **Strg + F5**
   (am Mac: **Cmd + Shift + R**) neu laden.

> **Warum Strg + F5?** Browser merken sich Seiten kurzzeitig, um sie schneller
> anzuzeigen. Nach einer Änderung sieht man deshalb oft noch die alte Version.
> Mit Strg + F5 wird die Seite wirklich neu geladen. Wenn also nach dem
> Hochladen scheinbar „nichts passiert" ist, liegt es fast immer daran – nicht
> an einem Fehler.

Wichtig: Immer nur die Dateien austauschen, die man wirklich geändert hat.
Der Ordner `assets` muss dabei so bleiben, wie er ist (dort liegen Bilder und
das Design).
