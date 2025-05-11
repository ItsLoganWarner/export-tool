// src/utils/updateJbeam.js
import { getSchemasForPart } from './getSchema.js';

export function updateJbeam(rawContent, pendingChanges) {
  // 1) Strip comments & split into lines
  const content = rawContent.replace(/\/\/.*$/gm, '');
  let lines     = rawContent.split('\n');

  // 2) Figure out partType
  const fullKeyMatch = content.match(/"camso_[^"]+"/i);
  const fullKey      = fullKeyMatch
    ? fullKeyMatch[0].slice(1, -1).toLowerCase()
    : '';
  const partType = fullKey
    .replace(/^camso_/, '')
    .split('_')
    .slice(0, -1)
    .join('_');

  // 3) Load & flatten schemas
  const schemas   = getSchemasForPart(fullKey, content) || [];
  const allFields = Object.assign({}, ...schemas.map(s => s.fields));

  // 4) SPECIAL‐CASE burnEfficiency: clear out the old block, insert the new array
  if (pendingChanges.burnEfficiency != null && partType === 'engine') {
    const arr = pendingChanges.burnEfficiency;           // [ [x,y], … ]
    const field = 'burnEfficiency';
    const def   = allFields[field];
    const loc   = def?.locations?.[partType];
    if (loc) {
      // find opening line
      const startIdx = lines.findIndex(l => l.includes(`"${field}"`));
      if (startIdx >= 0) {
        // scan forward until bracket-depth returns to zero
        let depth  = 0, endIdx = startIdx;
        for (let i = startIdx; i < lines.length; i++) {
          for (const ch of lines[i]) {
            if (ch === '[') depth++;
            if (ch === ']') depth--;
          }
          if (depth === 0) { endIdx = i; break; }
        }

        // compute indentation
        const indent    = (lines[startIdx].match(/^(\s*)/) || [''])[1];
        const openLine  = `${indent}"${field}": [`;
        const closeLine = `${indent}],`;

        // build each inner line as "[0.00, 1.00],"
        const bodyLines = arr.map(([x,y]) =>
          `${indent}  [${x.toFixed(2)}, ${y.toFixed(2)}],`
        );

        // splice out old block & splice in new
        lines.splice(
          startIdx,
          endIdx - startIdx + 1,
          openLine,
          ...bodyLines,
          closeLine
        );
      }
    }
    // remove it so we don’t re-handle in step 5
    delete pendingChanges.burnEfficiency;
  }

  // 5) Now handle every other pendingChange (including fuel‐type) via regex‐driven replace/insert
  for (const [field, newValue] of Object.entries(pendingChanges)) {
    const def = allFields[field];
    if (!def) continue;
    const loc = def.locations?.[partType];
    if (!loc) continue;

    // derive the real JSON key from the regex, e.g. /"energyType"/ → "energyType"
    const propMatch = loc.regex.toString().match(/^\/"([^"]+)"/);
    const propName  = propMatch ? propMatch[1] : field;
    const serialized = (typeof newValue === 'string')
      ? `"${newValue}"`
      : JSON.stringify(newValue);

    // 5a) Try replacing an existing line
    const replacePattern = new RegExp(
      `(^\\s*"${propName}"\\s*:\\s*)(?:"[^"]*"|[^,\\r\\n]+)(,?)`,
      'm'
    );
    const joined = lines.join('\n');
    if (replacePattern.test(joined)) {
      for (let i = 0; i < lines.length; i++) {
        if (replacePattern.test(lines[i])) {
          lines[i] = lines[i].replace(replacePattern, `$1${serialized}$2`);
          break;
        }
      }
    }
    // 5b) Otherwise insert under the anchor
    else if (loc.insertUnder) {
      const idx = lines
        .map((l,i) => ({ l,i }))
        .filter(o => o.l.includes(`"${loc.insertUnder}"`))
        .map(o => o.i)
        .pop();
      if (idx != null) {
        const baseIndent = (lines[idx].match(/^(\s*)/) || [''])[1];
        lines.splice(idx+1, 0, `${baseIndent}"${propName}": ${serialized},`);
      }
    }

    // 5c) run any postUpdate hook
    if (typeof def.postUpdate === 'function') {
      def.postUpdate(lines, newValue);
    }
  }

  // 6) Return the fully updated content
  return lines.join('\n');
}
