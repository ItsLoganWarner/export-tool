import { getSchemaForPart } from './getSchema.js';

export function parseJbeam2(rawContent) {
  const partKeyMatch = rawContent.match(/"camso_engine_[^"]+"/);
  if (!partKeyMatch) {
    console.warn('Unable to determine part type');
    return null;
  }

  const partKey = partKeyMatch[0].replace(/"/g, '');
  const schema = getSchemaForPart(partKey);
  if (!schema) {
    console.warn(`No schema found for part key: ${partKey}`);
    return null;
  }

  const extracted = {};
  const fields = schema.fields;

  for (const [key, { regex, type, canBeMissing, default: defaultValue }] of Object.entries(fields)) {
    const match = rawContent.match(regex);
    
    if (match) {
      let value = match[1];
      if (type === 'boolean') value = value === 'true';
      if (type === 'number') value = parseFloat(value);
      extracted[key] = value;
    } else {
      if (canBeMissing) {
        extracted[key] = defaultValue;
      } else {
        extracted[key] = null; // or throw, depending on strictness
        console.warn(`Missing required field: ${key}`);
      }
    }
  }

  return {
    sourceKey: partKey,
    extracted,
    raw: rawContent
  };
}
