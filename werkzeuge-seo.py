"""Trägt Suchmaschinen-Angaben in alle Seiten ein und erzeugt robots.txt
und sitemap.xml.

Die Basisadresse steht nur hier. Zieht die Seite auf eine eigene Domain um,
ändert man BASIS und lässt das Skript erneut laufen.
"""
import re

BASIS = "https://95m97sm6cr-stack.github.io/webseite/"

VORSCHAU = BASIS + "assets/img/vorschau.jpg"

# Datei: (Sprache, Titel fürs Teilen, Beschreibung fürs Teilen, Gegenstück
#         in der anderen Sprache oder None)
SEITEN = {
    "index.html": ("de", "b.ellers – Das Café in Miesbach",
                   "Das familiengeführte Café am Stadtplatz in Miesbach. "
                   "Frühstück, Kaffee und Kuchen, Öffnungszeiten und Anfahrt auf einen Blick.",
                   "index-en.html"),
    "index-en.html": ("en", "b.ellers – The café in Miesbach",
                      "A family-run café on the Stadtplatz in Miesbach. Breakfast, "
                      "coffee and cake, opening hours and how to find us.",
                      "index.html"),
    "speisekarte.html": ("de", "Speisekarte – b.ellers in Miesbach",
                         "Frühstück, Mittagstisch, Kaffeespezialitäten und Getränke – "
                         "die ganze Karte mit Preisen und Allergenen.",
                         "menu-en.html"),
    "menu-en.html": ("en", "Menu – b.ellers in Miesbach",
                     "Breakfast, lunch, coffee specialities and drinks – the full "
                     "menu with prices and allergens.",
                     "speisekarte.html"),
    "galerie.html": ("de", "Galerie – b.ellers in Miesbach",
                     "Bilder aus dem Café: Innenräume, Frühstück, Kuchen und Kaffee.",
                     "gallery-en.html"),
    "gallery-en.html": ("en", "Gallery – b.ellers in Miesbach",
                        "Pictures from the café: the rooms, breakfast, cake and coffee.",
                        "galerie.html"),
    "events.html": ("de", "Feiern & Events – b.ellers in Miesbach",
                    "Geburtstage, Hochzeiten, JGA, Firmung, Kommunion, Muttertag "
                    "oder Vatertag bei uns feiern – auf Anfrage und nach Absprache.",
                    "events-en.html"),
    "events-en.html": ("en", "Celebrations & events – b.ellers in Miesbach",
                       "Birthdays, weddings, hen and stag parties, confirmations, "
                       "communions and more – on request and by arrangement.",
                       "events.html"),
    "jobs.html": ("de", "Jobs – b.ellers in Miesbach",
                  "Wir suchen Servicekraft, Küchenkraft und Barista (m/w/d) – "
                  "Minijob oder Teilzeit, Start nach Absprache.",
                  "jobs-en.html"),
    "jobs-en.html": ("en", "Jobs – b.ellers in Miesbach",
                     "We are looking for service staff, kitchen staff and a barista – "
                     "mini-job or part-time, starting by arrangement.",
                     "jobs.html"),
    "impressum.html": ("de", "Impressum – b.ellers",
                       "Pflichtangaben nach § 5 TMG für das Café b.ellers in Miesbach.",
                       None),
    "datenschutz.html": ("de", "Datenschutz – b.ellers",
                         "Wie diese Website mit Daten umgeht: keine Cookies, "
                         "kein Tracking.",
                         None),
}

# Wie oft sich eine Seite erfahrungsgemäß ändert – Hinweis für Suchmaschinen.
WANDEL = {
    "index.html": "weekly", "index-en.html": "weekly",
    "speisekarte.html": "monthly", "menu-en.html": "monthly",
    "galerie.html": "monthly", "gallery-en.html": "monthly",
    "events.html": "weekly", "events-en.html": "weekly",
    "jobs.html": "monthly", "jobs-en.html": "monthly",
    "impressum.html": "yearly", "datenschutz.html": "yearly",
}

WICHTIGKEIT = {"index.html": "1.0", "index-en.html": "0.9",
               "events.html": "0.8"}


def kopfangaben(datei):
    sprache, titel, beschreibung, gegenstueck = SEITEN[datei]
    adresse = BASIS + ("" if datei == "index.html" else datei)
    z = []
    a = z.append
    a('  <!-- Für Suchmaschinen und fürs Teilen in Messengern. Erzeugt vom')
    a('       Skript seo_einbauen.py – die Basisadresse steht dort an einer')
    a('       einzigen Stelle und muss bei einem Domain-Umzug nur dort')
    a('       geändert werden. -->')
    a(f'  <link rel="canonical" href="{adresse}">')
    a(f'  <meta property="og:type" content="website">')
    a(f'  <meta property="og:site_name" content="b.ellers">')
    a(f'  <meta property="og:title" content="{titel}">')
    a(f'  <meta property="og:description" content="{beschreibung}">')
    a(f'  <meta property="og:url" content="{adresse}">')
    a(f'  <meta property="og:image" content="{VORSCHAU}">')
    a('  <meta property="og:image:width" content="1200">')
    a('  <meta property="og:image:height" content="630">')
    a(f'  <meta property="og:image:alt" content="Logo von b.ellers – '
      'Kaffeetasse mit Herz, Kaffeebohnen und Brezn">')
    a(f'  <meta property="og:locale" content="{"de_DE" if sprache == "de" else "en_GB"}">')
    if gegenstueck:
        a(f'  <meta property="og:locale:alternate" content="'
          f'{"en_GB" if sprache == "de" else "de_DE"}">')
    a('  <meta name="twitter:card" content="summary_large_image">')
    return "\n".join(z)


