// src/utils/jbeamParser2.js
import { getSchemasForPart } from './getSchema.js';

export function parseJbeam2(rawContent) {
  // 1) Strip out all single‐line comments (// …) so none of our regexes see them
  const content = rawContent.replace(/\/\/.*$/gm, '');

  // 2) Determine which schemas apply
  const partKeyMatch = content.match(/"camso_engine_[^"]+"/i);
  if (!partKeyMatch) {
    console.warn('Unable to determine part type');
    return null;
  }
  const partKey = partKeyMatch[0].replace(/"/g, '');
  const schemas = getSchemasForPart(partKey, content);
  if (!schemas || !Array.isArray(schemas)) {
    console.warn(`No schema array returned for part key: ${partKey}`);
    return null;
  }

  // 3) Run each schema’s regex against the **cleaned** content
  const extracted = {};
  for (const schema of schemas) {
    for (const [key, def] of Object.entries(schema.fields)) {
      const m = content.match(def.regex);
      if (m) {
        let v = m[1];
        if (def.type === 'boolean') v = v === 'true';
        if (def.type === 'number')  v = parseFloat(v);
        extracted[key] = v;
      } else {
        extracted[key] = def.canBeMissing ? def.default : null;
        if (!def.canBeMissing) console.warn(`Missing required field: ${key}`);
      }
    }
  }

  return {
    sourceKey: partKey,
    extracted,
    raw: rawContent
  };
}
