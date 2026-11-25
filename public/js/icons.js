'use strict';
// Line icons for the quick bar and the navigation: 24×24, drawn with the current text colour.
// icon('kunde') returns a <span class="ico"> with the SVG; unknown names give an empty span.

const ICONS = (() => {
  const file = '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/>';
  const clip = '<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 3h6v3H9z"/>';
  const tray = '<path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>';
  const car = '<path d="M5 17H3.5a1 1 0 0 1-1-1v-3.5l2-5A2 2 0 0 1 6.4 6h11.2a2 2 0 0 1 1.9 1.5l2 5V16a1 1 0 0 1-1 1H19"/><path d="M9 17h6M3 12h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>';
  // cog with 8 teeth, computed once
  const cog = (() => {
    const p = []; const n = 8;
    for (let i = 0; i < n; i++) {
      const a = i * 2 * Math.PI / n;
      for (const [d, r] of [[-0.24, 6.6], [-0.15, 9], [0.15, 9], [0.24, 6.6]]) p.push(`${(12 + r * Math.cos(a + d)).toFixed(2)} ${(12 + r * Math.sin(a + d)).toFixed(2)}`);
    }
    return `<path d="M${p.join('L')}z"/><circle cx="12" cy="12" r="3"/>`;
  })();
  return {
    start: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
    kunde: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    kundeNeu: '<circle cx="10" cy="8" r="4"/><path d="M2.5 21c0-4.4 3.4-7 7.5-7 1.6 0 3 .4 4.2 1"/><path d="M19 14v6M16 17h6"/>',
    fahrzeug: car,
    fahrzeugNeu: '<path d="M5 18H3.5a1 1 0 0 1-1-1v-3.5l2-5A2 2 0 0 1 6.4 7H13"/><path d="M19 13.5l1.5 0V17a1 1 0 0 1-1 1H19M9 18h6M3 13h12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M19 2.5v7M15.5 6h7"/>',
    artikel: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5"/>',
    arbeitswert: '<path d="M15 3.5a5 5 0 0 0-4.6 6.9l-6.9 6.9a2.1 2.1 0 0 0 3 3l6.9-6.9A5 5 0 0 0 20.2 8l-3 3-3.2-.8-.8-3.2 3-3A5 5 0 0 0 15 3.5z"/>',
    lieferant: '<path d="M13 16V5H2v11h2"/><path d="M13 8h4.5L21 12v4h-2M8 16h7"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    reifen: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',
    kalender: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7.5 14h.01M12 14h.01M16.5 14h.01M7.5 17.5h.01M12 17.5h.01"/>',
    aufgaben: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
    brief: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    zeiterfassung: '<circle cx="12" cy="14" r="7"/><path d="M12 14v-3.5M10 2.5h4M12 2.5V7M18.5 7.5 20 6"/>',
    stempeluhr: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    eingang: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
    lager: '<path d="M3 21V8l9-5 9 5v13"/><rect x="7" y="14" width="4" height="4"/><rect x="13" y="14" width="4" height="4"/><rect x="10" y="9.5" width="4" height="4"/>',
    lagerbewegung: '<path d="M4 8h15M15 4l4 4-4 4"/><path d="M20 16H5M9 12l-4 4 4 4"/>',
    inventur: clip + '<path d="M9 10.5h6M9 14h6M9 17.5h3"/>',
    erechnung: file + '<path d="m10 12-2 2.5 2 2.5M14 12l2 2.5-2 2.5"/>',
    angebot: file + '<path d="M8.5 13h4M8.5 16.5h2.5"/><path d="m13.5 18.5.4-2 3.6-3.6 1.6 1.6-3.6 3.6z"/>',
    auftrag: clip + '<path d="m9 13 2 2 4-4"/>',
    lieferschein: file + '<path d="M8.5 12.5h7M8.5 16h7M8.5 19h4"/>',
    rechnung: '<path d="M5 3h14v18l-2.3-1.5L14.4 21 12 19.5 9.6 21l-2.3-1.5L5 21z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>',
    korrektur: file + '<path d="M10 12.5 8 14.5l2 2"/><path d="M8 14.5h5a2 2 0 0 1 0 4h-1.5"/>',
    kasse: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8.5 6h7v3h-7z"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 17h.01M12 17h.01M15.5 17h.01"/>',
    fahrzeuglager: '<path d="M2 20V9l10-6 10 6v11"/><path d="M6 20v-9h12v9M6 14h12M6 17h12"/>',
    kaufvertrag: file + '<path d="M8 17.5c1.2-2.2 2.2-2.2 2.8-.2.5 1.6 1.4 1.6 2.3.2.8-1.2 1.6-1.2 2.4 0"/>',
    statistik: '<path d="M3.5 3.5v17h17"/><path d="M8 16.5v-5M12.5 16.5V7M17 16.5v-8"/>',
    kassenbuch: '<path d="M4 19.5v-15A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5zm0 0A1.5 1.5 0 0 0 5.5 21H20v-3"/><path d="M9 7.5h7M9 11h5"/>',
    zahlungen: '<path d="M3 9.5 12 4l9 5.5z"/><path d="M5.5 10v7.5M10 10v7.5M14 10v7.5M18.5 10v7.5M3 20.5h18"/>',
    op: '<path d="M6 3h12M6 21h12"/><path d="M7.5 3c0 5 4.5 6 4.5 9s-4.5 4-4.5 9M16.5 3c0 5-4.5 6-4.5 9s4.5 4 4.5 9"/>',
    rechnungsliste: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    mahnung: '<path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4.5M12 17h.01"/>',
    fibu: '<path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/>' + tray,
    termine: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
    umsatz: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    serienbriefe: '<rect x="5.5" y="7.5" width="16" height="12" rx="2"/><path d="m6 9.5 7.5 5 7.5-5"/><path d="M2.5 15.5V6.5a2 2 0 0 1 2-2h13"/>',
    leistungsgrad: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    einstellungen: cog,
    sicherung: '<path d="M4 19.5v-15A1.5 1.5 0 0 1 5.5 3H16l4 4v12.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5z"/><path d="M8 3v5h7V3M7.5 21v-7h9v7"/>',
    import: '<path d="M12 3.5V15M7.5 10.5 12 15l4.5-4.5"/>' + tray,
    datenimport: '<path d="M9 2.5v4.5M15 2.5v4.5"/><path d="M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v4.5"/>',
    auge: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    augeZu: '<path d="M10.6 5.6A9.5 9.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.4 3.2M6.6 6.6C3.9 8.3 2.5 12 2.5 12S6 18.5 12 18.5a9 9 0 0 0 5.4-1.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18"/>',
    waehrung: '<circle cx="9" cy="9" r="6"/><path d="M15.4 9.6a6 6 0 1 1-5.8 5.8"/><path d="M9 6.5v5M7.5 8h2.5"/>',
    anpassen: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  };
})();

function icon(name) {
  const s = document.createElement('span');
  s.className = 'ico';
  if (ICONS[name]) s.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  return s;
}
