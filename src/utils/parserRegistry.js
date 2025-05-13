// src/utils/parserRegistry.js
import { parseJbeam2 }   from './jbeamParser2';
import { parseJsonPart } from './jsonParser';

export function parsePart(rawContent, filePath) {
  try {
    // if this throws, it’s not valid JSON → go regex route
    JSON.parse(rawContent);
    // valid JSON! hand off to your JSON parser
    return parseJsonPart(rawContent) || { extracted: {} };
  } catch {
    // invalid JSON → treat as BeamNG .jbeam
    return parseJbeam2(rawContent);
  }
}
