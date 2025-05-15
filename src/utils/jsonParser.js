// src/utils/jsonParser.js
import { getSchemasForPart } from './getSchema.js';

export function parseJsonPart(rawContent, partKey) {
  // parse the full JSON
  const root = JSON.parse(rawContent);
  let data = root;

  // if this is our DriveModes file, unwrap the real slot before schema extraction
  if (
    partKey.toLowerCase().includes('drivemodes') &&
    !partKey.toLowerCase().includes('_default_') &&
    !partKey.toLowerCase().includes('_ev_')
  ) {
    // only pick the one whose driveModes.modes exists
    const slotKey = Object.keys(root).find(k =>
      root[k] &&
      root[k].driveModes &&
      typeof root[k].driveModes.modes === 'object'
    );
    if (slotKey) {
      data = root[slotKey];
    }
  }

  const schemas = getSchemasForPart(partKey, rawContent) || [];
  const extracted = {};

  for (const schema of schemas) {
    for (const [field, def] of Object.entries(schema.fields)) {
      // def.path is an array of nested keys, e.g. ['Years','min']
      const val = def.path.reduce((o, k) => (o && o[k] != null) ? o[k] : undefined, data);
      extracted[field] = val != null ? val : def.default;
    }
  }

  return { sourceKey: partKey, extracted, raw: rawContent };
}
