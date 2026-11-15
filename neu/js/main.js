/* =====================================================================
   b.ellers – Skript der Website

   Grundsatz: Die Seite ist auch ohne dieses Skript lesbar. Öffnungszeiten
   und Speisekarte stehen bereits fertig im HTML; das Skript ersetzt sie
   beim Laden durch den aktuellen Stand aus daten/daten.js und rechnet
   aus, ob gerade geöffnet ist.

   Der obere Teil besteht aus reinen Rechen- und Textfunktionen. Sie
   werden auch vom Bau- und vom Prüfskript benutzt (werkzeuge/), deshalb
   greifen sie nicht auf den Browser zu.
   ===================================================================== */
(function (wurzel) {
  "use strict";

  var TAGE = ["sonntag", "montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag"];

  var TEXTE = {
    de: {
      tage: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      uhr: " Uhr", ruhetag: "Ruhetag", feiertag: "Feiertag", bis: " – ",
      offenBis: function (z) { return "Jetzt geöffnet · bis " + z + " Uhr"; },
      offenNoch: function (m) { return "Jetzt geöffnet · schließt in " + m + " Min"; },
      zu: "Geschlossen", zuRuhetag: "Heute Ruhetag",
      oeffnetIn: function (m) { return "öffnet in " + m + " Min"; },
      oeffnetHeute: function (z) { return "öffnet heute um " + z + " Uhr"; },
      oeffnetMorgen: function (z) { return "öffnet morgen um " + z + " Uhr"; },
      oeffnetAm: function (t, z) { return "öffnet " + t + " um " + z + " Uhr"; },
      kategorien: "Kategorien der Speisekarte",
      legende: "Allergene und Zusatzstoffe", zusatzstoffe: "Zusatzstoffe", allergene: "Allergene",
      karteLaden: "Karte wird geladen …", kartenTitel: "Karte: b.ellers, Stadtplatz 1, 83714 Miesbach",
      schliessen: "Schließen", zurueck: "Vorheriges Bild", weiter: "Nächstes Bild", bildVon: function (a, b) { return "Bild " + a + " von " + b; }
    },
    en: {
      tage: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      uhr: "", ruhetag: "closed", feiertag: "public holidays", bis: " – ",
      offenBis: function (z) { return "Open now · until " + z; },
      offenNoch: function (m) { return "Open now · closes in " + m + " min"; },
      zu: "Closed", zuRuhetag: "Closed today",
      oeffnetIn: function (m) { return "opens in " + m + " min"; },
      oeffnetHeute: function (z) { return "opens today at " + z; },
      oeffnetMorgen: function (z) { return "opens tomorrow at " + z; },
      oeffnetAm: function (t, z) { return "opens " + t + " at " + z; },
      kategorien: "Menu categories",
      legende: "Allergens and additives", zusatzstoffe: "Additives", allergene: "Allergens",
      karteLaden: "Loading map …", kartenTitel: "Map: b.ellers, Stadtplatz 1, 83714 Miesbach",
      schliessen: "Close", zurueck: "Previous picture", weiter: "Next picture", bildVon: function (a, b) { return "Picture " + a + " of " + b; }
    }
  };

  /* ---------- kleine Helfer ---------- */

  function t(wert, sprache) {
    if (wert == null) return "";
    return typeof wert === "string" ? wert : (wert[sprache] || wert.de || "");
  }

  function esc(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function zwei(n) { return (n < 10 ? "0" : "") + n; }
  function schluessel(j, m, tag) { return j + "-" + zwei(m) + "-" + zwei(tag); }
  function minuten(zeit) { var p = zeit.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function uhrzeit(zeit) { var p = zeit.split(":"); return (+p[0]) + ":" + p[1]; }   // "08:00" -> "8:00"

  /* Kennzeichnungen wie "(a, g)" oder "(7)" kleiner setzen. "(3 Eier)" bleibt. */
  var KENNZ = /\(\s*((?:\d{1,2}|[a-u])(?:\s*,\s*(?:\d{1,2}|[a-u]))*)\s*\)/g;
  function mitKennz(text) {
    return esc(text).replace(KENNZ, function (_, k) { return '<span class="kz">' + k.replace(/\s+/g, "") .replace(/,/g, ", ") + "</span>"; });
  }
  function ohneKennz(text) { return String(text).replace(KENNZ, "").replace(/\s+/g, " ").trim(); }

  function preis(text) {
    return String(text).split("/").map(function (p) { return esc(p.trim()) + "&nbsp;€"; }).join(" / ");
  }

  /* ---------- Feiertage in Bayern ---------- */

  function ostersonntag(jahr) {                 // Gauß/Butcher, gregorianisch
    var a = jahr % 19, b = Math.floor(jahr / 100), c = jahr % 100,
        d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
        g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451),
        monat = Math.floor((h + l - 7 * m + 114) / 31), tag = ((h + l - 7 * m + 114) % 31) + 1;
    return Date.UTC(jahr, monat - 1, tag);
  }

  function feiertage(jahr) {
    var liste = {}, ostern = ostersonntag(jahr), TAG = 86400000;
    function fest(m, tag) { liste[schluessel(jahr, m, tag)] = true; }
    function beweglich(abstand) {
      var d = new Date(ostern + abstand * TAG);
      liste[schluessel(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())] = true;
    }
    fest(1, 1); fest(1, 6); fest(5, 1); fest(8, 15); fest(10, 3); fest(11, 1); fest(12, 25); fest(12, 26);
    beweglich(-2);  // Karfreitag
    beweglich(1);   // Ostermontag
    beweglich(39);  // Christi Himmelfahrt
    beweglich(50);  // Pfingstmontag
    beweglich(60);  // Fronleichnam
    return liste;
  }

  /* ---------- Öffnungszeiten ---------- */

  /* Zeiten eines Kalendertags: ["08:00","17:00"] oder null. */
  function zeitenAm(daten, j, m, tag) {
    var z = daten.oeffnungszeiten, key = schluessel(j, m, tag);
    if (z.ausnahmen && Object.prototype.hasOwnProperty.call(z.ausnahmen, key)) {
      return { zeiten: z.ausnahmen[key], art: "ausnahme" };
    }
    if (feiertage(j)[key]) return { zeiten: z.feiertag || null, art: "feiertag" };
    var wochentag = new Date(Date.UTC(j, m - 1, tag)).getUTCDay();
    return { zeiten: z[TAGE[wochentag]] || null, art: "wochentag", wochentag: wochentag };
  }

  /* jetzt = { j, m, tag, h, min } in Berliner Zeit. */
  function status(daten, jetzt, sprache) {
    var T = TEXTE[sprache] || TEXTE.de, heute = zeitenAm(daten, jetzt.j, jetzt.m, jetzt.tag),
        min = jetzt.h * 60 + jetzt.min;

    if (heute.zeiten && min >= minuten(heute.zeiten[0]) && min < minuten(heute.zeiten[1])) {
      var rest = minuten(heute.zeiten[1]) - min;
      return { offen: true, text: rest <= 60 ? T.offenNoch(rest) : T.offenBis(uhrzeit(heute.zeiten[1])) };
    }

    var vorweg = (!heute.zeiten && heute.art === "wochentag") ? T.zuRuhetag : T.zu;

    if (heute.zeiten && min < minuten(heute.zeiten[0])) {
      var warten = minuten(heute.zeiten[0]) - min;
      return { offen: false, text: vorweg + " · " + (warten <= 90 ? T.oeffnetIn(warten) : T.oeffnetHeute(uhrzeit(heute.zeiten[0]))) };
    }

    for (var i = 1; i <= 21; i++) {
      var d = new Date(Date.UTC(jetzt.j, jetzt.m - 1, jetzt.tag + i)),
          dann = zeitenAm(daten, d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
      if (dann.zeiten) {
        var z = uhrzeit(dann.zeiten[0]);
        return { offen: false, text: vorweg + " · " + (i === 1 ? T.oeffnetMorgen(z) : T.oeffnetAm(T.tage[d.getUTCDay()], z)) };
      }
    }
    return { offen: false, text: vorweg };
  }

  /* Zeilen der Öffnungszeiten-Tabelle. Gleiche Zeiten an aufeinander
     folgenden Tagen (Mo–Sa) werden zusammengefasst; der Sonntag steht
     allein, zusammen mit dem Feiertag, wenn beide gleich sind. */
  function zeitenZeilen(daten, sprache) {
    var T = TEXTE[sprache] || TEXTE.de, z = daten.oeffnungszeiten, zeilen = [], i = 1;
    function gleich(a, b) { return JSON.stringify(a || null) === JSON.stringify(b || null); }
    function wert(zt) { return zt ? uhrzeit(zt[0]) + T.bis + uhrzeit(zt[1]) + T.uhr : T.ruhetag; }

    while (i <= 6) {
      var ende = i;
      while (ende < 6 && gleich(z[TAGE[i]], z[TAGE[ende + 1]])) ende++;
      var tage = [];
      for (var n = i; n <= ende; n++) tage.push(n);
      zeilen.push({ tage: tage, name: T.tage[i] + (ende > i ? " – " + T.tage[ende] : ""), wert: wert(z[TAGE[i]]) });
      i = ende + 1;
    }
    if (gleich(z.sonntag, z.feiertag)) {
      zeilen.push({ tage: [0], feiertag: true, name: T.tage[0] + " / " + T.feiertag, wert: wert(z.sonntag) });
    } else {
      zeilen.push({ tage: [0], name: T.tage[0], wert: wert(z.sonntag) });
      zeilen.push({ tage: [], feiertag: true, name: T.feiertag.charAt(0).toUpperCase() + T.feiertag.slice(1), wert: wert(z.feiertag) });
    }
    return zeilen;
  }

  function zeitenHtml(daten, sprache) {
    return zeitenZeilen(daten, sprache).map(function (z) {
      return '<tr data-tage="' + z.tage.join(",") + '"' + (z.feiertag ? " data-feiertag" : "") + '><th scope="row">' +
        esc(z.name) + "</th><td>" + esc(z.wert) + "</td></tr>";
    }).join("\n");
  }

  /* Öffnungszeiten für Suchmaschinen (schema.org). */
  function zeitenSchema(daten) {
    var z = daten.oeffnungszeiten, en = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], liste = [];
    for (var i = 0; i < 7; i++) {
      var zt = z[TAGE[i]];
      liste.push({ "@type": "OpeningHoursSpecification", dayOfWeek: en[i],
                   opens: zt ? zt[0] : "00:00", closes: zt ? zt[1] : "00:00" });
    }
    return liste;
  }

  /* ---------- Speisekarte ---------- */

  function gerichtHtml(g, sprache) {
    var h = '<li class="gericht"><div class="gericht-kopf"><span class="gericht-name">' + mitKennz(t(g.name, sprache)) +
            '</span><span class="gericht-linie" aria-hidden="true"></span><span class="gericht-preis">' + preis(g.preis) + "</span></div>";
    if (g.text) h += '<p class="gericht-text">' + mitKennz(t(g.text, sprache)) + "</p>";
    if (g.dazu && g.dazu.length) {
      h += '<ul class="gericht-dazu">' + g.dazu.map(function (d) {
        return "<li><span>" + mitKennz(t(d.name, sprache)) + "</span><span>" + preis(d.preis) + "</span></li>";
      }).join("") + "</ul>";
    }
    return h + "</li>";
  }

  function gruppeHtml(id, titel, eintraege, sprache, extra) {
    return '<section class="karte-gruppe' + (extra && extra.klasse ? " " + extra.klasse : "") + '" id="k-' + esc(id) + '" aria-labelledby="k-' + esc(id) + '-titel">' +
      '<h3 id="k-' + esc(id) + '-titel">' + mitKennz(titel) + "</h3>" +
      (extra && extra.hinweis ? '<p class="karte-gruppe-hinweis">' + esc(extra.hinweis) + "</p>" : "") +
      '<ul class="karte-liste">' + eintraege.map(function (g) { return gerichtHtml(g, sprache); }).join("") + "</ul>" +
      (extra && extra.fussnote ? '<p class="karte-fussnote">' + esc(extra.fussnote) + "</p>" : "") +
      "</section>";
  }

  function karteHtml(daten, sprache) {
    var T = TEXTE[sprache] || TEXTE.de, nav = [], inhalt = [], s = daten.saisonkarte;

    if (s && s.aktiv && s.eintraege && s.eintraege.length) {
      nav.push(["saison", t(s.titel, sprache), true]);
      inhalt.push(gruppeHtml("saison", t(s.titel, sprache), s.eintraege, sprache, { klasse: "saison", hinweis: t(s.hinweis, sprache) }));
    }
    (daten.speisekarte || []).forEach(function (k) {
      nav.push([k.id, ohneKennz(t(k.titel, sprache))]);
      inhalt.push(gruppeHtml(k.id, t(k.titel, sprache), k.eintraege || [], sprache, { fussnote: t(k.fussnote, sprache) }));
    });

    var L = daten.legende || {};
    function liste(paare) {
      return '<dl class="legende-liste">' + (paare || []).map(function (p) {
        return "<div><dt>" + esc(p[0]) + "</dt><dd>" + esc(t(p[1], sprache)) + "</dd></div>";
      }).join("") + "</dl>";
    }
    var hinweise = ((daten.hinweise || {})[sprache] || []).map(function (h) { return "<p>" + esc(h) + "</p>"; }).join("");

    return {
      nav: '<ul>' + nav.map(function (n) {
        return '<li><a href="#k-' + esc(n[0]) + '"' + (n[2] ? ' class="ist-saison"' : "") + ">" + esc(n[1]) + "</a></li>";
      }).join("") + "</ul>",
      inhalt: inhalt.join("\n"),
      fuss: '<div class="karte-hinweise">' + hinweise + "</div>" +
        '<details class="legende"><summary>' + esc(T.legende) + "</summary>" +
        "<p>" + esc(t(L.einleitung, sprache)) + "</p>" +
        "<h4>" + esc(T.allergene) + "</h4>" + liste(L.allergene) +
        "<h4>" + esc(T.zusatzstoffe) + "</h4>" + liste(L.zusatzstoffe) + "</details>"
    };
  }

  var api = { TEXTE: TEXTE, feiertage: feiertage, zeitenAm: zeitenAm, status: status,
              zeitenHtml: zeitenHtml, zeitenSchema: zeitenSchema, karteHtml: karteHtml };

  /* Für die Werkzeuge (Node): nur die Funktionen herausgeben, hier ist Schluss. */
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  /* =====================================================================
     Ab hier: Browser
     ===================================================================== */

  var doc = wurzel.document, sprache = doc.documentElement.lang === "en" ? "en" : "de",
      T = TEXTE[sprache], daten = wurzel.BELLERS;

  function alle(auswahl, von) { return Array.prototype.slice.call((von || doc).querySelectorAll(auswahl)); }

  /* Berliner Uhrzeit – unabhängig davon, wo das Gerät steht. */
  function berlinJetzt() {
    var teile = {};
    try {
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hourCycle: "h23",
        year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" })
        .formatToParts(new Date()).forEach(function (p) { teile[p.type] = parseInt(p.value, 10); });
      return { j: teile.year, m: teile.month, tag: teile.day, h: teile.hour % 24, min: teile.minute };
    } catch (e) {
      var d = new Date();
      return { j: d.getFullYear(), m: d.getMonth() + 1, tag: d.getDate(), h: d.getHours(), min: d.getMinutes() };
    }
  }

  function statusZeigen() {
    if (!daten) return;
    var jetzt = berlinJetzt(), s = status(daten, jetzt, sprache);
    alle("[data-status]").forEach(function (el) {
      el.textContent = s.text;
      el.classList.toggle("ist-offen", s.offen);
      el.classList.toggle("ist-zu", !s.offen);
    });
    var heute = zeitenAm(daten, jetzt.j, jetzt.m, jetzt.tag);
    alle("#zeiten-koerper tr").forEach(function (tr) {
      var tage = (tr.getAttribute("data-tage") || "").split(","),
          trifft = heute.art === "feiertag" ? tr.hasAttribute("data-feiertag")
                 : heute.art === "wochentag" && tage.indexOf(String(heute.wochentag)) !== -1;
      tr.classList.toggle("heute", trifft);
    });
  }

  function datenEinsetzen() {
    if (!daten) return;                       // daten.js fehlt oder hat einen Tippfehler: HTML-Stand bleibt stehen
    try {
      var koerper = doc.getElementById("zeiten-koerper");
      if (koerper) koerper.innerHTML = zeitenHtml(daten, sprache);

      var k = karteHtml(daten, sprache), nav = doc.getElementById("karte-nav"),
          inhalt = doc.getElementById("karte-inhalt"), fuss = doc.getElementById("karte-fuss");
      if (nav) nav.innerHTML = k.nav;
      if (inhalt) inhalt.innerHTML = k.inhalt;
      if (fuss) fuss.innerHTML = k.fuss;

      var ld = doc.getElementById("schema");
      if (ld) {
        var schema = JSON.parse(ld.textContent);
        schema.openingHoursSpecification = zeitenSchema(daten);
        ld.textContent = JSON.stringify(schema);
      }
    } catch (e) { /* lieber den festen Stand zeigen als eine halbe Karte */ }
  }

  /* ---------- Kategorien-Leiste: zeigt, wo man gerade liest ---------- */
  function karteNavVorbereiten() {
    var nav = doc.getElementById("karte-nav");
    if (!nav || !("IntersectionObserver" in wurzel)) return;
    var links = alle("a", nav), aktiv = null;
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        var link = nav.querySelector('a[href="#' + e.target.id + '"]');
        if (!link || link === aktiv) return;
        links.forEach(function (l) { l.removeAttribute("aria-current"); });
        link.setAttribute("aria-current", "true");
        aktiv = link;
        var leiste = nav.querySelector("ul");       // Leiste mitführen, ohne die Seite zu bewegen
        if (leiste && leiste.scrollWidth > leiste.clientWidth) {
          leiste.scrollTo({ left: link.offsetLeft - (leiste.clientWidth - link.offsetWidth) / 2, behavior: "auto" });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    alle(".karte-gruppe").forEach(function (g) { beobachter.observe(g); });
  }

  /* ---------- Karte erst nach Klick laden (Datenschutz) ---------- */
  function landkarteVorbereiten() {
    var knopf = doc.getElementById("karte-laden"), huelle = doc.getElementById("landkarte");
    if (!knopf || !huelle) return;
    knopf.addEventListener("click", function () {
      var rahmen = doc.createElement("iframe");
      rahmen.src = huelle.getAttribute("data-quelle");
      rahmen.title = T.kartenTitel;
      rahmen.setAttribute("loading", "lazy");
      rahmen.setAttribute("referrerpolicy", "no-referrer");
      huelle.innerHTML = "";
      huelle.appendChild(rahmen);
      huelle.classList.add("ist-geladen");
      rahmen.focus();
    });
  }

  /* ---------- Großansicht der Fotos ---------- */
  function galerieVorbereiten() {
    var dialog = doc.getElementById("grossansicht"), links = alle(".galerie a[data-foto]");
    if (!dialog || !links.length || typeof dialog.showModal !== "function") return;
    var buehne = dialog.querySelector(".gross-buehne"), titel = dialog.querySelector(".gross-titel"),
        zaehler = dialog.querySelector(".gross-zaehler"), nummer = 0;

    function zeigen(n) {
      nummer = (n + links.length) % links.length;
      var a = links[nummer], name = a.getAttribute("data-foto"), breiten = a.getAttribute("data-breiten").split(","),
          img = a.querySelector("img");
      function satz(endung) { return breiten.map(function (b) { return "bilder/fotos/" + name + "-" + b + "." + endung + " " + b + "w"; }).join(", "); }
      buehne.innerHTML = '<picture><source type="image/avif" srcset="' + satz("avif") + '" sizes="100vw">' +
        '<source type="image/webp" srcset="' + satz("webp") + '" sizes="100vw">' +
        '<img src="' + a.getAttribute("href") + '" alt="' + esc(img.getAttribute("alt")) + '" width="' + img.getAttribute("width") +
        '" height="' + img.getAttribute("height") + '"></picture>';
      titel.textContent = a.getAttribute("data-titel");
      zaehler.textContent = T.bildVon(nummer + 1, links.length);
    }

    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault(); zeigen(i); dialog.showModal();
      });
    });
    dialog.querySelector(".gross-zu").addEventListener("click", function () { dialog.close(); });
    dialog.querySelector(".gross-vor").addEventListener("click", function () { zeigen(nummer + 1); });
    dialog.querySelector(".gross-zurueck").addEventListener("click", function () { zeigen(nummer - 1); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") zeigen(nummer + 1);
      if (e.key === "ArrowLeft") zeigen(nummer - 1);
    });
    dialog.addEventListener("close", function () { buehne.innerHTML = ""; if (links[nummer]) links[nummer].focus(); });
  }

  /* ---------- Menü auf dem Handy schließt sich nach der Wahl ---------- */
  function menueVorbereiten() {
    var menue = doc.getElementById("menue");
    if (!menue) return;
    alle("a", menue).forEach(function (a) { a.addEventListener("click", function () { menue.removeAttribute("open"); }); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menue.hasAttribute("open")) { menue.removeAttribute("open"); menue.querySelector("summary").focus(); }
    });
  }

  /* ---------- Sanftes Einblenden – nur wenn Bewegung erwünscht ist ---------- */
  function einblendenVorbereiten() {
    var ruhig = wurzel.matchMedia && wurzel.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ruhig || !("IntersectionObserver" in wurzel)) return;
    doc.documentElement.classList.add("mit-bewegung");
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("ist-da"); beobachter.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    alle("[data-einblenden]").forEach(function (el) { beobachter.observe(el); });
  }

  function start() {
    datenEinsetzen();
    statusZeigen();
    wurzel.setInterval(statusZeigen, 30000);
    doc.addEventListener("visibilitychange", function () { if (!doc.hidden) statusZeigen(); });
    karteNavVorbereiten();
    landkarteVorbereiten();
    galerieVorbereiten();
    menueVorbereiten();
    einblendenVorbereiten();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start); else start();

})(typeof window !== "undefined" ? window : this);
