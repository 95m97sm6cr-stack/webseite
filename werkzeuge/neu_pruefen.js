/* Prüft die neue Seite im Ordner neu/ im Browser.
   Braucht einen lokalen Server im Wurzelverzeichnis: python3 -m http.server 8765
   Aufruf: node werkzeuge/neu_pruefen.js */
"use strict";
const fs = require("fs"), path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT_MODUL || "/opt/node22/lib/node_modules/playwright");
const BASIS = (process.env.BASIS_ADRESSE || "http://localhost:8765") + "/neu/";
const NEU = path.join(__dirname, "..", "neu");
const BREITEN = [360, 390, 768, 1024, 1440];
const SEITEN = ["index.html", "index-en.html", "impressum.html", "datenschutz.html"];
let fehler = 0;
const melde = (t) => { fehler++; console.log("FEHLER  " + t); };

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PFAD || undefined });

  for (const seite of SEITEN) for (const breite of BREITEN) {
    const kontext = await browser.newContext({ viewport: { width: breite, height: 800 } });
    const p = await kontext.newPage(), wo = seite + " @" + breite;
    const fremd = [];
    p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") melde(wo + " Konsole: " + m.text()); });
    p.on("pageerror", (e) => melde(wo + " Skriptfehler: " + e.message));
    p.on("request", (r) => { if (!r.url().startsWith(BASIS) && !r.url().startsWith("data:")) fremd.push(r.url()); });
    p.on("response", (r) => { if (r.status() >= 400) melde(wo + " " + r.status() + " " + r.url()); });
    await p.goto(BASIS + seite, { waitUntil: "networkidle" });
    const hoehe = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < hoehe; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(30); }
    await p.waitForLoadState("networkidle");

    const b = await p.evaluate(() => {
      const r = {};
      r.breit = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      r.felder = document.querySelectorAll("form, input, textarea, select").length;
      r.ueber = [...document.querySelectorAll("body *")].filter((e) => {
        if (e.closest(".karte-nav ul, dialog, .unsichtbar, .sprung, .menue nav")) return false;
        const q = e.getBoundingClientRect();
        return q.width > 0 && (q.right > document.documentElement.clientWidth + 1 || q.left < -1);
      }).map((e) => e.tagName + "." + e.className).slice(0, 5);
      r.ohneAlt = [...document.querySelectorAll("img:not([alt])")].length;
      r.kaputt = [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc);
      r.anker = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href"))
        .filter((h) => h.length > 1 && !document.getElementById(h.slice(1)));
      r.klein = [...document.querySelectorAll("a, button, summary")].filter((e) => {
        const q = e.getBoundingClientRect();
        if (!q.width || e.closest("dialog, .sprung, p, address, .karte-hinweise, dd") && e.tagName === "A" && !e.classList.contains("knopf") && !e.classList.contains("status")) return false;
        return q.height < 40;
      }).map((e) => e.tagName + "." + e.className + ":" + e.textContent.trim().slice(0, 20));
      r.ids = [...document.querySelectorAll("[id]")].map((e) => e.id).filter((id, i, a) => a.indexOf(id) !== i);
      r.h1 = document.querySelectorAll("h1").length;
      r.speicher = localStorage.length + sessionStorage.length;
      r.cookies = document.cookie;
      return r;
    });
    if (b.breit > 0) melde(wo + " horizontales Scrollen: " + b.breit + " px");
    if (b.felder) melde(wo + " Formular oder Eingabefeld gefunden");
    if (b.ueber.length) melde(wo + " ragt über den Rand: " + b.ueber.join(", "));
    if (b.ohneAlt) melde(wo + " Bild ohne alt");
    if (b.kaputt.length) melde(wo + " Bild lädt nicht: " + b.kaputt.join(", "));
    if (b.anker.length) melde(wo + " Sprungziel fehlt: " + b.anker.join(", "));
    if (b.klein.length) melde(wo + " Tippfläche unter 40 px: " + b.klein.join(" | "));
    if (b.ids.length) melde(wo + " doppelte id: " + b.ids.join(", "));
    if (b.h1 !== 1) melde(wo + " Anzahl h1: " + b.h1);
    if (b.speicher || b.cookies) melde(wo + " speichert etwas auf dem Gerät");
    if (fremd.length) melde(wo + " fremde Server: " + [...new Set(fremd)].join(", "));

    if (breite === 390) {     // Verweise auf Dateien müssen existieren
      const ziele = await p.evaluate(() => [...document.querySelectorAll("a[href], link[href], script[src], img[src], source[srcset]")]
        .flatMap((e) => (e.getAttribute("srcset") || e.getAttribute("href") || e.getAttribute("src")).split(",").map((s) => s.trim().split(" ")[0])));
      for (const z of new Set(ziele)) {
        if (/^(https?:|mailto:|tel:|#)/.test(z)) continue;
        if (!fs.existsSync(path.join(NEU, z.split("#")[0]))) melde(wo + " Datei fehlt: " + z);
        if (z !== z.toLowerCase() || /[äöüß ]/.test(z)) melde(wo + " Dateiname nicht klein/ohne Umlaute: " + z);
        if (z.startsWith("/")) melde(wo + " absoluter Pfad: " + z);
      }
    }
    await kontext.close();
  }

  /* Bedienung */
  for (const [seite, breite] of [["index.html", 390], ["index-en.html", 390], ["index.html", 1440]]) {
    const kontext = await browser.newContext({ viewport: { width: breite, height: 800 } });
    const p = await kontext.newPage(), wo = seite + " @" + breite;
    await p.goto(BASIS + seite, { waitUntil: "networkidle" });
    const tel = await p.$$eval('a[href^="tel:"]', (a) => a.map((x) => x.getAttribute("href")));
    if (!tel.length || tel.some((t) => t !== "tel:+4980259924355")) melde(wo + " Telefon-Link falsch");
    const insta = await p.$$eval('a[href*="instagram"]', (a) => a.map((x) => x.getAttribute("href")));
    if (!insta.length || insta.some((t) => t !== "https://www.instagram.com/b.ellers_cafe/")) melde(wo + " Instagram-Link falsch");
    if (!(await p.textContent("[data-status]")).trim()) melde(wo + " Geöffnet-Anzeige leer");
    if (await p.$$eval("#zeiten-koerper tr", (t) => t.length) < 3) melde(wo + " Öffnungszeiten fehlen");
    if (await p.$$eval(".gericht", (t) => t.length) < 40) melde(wo + " Speisekarte unvollständig");

    if (breite < 900) {
      await p.click("#menue summary");
      if (!(await p.isVisible("#menue nav a"))) melde(wo + " Menü öffnet nicht");
      await p.click('#menue nav a[href="#galerie"]');
      await p.waitForTimeout(2500);
      if (await p.isVisible("#menue nav a")) melde(wo + " Menü schließt nicht nach Wahl");
      const y = await p.evaluate(() => document.getElementById("galerie").getBoundingClientRect().top);
      if (y < 0 || y > 300) melde(wo + " Sprung zur Galerie landet falsch: " + y);
      if (!(await p.isVisible(".leiste"))) melde(wo + " untere Leiste fehlt");
    } else {
      if (!(await p.isVisible(".hauptnav a"))) melde(wo + " Navigation fehlt");
      if (await p.isVisible(".leiste")) melde(wo + " untere Leiste auf großem Bildschirm sichtbar");
    }

    await p.click(".galerie a:nth-child(2)");
    await p.waitForSelector("#grossansicht img", { state: "visible", timeout: 5000 }).catch(() => melde(wo + " Großansicht öffnet nicht"));
    const eins = await p.textContent(".gross-zaehler");
    await p.keyboard.press("ArrowRight");
    if (eins === await p.textContent(".gross-zaehler")) melde(wo + " Großansicht blättert nicht");
    await p.keyboard.press("Escape");
    if (await p.isVisible("#grossansicht")) melde(wo + " Großansicht schließt nicht");

    await p.route("**openstreetmap**", (r) => r.fulfill({ body: "<p>Karte</p>", contentType: "text/html" }));
    if (await p.$("#landkarte iframe")) melde(wo + " Karte lädt ohne Klick");
    await p.click("#karte-laden");
    if (!(await p.$('#landkarte iframe[src*="openstreetmap.org"]'))) melde(wo + " Karte erscheint nicht nach Klick");

    const ziel = seite === "index.html" ? "index-en.html" : "index.html";
    await p.click("a.sprache");
    await p.waitForLoadState();
    if (!p.url().endsWith(ziel)) melde(wo + " Sprachumschalter führt nach " + p.url());
    await kontext.close();
  }

  /* Ohne JavaScript müssen Karte, Zeiten und Kontakt trotzdem da sein */
  const ohne = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });
  const q = await ohne.newPage();
  await q.goto(BASIS + "index.html");
  if (await q.$$eval(".gericht", (t) => t.length) < 40) melde("ohne JavaScript: Speisekarte fehlt");
  if (await q.$$eval("#zeiten-koerper tr", (t) => t.length) < 3) melde("ohne JavaScript: Öffnungszeiten fehlen");
  if (!(await q.isVisible('a[href^="tel:"]'))) melde("ohne JavaScript: Telefon fehlt");
  await q.click("#menue summary");
  if (!(await q.isVisible("#menue nav a"))) melde("ohne JavaScript: Menü öffnet nicht");
  await ohne.close();

  /* Weiterleitungen der alten Adressen */
  const w = await (await browser.newContext()).newPage();
  for (const [alt, neu] of [["speisekarte.html", "index.html#karte"], ["menu-en.html", "index-en.html#karte"], ["jobs.html", "index.html#jobs"], ["vouchers-en.html", "index-en.html#gutscheine"]]) {
    await w.goto(BASIS + alt); await w.waitForURL("**/" + neu, { timeout: 5000 }).catch(() => melde("Weiterleitung " + alt + " -> " + w.url()));
  }

  await browser.close();
  console.log(fehler ? fehler + " Fehler" : "Alles in Ordnung.");
  process.exit(fehler ? 1 : 0);
})();
