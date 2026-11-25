# Mitmachen

[English](CONTRIBUTING.md) · **Deutsch**

Fehlerberichte und Verbesserungen sind willkommen, gern als Issue oder Pull Request.

## Lizenz der Beiträge

OpenWerkstatt steht vollständig unter der GNU AGPL 3.0.

Mit einem Pull Request bestätigen Sie, dass Sie den Beitrag selbst geschrieben haben bzw.
weitergeben dürfen, und dass er unter der AGPL 3.0 veröffentlicht wird.

## Regeln

- Keine Kunden-, Firmen- oder Kassendaten ins Repository, auch nicht in Tests. Testdaten sind erfunden.
- Keine npm-Abhängigkeiten ohne vorherige Absprache. OpenWerkstatt braucht nur Node.js.
- Vor dem Pull Request `npm test` ausführen.
- Kommentare im Code und Commit-Nachrichten auf Englisch schreiben.
- Neue Texte der Oberfläche auf Deutsch schreiben und in `public/js/lang/en.js` und `es.js` übersetzen. `node tools/i18n/missing.js` zeigt, was noch fehlt. Werte im Text werden zu `{0}`, `{1}` …, die Übersetzung braucht dieselben Platzhalter.
