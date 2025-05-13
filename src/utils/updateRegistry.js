// src/utils/updateRegistry.js
import { updateJbeam }    from './updateJbeam';
import { updateJsonPart } from './updateJsonPart';

export function updatePart(rawContent, pendingChanges, partKey) {
  try {
    JSON.parse(rawContent);
    // JSON path gets the partKey
    return updateJsonPart(rawContent, pendingChanges, partKey);
  } catch {
    // JBEAM path ignores partKey
    return updateJbeam(rawContent, pendingChanges);
  }
}
