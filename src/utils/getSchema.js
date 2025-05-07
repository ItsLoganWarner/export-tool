import camsoEngine from '../schemas/camso_engine.schema.js';

export function getSchemaForPart(partKey) {
  if (partKey.startsWith("Camso_Engine")) return camsoEngine;
  // future support: add turbo, intake, transmission, etc.
  return null;
}
