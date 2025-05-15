// src/utils/parserRegistry.js
import { parseJbeam2 }   from './jbeamParser2';
import { parseJsonPart } from './jsonParser';

export function parsePart(rawContent, filePath) {
  try {
    // if this throws, it’s not valid JSON → go regex route
    JSON.parse(rawContent);
    console.log('valid JSON filePath:', filePath);  
    // pass the filePath (your partKey) into parseJsonPart
    return parseJsonPart(rawContent, filePath) || { extracted: {} };
  } catch {
    console.log('invalid JSON filePath:', filePath);
    // invalid JSON → treat as BeamNG .jbeam
    return parseJbeam2(rawContent);
  }
}
