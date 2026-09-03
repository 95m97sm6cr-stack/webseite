/* Prüft, dass Elemente mit data-gilt-bis am richtigen Tag verschwinden.

   Warum das eine eigene Prüfung verdient: Der Fehler zeigt sich erst Wochen
   später und niemand merkt ihn – auf der Startseite stünde dann eine
   Einladung zu einem Termin, der längst vorbei ist. Deshalb wird hier die
   Uhr des Browsers gefälscht, statt zu warten.

   Geprüft wird die **Mechanik**, nicht ein bestimmter Inhalt: Das Skript
   hängt sich selbst ein Testelement in die Seite. Dadurch bleibt die Funktion
   abgesichert, auch wenn gerade – wie derzeit – kein Termin läuft. Echte
   Elemente mit data-gilt-bis werden zusätzlich geprüft, sobald es wieder
   welche gibt; dafür ist nichts anzupassen.

   Umgebungsabhängige Pfade siehe werkzeuge/README.md. */
const { chromium } = require(process.env.PLAYWRIGHT_MODUL || '/opt/node22/lib/node_modules/playwright');
const CHROMIUM = process.env.CHROMIUM_PFAD === undefined
  ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  : (process.env.CHROMIUM_PFAD || undefined);
const BASIS = process.env.BASIS_ADRESSE || 'http://localhost:8765/';

const SEITEN = ['index.html', 'index-en.html', 'events.html', 'events-en.html'];
const TESTDATUM = '2026-10-02';

let fehler = 0;
function meldung(text) { console.log('  FEHLER: ' + text); fehler++; }

function tagVersetzt(datum, tage) {
  const d = new Date(datum + 'T12:00:00');
  d.setDate(d.getDate() + tage);
  return d.toISOString().slice(0, 10);
}

/* Öffnet eine Seite mit gefälschter Uhr. Das Testelement wird über
   addInitScript eingehängt, also bevor main.js läuft – genau so, als stünde
   es im HTML. */
async function seiteMitUhr(browser, seite, heute, testelement) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(`{
    const fest = new Date('${heute}T12:00:00').getTime();
    const Echt = Date;
    Date = class extends Echt {
      constructor(...a) { return a.length ? new Echt(...a) : new Echt(fest); }
      static now() { return fest; }
    };
  }`);
  if (testelement) {
    await ctx.addInitScript(`{
      document.addEventListener('DOMContentLoaded', function () {
        const p = document.createElement('p');
        p.id = 'ablauf-testelement';
        p.setAttribute('data-gilt-bis', '${TESTDATUM}');
        p.textContent = 'Testelement';
        document.body.insertBefore(p, document.body.firstChild);
      }, { capture: true });
    }`);
  }
  const page = await ctx.newPage();
  await page.goto(BASIS + seite, { waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  return { ctx, page };
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROMIUM });

  /* ---- 1. Die Mechanik, mit selbst eingehängtem Element ---- */
  const faelle = [
    [tagVersetzt(TESTDATUM, -30), true,  'einen Monat vorher'],
    [TESTDATUM,                   true,  'am Stichtag selbst'],
    [tagVersetzt(TESTDATUM, 1),   false, 'einen Tag danach'],
    [tagVersetzt(TESTDATUM, 45),  false, 'sechs Wochen danach'],
  ];

  for (const [heute, erwartet, wann] of faelle) {
    const { ctx, page } = await seiteMitUhr(browser, 'index.html', heute, true);
    const da = (await page.$('#ablauf-testelement')) !== null;
    if (da !== erwartet) {
      meldung(`Testelement: ${wann} – ${da ? 'noch da' : 'schon weg'}, `
              + `erwartet war ${erwartet ? 'sichtbar' : 'verschwunden'}`);
    }
    await ctx.close();
  }
  console.log(`Mechanik geprüft: Stichtag ${TESTDATUM}, vier Zeitpunkte`);

  /* ---- 2. Gegenprobe: ohne Ablaufdatum wird nichts entfernt ----
     Sonst würde ein Tippfehler im Attributnamen unbemerkt die halbe Seite
     wegräumen, und die Prüfung oben bliebe trotzdem grün. */
  {
    const { ctx, page } = await seiteMitUhr(browser, 'index.html',
                                            tagVersetzt(TESTDATUM, 45), false);
    const abschnitte = await page.evaluate(() => document.querySelectorAll('section').length);
    if (abschnitte < 5) meldung(`Startseite behält nur ${abschnitte} Abschnitte – zu wenig`);
    else console.log(`Gegenprobe: ${abschnitte} Abschnitte ohne Ablaufdatum bleiben stehen`);
    await ctx.close();
  }

  /* ---- 3. Echte Terminhinweise, falls vorhanden ----
     Derzeit gibt es keine. Sobald wieder einer eingebaut wird, prüft dieser
     Abschnitt ihn von selbst mit – ohne Anpassung am Skript. */
  let echte = 0;
  for (const seite of SEITEN) {
    const ctx0 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p0 = await ctx0.newPage();
    // Ohne gefälschte Uhr laden würde main.js abgelaufene Elemente sofort
    // entfernen. Deshalb das Datum direkt aus dem Quelltext lesen.
    const quelle = await (await p0.goto(BASIS + seite)).text();
    await ctx0.close();

    const treffer = [...quelle.matchAll(/data-gilt-bis="(\d{4}-\d{2}-\d{2})"/g)];
    for (const [, datum] of treffer) {
      echte++;
      for (const [heute, erwartet, wann] of [
        [tagVersetzt(datum, -1), true,  'am Tag davor'],
        [datum,                  true,  'am Stichtag'],
        [tagVersetzt(datum, 1),  false, 'am Tag danach'],
      ]) {
        const { ctx, page } = await seiteMitUhr(browser, seite, heute, false);
        const da = await page.evaluate(() => !!document.querySelector('[data-gilt-bis]'));
        if (da !== erwartet) meldung(`${seite} (${datum}): ${wann} – ${da ? 'noch da' : 'schon weg'}`);
        await ctx.close();
      }
      console.log(`${seite}: echter Terminhinweis zum ${datum} läuft korrekt ab`);
    }
  }
  if (echte === 0) console.log('Kein laufender Terminhinweis – nur die Mechanik geprüft');

  await browser.close();
  console.log(fehler === 0 ? '\nAlles in Ordnung.' : `\n${fehler} Fehler.`);
  process.exit(fehler === 0 ? 0 : 1);
})();
