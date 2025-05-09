import general from '../schemas/engine/general.schema';
import afterfire from '../schemas/engine/afterfire.schema';
import exhaust from '../schemas/engine/exhaust.schema';
import turbocharger from '../schemas/engine/forcedInduction/turbocharger.schema';
import supercharger from '../schemas/engine/forcedInduction/supercharger.schema';

export function getSchemasForPart(partKey, rawContent) {
  const normalized = partKey.toLowerCase();
  const baseSchemas = [general, afterfire, exhaust];
  const extraSchemas = [];

  if (rawContent?.includes('"turbocharger"')) extraSchemas.push(turbocharger);
  if (rawContent?.includes('"supercharger"')) extraSchemas.push(supercharger);

  if (normalized.startsWith("camso_engine")) {
    return [...baseSchemas, ...extraSchemas];
  }

  return [];
}
