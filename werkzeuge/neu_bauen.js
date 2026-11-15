/* Baut die HTML-Seiten der neuen Website im Ordner neu/.

   Aufruf im Wurzelverzeichnis:
     node werkzeuge/neu_bauen.js            fertige Fassung
     node werkzeuge/neu_bauen.js vorschau   Vorschau: Suchmaschinen bleiben draußen

   Die Seite selbst braucht dieses Skript NICHT – sie besteht aus fertigen
   Dateien. Es existiert nur, damit die deutsche und die englische Fassung
   nicht von Hand gleich gehalten werden müssen. Öffnungszeiten und Karte
   werden aus neu/daten/daten.js vorab ins HTML geschrieben (für Besucher
   ohne JavaScript und für Suchmaschinen); im Browser setzt neu/js/main.js
   dann den jeweils aktuellen Stand ein. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");

const ZIEL = path.join(__dirname, "..", "neu");
const VORSCHAU = process.argv.includes("vorschau");
const BASIS = "https://bellers-cafe.de/";

const kern = require(path.join(ZIEL, "js", "main.js"));
const kasten = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ZIEL, "daten", "daten.js"), "utf8"), kasten);
const DATEN = kasten.window.BELLERS;
const FOTOS = JSON.parse(fs.readFileSync(path.join(__dirname, "neu_fotos.json"), "utf8"));
const foto = (name) => FOTOS.find((f) => f.name === name);

const TEL = "tel:+4980259924355", TEL_TEXT = "08025 9924355", MAIL = "info@bellers-cafe.de";
const INSTA = "https://www.instagram.com/b.ellers_cafe/";
const ROUTE = "https://www.google.com/maps/dir/?api=1&amp;destination=b.ellers%2C+Stadtplatz+1%2C+83714+Miesbach";
const OSM = "https://www.openstreetmap.org/export/embed.html?bbox=11.8287%2C47.7866%2C11.8387%2C47.7916&amp;layer=mapnik&amp;marker=47.7891%2C11.8337";
const OSM_GROSS = "https://www.openstreetmap.org/?mlat=47.7891&amp;mlon=11.8337#map=18/47.7891/11.8337";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* <picture> mit AVIF, WebP und JPG in allen vorhandenen Breiten */
function bild(name, sizes, sprache, opt = {}) {
  const f = foto(name), satz = (e) => f.breiten.map((b) => `bilder/fotos/${name}-${b}.${e} ${b}w`).join(", ");
  const mitte = f.breiten[Math.min(1, f.breiten.length - 1)];
  const lade = opt.sofort ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<picture>
            <source type="image/avif" srcset="${satz("avif")}" sizes="${sizes}">
            <source type="image/webp" srcset="${satz("webp")}" sizes="${sizes}">
            <img src="bilder/fotos/${name}-${mitte}.jpg" srcset="${satz("jpg")}" sizes="${sizes}" alt="${esc(opt.alt != null ? opt.alt : f.alt[sprache])}" width="${f.breite}" height="${f.hoehe}" ${lade}>
          </picture>`;
}

function schema() {
  return JSON.stringify({
    "@context": "https://schema.org", "@type": "CafeOrCoffeeShop", name: "b.ellers",
    description: "Familiengeführtes Café am Stadtplatz in Miesbach mit Frühstück, Kaffeespezialitäten und hausgemachtem Kuchen.",
    url: BASIS, image: BASIS + "bilder/vorschau.jpg", logo: BASIS + "bilder/logo-700.png",
    telephone: "+49 8025 9924355", email: MAIL,
    address: { "@type": "PostalAddress", streetAddress: "Stadtplatz 1", postalCode: "83714",
               addressLocality: "Miesbach", addressRegion: "Bayern", addressCountry: "DE" },
    servesCuisine: ["Frühstück", "Kaffee", "Kuchen"], currenciesAccepted: "EUR",
    hasMenu: BASIS + "#karte", sameAs: [INSTA],
    openingHoursSpecification: kern.zeitenSchema(DATEN),
  }, null, 1);
}

/* ---------- gemeinsamer Rahmen ---------- */

function kopf(o) {
  return `<!DOCTYPE html>
<html lang="${o.sprache}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(o.titel)}</title>
  <meta name="description" content="${esc(o.beschreibung)}">${VORSCHAU || o.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="canonical" href="${BASIS}${o.datei === "index.html" ? "" : o.datei}">${o.alternativen ? `
  <link rel="alternate" hreflang="de" href="${BASIS}">
  <link rel="alternate" hreflang="en" href="${BASIS}index-en.html">
  <link rel="alternate" hreflang="x-default" href="${BASIS}">` : ""}
  <meta name="theme-color" content="#fac3b7">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="b.ellers">
  <meta property="og:title" content="${esc(o.titel)}">
  <meta property="og:description" content="${esc(o.beschreibung)}">
  <meta property="og:url" content="${BASIS}${o.datei === "index.html" ? "" : o.datei}">
  <meta property="og:image" content="${BASIS}bilder/vorschau.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="${o.sprache === "en" ? "en_GB" : "de_DE"}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="favicon.ico" sizes="48x48">
  <link rel="icon" href="bilder/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="bilder/symbol-180.png">
  <link rel="manifest" href="site.webmanifest">
${o.schema ? `  <link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${foto("foto-16").breiten.map((b) => `bilder/fotos/foto-16-${b}.avif ${b}w`).join(", ")}" imagesizes="(min-width: 900px) 44vw, 100vw">
` : ""}  <link rel="preload" href="schriften/figtree.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="schriften/fraunces.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/style.css">${o.schema ? `
  <script type="application/ld+json" id="schema">
${schema()}
  </script>` : ""}
</head>`;
}

function seitenkopf(s, start) {
  const L = (de, en) => (s === "en" ? en : de), heim = s === "en" ? "index-en.html" : "index.html", p = start ? "" : heim;
  const punkte = [["#karte", L("Speisekarte", "Menu")], ["#reservieren", L("Reservieren", "Book a table")],
    ["#besuch", L("Öffnungszeiten & Anfahrt", "Hours & directions")], ["#galerie", L("Galerie", "Gallery")],
    ["#feiern", L("Feiern", "Celebrations")], ["#gutscheine", L("Gutscheine", "Vouchers")],
    ["#jobs", "Jobs"], ["#kontakt", L("Kontakt", "Contact")]];
  const liste = punkte.map(([z, n]) => `<li><a href="${p}${z}">${n}</a></li>`).join("\n          ");
  const sprachlink = start
    ? (s === "en" ? `<a class="sprache" href="index.html" lang="de" hreflang="de" aria-label="Deutsche Fassung">DE</a>`
                  : `<a class="sprache" href="index-en.html" lang="en" hreflang="en" aria-label="English version">EN</a>`)
    : "";
  return `
  <a class="sprung" href="#inhalt">${L("Zum Inhalt springen", "Skip to content")}</a>

  <header class="kopf">
    <div class="kopf-innen">
      <a class="marke" href="${start ? "#anfang" : heim}" aria-label="${L("b.ellers – zum Seitenanfang", "b.ellers – back to top")}">
        <picture><source type="image/webp" srcset="bilder/signet.webp"><img src="bilder/signet.png" alt="" width="96" height="96"></picture>
        <span>b.ellers</span>
      </a>
      <nav class="hauptnav" aria-label="${L("Hauptnavigation", "Main navigation")}">
        <ul>
          ${liste}
        </ul>
      </nav>
      ${sprachlink}
      <details class="menue" id="menue">
        <summary>${L("Menü", "Menu")}</summary>
        <nav aria-label="${L("Navigation", "Navigation")}">
          <ul>
          ${liste}
          </ul>
        </nav>
      </details>
    </div>
  </header>`;
}

function fuss(s) {
  const L = (de, en) => (s === "en" ? en : de);
  return `
  <footer class="fuss">
    <div class="innen fuss-innen">
      <p class="fuss-marke">b.ellers</p>
      <p>Stadtplatz 1 · 83714 Miesbach<br><a href="${TEL}">${TEL_TEXT}</a> · <a href="mailto:${MAIL}">${MAIL}</a></p>
      <p class="fuss-links">
        <a href="${INSTA}" rel="noopener">Instagram</a>
        <a href="impressum.html">${L("Impressum", "Legal notice (German)")}</a>
        <a href="datenschutz.html">${L("Datenschutz", "Privacy policy (German)")}</a>
      </p>
      <p class="fuss-klein">© 2026 b.ellers</p>
    </div>
  </footer>`;
}

/* ---------- Startseite ---------- */

function startseite(s) {
  const L = (de, en) => (s === "en" ? en : de);
  const karte = kern.karteHtml(DATEN, s);
  const reihenfolge = ["foto-16", "foto-11", "foto-01", "foto-12", "foto-17", "foto-08", "foto-14", "foto-03", "foto-13",
                       "foto-15", "foto-06", "foto-09", "foto-10", "foto-07", "foto-02", "foto-04", "foto-05"];
  const galerie = reihenfolge.map((n, i) => {
    const f = foto(n);
    return `<a href="bilder/fotos/${n}-${f.breiten[f.breiten.length - 1]}.jpg" data-foto="${n}" data-breiten="${f.breiten.join(",")}" data-titel="${esc(f.titel[s])}">
          ${bild(n, i === 0 ? "(min-width: 1200px) 580px, (min-width: 800px) 48vw, 94vw" : "(min-width: 1200px) 285px, (min-width: 800px) 24vw, 46vw", s)}
        </a>`;
  }).join("\n        ");

  const anlaesse = [
    [L("Geburtstage", "Birthdays"), L("Vom runden Geburtstag bis zur Kindergeburtstagsrunde – mit Kuchen, Torte oder Frühstück.", "From a milestone birthday to a children's party – with cake, gateau or breakfast.")],
    [L("Junggesellenabschiede", "Hen & stag parties"), L("Ein entspannter Start in den Tag oder eine gemütliche Runde zwischendurch – ganz ohne Hektik.", "An easy start to the day or a comfortable break in between – without any rush.")],
    [L("Firmung & Kommunion", "Confirmation & communion"), L("Der festliche Rahmen für die Familie nach der Kirche, mit Frühstück oder Mittagstisch.", "A festive setting for the family after the church service, with breakfast or lunch.")],
    [L("Muttertag & Vatertag", "Mother's & Father's Day"), L("Einen Tisch für die ganze Familie reservieren oder etwas Besonderes vorbereiten lassen.", "Book a table for the whole family, or have something special prepared.")],
    [L("Und alles andere", "And anything else"), L("Taufe, Jubiläum, Firmenfeier, Vereinstreffen, Trauerkaffee – fragt einfach, wir richten uns nach euch.", "Christenings, anniversaries, company parties, club meetings, a wake – just ask, we will fit around you.")],
  ].map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("\n            ");

  const wege = (betreff) => `<p class="wege">
            <a class="knopf" href="${TEL}">${L("Anrufen", "Call")}: ${TEL_TEXT}</a>
            <a class="knopf knopf-hell" href="mailto:${MAIL}?subject=${betreff}">${L("E-Mail schreiben", "Write an email")}</a>
            <a class="knopf knopf-hell" href="${INSTA}" rel="noopener">${L("Auf Instagram schreiben", "Write on Instagram")}</a>
          </p>`;

  return `${kopf({ sprache: s, datei: s === "en" ? "index-en.html" : "index.html", alternativen: true, schema: true,
    titel: L("b.ellers – Café & Frühstück am Stadtplatz in Miesbach", "b.ellers – café & breakfast on the main square in Miesbach"),
    beschreibung: L("Café b.ellers am Stadtplatz in Miesbach: Frühstück, Kaffee und Kuchen im familiengeführten Café. Speisekarte, Öffnungszeiten, Anfahrt und Reservierung.",
                    "Café b.ellers on the main square in Miesbach, Bavaria: breakfast, coffee and cake in a family-run café. Menu, opening hours, directions and table bookings.") })}
<body id="anfang">
${seitenkopf(s, true)}

  <main id="inhalt">

    <section class="auftakt" aria-labelledby="auftakt-titel">
      <div class="innen auftakt-oben">
        <div class="auftakt-text">
          <p class="status-zeile"><a class="status" href="#besuch"><span data-status>${L("Öffnungszeiten ansehen", "See opening hours")}</span></a></p>
          <h1 id="auftakt-titel">${L("Das Café am Stadtplatz <span>in Miesbach</span>", "The café on the main square <span>in Miesbach</span>")}</h1>
          <p class="auftakt-satz">${L("Guter Kaffee, ein reich gedeckter Frühstückstisch und ein gemütlicher Platz zum Verweilen.",
                                       "Good coffee, a generously laid breakfast table and a comfortable spot to linger.")}</p>
          <p class="auftakt-knoepfe">
            <a class="knopf" href="#karte">${L("Zur Speisekarte", "See the menu")}</a>
            <a class="knopf knopf-hell" href="#reservieren">${L("Tisch reservieren", "Book a table")}</a>
          </p>
        </div>
        <figure class="auftakt-bild">
          ${bild("foto-16", "(min-width: 900px) 44vw, 100vw", s, { sofort: true })}
        </figure>
      </div>
      <div class="auftakt-marke">
        <div class="innen">
          <picture class="auftakt-logo">
            <source type="image/webp" srcset="bilder/logo-360.webp 360w, bilder/logo-700.webp 700w" sizes="(min-width: 900px) 190px, 130px">
            <img src="bilder/logo-360.png" srcset="bilder/logo-360.png 360w, bilder/logo-700.png 700w" sizes="(min-width: 900px) 190px, 130px" alt="${L("b.ellers – Kaffeetasse mit Herz im Milchschaum, Kaffeebohnen und Breze", "b.ellers – coffee cup with a latte art heart, coffee beans and a pretzel")}" width="700" height="669">
          </picture>
          <p class="auftakt-ort">Stadtplatz 1<br>83714 Miesbach<br><a href="${TEL}">${TEL_TEXT}</a></p>
        </div>
      </div>
    </section>

    <section class="abschnitt karte" id="karte" aria-labelledby="karte-titel">
      <div class="innen">
        <header class="abschnitt-kopf">
          <h2 id="karte-titel">${L("Speisekarte", "Menu")}</h2>
          <p>${L("Alles frisch, vieles hausgemacht.", "Everything fresh, much of it homemade.")}</p>
        </header>
      </div>
      <nav class="karte-nav" id="karte-nav" aria-label="${kern.TEXTE[s].kategorien}">
        ${karte.nav}
      </nav>
      <div class="innen">
        <div class="karte-inhalt" id="karte-inhalt">
${karte.inhalt}
        </div>
        <div class="karte-fuss" id="karte-fuss">${karte.fuss}</div>
      </div>
    </section>

    <section class="band" id="reservieren" aria-labelledby="reservieren-titel">
      <div class="innen band-innen" data-einblenden>
        <div>
          <h2 id="reservieren-titel">${L("Tisch reservieren", "Book a table")}</h2>
          <p>${L("Meldet euch einfach kurz bei uns – wir finden einen Platz für euch. Am besten telefonisch während unserer Öffnungszeiten oder per Nachricht auf Instagram.",
                 "Just give us a quick call – we'll find you a table. Best by phone during our opening hours, or send us a message on Instagram.")}</p>
        </div>
        <ul class="band-wege">
          <li><a href="${TEL}"><span>${L("Anrufen", "Call us")}</span><strong>${TEL_TEXT}</strong></a></li>
          <li><a href="${INSTA}" rel="noopener"><span>${L("Nachricht auf Instagram", "Message on Instagram")}</span><strong>@b.ellers_cafe</strong></a></li>
        </ul>
      </div>
    </section>

    <section class="abschnitt" id="besuch" aria-labelledby="besuch-titel">
      <div class="innen besuch">
        <div data-einblenden>
          <h2 id="besuch-titel">${L("Öffnungszeiten", "Opening hours")}</h2>
          <p class="status-zeile"><span class="status" data-status></span></p>
          <table class="zeiten">
            <caption class="unsichtbar">${L("Öffnungszeiten von b.ellers", "Opening hours of b.ellers")}</caption>
            <tbody id="zeiten-koerper">
${kern.zeitenHtml(DATEN, s)}
            </tbody>
          </table>
        </div>
        <div data-einblenden>
          <h2 id="anfahrt-titel">${L("Anfahrt", "Find us")}</h2>
          <address>b.ellers<br>Stadtplatz 1<br>83714 Miesbach</address>
          <p>${L("Mitten am Miesbacher Stadtplatz.", "Right on Miesbach's main square.")}</p>
          <p class="wege">
            <a class="knopf" href="${ROUTE}" rel="noopener">${L("Route planen", "Get directions")}</a>
          </p>
          <div class="landkarte" id="landkarte" data-quelle="${OSM}">
            <p>${L("Die Karte kommt von OpenStreetMap. Sie wird erst geladen, wenn ihr sie anfordert – dabei wird eure IP-Adresse an OpenStreetMap übertragen.",
                   "The map comes from OpenStreetMap. It only loads when you ask for it – your IP address is then sent to OpenStreetMap.")}</p>
            <p><button type="button" class="knopf knopf-hell" id="karte-laden">${L("Karte anzeigen", "Show map")}</button></p>
            <p><a href="${OSM_GROSS}" rel="noopener">${L("Stattdessen bei OpenStreetMap öffnen", "Open on OpenStreetMap instead")}</a></p>
          </div>
        </div>
      </div>
    </section>

    <section class="abschnitt abschnitt-rose" id="galerie" aria-labelledby="galerie-titel">
      <div class="innen">
        <header class="abschnitt-kopf">
          <h2 id="galerie-titel">${L("Galerie", "Gallery")}</h2>
          <p>${L("Noch mehr gibt es auf", "There are more on")} <a href="${INSTA}" rel="noopener">Instagram</a>.</p>
        </header>
        <div class="galerie">
        ${galerie}
        </div>
      </div>
    </section>

    <section class="abschnitt" id="feiern" aria-labelledby="feiern-titel">
      <div class="innen zweispaltig">
        <div data-einblenden>
          <h2 id="feiern-titel">${L("Feiern bei b.ellers", "Celebrate at b.ellers")}</h2>
          <p class="vorspann">${L("Vom kleinen Geburtstagskaffee bis zur großen Feier – fragt einfach an.", "From a small birthday coffee to a big party – just ask us.")}</p>
          <p>${L("Ihr habt etwas zu feiern? Erzählt uns einfach, was ihr vorhabt, und wir überlegen gemeinsam, wie es am schönsten wird. Ob Kaffee und Kuchen für zehn Leute oder das ganze Café für euch allein: Sprecht uns an, wir finden eine Lösung.",
                 "Something to celebrate? Just tell us what you have in mind and we will work out together how to make it lovely. Coffee and cake for ten, or the whole café to yourselves: talk to us and we will find a way.")}</p>
          <ol class="schritte">
            <li><strong>${L("Anfragen", "Ask")}</strong> ${L("Ruft an, schreibt uns eine E-Mail oder eine Nachricht auf Instagram – mit Anlass, Datum und ungefährer Personenzahl.", "Call us, send an email or write on Instagram – with the occasion, the date and roughly how many of you there will be.")}</li>
            <li><strong>${L("Absprechen", "Arrange")}</strong> ${L("Wir besprechen in Ruhe, was es geben soll, wie viel Platz ihr braucht und was das Ganze kostet.", "We take the time to discuss what you would like to eat and drink, how much room you need and what it will cost.")}</li>
            <li><strong>${L("Feiern", "Celebrate")}</strong> ${L("Ihr kommt, alles steht bereit – und wir kümmern uns um den Rest.", "You arrive, everything is ready – and we take care of the rest.")}</li>
          </ol>
          ${wege(L("Anfrage%20Feier", "Celebration%20enquiry"))}
        </div>
        <div data-einblenden>
          <h3 class="klein-titel">${L("Anlässe, die wir gerne mit euch feiern", "Occasions we are glad to host")}</h3>
          <dl class="anlaesse">
            ${anlaesse}
          </dl>
        </div>
      </div>
    </section>

    <section class="abschnitt abschnitt-hell" id="gutscheine" aria-labelledby="gutscheine-titel">
      <div class="innen zweispaltig">
        <div data-einblenden>
          <h2 id="gutscheine-titel">${L("Gutscheine", "Gift vouchers")}</h2>
          <p class="vorspann">${L("Ein Stück b.ellers verschenken.", "Give a little bit of b.ellers.")}</p>
          <p>${L("Ein Gutschein von uns ist eine Einladung: zu einem Frühstück ohne Blick auf die Uhr, zu einem Stück Kuchen am Nachmittag oder einfach zu einem guten Kaffee mitten am Stadtplatz.",
                 "A voucher from us is an invitation: to a breakfast without watching the clock, to a slice of cake in the afternoon, or simply to a good coffee in the middle of the town square.")}</p>
          <p>${L("Sagt uns einfach Bescheid – dann liegt er an der Theke für euch bereit.", "Just let us know – it will be waiting for you at the counter.")}</p>
          ${wege(L("Gutschein", "Gift%20voucher"))}
        </div>
        <dl class="fakten" data-einblenden>
          <div><dt>${L("Betrag", "Amount")}</dt><dd>${L("ganz nach Wunsch", "whatever you like")}</dd></div>
          <div><dt>${L("Einlösbar", "Valid for")}</dt><dd>${L("für alles auf unserer Karte", "everything on our menu")}</dd></div>
          <div><dt>${L("Erhältlich", "Available")}</dt><dd>${L("bei uns im Café am Stadtplatz", "at the café on the Stadtplatz")}</dd></div>
          <div><dt>${L("Vorbestellen", "Order ahead")}</dt><dd>${L("telefonisch oder per E-Mail, Abholung an der Theke", "by phone or email, pick-up at the counter")}</dd></div>
        </dl>
      </div>
    </section>

    <section class="abschnitt" id="jobs" aria-labelledby="jobs-titel">
      <div class="innen zweispaltig">
        <div data-einblenden>
          <h2 id="jobs-titel">${L("Wir suchen dich!", "We are looking for you!")}</h2>
          <p class="vorspann">${L("Servicekraft / Küchenkraft / Barista (m/w/d)", "Service staff / kitchen staff / barista (m/f/d)")}</p>
          <dl class="fakten fakten-reihe">
            <div><dt>${L("Umfang", "Hours")}</dt><dd>${L("Minijob oder Teilzeit", "mini-job or part-time")}</dd></div>
            <div><dt>${L("Alter", "Age")}</dt><dd>${L("ab 18 Jahren", "18 and over")}</dd></div>
            <div><dt>Start</dt><dd>${L("nach Absprache", "by arrangement")}</dd></div>
          </dl>
          <p>${L("Interesse geweckt? Dann freuen wir uns auf deine Bewerbung mit einer kurzen Vorstellung und deinen Kontaktdaten.",
                 "Interested? Then we would be glad to hear from you – a short introduction and how to reach you is enough.")}</p>
          <p class="wege">
            <a class="knopf" href="mailto:${MAIL}?subject=${L("Bewerbung", "Application")}">${MAIL}</a>
            <a class="knopf knopf-hell" href="${TEL}">${L("Lieber anrufen", "Rather call")}: ${TEL_TEXT}</a>
          </p>
        </div>
        <div class="listen" data-einblenden>
          <h3 class="klein-titel">${L("Das bringst du mit", "What you bring")}</h3>
          <ul>
            <li>${L("Zuverlässigkeit und Verantwortungsbewusstsein", "Reliability and a sense of responsibility")}</li>
            <li>${L("Freundliches Auftreten und Teamfähigkeit", "A friendly manner and a feel for teamwork")}</li>
            <li>${L("Motivation und Freude an der Gastronomie", "Motivation and a genuine liking for hospitality")}</li>
            <li>${L("Erfahrung im Service, in der Küche oder als Barista ist ein Plus – aber kein Muss, wir zeigen dir alles", "Experience in service, in the kitchen or behind the coffee machine is a plus – but not a must, we will show you everything")}</li>
          </ul>
          <h3 class="klein-titel">${L("Deine Aufgaben", "What you would do")}</h3>
          <ul>
            <li>${L("Freundliche Betreuung und Bedienung unserer Gäste", "Looking after our guests and waiting tables")}</li>
            <li>${L("Zubereitung von Kaffee- und Getränkespezialitäten", "Making coffee and other drinks")}</li>
            <li>${L("Unterstützung im Küchenbereich", "Helping out in the kitchen")}</li>
            <li>${L("Vor- und Nachbereitung des Arbeitsbereichs", "Getting your area ready and clearing it afterwards")}</li>
            <li>${L("Einhaltung der Hygiene- und Qualitätsstandards", "Keeping to our hygiene and quality standards")}</li>
          </ul>
          <h3 class="klein-titel">${L("Wir bieten", "What we offer")}</h3>
          <ul>
            <li>${L("Faire Bezahlung", "Fair pay")}</li>
            <li>${L("Flexible Arbeitszeiten nach Absprache", "Flexible hours by arrangement")}</li>
            <li>${L("Ein angenehmes Arbeitsklima in einem motivierten Team", "A pleasant atmosphere in a motivated team")}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="abschnitt abschnitt-rose kontakt" id="kontakt" aria-labelledby="kontakt-titel">
      <div class="innen" data-einblenden>
        <h2 id="kontakt-titel">${L("Kontakt", "Contact")}</h2>
        <ul class="kontakt-liste">
          <li><span>${L("Telefon", "Phone")}</span><a href="${TEL}">${TEL_TEXT}</a></li>
          <li><span>${L("E-Mail", "Email")}</span><a href="mailto:${MAIL}">${MAIL}</a></li>
          <li><span>Instagram</span><a href="${INSTA}" rel="noopener">@b.ellers_cafe</a></li>
          <li><span>${L("Adresse", "Address")}</span><a href="${ROUTE}" rel="noopener">Stadtplatz 1, 83714 Miesbach</a></li>
        </ul>
      </div>
    </section>

  </main>
${fuss(s)}

  <nav class="leiste" aria-label="${L("Schnellzugriff", "Quick actions")}">
    <a href="${TEL}">${L("Anrufen", "Call")}</a>
    <a href="${ROUTE}" rel="noopener">Route</a>
    <a href="#karte">${L("Karte", "Menu")}</a>
  </nav>

  <dialog class="gross" id="grossansicht" aria-label="${L("Großansicht", "Large view")}">
    <div class="gross-buehne"></div>
    <p class="gross-text"><span class="gross-titel"></span> <span class="gross-zaehler"></span></p>
    <button type="button" class="gross-zu" aria-label="${kern.TEXTE[s].schliessen}">×</button>
    <button type="button" class="gross-zurueck" aria-label="${kern.TEXTE[s].zurueck}">←</button>
    <button type="button" class="gross-vor" aria-label="${kern.TEXTE[s].weiter}">→</button>
  </dialog>

  <script src="daten/daten.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
`;
}

/* ---------- Rechtsseiten ---------- */

function rechtsseite(datei, titel, inhalt) {
  return `${kopf({ sprache: "de", datei, titel: titel + " – b.ellers", noindex: false,
    beschreibung: titel + " des Cafés b.ellers, Stadtplatz 1, 83714 Miesbach." })}
<body>
${seitenkopf("de", false)}

  <main id="inhalt" class="recht">
    <div class="innen innen-schmal">
      <p><a href="index.html">← Zurück zur Startseite</a></p>
${inhalt}
    </div>
  </main>
${fuss("de")}
</body>
</html>
`;
}

const IMPRESSUM = `      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 TMG</h2>
      <p>Birgit Eller<br>b.ellers<br>Stadtplatz 1<br>83714 Miesbach</p>

      <h2>Kontakt</h2>
      <p>Telefon: <a href="${TEL}">${TEL_TEXT}</a><br>E-Mail: <a href="mailto:${MAIL}">${MAIL}</a></p>

      <h2>Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br>DE457036331</p>

      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p>Birgit Eller<br>Anschrift wie oben</p>`;

const DATENSCHUTZ = `      <h1>Datenschutzerklärung</h1>

      <h2>Verantwortliche Stelle</h2>
      <p>Birgit Eller<br>b.ellers<br>Stadtplatz 1<br>83714 Miesbach<br>E-Mail: <a href="mailto:${MAIL}">${MAIL}</a></p>

      <h2>Keine Cookies, kein Tracking</h2>
      <p>Diese Website verwendet keine Cookies und kein Analyse- oder Tracking-Tool. Es werden keine personenbezogenen Daten der Besucherinnen und Besucher gespeichert oder ausgewertet. Schriften und Bilder werden zusammen mit der Seite ausgeliefert; es werden beim Aufruf der Seite keine Inhalte von Dritten nachgeladen.</p>

      <h2>Kartenansicht (OpenStreetMap)</h2>
      <p>Im Bereich „Anfahrt“ kann eine Kartenansicht von OpenStreetMap angezeigt werden. Sie wird erst geladen, wenn Sie auf „Karte anzeigen“ klicken. Erst dann wird eine Verbindung zu Servern der OpenStreetMap Foundation aufgebaut, wodurch technische Daten wie die IP-Adresse an den Anbieter übermittelt werden können. Weitere Informationen: <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" rel="noopener">Datenschutzerklärung von OpenStreetMap</a>.</p>

      <h2>Hosting (GitHub Pages)</h2>
      <!-- ACHTUNG: Dieser Abschnitt beschreibt GitHub Pages. Zieht die Seite auf
           einen anderen Anbieter um (z. B. IONOS Webspace), muss er ersetzt werden. -->
      <p>Diese Website wird über GitHub Pages bereitgestellt, einen Dienst der GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA (ein Unternehmen der Microsoft Corporation). Beim Aufruf der Seite werden vom Server automatisch technisch notwendige Zugriffsdaten in sogenannten Server-Logdateien verarbeitet: IP-Adresse, Datum und Uhrzeit des Zugriffs, die abgerufene Datei, der verwendete Browser und das Betriebssystem. Diese Daten dienen ausschließlich dem sicheren und stabilen Betrieb der Website sowie der Abwehr von Missbrauch und werden von uns nicht mit anderen Daten zusammengeführt.</p>
      <p>Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und zuverlässigen Bereitstellung dieser Website (Art. 6 Abs. 1 lit. f DSGVO).</p>
      <p>Da GitHub seinen Sitz in den USA hat, können diese Daten in die USA übermittelt werden. GitHub ist unter dem EU-U.S. Data Privacy Framework zertifiziert; die Europäische Kommission hat für auf dieser Grundlage übermittelte Daten ein angemessenes Datenschutzniveau festgestellt. Näheres in der <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">Datenschutzerklärung von GitHub</a>.</p>

      <h2>Ihre Rechte</h2>
      <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer bei uns gespeicherten Daten sowie ein Beschwerderecht bei einer Aufsichtsbehörde. Bei Fragen wenden Sie sich bitte an die oben genannte E-Mail-Adresse.</p>`;

/* ---------- Weiterleitungen von den Adressen der alten Seite ---------- */

function weiter(ziel, s) {
  return `<!DOCTYPE html>
<html lang="${s}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>b.ellers</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${BASIS}${ziel.replace(/^index\.html/, "")}">
  <meta http-equiv="refresh" content="0; url=${ziel}">
</head>
<body>
  <p><a href="${ziel}">${s === "en" ? "This page has moved – continue here." : "Diese Seite ist umgezogen – hier geht es weiter."}</a></p>
</body>
</html>
`;
}

const FEHLERSEITE = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Seite nicht gefunden – b.ellers</title>
  <meta name="robots" content="noindex">
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fac3b7; color: #3c2a1e;
           font: 1.125rem/1.6 Georgia, serif; text-align: center; padding: 2rem; }
    h1 { font-size: 2rem; margin: 0 0 .5rem; }
    a { color: #3c2a1e; font-weight: bold; }
  </style>
</head>
<body>
  <main>
    <h1>Diese Seite gibt es nicht.</h1>
    <p>Page not found.</p>
    <p><a href="/">Zur Startseite von b.ellers</a></p>
  </main>
</body>
</html>
`;

/* ---------- schreiben ---------- */

const schreiben = (datei, text) => fs.writeFileSync(path.join(ZIEL, datei), text);

schreiben("index.html", startseite("de"));
schreiben("index-en.html", startseite("en"));
schreiben("impressum.html", rechtsseite("impressum.html", "Impressum", IMPRESSUM));
schreiben("datenschutz.html", rechtsseite("datenschutz.html", "Datenschutz", DATENSCHUTZ));
schreiben("404.html", FEHLERSEITE);

const ALT = { "speisekarte.html": ["index.html#karte", "de"], "menu-en.html": ["index-en.html#karte", "en"],
  "galerie.html": ["index.html#galerie", "de"], "gallery-en.html": ["index-en.html#galerie", "en"],
  "events.html": ["index.html#feiern", "de"], "events-en.html": ["index-en.html#feiern", "en"],
  "jobs.html": ["index.html#jobs", "de"], "jobs-en.html": ["index-en.html#jobs", "en"],
  "gutscheine.html": ["index.html#gutscheine", "de"], "vouchers-en.html": ["index-en.html#gutscheine", "en"] };
for (const [datei, [ziel, s]] of Object.entries(ALT)) schreiben(datei, weiter(ziel, s));

schreiben("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${BASIS}sitemap.xml\n`);
schreiben("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${BASIS}</loc><xhtml:link rel="alternate" hreflang="de" href="${BASIS}"/><xhtml:link rel="alternate" hreflang="en" href="${BASIS}index-en.html"/></url>
  <url><loc>${BASIS}index-en.html</loc><xhtml:link rel="alternate" hreflang="de" href="${BASIS}"/><xhtml:link rel="alternate" hreflang="en" href="${BASIS}index-en.html"/></url>
  <url><loc>${BASIS}impressum.html</loc></url>
  <url><loc>${BASIS}datenschutz.html</loc></url>
</urlset>
`);
schreiben("site.webmanifest", JSON.stringify({ name: "b.ellers – Café in Miesbach", short_name: "b.ellers", start_url: "index.html",
  display: "browser", background_color: "#fbf5f1", theme_color: "#fac3b7",
  icons: [{ src: "bilder/symbol-192.png", sizes: "192x192", type: "image/png" }, { src: "bilder/symbol-512.png", sizes: "512x512", type: "image/png" }] }, null, 1) + "\n");

console.log("Seiten geschrieben" + (VORSCHAU ? " (Vorschau: noindex)" : ""));