def strukturierte_daten():
    """Adresse, Telefon und Öffnungszeiten maschinenlesbar – daraus baut
    Google die Infobox neben dem Suchergebnis. Bewusst OHNE geo-Koordinaten:
    Die Position in der eingebundenen Karte ist noch ein Platzhalter, und
    eine erfundene Koordinate wäre schlechter als gar keine."""
    return '''  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "b.ellers",
    "description": "Familiengeführtes Café am Stadtplatz in Miesbach mit Frühstück, Mittagstisch, Kaffeespezialitäten und hausgemachtem Kuchen.",
    "url": "''' + BASIS + '''",
    "image": "''' + VORSCHAU + '''",
    "logo": "''' + BASIS + '''assets/img/logo-freigestellt.png",
    "telephone": "+49 8025 9924355",
    "email": "info@bellers-cafe.de",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Stadtplatz 1",
      "postalCode": "83714",
      "addressLocality": "Miesbach",
      "addressRegion": "Bayern",
      "addressCountry": "DE"
    },
    "servesCuisine": ["Frühstück", "Kaffee", "Kuchen"],
    "currenciesAccepted": "EUR",
    "sameAs": ["https://www.instagram.com/b.ellers_cafe/"],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Monday",
        "opens": "00:00",
        "closes": "00:00"
      }
    ]
  }
  </script>'''


# ---------- In die Seiten eintragen ----------

alt_muster = re.compile(
    r'\n  <!-- Für Suchmaschinen und fürs Teilen.*?<meta name="twitter:card"[^>]*>',
    re.DOTALL)
alt_ldjson = re.compile(
    r'\n  <script type="application/ld\+json">.*?</script>', re.DOTALL)

for datei in SEITEN:
    text = open(datei, encoding="utf-8").read()
    # Erst eine frühere Fassung entfernen, damit das Skript wiederholbar ist
    text = alt_muster.sub("", text)
    text = alt_ldjson.sub("", text)

    einschub = "\n" + kopfangaben(datei)
    if datei in ("index.html", "index-en.html"):
        einschub += "\n" + strukturierte_daten()

    # Direkt hinter die Stylesheet-Zeile setzen
    neu, anzahl = re.subn(r'(  <link rel="stylesheet" href="[^"]*">)',
                          lambda m: m.group(1) + einschub, text, count=1)
    assert anzahl == 1, f"Stylesheet-Zeile in {datei} nicht gefunden"
    open(datei, "w", encoding="utf-8").write(neu)
    print(f"{datei}: Kopfangaben gesetzt"
          + (" + strukturierte Daten" if datei in ("index.html", "index-en.html") else ""))

# ---------- robots.txt ----------

open("robots.txt", "w", encoding="utf-8").write(
    "# ACHTUNG: Suchmaschinen lesen robots.txt ausschliesslich direkt an der\n"
    "# Wurzel einer Domain. Solange die Seite als GitHub-Projektseite unter\n"
    "# .../webseite/ liegt, wird diese Datei deshalb NICHT ausgewertet - sie\n"
    "# liegt hier fuer den Umzug auf eine eigene Domain bereit. Bis dahin die\n"
    "# sitemap.xml direkt in der Google Search Console eintragen.\n"
    "\n"
    "# Alle Suchmaschinen duerfen die ganze Seite lesen.\n"
    "User-agent: *\n"
    "Allow: /\n"
    "\n"
    "# Die Fehlerseite gehoert nicht in den Suchindex. Sie traegt zusaetzlich\n"
    "# ein noindex im Kopfbereich, das unabhaengig davon wirkt.\n"
    "Disallow: /404.html\n"
    "\n"
    f"Sitemap: {BASIS}sitemap.xml\n")
print("robots.txt geschrieben")

# ---------- sitemap.xml ----------

zeilen = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.w3.org/1999/xhtml/sitemap"'.replace(
              "http://www.w3.org/1999/xhtml/sitemap",
              "http://www.sitemaps.org/schemas/sitemap/0.9"),
          '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']

for datei, (sprache, _, _, gegenstueck) in SEITEN.items():
    adresse = BASIS + ("" if datei == "index.html" else datei)
    zeilen.append("  <url>")
    zeilen.append(f"    <loc>{adresse}</loc>")
    # Verweis auf die jeweils andere Sprachfassung, damit Suchmaschinen
    # beide kennen und die passende ausspielen
    if gegenstueck:
        deutsch = datei if sprache == "de" else gegenstueck
        englisch = gegenstueck if sprache == "de" else datei
        d_adresse = BASIS + ("" if deutsch == "index.html" else deutsch)
        e_adresse = BASIS + englisch
        zeilen.append(f'    <xhtml:link rel="alternate" hreflang="de" href="{d_adresse}"/>')
        zeilen.append(f'    <xhtml:link rel="alternate" hreflang="en" href="{e_adresse}"/>')
    zeilen.append(f"    <changefreq>{WANDEL[datei]}</changefreq>")
    zeilen.append(f"    <priority>{WICHTIGKEIT.get(datei, '0.7')}</priority>")
    zeilen.append("  </url>")

zeilen.append("</urlset>")
open("sitemap.xml", "w", encoding="utf-8").write("\n".join(zeilen) + "\n")
print(f"sitemap.xml geschrieben ({len(SEITEN)} Seiten)")
