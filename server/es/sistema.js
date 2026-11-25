'use strict';
// The billing software ("sistema informático de facturación") as it is reported in every VERI*FACTU record.
// The producer of the software is the publisher of OpenWerkstatt. Fill in the producer's tax ID before going live:
// a Spanish NIF in "nif", or for a producer without a Spanish NIF the EU VAT ID in "idOtro"
// (IDType "02" = NIF-IVA), e.g. { pais: 'DE', tipo: '02', id: 'DE123456789' }.
// Environment variables override the values (OPENWERKSTATT_SIF_NOMBRE, OPENWERKSTATT_SIF_NIF, OPENWERKSTATT_SIF_IDOTRO=DE:02:DE123456789).
const pkg = require('../../package.json');

function productor() {
  const env = process.env;
  let idOtro = null;
  if (env.OPENWERKSTATT_SIF_IDOTRO) { const [pais, tipo, id] = env.OPENWERKSTATT_SIF_IDOTRO.split(':'); idOtro = { pais, tipo, id }; }
  return {
    nombreRazon: env.OPENWERKSTATT_SIF_NOMBRE || 'Doc',
    nif: env.OPENWERKSTATT_SIF_NIF || '',
    idOtro: idOtro || null,
    nombreSistema: 'OpenWerkstatt',
    id: 'OW', // IdSistemaInformatico, 2 characters
    version: pkg.version,
  };
}

module.exports = { productor };
