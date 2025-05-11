// src/utils/updateJbeam.js
import { getSchemasForPart } from './getSchema.js';

export function updateJbeam(rawContent, pendingChanges) {
  // Strip comments so our regexes only see real code
  const content = rawContent.replace(/\/\/.*$/gm, '');
  const lines = rawContent.split('\n');

  // Figure out the full JBEAM key (e.g. "camso_engine_b420f")
  const keyMatch = content.match(/"camso_[^"]+"/i);
  const fullKey = keyMatch ? keyMatch[0].slice(1, -1).toLowerCase() : null;
  // derive short partType: "engine" or "fuel_tank"
  const partsArr = fullKey?.replace(/^camso_/, '').split('_') || [];
  const partType = partsArr.slice(0, -1).join('_');

  // Grab exactly the same schemas your parser used
  const schemas = fullKey
    ? getSchemasForPart(fullKey, content)
    : [];

  // Flatten all fields across those schemas
  const allFields = Object.assign(
    {},
    ...schemas.map(s => s.fields)
  );

  for (const [field, newValue] of Object.entries(pendingChanges)) {
    const def = allFields[field];
    if (!def) continue; // unexpected field

    // Serialize the new value
    const serialized =
      typeof newValue === 'string'
        ? `"${newValue}"`
        : (newValue === null ? 'null' : String(newValue));

    // Pick the location-specific regex & anchor for this partType
    const loc = def.locations?.[partType];
    if (!loc) continue;
    const regex = loc.regex;
    const insertUnder = loc.insertUnder;

    // Build a generic replacement pattern (match any existing value)
    const pattern = new RegExp(
      `(^\\s*"${field}"\\s*:\\s*)(?:"[^"]*"|[^,\\r\\n]+)(,?)`,
      'm'
    );

    const joined = lines.join('\n');
    if (pattern.test(joined)) {
      // Replace existing line
      for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
          lines[i] = lines[i].replace(pattern, `$1${serialized}$2`);
          break;
        }
      }
    } else {
      // Insert under the last occurrence of the anchor
      const idx = lines
        .map((l, i) => ({ l, i }))
        .filter(({ l }) => l.includes(`"${insertUnder}"`))
        .map(o => o.i)
        .pop();
      if (idx != null) {
        const indent = (lines[idx].match(/^(\s*)/) || [''])[1];
        lines.splice(idx + 1, 0, `${indent}"${field}": ${serialized},`);
      }
    }
  }

  return lines.join('\n');
}
