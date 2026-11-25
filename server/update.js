'use strict';
// Update notice: asks GitHub at most once a day for the newest OpenWerkstatt release and compares it with the
// installed version. Only the public release information is fetched; no data from OpenWerkstatt is sent.
// Nothing is ever installed automatically.
//   Setting "update.pruefen" (per tenant, default on) switches the daily check off.
//   Environment variable OPENWERKSTATT_UPDATE_CHECK=0 switches it off completely (offline installations,
//   software distribution), including the "check now" button.
const L = require('./lib');
const pkg = require('../package.json');

const API = 'https://api.github.com/repos/TherapyCenter/OpenWerkstatt/releases/latest';
const SEITE = 'https://github.com/TherapyCenter/OpenWerkstatt/releases/latest';
const ALLE_MS = 24 * 3600e3;      // ask again after one day
const FEHLER_MS = 3600e3;         // after an error (e.g. offline) try again after one hour
const JETZT_MS = 60e3;            // "check now" at most once a minute

let stand = null;                 // { neueste, name, url, datum, zeit, fehler }
let laeuft = null;

// "v2.1.0" → [2, 1, 0]; pre-releases ("2.1.0-beta.1") count lower than the release
function teile(v) {
  const [kern, vor] = String(v || '').trim().replace(/^v/i, '').split('-', 2);
  return { n: kern.split('.').map(x => parseInt(x, 10) || 0), vor: vor || '' };
}
function neuer(a, b) {        // true if version a is newer than version b
  const x = teile(a), y = teile(b);
  for (let i = 0; i < Math.max(x.n.length, y.n.length, 3); i++) {
    const d = (x.n[i] || 0) - (y.n[i] || 0);
    if (d) return d > 0;
  }
  return !x.vor && !!y.vor;
}

const gesperrt = () => process.env.OPENWERKSTATT_UPDATE_CHECK === '0';
const aktiv = () => !gesperrt() && L.sw('update.pruefen', '1') !== '0';

// Fallback when the API limit (60 requests per hour and IP address) is used up: the release page
// ".../releases/latest" redirects to ".../releases/tag/v2.1.0"; this does not count towards the limit.
async function ausWeiterleitung() {
  const r = await fetch(SEITE, { method: 'HEAD', redirect: 'manual', headers: { 'User-Agent': 'OpenWerkstatt' }, signal: AbortSignal.timeout(15000) });
  const ziel = (r.headers && r.headers.get && r.headers.get('location')) || '';
  const m = /^https:\/\/github\.com\/TherapyCenter\/OpenWerkstatt\/releases\/tag\/([^/?#]+)$/.exec(ziel);
  if (!m) throw new Error(`HTTP ${r.status}`);
  return { tag_name: decodeURIComponent(m[1]), html_url: ziel };
}

async function abrufen() {
  if (laeuft) return laeuft;
  laeuft = (async () => {
    try {
      const r = await fetch(API, { headers: { 'User-Agent': 'OpenWerkstatt', Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(15000) });
      if (!r.ok && r.status !== 403 && r.status !== 429) throw new Error(`HTTP ${r.status}`);
      const j = r.ok ? await r.json() : await ausWeiterleitung();
      if (!j || !j.tag_name) throw new Error('unerwartete Antwort von GitHub');
      // only ever link to our own release pages
      const url = /^https:\/\/github\.com\/TherapyCenter\/OpenWerkstatt\/releases\//.test(j.html_url || '') ? j.html_url : SEITE;
      stand = { neueste: String(j.tag_name).replace(/^v/i, ''), name: j.name || '', url, datum: (j.published_at || '').slice(0, 10), zeit: Date.now(), fehler: null };
    } catch (e) {
      stand = { ...(stand || {}), zeit: Date.now(), fehler: e.message };
    }
  })().finally(() => { laeuft = null; });
  return laeuft;
}

// Current state for the user interface. jetzt = check right away (button in the settings).
async function status({ jetzt = false } = {}) {
  const out = { version: pkg.version, aktiv: aktiv(), gesperrt: gesperrt(), seite: SEITE };
  if (gesperrt() || (!out.aktiv && !jetzt)) return out;
  const alter = stand ? Date.now() - stand.zeit : Infinity;
  if (jetzt ? alter > JETZT_MS : alter > (stand && stand.fehler ? FEHLER_MS : ALLE_MS)) await abrufen();
  if (!stand) return out;
  return {
    ...out,
    neueste: stand.neueste || null,
    name: stand.name || '',
    url: stand.url || SEITE,
    datum: stand.datum || '',
    geprueft: stand.zeit ? new Date(stand.zeit).toISOString() : null,
    fehler: stand.fehler || null,
    neu: !!stand.neueste && neuer(stand.neueste, pkg.version),
  };
}

module.exports = { status, neuer, _reset: () => { stand = null; } };
