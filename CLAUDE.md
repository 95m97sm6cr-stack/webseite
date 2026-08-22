# Hinweise für Claude

Website des Cafés **b.ellers**, Stadtplatz 1, 83714 Miesbach. Familienbetrieb,
Inhaberin Birgit Eller. Die Seite ist fertig und läuft im Betrieb.

Diese Datei enthält das, was man dem Code **nicht** ansieht. Wo es reicht,
wird auf die anderen Anleitungen verwiesen statt sie zu wiederholen.

## Rahmen

- **Reines HTML, CSS und JavaScript.** Kein Build-Schritt, kein
  Paketmanager, keine Abhängigkeiten. Eine geänderte Datei ist sofort die
  fertige Datei. Bitte dabei bleiben – der Betrieb soll ohne Werkzeugkette
  auskommen.
- **Veröffentlicht** über GitHub Pages vom Branch
  `claude/cafe-bellers-website-s2m00o` (nicht `main`). Jeder Push dorthin geht
  binnen einer Minute live.
- **Adresse** `https://bellers-cafe.de`, Domain bei IONOS, Hosting kostenlos.
  Die Datei `CNAME` teilt GitHub die Domain mit.
- **Sprache:** Deutsch ist die Standardfassung, Englisch liegt daneben.

## Feste Regeln

Jede hat einen Grund. Ohne den Grund wirken sie wie Kleinigkeiten und werden
beim nächsten Umbau wegoptimiert.

1. **Keine echte Reservierungsfunktion.** Der Knopf „Tisch reservieren" zeigt
   ausschließlich Telefonnummer und Instagram. Ausdrücklicher Wunsch: Es soll
   *nicht* möglich sein, selbstständig zu reservieren – sonst stehen Tische
   im System, von denen im Café niemand weiß.

2. **Nur eigene Fotos des Cafés.** Keine Bilder aus dem Internet, auch keine
   „lizenzfreien". In Deutschland ist die Abmahnung wegen Bildrechten ein
   reales und teures Risiko.

3. **EXIF und GPS aus Fotos entfernen**, bevor sie ins Repo kommen. Handyfotos
   tragen Aufnahmeort und -zeit mit sich; auf einer öffentlichen Seite hat das
   nichts verloren. Verfahren steht in `INHALTE-BEARBEITEN.md`.

4. **Jede Änderung betrifft beide Sprachfassungen.** `index.html` und
   `index-en.html`, `speisekarte.html` und `menu-en.html` und so fort. Falsche
   Öffnungszeiten auf der englischen Seite sind schlimmer als keine englische
   Seite. Die vollständige Zuordnung steht oben in `INHALTE-BEARBEITEN.md`.

5. **Kein Alkohol.** Das Café schenkt keinen aus. Das gilt auch für
   Formulierungen, die ihn nahelegen – „Drinks", „Sektempfang", „alkoholfreies
   Getränk" (nennt die Abwesenheit und unterstellt damit eine Variante mit).

6. **Nichts einbauen, das auf dem Endgerät speichert oder fremde Server
   kontaktiert, ohne es vorher zu messen.** Die Seite kommt **ohne
   Cookie-Banner** aus, und das ist kein Zufall:
   - Sie setzt **null Cookies**.
   - In `localStorage` steht nur die Ansicht-Einstellung, und erst nachdem
     jemand aktiv darauf geklickt hat (§ 25 Abs. 2 TDDDG).
   - Einziger fremder Server ist `openstreetmap.org` für die Karte.

   Analytics, eingebettete Schriften von Google, Social-Media-Widgets oder ein
   Besucherzähler würden das zerstören. Wurde bereits erwogen und **bewusst
   nicht gemacht**. Wer daran etwas ändert: vorher messen, was tatsächlich
   gespeichert und geladen wird, und die Datenschutzerklärung nachziehen.

7. **Barrierefreiheit erhalten.** Die Seite ist ohne Maus und ohne JavaScript
   bedienbar, Schriftgröße und Kontrast sind einstellbar, alle Farbpaare
   erreichen mindestens 4,5:1. Wird bei Änderungen leicht zerstört.

8. **Keine Steuernummer im Repo.** Eine in einer früheren Sitzung genannte
   Steuernummer gehört nicht hierher – das Repository ist öffentlich. Im
   Impressum steht die Umsatzsteuer-ID, das ist etwas anderes und dort
   richtig.

## Vor jedem Push

Die drei Prüfskripte laufen lassen. Sie brauchen einen lokalen Server im
Wurzelverzeichnis:

```
python3 -m http.server 8765
node werkzeuge/pruefen.js
node werkzeuge/nav_pruefen.js
node werkzeuge/gross_pruefen.js
```

Details und die Anpassung an andere Umgebungen: `werkzeuge/README.md`.

## Zwei Fallen

- **Das Menü oben** steht in allen 13 Seiten und wird von
  `werkzeuge/nav_bauen.py` erzeugt. Änderungen dort machen, nicht in den
  HTML-Dateien – sonst überschreibt der nächste Lauf sie wieder.
- **`404.html` braucht absolute Pfade**, weil der Browser bei einer falschen
  Adresse weiter die falsche Adresse anzeigt und relative Pfade dann ins Leere
  zeigen. Der Präfix muss zum Ort der Website passen (derzeit `/`). Steht
  sowohl in `404.html` als Kommentar als auch in `nav_bauen.py`.

## Weiterführend

- `INHALTE-BEARBEITEN.md` – Texte, Preise, Fotos, Öffnungszeiten ändern.
  Geschrieben für Menschen ohne Programmierkenntnisse.
- `README.md` – Aufbau, Veröffentlichung, Domain, Suchmaschinen.
- `werkzeuge/README.md` – die Prüfskripte und Generatoren.

Die Commit-Beschreibungen in diesem Repo sind absichtlich ausführlich und
nennen jeweils den *Grund* einer Änderung. Bei einer Frage nach dem „warum"
lohnt `git log` mehr als das Raten.
