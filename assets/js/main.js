/* =============================================================
   b.ellers – Skript für die Website

   Grundsatz: Die Seite muss ohne JavaScript vollständig nutzbar sein.
   Alles hier ist eine Verbesserung obendrauf, nichts davon ist Pflicht.
   ============================================================= */

(function () {
  "use strict";

  /* ===========================================================
     Öffnungszeiten – eine einzige Quelle für Status und Countdown.

     Reihenfolge: 0 = Sonntag, 1 = Montag ... 6 = Samstag.
     null bedeutet Ruhetag.

     WICHTIG: Wenn sich die Öffnungszeiten ändern, hier UND in der
     Tabelle in index.html anpassen.
     =========================================================== */
  var OEFFNUNGSZEITEN = [
    { von: "08:00", bis: "17:00" }, // Sonntag
    null,                            // Montag – Ruhetag
    { von: "07:00", bis: "17:00" }, // Dienstag
    { von: "07:00", bis: "17:00" }, // Mittwoch
    { von: "07:00", bis: "17:00" }, // Donnerstag
    { von: "07:00", bis: "17:00" }, // Freitag
    { von: "08:00", bis: "17:00" }  // Samstag
  ];

  var SPEICHER = "bellers-ansicht";

  /* Sprachabhängige Texte. Welche Fassung gilt, entscheidet das lang-Attribut
     der Seite (<html lang="de"> bzw. <html lang="en">). */
  var TEXTE = {
    de: {
      tage: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      offenBis:   function (z) { return "Jetzt geöffnet · bis " + z; },
      offenNoch:  function (m) { return "Jetzt geöffnet · noch " + m + " Min"; },
      zuIn:       function (d) { return "Geschlossen · öffnet in " + d; },
      zuAmTag:    function (t, z) { return "Geschlossen · öffnet " + t + " um " + z; },
      zu:         "Gerade geschlossen",
      morgen:     "morgen",
      dauer:      function (std, min) { return std > 0 ? (std + " Std " + min + " Min") : (min + " Min"); },
      uhrzeit:    function (hhmm) { return hhmm.replace(/^0/, "") + " Uhr"; },
      heute:      " · heute"
    },
    en: {
      tage: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      offenBis:   function (z) { return "Open now · until " + z; },
      offenNoch:  function (m) { return "Open now · closing in " + m + " min"; },
      zuIn:       function (d) { return "Closed · opens in " + d; },
      zuAmTag:    function (t, z) { return "Closed · opens " + t + " at " + z; },
      zu:         "Currently closed",
      morgen:     "tomorrow",
      dauer:      function (std, min) { return std > 0 ? (std + " hrs " + min + " min") : (min + " min"); },
      // 24-Stunden-Format bleibt auch auf Englisch – in Europa üblich und eindeutig.
      uhrzeit:    function (hhmm) { return hhmm.replace(/^0/, ""); },
      heute:      " · today"
    }
  };

  /* Achtung: bewusst NICHT "t" genannt – in status() gibt es eine
     Schleifenvariable "var t", die den Namen sonst im ganzen Funktionsbereich
     überdecken würde (var wird nach oben gezogen). */
  function texte() {
    return TEXTE[document.documentElement.lang === "en" ? "en" : "de"];
  }

  /* ---------- kleine Helfer ---------- */

  function $(auswahl, wurzel) { return (wurzel || document).querySelector(auswahl); }
  function $$(auswahl, wurzel) {
    return Array.prototype.slice.call((wurzel || document).querySelectorAll(auswahl));
  }

  function inMinuten(hhmm) {
    var t = hhmm.split(":");
    return parseInt(t[0], 10) * 60 + parseInt(t[1], 10);
  }

  function alsUhrzeit(hhmm) { return texte().uhrzeit(hhmm); }

  /* Läuft die Seite gerade mit Bewegung? Berücksichtigt sowohl den
     Schalter im Ansicht-Bedienfeld als auch die Systemeinstellung. */
  function bewegungErlaubt() {
    var gewaehlt = document.documentElement.getAttribute("data-bewegung");
    if (gewaehlt === "reduziert") return false;
    if (gewaehlt === "an") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ===========================================================
     1. Öffnungs-Status mit Countdown
     =========================================================== */

  function status(jetzt) {
    var tag = jetzt.getDay();
    var minuten = jetzt.getHours() * 60 + jetzt.getMinutes();
    var heute = OEFFNUNGSZEITEN[tag];

    var T = texte();

    if (heute && minuten >= inMinuten(heute.von) && minuten < inMinuten(heute.bis)) {
      var restMin = inMinuten(heute.bis) - minuten;
      if (restMin <= 60) return { offen: true, text: T.offenNoch(restMin) };
      return { offen: true, text: T.offenBis(alsUhrzeit(heute.bis)) };
    }

    // Wie lange bis zur nächsten Öffnung?
    var wartenMin = null, zielTag = null, zielZeit = null;

    if (heute && minuten < inMinuten(heute.von)) {
      wartenMin = inMinuten(heute.von) - minuten;
      zielTag = tag;
      zielZeit = heute.von;
    } else {
      for (var i = 1; i <= 7; i++) {
        var t = (tag + i) % 7;
        var z = OEFFNUNGSZEITEN[t];
        if (z) {
          wartenMin = (24 * 60 - minuten) + (i - 1) * 24 * 60 + inMinuten(z.von);
          zielTag = t;
          zielZeit = z.von;
          break;
        }
      }
    }

    if (wartenMin === null) return { offen: false, text: T.zu };

    // Unter 10 Stunden: als Countdown, das ist greifbarer als ein Wochentag.
    if (wartenMin < 600) {
      var std = Math.floor(wartenMin / 60);
      var min = wartenMin % 60;
      return { offen: false, text: T.zuIn(T.dauer(std, min)) };
    }

    var name = (zielTag === (tag + 1) % 7) ? T.morgen : T.tage[zielTag];
    return { offen: false, text: T.zuAmTag(name, alsUhrzeit(zielZeit)) };
  }

  function statusAnzeigen() {
    var felder = $$("[data-status]");
    if (!felder.length) return;

    var s = status(new Date());
    felder.forEach(function (el) {
      el.classList.remove("ist-offen", "ist-zu");
      el.classList.add(s.offen ? "ist-offen" : "ist-zu");
      el.innerHTML = '<span class="status-punkt" aria-hidden="true"></span><span></span>';
      el.lastElementChild.textContent = s.text;
      el.hidden = false;
    });
  }

  function heutigenTagMarkieren() {
    var heute = new Date().getDay();
    $$("tr[data-tage]").forEach(function (zeile) {
      if (zeile.getAttribute("data-tage").split(",").indexOf(String(heute)) !== -1) {
        zeile.classList.add("heute");
      }
    });
  }

  /* ===========================================================
     2. Ansicht-Bedienfeld: Schriftgröße, Kontrast, Bewegung
     =========================================================== */

  function einstellungenLesen() {
    try {
      return JSON.parse(localStorage.getItem(SPEICHER)) || {};
    } catch (e) {
      return {};
    }
  }

  function einstellungenSchreiben(werte) {
    try {
      localStorage.setItem(SPEICHER, JSON.stringify(werte));
    } catch (e) {
      /* Privater Modus o. Ä. – dann gilt die Einstellung eben nur für diese Seite. */
    }
  }

  function einstellungSetzen(name, wert) {
    var werte = einstellungenLesen();
    werte[name] = wert;
    einstellungenSchreiben(werte);
    document.documentElement.setAttribute("data-" + name, wert);
    knoepfeAktualisieren();
  }

  function knoepfeAktualisieren() {
    var wurzel = document.documentElement;
    $$("[data-setzt]").forEach(function (knopf) {
      var teile = knopf.getAttribute("data-setzt").split(":");
      var aktiv = (wurzel.getAttribute("data-" + teile[0]) || standard(teile[0])) === teile[1];
      knopf.setAttribute("aria-pressed", aktiv ? "true" : "false");
    });
  }

  function standard(name) {
    /* Bei der Bewegung ist der Standard NICHT einfach "an": Wenn im
       Betriebssystem "Bewegung reduzieren" eingestellt ist, gilt das auch
       hier. Solange niemand aktiv etwas anderes wählt, bleibt das Attribut
       ungesetzt, damit die Systemeinstellung im CSS greifen kann. */
    if (name === "bewegung") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduziert" : "an";
    }
    return "normal";
  }

  function ansichtVorbereiten() {
    var knopf = $(".ansicht-knopf");
    var panel = $(".ansicht-panel");
    if (!knopf || !panel) return;

    // Schrift und Kontrast dürfen fest gesetzt werden; die Bewegung bewusst
    // nicht (siehe standard()).
    ["schrift", "kontrast"].forEach(function (n) {
      if (!document.documentElement.getAttribute("data-" + n)) {
        document.documentElement.setAttribute("data-" + n, "normal");
      }
    });

    function oeffnen() {
      panel.hidden = false;
      knopf.setAttribute("aria-expanded", "true");
      var ersterKnopf = $("button", panel);
      if (ersterKnopf) ersterKnopf.focus();
    }

    function schliessen(fokusZurueck) {
      panel.hidden = true;
      knopf.setAttribute("aria-expanded", "false");
      if (fokusZurueck) knopf.focus();
    }

    knopf.addEventListener("click", function () {
      if (panel.hidden) oeffnen(); else schliessen(true);
    });

    panel.addEventListener("click", function (e) {
      var ziel = e.target.closest("[data-setzt]");
      if (ziel) {
        var teile = ziel.getAttribute("data-setzt").split(":");
        einstellungSetzen(teile[0], teile[1]);
        return;
      }
      if (e.target.closest(".zuruecksetzen")) {
        ["schrift", "kontrast", "bewegung"].forEach(function (n) {
          einstellungSetzen(n, standard(n));
        });
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) schliessen(true);
    });

    document.addEventListener("click", function (e) {
      if (panel.hidden) return;
      if (!panel.contains(e.target) && !knopf.contains(e.target)) schliessen(false);
    });

    knoepfeAktualisieren();
  }

  /* ===========================================================
     3. Reservierungs-Dialog

     Wichtig: Hier lässt sich NICHT reservieren. Der Dialog zeigt nur,
     wie man das Café erreicht. Ohne JavaScript führt der Button
     stattdessen zum Abschnitt "#reservierung" mit denselben Angaben.
     =========================================================== */

  var FOKUSSIERBAR = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  /* Gemeinsame Mechanik beider Dialoge (Reservierung und Großansicht):
     Hintergrund abschirmen, Fokus einsperren, Escape schließt, und der Fokus
     landet danach wieder dort, wo er hergekommen ist. Bewusst von Hand statt
     mit <dialog>, damit auch ältere Geräte mitkommen. */
  function modalMachen(huelle, dialog, beimOeffnen) {
    var zuletztFokussiert = null;

    function oeffnen(e) {
      if (e) e.preventDefault();
      zuletztFokussiert = document.activeElement;
      huelle.hidden = false;
      document.documentElement.classList.add("dialog-offen");
      // Hintergrund für Screenreader ausblenden
      $$("body > *").forEach(function (el) {
        if (el !== huelle) el.setAttribute("aria-hidden", "true");
      });
      // Seite darf im Hintergrund nicht wegscrollen
      document.body.style.overflow = "hidden";
      if (beimOeffnen) beimOeffnen(e);
      var erstes = $(FOKUSSIERBAR, dialog);
      if (erstes) erstes.focus();
    }

    function schliessen() {
      huelle.hidden = true;
      document.documentElement.classList.remove("dialog-offen");
      $$("body > *").forEach(function (el) { el.removeAttribute("aria-hidden"); });
      document.body.style.overflow = "";
      if (zuletztFokussiert) zuletztFokussiert.focus();
    }

    // Klick auf den abgedunkelten Bereich schließt
    huelle.addEventListener("mousedown", function (e) {
      if (e.target === huelle) schliessen();
    });

    document.addEventListener("keydown", function (e) {
      if (huelle.hidden) return;

      if (e.key === "Escape") { schliessen(); return; }

      // Fokusfalle: Der Tastaturfokus bleibt im Dialog.
      if (e.key === "Tab") {
        var elemente = $$(FOKUSSIERBAR, dialog).filter(function (el) {
          return el.offsetParent !== null;
        });
        if (!elemente.length) return;
        var erstes = elemente[0];
        var letztes = elemente[elemente.length - 1];

        if (e.shiftKey && document.activeElement === erstes) {
          e.preventDefault();
          letztes.focus();
        } else if (!e.shiftKey && document.activeElement === letztes) {
          e.preventDefault();
          erstes.focus();
        }
      }
    });

    return { oeffnen: oeffnen, schliessen: schliessen, huelle: huelle };
  }

  function dialogVorbereiten() {
    var huelle = $(".dialog-hintergrund");
    var dialog = $(".reservierung-dialog");
    var ausloeser = $$('[data-oeffnet="reservierung"]');
    if (!huelle || !dialog || !ausloeser.length) return;

    // Der Öffnungsstatus im Dialog soll beim Öffnen frisch sein.
    var modal = modalMachen(huelle, dialog, statusAnzeigen);

    ausloeser.forEach(function (a) { a.addEventListener("click", modal.oeffnen); });

    $$("[data-schliesst]", huelle).forEach(function (b) {
      b.addEventListener("click", modal.schliessen);
    });
  }

  /* ===========================================================
     3b. Galerie: Fotos groß ansehen
     =========================================================== */

  function grossansichtVorbereiten() {
    var huelle = $(".bild-hintergrund");
    var dialog = $(".bild-dialog");
    var bild = $(".bild-buehne img");
    var beschriftung = $(".bild-buehne figcaption");
    var links = $$(".galerie-lupe");
    if (!huelle || !dialog || !bild || !links.length) return;

    var nummer = 0;

    function zeigen(i) {
      // Modulo mit Korrektur, damit man von Foto 1 rückwärts zum letzten kommt
      nummer = ((i % links.length) + links.length) % links.length;
      var link = links[nummer];
      var klein = $("img", link);
      bild.src = link.getAttribute("href");
      bild.alt = klein ? klein.alt : "";
      beschriftung.textContent = link.getAttribute("data-bu") || "";
    }

    var modal = modalMachen(huelle, dialog);

    links.forEach(function (link, i) {
      link.addEventListener("click", function (e) {
        // Nur der normale Klick wird abgefangen. Wer das Bild bewusst in einem
        // neuen Tab öffnen will, soll das weiterhin können.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        zeigen(i);
        modal.oeffnen(e);
      });
    });

    $$("[data-bild-schliesst]", huelle).forEach(function (b) {
      b.addEventListener("click", modal.schliessen);
    });

    $$("[data-bild-blaettert]", huelle).forEach(function (b) {
      b.addEventListener("click", function () {
        zeigen(nummer + Number(b.getAttribute("data-bild-blaettert")));
      });
    });

    document.addEventListener("keydown", function (e) {
      if (huelle.hidden) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); zeigen(nummer - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); zeigen(nummer + 1); }
    });
  }

  /* ===========================================================
     4. Navigation: mobiles Menü und mitlaufende Hervorhebung
     =========================================================== */

  function menueVorbereiten() {
    var toggle = $(".nav-toggle");
    var klapp = $(".nav-klapp");
    if (!toggle || !klapp) return;

    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", function () {
      var offen = klapp.classList.toggle("offen");
      toggle.setAttribute("aria-expanded", offen ? "true" : "false");
    });

    // Nach einem Klick auf einen Link ist das Menü erledigt. Der
    // Sprachumschalter lädt ohnehin eine neue Seite; die Knöpfe im
    // Ansicht-Feld sollen das Menü dagegen offen lassen.
    $$(".nav-links a", klapp).forEach(function (link) {
      link.addEventListener("click", function () {
        klapp.classList.remove("offen");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function scrollspyVorbereiten() {
    var links = $$('.nav-links a[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;

    var abschnitte = links.map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    }).filter(Boolean);
    if (!abschnitte.length) return;

    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          var passt = a.getAttribute("href") === "#" + e.target.id;
          a.classList.toggle("aktiv", passt);
          if (passt) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    abschnitte.forEach(function (s) { beobachter.observe(s); });
  }

  /* ===========================================================
     5. Effekte: Einblenden, Fortschritt, Parallax, Nach oben
     =========================================================== */

  function einblendenVorbereiten() {
    var elemente = $$(".einblenden, .staffeln");
    if (!elemente.length) return;

    function allesZeigen() {
      elemente.forEach(function (el) { el.classList.add("sichtbar"); });
    }

    if (!bewegungErlaubt() || !("IntersectionObserver" in window)) {
      return; // ohne "anim-bereit" ist ohnehin alles sichtbar
    }

    try {
      document.documentElement.classList.add("anim-bereit");

      var beobachter = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("sichtbar");
            beobachter.unobserve(e.target);
          }
        });
      }, { rootMargin: "0px 0px -60px 0px", threshold: 0.01 });

      elemente.forEach(function (el) { beobachter.observe(el); });

      // Notbremse: Sollte der Beobachter nicht auslösen, ist nach 6 s auf
      // jeden Fall alles zu sehen. Lieber ohne Animation als unsichtbar.
      setTimeout(allesZeigen, 6000);
    } catch (e) {
      document.documentElement.classList.remove("anim-bereit");
      allesZeigen();
    }
  }

  /* Fortschrittsbalken, Parallax und Nach-oben-Knopf teilen sich einen
     einzigen Scroll-Handler, der über requestAnimationFrame gedrosselt wird.
     Das hält die Seite auch auf älteren Handys flüssig. */
  function scrollEffekte() {
    var balken = $(".fortschritt");
    var nachOben = $(".nach-oben");
    var hero = $(".hero");
    var buehne = $(".hero-buehne");
    var deko = $(".hero-deko");

    // Parallax nur auf großen Zeigegeräten – auf Handys kostet es nur Akku.
    var parallaxAn = bewegungErlaubt() &&
      window.matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)").matches;

    if (!balken && !nachOben && !parallaxAn) return;

    var laeuft = false;

    function rechnen() {
      laeuft = false;
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (balken) {
        var hoehe = document.documentElement.scrollHeight - window.innerHeight;
        var anteil = hoehe > 0 ? Math.min(y / hoehe, 1) : 0;
        balken.style.transform = "scaleX(" + anteil + ")";
      }

      if (nachOben) {
        nachOben.classList.toggle("sichtbar", y > 600);
      }

      if (parallaxAn && hero && y < hero.offsetHeight) {
        if (buehne) buehne.style.transform = "translate3d(0," + (y * 0.16) + "px,0)";
        if (deko) deko.style.transform = "translate3d(0," + (y * 0.32) + "px,0)";
      }
    }

    window.addEventListener("scroll", function () {
      if (!laeuft) { laeuft = true; window.requestAnimationFrame(rechnen); }
    }, { passive: true });

    rechnen();
  }

  function nachObenVorbereiten() {
    var knopf = $(".nach-oben");
    if (!knopf) return;
    knopf.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: bewegungErlaubt() ? "smooth" : "auto" });
      var ziel = $("h1") || $("main");
      if (ziel) {
        ziel.setAttribute("tabindex", "-1");
        ziel.focus({ preventScroll: true });
      }
    });
  }

  /* ===========================================================
     Start
     =========================================================== */

  document.addEventListener("DOMContentLoaded", function () {
    ansichtVorbereiten();
    menueVorbereiten();
    dialogVorbereiten();
    grossansichtVorbereiten();
    statusAnzeigen();
    heutigenTagMarkieren();
    einblendenVorbereiten();
    scrollspyVorbereiten();
    scrollEffekte();
    nachObenVorbereiten();

    // Status aktuell halten, falls die Seite lange offen bleibt.
    setInterval(statusAnzeigen, 30000);
  });
})();
