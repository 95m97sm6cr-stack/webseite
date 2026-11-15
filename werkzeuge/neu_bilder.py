"""Erzeugt die Bilder der neuen Seite (Ordner neu/bilder) aus den Vorlagen.

Jedes Foto entsteht in drei Breiten und drei Formaten (AVIF, WebP, JPG als
Rueckfall). Metadaten (EXIF, GPS) werden dabei nicht uebernommen.
Aufruf im Wurzelverzeichnis:  python werkzeuge/neu_bilder.py
Braucht Pillow mit AVIF-Unterstuetzung.
"""
import glob, json, os, re, html, io
from PIL import Image, ImageOps

ZIEL = "neu/bilder"
BREITEN = (480, 800, 1350)

fotos = []
for quelle in sorted(glob.glob("assets/img/galerie/gross/foto-*.jpg")):
    name = os.path.basename(quelle)[:-4]
    im = ImageOps.exif_transpose(Image.open(quelle)).convert("RGB")
    b, h = im.size
    breiten = [w for w in BREITEN if w < b] + [b] if b < BREITEN[-1] else list(BREITEN)
    breiten = sorted(set(breiten))
    for w in breiten:
        bild = im if w == b else im.resize((w, round(h * w / b)), Image.LANCZOS)
        basis = f"{ZIEL}/fotos/{name}-{w}"
        bild.save(basis + ".avif", quality=52, speed=4)
        bild.save(basis + ".webp", quality=74, method=6)
        bild.save(basis + ".jpg", quality=76, progressive=True, optimize=True)
    fotos.append({"name": name, "breite": b, "hoehe": h, "breiten": breiten})

# Beschriftungen und Alt-Texte aus den alten Galerieseiten uebernehmen
def texte(datei):
    s = io.open(datei, encoding="utf-8").read()
    aus = {}
    for bu, name, alt in re.findall(r'data-bu="([^"]*)">\s*<img src="assets/img/galerie/(foto-\d+)\.jpg" alt="([^"]*)"', s):
        aus[name] = (html.unescape(bu), html.unescape(alt))
    return aus
if os.path.exists("galerie.html"):
    de, en = texte("galerie.html"), texte("gallery-en.html")
    for f in fotos:
        f["titel"] = {"de": de[f["name"]][0], "en": en[f["name"]][0]}
        f["alt"] = {"de": de[f["name"]][1], "en": en[f["name"]][1]}
    json.dump(fotos, io.open("werkzeuge/neu_fotos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# Logo und Signet
logo = Image.open("assets/img/logo-freigestellt.png").convert("RGBA")
for w in (360, 700):
    l = logo.resize((w, round(logo.height * w / logo.width)), Image.LANCZOS)
    l.save(f"{ZIEL}/logo-{w}.webp", quality=88, method=6)
    l.save(f"{ZIEL}/logo-{w}.png", optimize=True)
sig = Image.open("assets/img/signet.png").convert("RGBA")
sig.resize((96, 96), Image.LANCZOS).save(f"{ZIEL}/signet.png", optimize=True)
sig.resize((96, 96), Image.LANCZOS).save(f"{ZIEL}/signet.webp", quality=88)
sig.resize((32, 32), Image.LANCZOS).save(f"{ZIEL}/favicon-32.png", optimize=True)
sig.resize((48, 48), Image.LANCZOS).save("neu/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
for w in (180, 192, 512):                      # Symbole fuer den Startbildschirm: auf Rosé
    grund = Image.new("RGBA", (w, w), "#fac3b7")
    s = sig.resize((round(w * .76), round(w * .76)), Image.LANCZOS)
    grund.alpha_composite(s, ((w - s.width) // 2, (w - s.height) // 2))
    grund.convert("RGB").save(f"{ZIEL}/symbol-{w}.png", optimize=True)
Image.open("assets/img/vorschau.jpg").save(f"{ZIEL}/vorschau.jpg", quality=84, optimize=True)
print(len(fotos), "Fotos,", len(glob.glob(ZIEL + "/fotos/*")), "Dateien")
