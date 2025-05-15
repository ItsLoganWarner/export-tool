// src/utils/updateJsonPart.js
import { getSchemasForPart } from './getSchema.js';

export function updateJsonPart(rawContent, pendingChanges, partKey) {
  // 1) Parse the file
  const root = JSON.parse(rawContent);

  // 2) Grab your schemas
  const schemas = getSchemasForPart(partKey, rawContent) || [];
  const allFields = Object.assign({}, ...schemas.map(s => s.fields));

  // 3) Find the main "Camso_DriveModes_*" slot so we can patch driveModes.* directly
  const slotKey = Object.keys(root).find(
    k => root[k]?.driveModes && root[k].driveModes.modes
  );
  const driveSlot = slotKey ? root[slotKey].driveModes : null;

  // 4) Apply every pending change
  for (const [field, newValue] of Object.entries(pendingChanges)) {
    const def = allFields[field];

    if (def && def.path) {
      // ── Schemaed field (enabledModes/defaultMode) ──
      // If the path starts at "driveModes", we must apply inside the slot:
      let target = (def.path[0] === 'driveModes' && slotKey)
        ? root[slotKey]
        : root;

      // Drill down to the parent of the final key
      for (let i = 0; i < def.path.length - 1; i++) {
        const k = def.path[i];
        if (typeof target[k] !== 'object') target[k] = {};
        target = target[k];
      }

      // Write the new value
      const lastKey = def.path[def.path.length - 1];
      target[lastKey] = newValue;

      // Run any postUpdate hook
      if (typeof def.postUpdate === 'function') {
        def.postUpdate(root, newValue);
      }

    } else {
      // ── Fallback #1: Top‐level ESC fields ──
      // If we've got an enabledModes/defaultMode change,
      // but no schema def (because partKey==='esc'), write it here.
      if (driveSlot && (field === 'enabledModes' || field === 'defaultMode')) {
        driveSlot[field] = newValue;
        continue;
      }

      // ── Fallback #2: per‐mode controller props (mode@ctrl@prop) ──
      const parts = field.split('@');
      if (
        parts.length === 3 &&
        driveSlot &&
        typeof driveSlot.modes === 'object'
      ) {
        const [modeKey, ctrlName, prop] = parts;
        const mode = driveSlot.modes[modeKey];
        if (mode && Array.isArray(mode.settings)) {
          const idx = mode.settings.findIndex(
            e => e[0] === 'controller' && e[1]?.controllerName === ctrlName
          );
          if (idx >= 0) {
            mode.settings[idx][1][prop] = newValue;
          }
        }
      }
    }
  }

  // 5) Serialize back
  return JSON.stringify(root, null, 2);
}
