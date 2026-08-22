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
let fehler = 0;
function meldung(t) { console.log('  FEHLER: ' + t); fehler++; }

(async () => {
  const browser = await chromium.launch({ executablePath: CHROMIUM });

  // Seite, Anzahl Fotos, sichtbare Beschriftungen unter dem Foto – überall
  // keine, der Text gehört ausschließlich in die Großansicht
  for (const [seite, fotos, anzahl] of [['galerie.html', 10, 0], ['index.html', 6, 0],
                                        ['gallery-en.html', 10, 0], ['index-en.html', 6, 0]]) {
    for (const breite of [390, 1280]) {
      const ctx = await browser.newContext({ viewport: { width: breite, height: 800 } });
      const page = await ctx.newPage();
      const js = [];
      page.on('pageerror', e => js.push(String(e)));
      page.on('response', r => { if (r.status() >= 400) meldung(`${seite}: ${r.status()} ${r.url()}`); });
      await page.goto(BASIS + seite, { waitUntil: 'networkidle' });

      const bilder = await page.$$eval('.galerie-bild', e => e.length);
      if (bilder !== fotos)
        meldung(`${seite} @${breite}: ${bilder} Fotos statt ${fotos}`);

      const beschriftungen = await page.$$eval('.galerie-bild figcaption',
        e => e.map(x => x.textContent.trim()));
      if (beschriftungen.length !== anzahl)
        meldung(`${seite} @${breite}: ${beschriftungen.length} Beschriftungen statt ${anzahl}`);
      if (beschriftungen.some(t => !t))
        meldung(`${seite} @${breite}: leere Beschriftung`);
      const sichtbar = await page.$$eval('.galerie-bild figcaption',
        e => e.filter(x => x.getBoundingClientRect().height > 0).length);
      if (sichtbar !== anzahl)
        meldung(`${seite} @${breite}: nur ${sichtbar} von ${anzahl} Beschriftungen sichtbar`);

      // Der Text muss auch dort vorhanden sein, wo er nicht sichtbar steht –
      // die Großansicht holt ihn aus data-bu.
      const ohneText = await page.$$eval('.galerie-lupe',
        e => e.filter(x => !(x.getAttribute('data-bu') || '').trim()).length);
      if (ohneText) meldung(`${seite} @${breite}: ${ohneText} Fotos ohne data-bu`);

      // Öffnen
      await page.click('.galerie-bild:nth-of-type(2) .galerie-lupe');
      await page.waitForTimeout(500);
      let z = await page.evaluate(() => {
        const h = document.querySelector('.bild-hintergrund');
        const b = document.querySelector('.bild-buehne img');
        return {
          offen: !h.hidden,
          quelle: b.getAttribute('src'),
          geladen: b.naturalWidth > 0,
          verzerrt: Math.abs(b.offsetWidth / b.offsetHeight - b.naturalWidth / b.naturalHeight) > 0.01,
          imBild: b.getBoundingClientRect().bottom <= window.innerHeight + 1 &&
                  b.getBoundingClientRect().top >= -1,
          text: document.querySelector('.bild-buehne figcaption').textContent.trim(),
          fokusImDialog: document.querySelector('.bild-dialog').contains(document.activeElement),
          hintergrundStumm: document.querySelector('main').getAttribute('aria-hidden') === 'true',
          ueberlauf: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      if (!z.offen) meldung(`${seite} @${breite}: Großansicht öffnet nicht`);
      if (!z.geladen) meldung(`${seite} @${breite}: großes Bild lädt nicht (${z.quelle})`);
      if (!/\/gross\//.test(z.quelle)) meldung(`${seite} @${breite}: zeigt nicht die große Datei (${z.quelle})`);
      if (z.verzerrt) meldung(`${seite} @${breite}: großes Bild verzerrt`);
      if (!z.imBild) meldung(`${seite} @${breite}: großes Bild ragt aus dem Fenster`);
      if (!z.text) meldung(`${seite} @${breite}: keine Beschriftung in der Großansicht`);
      if (!z.fokusImDialog) meldung(`${seite} @${breite}: Fokus nicht im Dialog`);
      if (!z.hintergrundStumm) meldung(`${seite} @${breite}: Hintergrund nicht ausgeblendet`);
      if (z.ueberlauf > 1) meldung(`${seite} @${breite}: Überlauf ${z.ueberlauf} px bei offener Großansicht`);

      // Blättern mit der Tastatur
      const vorher = z.quelle;
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(300);
      const nachher = await page.$eval('.bild-buehne img', b => b.getAttribute('src'));
      if (nachher === vorher) meldung(`${seite} @${breite}: Pfeiltaste blättert nicht`);

      // Schließen mit Escape, Fokus zurück
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const zu = await page.evaluate(() => ({
        zu: document.querySelector('.bild-hintergrund').hidden,
        fokusAufFoto: document.activeElement.classList.contains('galerie-lupe'),
        ariaWeg: !document.querySelector('main').hasAttribute('aria-hidden'),
        scrollFrei: document.body.style.overflow === ''
      }));
      if (!zu.zu) meldung(`${seite} @${breite}: Escape schließt nicht`);
      if (!zu.fokusAufFoto) meldung(`${seite} @${breite}: Fokus kehrt nicht zum Foto zurück`);
      if (!zu.ariaWeg) meldung(`${seite} @${breite}: aria-hidden bleibt hängen`);
      if (!zu.scrollFrei) meldung(`${seite} @${breite}: Seite bleibt gesperrt`);

      if (js.length) meldung(`${seite} @${breite}: JS – ${js.join(' | ')}`);
      await ctx.close();
    }
    console.log(`${seite}: geprüft`);
  }

  // Ohne JavaScript: der Klick führt auf die große Bilddatei
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASIS + 'galerie.html', { waitUntil: 'load' });
  const zahl = await page.$$eval('.galerie-bild', e => e.length);
  console.log('ohne JS: ' + zahl + ' Fotos anklickbar');
  await page.click('.galerie-bild:nth-of-type(1) .galerie-lupe');
  await page.waitForLoadState('load');
  if (!/gross\/foto-01\.jpg$/.test(page.url()))
    meldung('ohne JS: Klick führt nach ' + page.url());
  await ctx.close();

  await browser.close();
  console.log(fehler === 0 ? '\nAlles in Ordnung.' : `\n${fehler} Fehler.`);
  process.exit(fehler === 0 ? 0 : 1);
})();
