// src/utils/jsonParser.js
import { getSchemasForPart } from './getSchema.js';

export function parseJsonPart(rawContent, partKey) {
  const data = JSON.parse(rawContent);
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
