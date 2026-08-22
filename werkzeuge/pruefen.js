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

const SEITEN = ['index.html', 'index-en.html', 'speisekarte.html', 'menu-en.html',
                'galerie.html', 'gallery-en.html', 'events.html', 'events-en.html',
                'jobs.html', 'jobs-en.html', 'impressum.html', 'datenschutz.html',
                '404.html'];
const BREITEN = [390, 768, 1280];
const BASIS = process.env.BASIS_ADRESSE || 'http://localhost:8765/';

let fehler = 0;
function meldung(text) { console.log('  FEHLER: ' + text); fehler++; }

(async () => {
  const browser = await chromium.launch({ executablePath: CHROMIUM });

  for (const seite of SEITEN) {
    for (const breite of BREITEN) {
      const ctx = await browser.newContext({ viewport: { width: breite, height: 900 } });
      const page = await ctx.newPage();
      const jsFehler = [];
      page.on('pageerror', e => jsFehler.push(String(e)));
      // 404.html verwendet absichtlich absolute Pfade ab "/". Seit dem Umzug
      // auf bellers-cafe.de liegt die Seite an der Wurzel, deshalb greifen die
      // Pfade auch lokal und die Fehlerseite wird ganz normal mitgeprüft.
      page.on('response', r => {
        if (r.status() >= 400) meldung(`${seite} @${breite}: ${r.status()} für ${r.url()}`);
      });

      await page.goto(BASIS + seite, { waitUntil: 'networkidle' });
      // Schriftgröße "sehr groß" erzwingen – der härteste Fall für Überlauf
      await page.evaluate(() => document.documentElement.setAttribute('data-schrift', 'sehr-gross'));
      // alle Lazy-Bilder laden
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1400);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);

      if (jsFehler.length) meldung(`${seite} @${breite}: JS – ${jsFehler.join(' | ')}`);

      const ergebnis = await page.evaluate(() => {
        // Das Bild in der Großansicht hat erst dann eine Quelle, wenn man ein
        // Foto anklickt – es gehört hier nicht geprüft.
        const bilder = [...document.images].filter(img => img.getAttribute('src')).map(img => ({
          src: img.currentSrc || img.src,
          geladen: img.naturalWidth > 0,
          alt: img.alt,
          hatAltAttribut: img.hasAttribute('alt'),
          natuerlich: img.naturalWidth / img.naturalHeight,
          // offsetWidth/-Height, nicht getBoundingClientRect: die Deko im Hero
          // dreht sich, und das Rechteck drumherum hätte ein anderes Verhältnis
          // als das Bild selbst – ein Fehlalarm.
          gezeigt: img.offsetWidth / img.offsetHeight,
          sichtbar: img.offsetWidth > 0
        }));
        // Nach dem Scrollen muss jeder einblendende Abschnitt sichtbar sein –
        // sonst bliebe Inhalt dauerhaft unsichtbar.
        const versteckt = [...document.querySelectorAll('.einblenden')]
          .filter(e => Number(getComputedStyle(e).opacity) < 0.9).length;
        return {
          bilder,
          versteckt,
          abschnitte: document.querySelectorAll('.einblenden').length,
          ueberlauf: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });

      if (ergebnis.versteckt)
        meldung(`${seite} @${breite}: ${ergebnis.versteckt} von ${ergebnis.abschnitte} Abschnitten bleiben unsichtbar`);

      if (ergebnis.ueberlauf > 1)
        meldung(`${seite} @${breite}: horizontaler Überlauf ${ergebnis.ueberlauf} px`);

      for (const b of ergebnis.bilder) {
        const name = b.src.split('/').pop();
        if (!b.geladen) meldung(`${seite} @${breite}: Bild lädt nicht – ${name}`);
        if (!b.hatAltAttribut) meldung(`${seite} @${breite}: alt-Attribut fehlt – ${name}`);
        if (b.sichtbar && b.geladen) {
          const abweichung = Math.abs(b.gezeigt - b.natuerlich) / b.natuerlich;
          if (abweichung > 0.01)
            meldung(`${seite} @${breite}: verzerrt ${name} – Abweichung ${(abweichung * 100).toFixed(1)} %`);
        }
      }
      await ctx.close();
    }
    console.log(`${seite}: geprüft`);
  }

  // Fotos: alt darf nicht leer sein
  for (const seite of ['index.html', 'index-en.html', 'galerie.html', 'gallery-en.html']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASIS + seite, { waitUntil: 'networkidle' });
    const fotos = await page.$$eval('.galerie-bild img',
      els => els.map(e => ({ src: e.getAttribute('src'), alt: e.getAttribute('alt') })));
    console.log(`${seite}: ${fotos.length} Fotos in der Galerie`);
    for (const f of fotos)
      if (!f.alt || !f.alt.trim()) meldung(`${seite}: leeres alt bei ${f.src}`);
    await ctx.close();
  }

  // Navigation: Startseite -> Galerie -> zurück, und DE/EN auf der Galerieseite
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASIS + 'index.html', { waitUntil: 'networkidle' });
  await page.click('.galerie-aktion a');
  await page.waitForLoadState('networkidle');
  if (!page.url().endsWith('galerie.html')) meldung('Knopf "Alle Bilder ansehen" führt nicht zur Galerie: ' + page.url());
  await page.click('.galerie-aktion a');
  await page.waitForLoadState('networkidle');
  if (!page.url().endsWith('index.html')) meldung('Zurück-Knopf führt nicht zur Startseite: ' + page.url());

  await page.goto(BASIS + 'galerie.html', { waitUntil: 'networkidle' });
  await page.click('a[hreflang="en"]');
  await page.waitForLoadState('networkidle');
  if (!page.url().endsWith('gallery-en.html')) meldung('EN-Umschalter auf der Galerie führt nach: ' + page.url());
  await page.click('a[hreflang="de"]');
  await page.waitForLoadState('networkidle');
  if (!page.url().endsWith('galerie.html')) meldung('DE-Umschalter auf der Galerie führt nach: ' + page.url());
  await ctx.close();

  await browser.close();
  console.log(fehler === 0 ? '\nAlles in Ordnung.' : `\n${fehler} Fehler.`);
  process.exit(fehler === 0 ? 0 : 1);
})();
