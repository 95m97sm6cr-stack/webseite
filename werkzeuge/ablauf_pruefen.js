/* Prüft, dass Terminhinweise mit data-gilt-bis am richtigen Tag verschwinden.

   Warum das eine eigene Prüfung verdient: Der Fehler zeigt sich erst Wochen
   später und niemand merkt ihn – auf der Startseite stünde dann eine
   Einladung zu einem Termin, der längst vorbei ist. Deshalb wird hier die
   Uhr des Browsers gefälscht, statt zu warten.

   Umgebungsabhängige Pfade siehe werkzeuge/README.md. */
const { chromium } = require(process.env.PLAYWRIGHT_MODUL || '/opt/node22/lib/node_modules/playwright');
const CHROMIUM = process.env.CHROMIUM_PFAD === undefined
  ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  : (process.env.CHROMIUM_PFAD || undefined);
const BASIS = process.env.BASIS_ADRESSE || 'http://localhost:8765/';

/* Alle Stellen, die ein data-gilt-bis tragen, mit dem Datum aus dem HTML.
   Kommt ein neuer Terminhinweis dazu, gehört er hier mit hinein. */
const STELLEN = [
  ['index.html',     '.aktion-banner', '2026-10-02', 'Streifen DE'],
  ['index-en.html',  '.aktion-banner', '2026-10-02', 'Streifen EN'],
  ['events.html',    '#speed-dating',  '2026-10-02', 'Terminkasten DE'],
  ['events-en.html', '#speed-dating',  '2026-10-02', 'Terminkasten EN'],
];

let fehler = 0;
function meldung(text) { console.log('  FEHLER: ' + text); fehler++; }

function tagVersetzt(datum, tage) {
  const d = new Date(datum + 'T12:00:00');
  d.setDate(d.getDate() + tage);
  return d.toISOString().slice(0, 10);
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROMIUM });

  for (const [seite, auswahl, bis, name] of STELLEN) {
    /* Vier Zeitpunkte: lange vorher, am Tag selbst (muss noch stehen –
       der Termin läuft ja erst an diesem Abend), am Tag danach und lange
       danach. Der Tag selbst ist der Fall, den ein naiver Vergleich
       falsch macht. */
    const faelle = [
      [tagVersetzt(bis, -30), true,  'einen Monat vorher'],
      [bis,                   true,  'am Termintag selbst'],
      [tagVersetzt(bis, 1),   false, 'einen Tag danach'],
      [tagVersetzt(bis, 45),  false, 'sechs Wochen danach'],
    ];

    for (const [heute, erwartet, wann] of faelle) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      // Die Uhr fälschen, bevor irgendein Skript der Seite läuft.
      await ctx.addInitScript(`{
        const fest = new Date('${heute}T12:00:00').getTime();
        const Echt = Date;
        Date = class extends Echt {
          constructor(...a) { return a.length ? new Echt(...a) : new Echt(fest); }
          static now() { return fest; }
        };
      }`);
      const page = await ctx.newPage();
      await page.goto(BASIS + seite, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);
      const vorhanden = (await page.$(auswahl)) !== null;
      if (vorhanden !== erwartet) {
        meldung(`${name} (${seite}): ${wann} – ${vorhanden ? 'noch da' : 'schon weg'}, `
                + `erwartet war ${erwartet ? 'sichtbar' : 'verschwunden'}`);
      }
      await ctx.close();
    }
    console.log(`${name}: läuft am ${bis} korrekt ab`);
  }

  /* Gegenprobe: Ohne data-gilt-bis darf nichts entfernt werden. Sonst
     würde ein Tippfehler im Attributnamen unbemerkt alles wegräumen. */
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASIS + 'index.html', { waitUntil: 'networkidle' });
  const bleibt = await page.evaluate(() =>
    document.querySelectorAll('section, .aktion-banner').length);
  if (bleibt < 5) meldung(`Startseite hat nach dem Lauf nur noch ${bleibt} Abschnitte – zu wenig`);
  else console.log(`Gegenprobe: ${bleibt} Abschnitte ohne Ablaufdatum bleiben stehen`);
  await ctx.close();

  await browser.close();
  console.log(fehler === 0 ? '\nAlles in Ordnung.' : `\n${fehler} Fehler.`);
  process.exit(fehler === 0 ? 0 : 1);
})();
