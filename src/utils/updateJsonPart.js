// src/utils/updateJsonPart.js
import { getSchemasForPart } from './getSchema.js';

export function updateJsonPart(rawContent, pendingChanges, partKey) {
  const obj = JSON.parse(rawContent);
  const schemas = getSchemasForPart(partKey, rawContent) || [];
  const allFields = Object.assign({}, ...schemas.map(s => s.fields));

  for (const [field, newValue] of Object.entries(pendingChanges)) {
    const def = allFields[field];
    if (!def || !def.path) continue;

    // walk down to the parent of the target
    let target = obj;
    for (let i = 0; i < def.path.length - 1; i++) {
      const k = def.path[i];
      if (typeof target[k] !== 'object') target[k] = {};
      target = target[k];
    }

    // write the "min"
    const lastKey = def.path[def.path.length - 1];
    target[lastKey] = newValue;

    // **then** run the postUpdate if there is one
    if (typeof def.postUpdate === 'function') {
      def.postUpdate(obj, newValue);
    }
  }

  return JSON.stringify(obj, null, 2);
}
