/* Prüft die Geöffnet-Anzeige der neuen Seite: jeden Wochentag, die Minuten
   rund um Öffnen und Schließen, Feiertage und Ausnahmen.
   Aufruf: node werkzeuge/neu_zeit_pruefen.js   (braucht keinen Server) */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const NEU = path.join(__dirname, "..", "neu");
const kern = require(path.join(NEU, "js", "main.js"));
const kasten = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(NEU, "daten", "daten.js"), "utf8"), kasten);
const D = kasten.window.BELLERS;

let fehler = 0, zahl = 0;
function pruefe(name, ist, soll) {
  zahl++;
  if (ist !== soll) { fehler++; console.log("FEHLER  " + name + "\n   ist:  " + ist + "\n   soll: " + soll); }
}
const st = (j, m, tag, h, min, s) => kern.status(D, { j, m, tag, h, min }, s || "de");

/* Woche vom 16. bis 22. November 2026: Montag bis Sonntag, kein Feiertag */
pruefe("Mo 10:00", st(2026, 11, 16, 10, 0).text, "Heute Ruhetag · öffnet morgen um 8:00 Uhr");
pruefe("Mo 10:00 offen?", st(2026, 11, 16, 10, 0).offen, false);
for (const tag of [17, 18, 19, 20]) {
  pruefe(tag + ". 07:59 zu", st(2026, 11, tag, 7, 59).offen, false);
  pruefe(tag + ". 07:59", st(2026, 11, tag, 7, 59).text, "Geschlossen · öffnet in 1 Min");
  pruefe(tag + ". 08:00 offen", st(2026, 11, tag, 8, 0).offen, true);
  pruefe(tag + ". 12:00", st(2026, 11, tag, 12, 0).text, "Jetzt geöffnet · bis 17:00 Uhr");
  pruefe(tag + ". 16:59 offen", st(2026, 11, tag, 16, 59).offen, true);
  pruefe(tag + ". 16:59", st(2026, 11, tag, 16, 59).text, "Jetzt geöffnet · schließt in 1 Min");
  pruefe(tag + ". 17:00 zu", st(2026, 11, tag, 17, 0).offen, false);
}
pruefe("Di 06:00", st(2026, 11, 17, 6, 0).text, "Geschlossen · öffnet heute um 8:00 Uhr");
pruefe("Di 18:00", st(2026, 11, 17, 18, 0).text, "Geschlossen · öffnet morgen um 8:00 Uhr");
pruefe("Fr 18:00", st(2026, 11, 20, 18, 0).text, "Geschlossen · öffnet morgen um 8:30 Uhr");
for (const tag of [21, 22]) {
  pruefe(tag + ". 08:00 zu", st(2026, 11, tag, 8, 0).offen, false);
  pruefe(tag + ". 08:29 zu", st(2026, 11, tag, 8, 29).offen, false);
  pruefe(tag + ". 08:30 offen", st(2026, 11, tag, 8, 30).offen, true);
  pruefe(tag + ". 16:59 offen", st(2026, 11, tag, 16, 59).offen, true);
  pruefe(tag + ". 17:00 zu", st(2026, 11, tag, 17, 0).offen, false);
}
pruefe("Sa 18:00", st(2026, 11, 21, 18, 0).text, "Geschlossen · öffnet morgen um 8:30 Uhr");
pruefe("So 18:00", st(2026, 11, 22, 18, 0).text, "Geschlossen · öffnet Dienstag um 8:00 Uhr");
pruefe("So 18:00 en", st(2026, 11, 22, 18, 0, "en").offen, false);

/* Feiertage in Bayern 2026 und 2027 */
const soll26 = ["1.1", "6.1", "3.4", "6.4", "1.5", "14.5", "25.5", "4.6", "15.8", "3.10", "1.11", "25.12", "26.12"];
const f26 = kern.feiertage(2026), liste = Array.isArray(f26) ? f26 : Object.keys(f26);
pruefe("Anzahl Feiertage 2026", liste.length, soll26.length);
for (const [m, tag, name] of [[1, 1, "Neujahr"], [1, 6, "Dreikönig"], [4, 3, "Karfreitag"], [4, 6, "Ostermontag"], [5, 1, "1. Mai"],
  [5, 14, "Himmelfahrt"], [5, 25, "Pfingstmontag"], [6, 4, "Fronleichnam"], [8, 15, "Mariä Himmelfahrt"], [10, 3, "Tag der Einheit"],
  [11, 1, "Allerheiligen"], [12, 25, "1. Weihnachtstag"], [12, 26, "2. Weihnachtstag"]])
  pruefe("2026 " + name, kern.zeitenAm(D, 2026, m, tag).art, "feiertag");
for (const [m, tag, name] of [[3, 26, "Karfreitag"], [3, 29, "Ostermontag"], [5, 6, "Himmelfahrt"], [5, 17, "Pfingstmontag"], [5, 27, "Fronleichnam"]])
  pruefe("2027 " + name, kern.zeitenAm(D, 2027, m, tag).art, "feiertag");
pruefe("kein Feiertag: 2.1.2026", kern.zeitenAm(D, 2026, 1, 2).art, "wochentag");
pruefe("kein Feiertag: 24.12.2026", kern.zeitenAm(D, 2026, 12, 24).art, "wochentag");

/* Feiertag an einem Montag (Ostermontag 6.4.2026): es gelten die Feiertagszeiten */
pruefe("Ostermontag 10:00 offen", st(2026, 4, 6, 10, 0).offen, true);
pruefe("Ostermontag 08:15 zu", st(2026, 4, 6, 8, 15).offen, false);
/* Feiertag an einem Dienstag (Dreikönig 6.1.2026): 8:30 statt 8:00 */
pruefe("Dreikönig 08:10 zu", st(2026, 1, 6, 8, 10).offen, false);

/* Ausnahmen: ein geschlossener Tag und geänderte Zeiten */
const kopie = JSON.parse(JSON.stringify(D));
kopie.oeffnungszeiten.ausnahmen = { "2026-11-18": null, "2026-11-19": ["10:00", "14:00"] };
const sk = (tag, h, min) => kern.status(kopie, { j: 2026, m: 11, tag, h, min }, "de");
pruefe("Ausnahme zu: Mi 12:00", sk(18, 12, 0).offen, false);
pruefe("Ausnahme Zeiten: Do 09:00 zu", sk(19, 9, 0).offen, false);
pruefe("Ausnahme Zeiten: Do 10:00 offen", sk(19, 10, 0).offen, true);
pruefe("Ausnahme Zeiten: Do 14:00 zu", sk(19, 14, 0).offen, false);
pruefe("Di 18:00 vor geschlossenem Mi", sk(17, 18, 0).text, "Geschlossen · öffnet Donnerstag um 10:00 Uhr");

/* Jahreswechsel und Monatsende */
pruefe("31.12.2026 (Do) 18:00", st(2026, 12, 31, 18, 0).text, "Geschlossen · öffnet morgen um 8:30 Uhr");
pruefe("28.2.2027 (So) 18:00", st(2027, 2, 28, 18, 0).text, "Geschlossen · öffnet Dienstag um 8:00 Uhr");

console.log(zahl + " Prüfungen, " + fehler + " Fehler");
if (fehler) process.exit(1); else console.log("Alles in Ordnung.");
