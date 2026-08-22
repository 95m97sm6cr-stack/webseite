/* Umgebungsabhängige Pfade an einer Stelle.
   In dieser Umgebung liegen Playwright und Chromium unter /opt. Woanders
   setzt man vor dem Aufruf:
     export PLAYWRIGHT_MODUL=/pfad/zu/node_modules/playwright
     export CHROMIUM_PFAD=/pfad/zu/chrome        (leer lassen = Playwrights eigenes)
     export BASIS_ADRESSE=http://localhost:8765/
   Siehe werkzeuge/README.md. */
const { chromium } = require(process.env.PLAYWRIGHT_MODUL || '/opt/node22/lib/node_modules/playwright');
const CHROMIUM = process.env.CHROMIUM_PFAD === undefined
  ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  : (process.env.CHROMIUM_PFAD || undefined);
const BASIS = process.env.BASIS_ADRESSE || 'http://localhost:8765/';
const SEITEN = ['index.html', 'index-en.html', 'speisekarte.html', 'menu-en.html',
                'galerie.html', 'gallery-en.html', 'events.html', 'events-en.html',
                'jobs.html', 'jobs-en.html', 'impressum.html', 'datenschutz.html',
                '404.html'];
let fehler = 0;
function meldung(t) { console.log('  FEHLER: ' + t); fehler++; }

