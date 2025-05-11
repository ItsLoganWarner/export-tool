// src/utils/getSchema.js
import general    from '../schemas/engine/general.schema';
import exhaust    from '../schemas/engine/exhaust.schema';
import afterfire  from '../schemas/engine/afterfire.schema';
import turbo      from '../schemas/engine/forcedInduction/turbocharger.schema';
import superchrg  from '../schemas/engine/forcedInduction/supercharger.schema';
import fuelSchema from '../schemas/engine/fuel.schema';

const allSchemas = { general, exhaust, afterfire, turbo, superchrg, fuelSchema };

export function getSchemasForPart(partKey, rawContent) {
  const normalized = partKey.toLowerCase();
  const out = [];

  if (normalized.startsWith('camso_engine')) {
    out.push(general, exhaust, afterfire);
    if (rawContent.includes('"turbocharger"')) out.push(turbo);
    if (rawContent.includes('"supercharger"')) out.push(superchrg);
  }
  if (normalized.startsWith('camso_fuel_tank')) {
    out.push(fuelSchema);
  }
  return out;
}
