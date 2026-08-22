"""Baut den <nav>-Block aller Seiten neu.

Zweck: eine einzige Stelle, an der die Navigation definiert ist. Vorher war
sie in jede Seite kopiert – auf den Galerieseiten zeigten die Links deshalb
auf Anker (#oeffnungszeiten …), die es dort gar nicht gibt, und auf der
Speisekarte fehlte der Eintrag „Galerie".

Neu ist außerdem, dass Sprachumschalter und „Ansicht" auf dem Handy mit hinter
dem Menüknopf verschwinden. Dafür liegen sie jetzt gemeinsam mit den Links in
<div class="nav-klapp">.
"""
import re

TEXTE = {
    "de": {
        "nav": "Hauptnavigation",
        "menue": "Menü öffnen",
        "ansicht": "Ansicht",
        "ansicht_titel": "Ansicht anpassen",
        "ansicht_hinweis": "Die Einstellung bleibt für alle Seiten gespeichert.",
        "schrift": "Schriftgröße",
        "normal": "Normal", "gross": "Groß", "sehr_gross": "Sehr groß",
        "kontrast": "Kontrast", "stark": "Stark",
        "bewegung": "Bewegung", "an": "An", "reduziert": "Reduziert",
        "zuruecksetzen": "Auf Standard zurücksetzen",
        "punkte": [("Willkommen", "index.html", "#hero"),
                   ("Speisekarte", "speisekarte.html", None),
                   ("Öffnungszeiten", "index.html#oeffnungszeiten", "#oeffnungszeiten"),
                   ("Anfahrt", "index.html#anfahrt", "#anfahrt"),
                   ("Galerie", "galerie.html", "#galerie"),
                   ("Events", "events.html", None),
                   ("Jobs", "jobs.html", None),
                   ("Kontakt", "index.html#kontakt", "#kontakt")],
    },
    "en": {
        "nav": "Main navigation",
        "menue": "Open menu",
        "ansicht": "View",
        "ansicht_titel": "Adjust the view",
        "ansicht_hinweis": "The setting is kept for all pages.",
        "schrift": "Text size",
        "normal": "Normal", "gross": "Large", "sehr_gross": "Very large",
        "kontrast": "Contrast", "stark": "Strong",
        "bewegung": "Motion", "an": "On", "reduziert": "Reduced",
        "zuruecksetzen": "Back to standard",
        "punkte": [("Welcome", "index-en.html", "#hero"),
                   ("Menu", "menu-en.html", None),
                   ("Opening hours", "index-en.html#oeffnungszeiten", "#oeffnungszeiten"),
                   ("Getting here", "index-en.html#anfahrt", "#anfahrt"),
                   ("Gallery", "gallery-en.html", "#galerie"),
                   ("Events", "events-en.html", None),
                   ("Jobs", "jobs-en.html", None),
                   ("Contact", "index-en.html#kontakt", "#kontakt")],
    },
}

# Datei: (Sprache, Startseite?, Präfix vor allen eigenen Adressen,
#         Sprachumschalter als (deutsch, englisch) oder None)
SEITEN = {
    "index.html":      ("de", True,  "", ("index.html", "index-en.html")),
    "index-en.html":   ("en", True,  "", ("index.html", "index-en.html")),
    "speisekarte.html": ("de", False, "", ("speisekarte.html", "menu-en.html")),
    "menu-en.html":    ("en", False, "", ("speisekarte.html", "menu-en.html")),
    "galerie.html":    ("de", False, "", ("galerie.html", "gallery-en.html")),
    "gallery-en.html": ("en", False, "", ("galerie.html", "gallery-en.html")),
    "events.html":     ("de", False, "", ("events.html", "events-en.html")),
    "events-en.html":  ("en", False, "", ("events.html", "events-en.html")),
    "jobs.html":       ("de", False, "", ("jobs.html", "jobs-en.html")),
    "jobs-en.html":    ("en", False, "", ("jobs.html", "jobs-en.html")),
    "impressum.html":  ("de", False, "", None),
    "datenschutz.html": ("de", False, "", None),
    # Die Fehlerseite kann unter jeder Adresse ausgeliefert werden, deshalb
    # müssen ihre Links absolut sein. Der Präfix entspricht dem Ort, an dem
    # die Seite liegt: unter der eigenen Domain bellers-cafe.de liegt sie an
    # der Wurzel, also "/". Läge sie je wieder in einem Unterordner (etwa als
    # GitHub-Projektseite unter .../webseite/), müsste hier "/webseite/"
    # stehen. Muss zu den Pfaden im Rest der Datei passen – siehe den
    # Kommentar oben in 404.html.
    "404.html":        ("de", False, "/", None),
}


