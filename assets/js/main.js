/* b.ellers – kleine Helfer für die Website.
   Alles optional: Ohne JavaScript bleibt die Seite vollständig lesbar. */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Öffnungszeiten an einer Stelle gepflegt.
     Reihenfolge: 0 = Sonntag, 1 = Montag, ... 6 = Samstag.
     null bedeutet Ruhetag. Zeiten in Minuten seit Mitternacht.
     WICHTIG: Wenn sich die Öffnungszeiten ändern, hier UND in der
     Tabelle in index.html anpassen.
     --------------------------------------------------------------- */
  var OEFFNUNGSZEITEN = [
    { von: "08:00", bis: "17:00" }, // Sonntag
    null,                            // Montag – Ruhetag
    { von: "07:00", bis: "17:00" }, // Dienstag
    { von: "07:00", bis: "17:00" }, // Mittwoch
    { von: "07:00", bis: "17:00" }, // Donnerstag
    { von: "07:00", bis: "17:00" }, // Freitag
    { von: "08:00", bis: "17:00" }  // Samstag
  ];

  var TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  function inMinuten(hhmm) {
    var t = hhmm.split(":");
    return parseInt(t[0], 10) * 60 + parseInt(t[1], 10);
  }

  function ohneNull(hhmm) {
    // "07:00" → "7:00 Uhr" (so steht es auch in der Tabelle)
    return hhmm.replace(/^0/, "") + " Uhr";
  }

  /* Ermittelt den aktuellen Status anhand der Uhrzeit des Besuchergeräts. */
  function status(jetzt) {
    var tag = jetzt.getDay();
    var minuten = jetzt.getHours() * 60 + jetzt.getMinutes();
    var heute = OEFFNUNGSZEITEN[tag];

    if (heute && minuten >= inMinuten(heute.von) && minuten < inMinuten(heute.bis)) {
      return { offen: true, text: "Jetzt geöffnet · bis " + ohneNull(heute.bis) };
    }

    // Öffnet es heute noch?
    if (heute && minuten < inMinuten(heute.von)) {
      return { offen: false, text: "Gerade geschlossen · öffnet heute um " + ohneNull(heute.von) };
    }

    // Nächsten geöffneten Tag suchen
    for (var i = 1; i <= 7; i++) {
      var t = (tag + i) % 7;
      var z = OEFFNUNGSZEITEN[t];
      if (z) {
        var name = (i === 1) ? "morgen" : TAGE[t];
        return { offen: false, text: "Gerade geschlossen · öffnet " + name + " um " + ohneNull(z.von) };
      }
    }
    return { offen: false, text: "Gerade geschlossen" };
  }

  function statusAnzeigen() {
    var el = document.querySelector("[data-status]");
    if (!el) return;

    var s = status(new Date());
    el.classList.remove("ist-offen", "ist-zu");
    el.classList.add(s.offen ? "ist-offen" : "ist-zu");
    el.innerHTML = '<span class="status-punkt"></span><span></span>';
    el.lastElementChild.textContent = s.text;
    el.hidden = false;
  }

  /* Hebt in der Öffnungszeiten-Tabelle die heutige Zeile hervor.
     Jede Zeile nennt über data-tage die Wochentage, für die sie gilt. */
  function heutigenTagMarkieren() {
    var heute = new Date().getDay();
    document.querySelectorAll("tr[data-tage]").forEach(function (zeile) {
      var tage = zeile.getAttribute("data-tage").split(",");
      if (tage.indexOf(String(heute)) !== -1) {
        zeile.classList.add("heute");
      }
    });
  }

  /* Mobiles Menü */
  function menueVorbereiten() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", function () {
      var offen = links.classList.toggle("offen");
      toggle.setAttribute("aria-expanded", offen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("offen");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Abschnitte sanft einblenden, sobald sie in den Sichtbereich kommen.

     Grundsatz: Inhalt darf niemals dauerhaft unsichtbar sein. Deshalb
     - wird der Versteck-Zustand per CSS nur aktiv, wenn wir die Klasse
       "anim-bereit" setzen (siehe style.css),
     - blendet ein Sicherheits-Timer nach 2,5 s alles ein, falls der
       Beobachter aus irgendeinem Grund nicht auslöst,
     - und ein Fehler in dieser Funktion macht ebenfalls alles sichtbar. */
  function einblendenVorbereiten() {
    var elemente = document.querySelectorAll(".einblenden");
    if (!elemente.length) return;

    function allesZeigen() {
      elemente.forEach(function (el) { el.classList.add("sichtbar"); });
    }

    var wenigerBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (wenigerBewegung || !("IntersectionObserver" in window)) {
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

  document.addEventListener("DOMContentLoaded", function () {
    menueVorbereiten();
    statusAnzeigen();
    heutigenTagMarkieren();
    einblendenVorbereiten();
    // Status aktuell halten, falls die Seite lange offen bleibt
    setInterval(statusAnzeigen, 60000);
  });
})();
