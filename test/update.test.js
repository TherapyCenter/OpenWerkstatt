'use strict';
// Tests of the update notice (without internet: GitHub is replaced by a fake fetch)
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'openwerkstatt-update-'));
process.env.OPENWERKSTATT_DATA = tmp;

const dbm = require('../server/db');
const L = require('../server/lib');
const U = require('../server/update');
const pkg = require('../package.json');

const echtesFetch = global.fetch;
let abrufe = 0;
function github(antwort, status = 200) {
  global.fetch = async () => { abrufe++; return { ok: status === 200, status, json: async () => antwort }; };
}

test.beforeEach(() => { U._reset(); abrufe = 0; delete process.env.OPENWERKSTATT_UPDATE_CHECK; dbm.get(); L.setSw('update.pruefen', '1'); });
test.after(() => { global.fetch = echtesFetch; dbm.closeAll(); fs.rmSync(tmp, { recursive: true, force: true }); });

test('Versionsvergleich', () => {
  assert.ok(U.neuer('2.0.1', '2.0.0'));
  assert.ok(U.neuer('v2.1.0', '2.0.9'));
  assert.ok(U.neuer('10.0.0', '9.9.9'), 'numerisch, nicht als Text');
  assert.ok(U.neuer('2.1', '2.0.5'));
  assert.ok(U.neuer('2.0.0', '2.0.0-beta.1'), 'Release ist neuer als Vorabversion');
  assert.ok(!U.neuer('2.0.0', '2.0.0'));
  assert.ok(!U.neuer('1.9.0', '2.0.0'));
  assert.ok(!U.neuer('2.0.0-beta.1', '2.0.0'));
});

test('neuere Version wird gemeldet und nur einmal am Tag abgefragt', async () => {
  github({ tag_name: 'v99.0.0', name: 'OpenWerkstatt 99.0.0', html_url: 'https://github.com/TherapyCenter/OpenWerkstatt/releases/tag/v99.0.0', published_at: '2026-12-01T10:00:00Z' });
  const r = await U.status();
  assert.strictEqual(r.neu, true);
  assert.strictEqual(r.neueste, '99.0.0');
  assert.strictEqual(r.version, pkg.version);
  assert.strictEqual(r.datum, '2026-12-01');
  assert.strictEqual(r.url, 'https://github.com/TherapyCenter/OpenWerkstatt/releases/tag/v99.0.0');
  await U.status();
  assert.strictEqual(abrufe, 1, 'zweiter Aufruf aus dem Zwischenspeicher');
});

test('gleiche Version: kein Hinweis; fremde Links werden nicht übernommen', async () => {
  github({ tag_name: 'v' + pkg.version, html_url: 'https://example.com/boese' });
  const r = await U.status();
  assert.strictEqual(r.neu, false);
  assert.strictEqual(r.url, 'https://github.com/TherapyCenter/OpenWerkstatt/releases/latest');
});

test('abgeschaltet: kein Abruf, „Jetzt prüfen“ geht trotzdem', async () => {
  github({ tag_name: 'v99.0.0' });
  L.setSw('update.pruefen', '0');
  const r = await U.status();
  assert.strictEqual(r.aktiv, false);
  assert.strictEqual(r.neu, undefined);
  assert.strictEqual(abrufe, 0);
  assert.strictEqual((await U.status({ jetzt: true })).neu, true);
  assert.strictEqual(abrufe, 1);
});

test('OPENWERKSTATT_UPDATE_CHECK=0 sperrt auch „Jetzt prüfen“', async () => {
  github({ tag_name: 'v99.0.0' });
  process.env.OPENWERKSTATT_UPDATE_CHECK = '0';
  const r = await U.status({ jetzt: true });
  assert.strictEqual(r.gesperrt, true);
  assert.strictEqual(abrufe, 0);
});

test('API-Limit erreicht: Version aus der Weiterleitung der Release-Seite', async () => {
  global.fetch = async (url) => {
    abrufe++;
    if (String(url).includes('api.github.com')) return { ok: false, status: 403 };
    return { ok: false, status: 302, headers: new Headers({ location: 'https://github.com/TherapyCenter/OpenWerkstatt/releases/tag/v99.1.0' }) };
  };
  const r = await U.status();
  assert.strictEqual(r.neu, true);
  assert.strictEqual(r.neueste, '99.1.0');
  assert.strictEqual(r.url, 'https://github.com/TherapyCenter/OpenWerkstatt/releases/tag/v99.1.0');
  assert.strictEqual(abrufe, 2);
});

test('ohne Internet: Fehler wird gemeldet, kein Absturz', async () => {
  global.fetch = async () => { abrufe++; throw new Error('getaddrinfo ENOTFOUND api.github.com'); };
  const r = await U.status();
  assert.match(r.fehler, /ENOTFOUND/);
  assert.ok(!r.neu);
});