def nav(datei):
    sprache, startseite, praefix, umschalter = SEITEN[datei]
    t = TEXTE[sprache]
    z = []
    a = z.append

    a(f'    <nav class="nav" aria-label="{t["nav"]}">')
    heim = ("#hero" if startseite
            else praefix + ("index-en.html" if sprache == "en" else "index.html"))
    a(f'      <a href="{heim}" class="nav-logo">')
    a(f'        <img src="{praefix}assets/img/signet.png" alt="">')
    a('        <span>b.ellers</span>')
    a('      </a>')
    a('')
    a(f'      <button class="nav-toggle" aria-label="{t["menue"]}"'
      ' aria-expanded="false" aria-controls="nav-klapp">&#9776;</button>')
    a('')
    a('      <div class="nav-klapp" id="nav-klapp">')

    # Impressum, Datenschutz und die Fehlerseite bekommen keine Abschnittsliste,
    # dort führt sie nur ins Leere bzw. weg von dem, was man gerade liest.
    if datei not in ("impressum.html", "datenschutz.html"):
        a('        <ul class="nav-links">')
        for name, adresse, anker in t["punkte"]:
            ziel = anker if (startseite and anker) else praefix + adresse
            a(f'          <li><a href="{ziel}">{name}</a></li>')
        a('        </ul>')
        a('')

    a('        <div class="nav-werkzeuge">')
    if umschalter:
        de, en = umschalter
        a('          <div class="sprache">')
        if sprache == "de":
            a(f'            <a href="{de}" aria-current="true">DE</a>')
            a('            <span class="trennstrich" aria-hidden="true"></span>')
            a(f'            <a href="{en}" lang="en" hreflang="en">EN</a>')
        else:
            a(f'            <a href="{de}" lang="de" hreflang="de">DE</a>')
            a('            <span class="trennstrich" aria-hidden="true"></span>')
            a(f'            <a href="{en}" aria-current="true">EN</a>')
        a('          </div>')
        a('')

    a('          <div class="ansicht">')
    a('            <button class="ansicht-knopf" aria-expanded="false" aria-controls="ansicht-panel">')
    a('              <span class="klein-a" aria-hidden="true">A</span>'
      '<span class="gross-a" aria-hidden="true">A</span>')
    a(f'              <span>{t["ansicht"]}</span>')
    a('            </button>')
    a('')
    a('            <div class="ansicht-panel" id="ansicht-panel" hidden>')
    a(f'              <h2>{t["ansicht_titel"]}</h2>')
    a(f'              <p>{t["ansicht_hinweis"]}</p>')
    for schluessel, titel, knoepfe in [
            ("schrift", t["schrift"], [("normal", t["normal"]),
                                       ("gross", t["gross"]),
                                       ("sehr-gross", t["sehr_gross"])]),
            ("kontrast", t["kontrast"], [("normal", t["normal"]),
                                         ("stark", t["stark"])]),
            ("bewegung", t["bewegung"], [("an", t["an"]),
                                         ("reduziert", t["reduziert"])])]:
        a('')
        a('              <div class="ansicht-gruppe">')
        a(f'                <span class="titel" id="titel-{schluessel}">{titel}</span>')
        a(f'                <div class="ansicht-wahl" role="group" aria-labelledby="titel-{schluessel}">')
        for wert, beschriftung in knoepfe:
            a(f'                  <button type="button" data-setzt="{schluessel}:{wert}">'
              f'{beschriftung}</button>')
        a('                </div>')
        a('              </div>')
    a('')
    a(f'              <button type="button" class="zuruecksetzen">{t["zuruecksetzen"]}</button>')
    a('            </div>')
    a('          </div>')
    a('        </div>')
    a('      </div>')
    a('    </nav>')
    return "\n".join(z)


muster = re.compile(r'    <nav class="nav".*?</nav>', re.DOTALL)

for datei in SEITEN:
    quelltext = open(datei, encoding="utf-8").read()
    neu, anzahl = muster.subn(lambda m: nav(datei), quelltext, count=1)
    assert anzahl == 1, f"<nav> in {datei} nicht gefunden"
    open(datei, "w", encoding="utf-8").write(neu)
    print(f"{datei}: Navigation neu gebaut")
