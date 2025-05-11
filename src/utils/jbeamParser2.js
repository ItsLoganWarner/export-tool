// src/utils/jbeamParser2.js
import { getSchemasForPart } from './getSchema.js';

export function parseJbeam2(rawContent) {
  // 1) Strip comments
  const content = rawContent.replace(/\/\/.*$/gm, '');

  // 2) Find the JBEAM key
  const fullKeyMatch = content.match(/"camso_[^"]+"/i);
  if (!fullKeyMatch) {
    console.warn('Unable to determine part type');
    return null;
  }
  const fullKey = fullKeyMatch[0].slice(1, -1).toLowerCase();
  const partsArr = fullKey.replace(/^camso_/, '').split('_');
  const partType = partsArr.slice(0, -1).join('_'); // e.g. "engine" or "fueltank"

  // 3) Grab the relevant schemas
  const schemas = getSchemasForPart(fullKey, content);
  if (!schemas || !Array.isArray(schemas)) {
    console.warn(`No schema array returned for part key: ${fullKey}`);
    return null;
  }

  // 4) Extract each field
  const extracted = {};
  for (const schema of schemas) {
    for (const [key, def] of Object.entries(schema.fields)) {
      const loc = def.locations?.[partType];
      if (!loc) continue;

      // 🎯 Textarea (burnEfficiency) needs manual bracket-matching
      if (def.type === 'textarea') {
        // manually bracket-match the full array
        const keyPos = content.indexOf(`"${key}"`);
        if (keyPos === -1) {
          extracted[key] = def.default;
        } else {
          const start = content.indexOf('[', keyPos);
          let depth = 0, i = start;
          for (; i < content.length; i++) {
            if (content[i] === '[') depth++;
            else if (content[i] === ']') {
              depth--;
              if (depth === 0) break;
            }
          }
          let blob = content.slice(start, i + 1);
          // strip any trailing comma before the closing bracket
          blob = blob.replace(/,\s*]$/, ']');
          try {
            extracted[key] = JSON.parse(blob);
          } catch (e) {
            console.warn(`burnEfficiency parse failed:`, e);
            extracted[key] = def.default;
          }
        }
        continue;
      }

      // everything else via regex
      const m = content.match(loc.regex);
      let v = m
        ? m[1]
        : (def.canBeMissing ? def.default : null);

      if (m && def.type === 'boolean') v = (v === 'true');
      if (m && def.type === 'number')  v = parseFloat(v);

      extracted[key] = v;
    }
  }

  return {
    sourceKey: fullKey,
    extracted,
    raw: rawContent
  };
}