(async () => {
  const browser = await chromium.launch({ executablePath: CHROMIUM });

  // 404.html lädt CSS/JS absichtlich von "/webseite/…" (GitHub-Pages-
  // Unterordner) – auf dem lokalen Testserver ohne diesen Unterordner bleibt
  // die Seite deshalb unstyled und ohne Skript. Menü-Layout und Skript-
  // Verhalten werden für diese eine Seite separat simuliert (weiter unten),
  // hier daher ausgenommen.
  const MENUE_SEITEN = SEITEN.filter(s => s !== '404.html');

  // 1. Auf dem Handy steht oben nur Logo und Menüknopf – eine Zeile.
  for (const seite of MENUE_SEITEN) {
    for (const schrift of ['normal', 'sehr-gross']) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await page.goto(BASIS + seite, { waitUntil: 'networkidle' });
      await page.evaluate(s => document.documentElement.setAttribute('data-schrift', s), schrift);
      await page.waitForTimeout(300);

      const zu = await page.evaluate(() => {
        const sichtbar = el => el && el.getBoundingClientRect().height > 0;
        const k = document.querySelector('.kopfbereich');
        return {
          hoehe: Math.round(k.getBoundingClientRect().height),
          klappOffen: sichtbar(document.querySelector('.nav-klapp')),
          knopf: sichtbar(document.querySelector('.nav-toggle')),
          knopfGross: (() => { const b = document.querySelector('.nav-toggle');
            const r = b.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; })(),
          erweitert: document.querySelector('.nav-toggle').getAttribute('aria-expanded')
        };
      });
      if (zu.klappOffen) meldung(`${seite} @${schrift}: Menü ist zu Beginn offen`);
      if (!zu.knopf) meldung(`${seite} @${schrift}: kein Menüknopf sichtbar`);
      if (zu.knopfGross[0] < 44 || zu.knopfGross[1] < 44)
        meldung(`${seite} @${schrift}: Menüknopf nur ${zu.knopfGross.join('x')} px`);
      if (zu.erweitert !== 'false') meldung(`${seite} @${schrift}: aria-expanded ist ${zu.erweitert}`);
      // Eine Zeile: Logo (48 px) plus Innenabstand. Bei sehr großer Schrift
      // darf es etwas mehr sein, aber keine zweite Zeile.
      const grenze = schrift === 'normal' ? 80 : 100;
      if (zu.hoehe > grenze)
        meldung(`${seite} @${schrift}: Kopfbereich ${zu.hoehe} px hoch – vermutlich zweizeilig`);

      // Aufklappen
      await page.click('.nav-toggle');
      await page.waitForTimeout(350);
      const auf = await page.evaluate(() => {
        const k = document.querySelector('.nav-klapp');
        return {
          offen: k.getBoundingClientRect().height > 0,
          erweitert: document.querySelector('.nav-toggle').getAttribute('aria-expanded'),
          sprache: !!document.querySelector('.nav-klapp .sprache'),
          ansicht: !!document.querySelector('.nav-klapp .ansicht'),
          ueberlauf: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      if (!auf.offen) meldung(`${seite} @${schrift}: Menü klappt nicht auf`);
      if (auf.erweitert !== 'true') meldung(`${seite} @${schrift}: aria-expanded bleibt ${auf.erweitert}`);
      if (!auf.ansicht) meldung(`${seite} @${schrift}: "Ansicht" steckt nicht im Menü`);
      if (auf.ueberlauf > 1) meldung(`${seite} @${schrift}: Überlauf ${auf.ueberlauf} px bei offenem Menü`);

      // Ansicht-Feld im offenen Menü
      const knopf = await page.$('.nav-klapp .ansicht-knopf');
      if (knopf) {
        await knopf.click();
        await page.waitForTimeout(300);
        const panel = await page.evaluate(() => {
          const p = document.querySelector('.ansicht-panel');
          const r = p.getBoundingClientRect();
          return { sichtbar: r.height > 0, rechts: Math.round(r.right),
                   links: Math.round(r.left), breite: window.innerWidth };
        });
        if (!panel.sichtbar) meldung(`${seite} @${schrift}: Ansicht-Feld öffnet nicht`);
        if (panel.rechts > panel.breite + 1 || panel.links < -1)
          meldung(`${seite} @${schrift}: Ansicht-Feld ragt heraus (${panel.links}…${panel.rechts} von ${panel.breite})`);

        // Mit offenem Ansicht-Feld ist das Menü höher als der Bildschirm. Es
        // muss dann IN SICH scrollen: Der Kopfbereich klebt oben fest, die
        // Seite dahinter darf sich dabei nicht bewegen, und beide Enden des
        // Menüs müssen erreichbar sein. (Eine falsche justify-content-Angabe
        // hatte den oberen Teil einmal unerreichbar über den Rand geschoben.)
        await page.evaluate(() => { document.querySelector('.nav-klapp').scrollTop = 0; });
        await page.waitForTimeout(200);
        const obenErreichbar = await page.evaluate(() => {
          const l = document.querySelector('.nav-links a');
          if (!l) return true;                       // Rechtsseiten haben keine Linkliste
          const r = l.getBoundingClientRect();
          return r.top >= -1 && r.bottom <= window.innerHeight + 1;
        });
        if (!obenErreichbar)
          meldung(`${seite} @${schrift}: oberer Teil des Menüs nicht erreichbar`);

        await page.evaluate(() => { const k = document.querySelector('.nav-klapp'); k.scrollTop = k.scrollHeight; });
        await page.waitForTimeout(200);
        const unten = await page.evaluate(() => {
          const z = document.querySelector('.zuruecksetzen').getBoundingClientRect();
          return { sichtbar: z.top >= -1 && z.bottom <= window.innerHeight + 1,
                   seiteVerschoben: Math.round(window.scrollY) };
        });
        if (!unten.sichtbar)
          meldung(`${seite} @${schrift}: letzter Knopf im Ansicht-Feld nicht erreichbar`);
        if (unten.seiteVerschoben !== 0)
          meldung(`${seite} @${schrift}: Scrollen im Menü verschiebt die Seite dahinter (${unten.seiteVerschoben} px)`);

        await page.keyboard.press('Escape');
      }
      await ctx.close();
    }
    console.log(`${seite}: Menü geprüft`);
  }

  // 2. Am Rechner ist die Leiste offen und ohne Menüknopf.
  for (const seite of MENUE_SEITEN) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASIS + seite, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => ({
      knopf: document.querySelector('.nav-toggle').getBoundingClientRect().height > 0,
      klapp: document.querySelector('.nav-klapp').getBoundingClientRect().height > 0,
      zeilen: Math.round(document.querySelector('.kopfbereich').getBoundingClientRect().height)
    }));
    if (r.knopf) meldung(`${seite} @1280: Menüknopf am Rechner sichtbar`);
    if (!r.klapp) meldung(`${seite} @1280: Leiste ist eingeklappt`);
    if (r.zeilen > 90) meldung(`${seite} @1280: Kopfbereich ${r.zeilen} px – zweizeilig`);
    await ctx.close();
  }
  console.log('Rechner-Ansicht geprüft');

  // 3. Jedes Ziel in der Navigation muss existieren – Datei und Anker.
  for (const seite of SEITEN) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASIS + seite, { waitUntil: 'networkidle' });
    const ziele = await page.$$eval('.nav-links a, .nav-logo, .sprache a',
      els => els.map(e => e.getAttribute('href')));
    for (const ziel of ziele) {
      const [datei, anker] = ziel.split('#');
      if (datei) {
        // 404.html verwendet absichtlich "/webseite/…" (Projekt-Unterordner
        // bei GitHub Pages) – lokal ohne diesen Unterordner muss das Präfix
        // beim Prüfen abgeschnitten werden, sonst 404 aus falschem Grund.
        let pfad = datei.startsWith('/') ? datei.slice(1) : datei;
        if (seite === '404.html' && pfad.startsWith('webseite/')) pfad = pfad.slice('webseite/'.length);
        const adresse = BASIS + pfad;
        const antwort = await page.request.get(adresse);
        if (!antwort.ok()) { meldung(`${seite}: Ziel ${ziel} → ${antwort.status()}`); continue; }
        if (anker) {
          const html = await antwort.text();
          if (!html.includes(`id="${anker}"`))
            meldung(`${seite}: Anker #${anker} gibt es in ${datei} nicht`);
        }
      } else if (anker) {
        const da = await page.evaluate(a => !!document.getElementById(a), anker);
        if (!da) meldung(`${seite}: Anker #${anker} gibt es auf dieser Seite nicht`);
      }
    }
    await ctx.close();
  }
  console.log('Alle Navigationsziele geprüft');

  // 4. Jobs-Seite: Inhalt und Sprachumschalter
  for (const [seite, ziel] of [['jobs.html', 'jobs-en.html'], ['jobs-en.html', 'jobs.html']]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASIS + seite, { waitUntil: 'networkidle' });
    const j = await page.evaluate(() => ({
      punkte: document.querySelectorAll('.job-liste li').length,
      kaesten: document.querySelectorAll('.info-box').length,
      mail: (document.querySelector('.bewerbung a[href^="mailto:"]') || {}).textContent,
      telefon: !!document.querySelector('.bewerbung a[href^="tel:"]'),
      h1: document.querySelector('h1').textContent.trim()
    }));
    if (j.punkte !== 12) meldung(`${seite}: ${j.punkte} Listenpunkte statt 12`);
    if (j.kaesten !== 4) meldung(`${seite}: ${j.kaesten} Infokästen statt 4`);
    if (!/info@bellers-cafe\.de/.test(j.mail || '')) meldung(`${seite}: Bewerbungsadresse fehlt`);
    if (!j.telefon) meldung(`${seite}: Telefonnummer fehlt`);
    console.log(`${seite}: „${j.h1}", ${j.punkte} Punkte, ${j.kaesten} Kästen`);
    const andere = seite === 'jobs.html' ? 'en' : 'de';
    await page.click(`.sprache a[hreflang="${andere}"]`);
    await page.waitForLoadState('networkidle');
    if (!page.url().endsWith(ziel)) meldung(`${seite}: Sprachumschalter führt nach ${page.url()}`);
    await ctx.close();
  }

  // 5. Events-Seite und der Terminhinweis auf der Startseite
  for (const [start, events] of [['index.html', 'events.html'],
                                 ['index-en.html', 'events-en.html']]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASIS + start, { waitUntil: 'networkidle' });
    const banner = await page.evaluate(() => {
      const a = document.querySelector('.aktion-banner');
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return { ziel: a.getAttribute('href'), sichtbar: r.height > 0,
               obenAufDerSeite: r.top < 200, text: a.innerText.replace(/\s+/g, ' ').trim() };
    });
    if (!banner) { meldung(`${start}: kein Terminhinweis`); await ctx.close(); continue; }
    if (!banner.sichtbar) meldung(`${start}: Terminhinweis unsichtbar`);
    if (!banner.obenAufDerSeite) meldung(`${start}: Terminhinweis steht nicht oben`);
    if (!/Speed/i.test(banner.text)) meldung(`${start}: Terminhinweis ohne Anlass`);
    // Anklicken muss auf der Events-Seite beim Termin landen
    await page.click('.aktion-banner');
    await page.waitForLoadState('networkidle');
    if (!page.url().includes(events + '#speed-dating'))
      meldung(`${start}: Terminhinweis führt nach ${page.url()}`);
    const termin = await page.evaluate(() => {
      const s = document.querySelector('#speed-dating');
      return s ? { da: true, anlaesse: document.querySelectorAll('.anlass').length,
                   schritte: document.querySelectorAll('.ablauf li').length } : { da: false };
    });
    if (!termin.da) meldung(`${events}: Abschnitt #speed-dating fehlt`);
    if (termin.anlaesse !== 5) meldung(`${events}: ${termin.anlaesse} Anlässe statt 5`);
    if (termin.schritte !== 3) meldung(`${events}: ${termin.schritte} Schritte statt 3`);
    console.log(`${events}: Termin und ${termin.anlaesse} Anlässe geprüft`);
    await ctx.close();
  }

  await browser.close();
  console.log(fehler === 0 ? '\nAlles in Ordnung.' : `\n${fehler} Fehler.`);
  process.exit(fehler === 0 ? 0 : 1);
})();
