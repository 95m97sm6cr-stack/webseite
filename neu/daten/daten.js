/* =====================================================================
   b.ellers – ÖFFNUNGSZEITEN UND SPEISEKARTE

   Das ist die einzige Datei, die man für Öffnungszeiten, Preise und
   Gerichte ändern muss. Die Website liest alles von hier.

   SPIELREGELN (bitte genau beachten, sonst bleibt die Karte leer):
   - Text steht immer in "Anführungszeichen".
   - Nach jedem Eintrag steht ein Komma.
   - Alles hinter zwei Schrägstrichen // ist nur ein Hinweis für dich
     und erscheint nicht auf der Website.
   - de = deutscher Text, en = englischer Text.
   - Vor dem Ändern eine Kopie dieser Datei aufheben. Wenn danach etwas
     nicht stimmt, einfach die Kopie wieder hochladen.
   ===================================================================== */

window.BELLERS = {

  /* -------------------------------------------------------------------
     1. ÖFFNUNGSZEITEN
     Uhrzeiten immer vierstellig mit Doppelpunkt: "08:00", "17:00".
     Ruhetag:  null   (ohne Anführungszeichen)
     ------------------------------------------------------------------- */
  oeffnungszeiten: {
    montag:     null,                 // Ruhetag
    dienstag:   ["08:00", "17:00"],
    mittwoch:   ["08:00", "17:00"],
    donnerstag: ["08:00", "17:00"],
    freitag:    ["08:00", "17:00"],
    samstag:    ["08:30", "17:00"],
    sonntag:    ["08:30", "17:00"],

    // An gesetzlichen Feiertagen in Bayern gelten diese Zeiten – egal auf
    // welchen Wochentag der Feiertag fällt. Die Feiertage rechnet die
    // Website selbst aus (auch Ostern, Pfingsten, Fronleichnam).
    // An Feiertagen geschlossen?  Dann:  feiertag: null,
    // BITTE PRÜFEN: Gilt das auch, wenn der Feiertag ein Montag ist?
    feiertag:   ["08:30", "17:00"],

    // Einzelne Tage, die abweichen – Betriebsurlaub, Heiligabend usw.
    // Datum als "JJJJ-MM-TT". Geschlossen: null. Andere Zeiten: ["08:30", "13:00"].
    // Beispiele (die zwei Schrägstriche davor entfernen, um sie zu benutzen):
    ausnahmen: {
      // "2026-12-24": null,
      // "2026-12-31": ["08:30", "13:00"],
    },
  },

  /* -------------------------------------------------------------------
     2. SAISONKARTE (z. B. Winterkarte)
     aktiv: true  = wird ganz oben in der Speisekarte gezeigt
     aktiv: false = ist unsichtbar (die Einträge dürfen stehen bleiben)
     ------------------------------------------------------------------- */
  saisonkarte: {
    aktiv: true,
    titel:  { de: "Winterkarte", en: "Winter menu" },
    hinweis: { de: "Nur für kurze Zeit.", en: "For a short time only." },
    eintraege: [
      // PLATZHALTER – bitte durch die echten Gerichte ersetzen oder oben
      // aktiv: false setzen. Aufbau wie in der Speisekarte weiter unten.
      { name: { de: "[Platzhalter] Gericht der Winterkarte", en: "[Placeholder] Winter menu dish" },
        text: { de: "[Platzhalter] Beschreibung", en: "[Placeholder] description" },
        preis: "0,00" },
    ],
  },

  /* -------------------------------------------------------------------
     3. SPEISEKARTE
     Jede Kategorie hat einen Titel und Einträge. Ein Eintrag:
       name:  so wie er auf der Karte steht. Kennzeichnungen für
              Allergene und Zusatzstoffe einfach in Klammern dahinter,
              z. B. "Butter (a, g)".
       text:  Beschreibung (darf fehlen)
       preis: als Text mit Komma, ohne Euro-Zeichen: "3,90"
       dazu:  kleine Aufpreise unter dem Gericht (darf fehlen)
     Steht der Name auf Deutsch und Englisch gleich da, genügt ein Text:
       name: "Espresso (7)"
     ------------------------------------------------------------------- */
  speisekarte: [
    {
      id: "fruehstueck",
      titel: { de: "Frühstück", en: "Breakfast" },
      eintraege: [
        { name: "Süßer Start (a, g)",
          text: { de: "Buttercroissant mit hausgemachtem Fruchtaufstrich",
                  en: "butter croissant with homemade fruit spread" },
          preis: "3,90" },
        { name: "Müsli Bircher Art (a, g, h)",
          text: { de: "hausgemacht mit Früchtetopping & Granola",
                  en: "homemade bircher muesli with fruit topping & granola" },
          preis: "6,90" },
        { name: "herzhaftes (a, g, c, d)",
          text: { de: "Schinken, Salami, Käse & Butter, serviert mit Brotkorb",
                  en: "the savoury one: ham, salami, cheese & butter, served with a bread basket" },
          preis: "9,90" },
        { name: "Lieblingsbowl (a, e, h)",
          preis: "9,90" },
        { name: "Avocado Royal (a, g, c, d)",
          text: { de: "knusprig geröstetes Dinkel-Roggen-Malzbrot mit körnigem Frischkäse, Cocktailtomaten, Rucola, Avocado, 2 Spiegel- oder Rühreier mit Balsamicotopping",
                  en: "crisply toasted spelt and rye malt bread with grainy cream cheese, cocktail tomatoes, rocket, avocado, 2 fried or scrambled eggs and a balsamic topping" },
          preis: "14,50",
          dazu: [
            { name: { de: "+ Schinken", en: "+ ham" }, preis: "2,00" },
            { name: { de: "+ Lachs", en: "+ salmon" }, preis: "3,50" },
            { name: { de: "+ frisch gepresster Orangensaft", en: "+ freshly squeezed orange juice" }, preis: "4,20" },
          ] },
        { name: "Gönnerbrunch (a, g, c, d)",
          text: { de: "Schinkenauswahl, Salami, Käseauswahl, Aufstrich des Tages, weichgekochtes Ei, hausgemachter Fruchtaufstrich & Butter, serviert mit Brotkorb",
                  en: "a selection of ham, salami and cheese, spread of the day, soft-boiled egg, homemade fruit spread & butter, served with a bread basket" },
          preis: "15,90" },
        { name: "Vegetarisch (a, g, c, d)",
          text: { de: "Käseauswahl, Müsli, Aufstrich des Tages, Tomate-Mozzarella, weichgekochtes Ei, hausgemachter Fruchtaufstrich & Butter, serviert mit Brotkorb",
                  en: "the vegetarian one: a selection of cheese, muesli, spread of the day, tomato and mozzarella, soft-boiled egg, homemade fruit spread & butter, served with a bread basket" },
          preis: "18,90" },
        { name: "Frühstück für zwei (a, g, c, d)",
          text: { de: "Unser Schlemmer-Duo: Schinken, Salami, Käseauswahl, 2 weichgekochte Eier, 2 Müsli Bircher Art, Aufstrich des Tages, hausgemachter Fruchtaufstrich & Butter, serviert mit Brotkorb",
                  en: "breakfast for two: ham, salami, a selection of cheese, 2 soft-boiled eggs, 2 bircher mueslis, spread of the day, homemade fruit spread & butter, served with a bread basket" },
          preis: "27,90" },
      ],
    },
    {
      id: "eier",
      titel: { de: "Ei love eggs (a, c)", en: "Ei love eggs (a, c)" },
      eintraege: [
        { name: { de: "weichgekochtes Ei", en: "soft-boiled egg" }, preis: "2,50" },
        { name: { de: "Rührei Natur (3 Eier) oder Spiegelei (2 Eier)", en: "scrambled eggs (3 eggs) or fried eggs (2 eggs)" }, preis: "5,90 / 4,70" },
        { name: { de: "Rührei mit Tomaten", en: "scrambled eggs with tomatoes" }, preis: "6,60" },
        { name: { de: "Rührei mit Schinken", en: "scrambled eggs with ham" }, preis: "7,60" },
        { name: { de: "Rührei mit Tomaten & Schinken", en: "scrambled eggs with tomatoes & ham" }, preis: "8,60" },
      ],
    },
    {
      id: "extras",
      titel: { de: "Extras", en: "Extras" },
      eintraege: [
        { name: { de: "Fruchtaufstrich / Honig / Nutella (h, f) / Dattel-Curry-Dip (a, g) je",
                  en: "fruit spread / honey / Nutella (h, f) / date curry dip (a, g) each" }, preis: "1,40" },
        { name: { de: "Butter (a, g)", en: "butter (a, g)" }, preis: "1,00" },
        { name: { de: "Portion Schinken", en: "portion of ham" }, preis: "4,20" },
        { name: { de: "Räucherlachs (d) mit Meerrettich", en: "smoked salmon (d) with horseradish" }, preis: "5,20" },
        { name: { de: "Semmel Weizen", en: "wheat roll" }, preis: "1,20" },
        { name: { de: "Breze", en: "pretzel" }, preis: "1,50" },
        { name: { de: "Dinkelvollkornsemmel", en: "wholegrain spelt roll" }, preis: "1,50" },
        { name: { de: "Croissant", en: "croissant" }, preis: "2,50" },
      ],
    },
    {
      id: "kaffee",
      titel: { de: "Kaffee & Co.", en: "Coffee & co." },
      fussnote: { de: "Hafermilch + 0,80 €", en: "Oat milk + 0.80 €" },
      eintraege: [
        { name: "Espresso (7)", preis: "2,20" },
        { name: "Doppio (7)", preis: "3,90" },
        { name: "Espresso Macchiato (7, g)", preis: "3,20" },
        { name: { de: "Cappuccino klein (7, g)", en: "Cappuccino small (7, g)" }, preis: "3,80" },
        { name: { de: "Cappuccino groß (7, g)", en: "Cappuccino large (7, g)" }, preis: "4,80" },
        { name: "Latte Macchiato (7, g)", preis: "4,80" },
        { name: { de: "Milchkaffee (7, g)", en: "white coffee (7, g)" }, preis: "4,80" },
        { name: { de: "Kaffee Tasse", en: "coffee, cup" }, preis: "3,50" },
        { name: { de: "Kaffee Haferl", en: "coffee, large mug" }, preis: "4,50" },
        { name: "Chai Latte (7, 12, g, m)", preis: "5,90" },
        { name: "Matcha Latte (7, 12, g, u)", preis: "6,90" },
        { name: { de: "Kindercappu (g)", en: "children's cappuccino (g)" }, preis: "1,00" },
        { name: { de: "Heißer Schokotrunk (g)", en: "hot chocolate (g)" }, preis: "4,80" },
        { name: { de: "Tee von Bioteaque 0,5 l", en: "Bioteaque tea, 0.5 l" },
          text: { de: "Kräutertee, Früchtetee, schwarzer Tee, grüner Tee", en: "herbal, fruit, black or green tea" },
          preis: "4,90" },
      ],
    },
    {
      id: "getraenke",
      titel: { de: "Getränke", en: "Drinks" },
      eintraege: [
        { name: { de: "Wasser still 0,4 l", en: "still water 0.4 l" }, preis: "3,20" },
        { name: { de: "Wasser Sprudel 0,4 l", en: "sparkling water 0.4 l" }, preis: "3,20" },
        { name: { de: "Säfte 0,4 l", en: "juices 0.4 l" },
          text: { de: "Apfel, Johannisbeere (13), Maracuja, Orange, Rhabarber", en: "apple, blackcurrant (13), passion fruit, orange, rhubarb" },
          preis: "4,60" },
        { name: { de: "Schorlen 0,4 l", en: "juice with sparkling water 0.4 l" },
          text: { de: "Apfel, Johannisbeere, Maracuja, Orange, Rhabarber, Holler", en: "apple, blackcurrant, passion fruit, orange, rhubarb, elderflower" },
          preis: "4,60" },
      ],
    },
  ],

  /* -------------------------------------------------------------------
     4. HINWEISE UNTER DER KARTE und die Legende der Kennzeichnungen
     ------------------------------------------------------------------- */
  hinweise: {
    de: [
      "Falls wir gerade zu viel um die Ohren haben, meldet Euch gerne an der Theke. Wir sind trotzdem gerne für Euch da und bringen Eure Bestellung dann zum Tisch!",
      "Alle Preise in Euro inkl. gesetzlicher Mehrwertsteuer. Änderungen vorbehalten.",
    ],
    en: [
      "If we're rushed off our feet, please just come to the counter. We're still happy to help and will bring your order to your table!",
      "If you have an allergy, please ask us – we're happy to check for you.",
      "All prices in euros, including VAT. Subject to change.",
    ],
  },

  legende: {
    einleitung: { de: "Kreuzkontaminationen und Spuren können vorhanden sein.",
                  en: "Traces and cross-contamination cannot be ruled out." },
    zusatzstoffe: [
      ["1",  { de: "Konservierungsstoff", en: "preservative" }],
      ["2",  { de: "mit Farbstoff", en: "with colouring" }],
      ["3",  { de: "mit Antioxidationsmittel", en: "with antioxidant" }],
      ["4",  { de: "mit Phosphat", en: "with phosphate" }],
      ["7",  { de: "mit Koffein", en: "contains caffeine" }],
      ["8",  { de: "mit Geschmacksverstärker", en: "with flavour enhancer" }],
      ["9",  { de: "geschwärzt", en: "blackened" }],
      ["10", { de: "gewachst", en: "waxed" }],
      ["11", { de: "mit Taurin", en: "with taurine" }],
      ["12", { de: "mit Süßungsmitteln", en: "with sweeteners" }],
      ["13", { de: "mit Nitrat", en: "with nitrate" }],
    ],
    allergene: [
      ["a", { de: "Glutenhaltiges Getreide", en: "cereals containing gluten" }],
      ["b", { de: "Krebstiere und daraus gewonnene Erzeugnisse", en: "crustaceans and products thereof" }],
      ["c", { de: "Eier und daraus gewonnene Erzeugnisse", en: "eggs and products thereof" }],
      ["d", { de: "Fische und daraus gewonnene Erzeugnisse", en: "fish and products thereof" }],
      ["e", { de: "Erdnüsse und daraus gewonnene Erzeugnisse", en: "peanuts and products thereof" }],
      ["f", { de: "Sojabohnen und daraus gewonnene Erzeugnisse", en: "soybeans and products thereof" }],
      ["g", { de: "Milch und daraus gewonnene Erzeugnisse", en: "milk and products thereof" }],
      ["h", { de: "Schalenfrüchte", en: "nuts" }],
      ["i", { de: "Sellerie und daraus gewonnene Erzeugnisse", en: "celery and products thereof" }],
      ["j", { de: "Senf und daraus gewonnene Erzeugnisse", en: "mustard and products thereof" }],
      ["k", { de: "Sesamsamen und daraus gewonnene Erzeugnisse", en: "sesame seeds and products thereof" }],
      ["l", { de: "Schwefeldioxid und Sulphite", en: "sulphur dioxide and sulphites" }],
      ["m", { de: "Lupinen und daraus gewonnene Erzeugnisse", en: "lupin and products thereof" }],
      ["n", { de: "Weichtiere und daraus gewonnene Erzeugnisse", en: "molluscs and products thereof" }],
      // PLATZHALTER: Beim Matcha Latte steht "(u)", auf der alten Karte
      // fehlte die Erklärung dazu. Bitte ergänzen oder das (u) entfernen.
      ["u", { de: "[Platzhalter – Bedeutung bitte ergänzen]", en: "[placeholder – meaning to be added]" }],
    ],
  },
};
