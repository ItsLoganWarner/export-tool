import afterfireSchema from '../schemas/engine/afterfire.schema.js';

export function updateJbeam(rawContent, pendingChanges) {
  // 1) strip comments so we don’t accidentally match commented‐out lines
  const clean = rawContent.replace(/\/\/.*$/gm, '');
  const lines = rawContent.split('\n');

  const { prefix, fields } = afterfireSchema;

  for (const [key, newValue] of Object.entries(pendingChanges)) {
    // serialize
    const serialized =
      typeof newValue === 'string'
        ? `"${newValue}"`
        : (newValue === null ? 'null' : String(newValue));

    // match *actual* assignment lines
    const pattern = new RegExp(
      `(^[ \\t]*"${key}"\\s*:\\s*)(?:"[^"]*"|[^,\\r\\n]+)(,?)`,
      'm'
    );

    const joined = lines.join('\n');
    if (pattern.test(joined)) {
      // replace existing line
      for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
          lines[i] = lines[i].replace(pattern, `$1${serialized}$2`);
          break;
        }
      }
    } else if (fields[key]) {
      // no existing line & it’s an AfterFire field → insert under its insertUnder block
      const insertUnder = afterfireSchema.fields[key].insertUnder;
      // find the last occurrence of any field in that insertUnder group
      const idx = lines
        .map((l, i) => ({l, i}))
        .filter(({l}) => l.includes(`"${insertUnder}"`))
        .map(o => o.i)
        .pop();
      if (idx != null) {
        // preserve the indentation of that block
        const indent = (lines[idx].match(/^(\s*)/) || [''])[1];
        lines.splice(idx + 1, 0, `${indent}"${key}": ${serialized},`);
      }
    }
  }

  return lines.join('\n');
}
