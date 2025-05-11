// src/utils/loadVehicleData.js
import { parseJbeam2 } from './jbeamParser2';

export async function loadVehicleData(directoryPath) {
  const vehiclesPath = `${directoryPath}/vehicles`;
  const [first] = await window.electron.readDirectory(vehiclesPath);
  if (!first) return null;
  const vehiclePath = `${vehiclesPath}/${first}`;

  // ————— Model Info from info_<model>.json —————
  const dirEntries = await window.electron.readDirectory(vehiclePath);
  const infoFiles = dirEntries.filter(
    f => f.startsWith('info_') && f.endsWith('.json') && f !== 'info.json'
  );
  if (infoFiles.length === 0) {
    throw new Error('Missing info_<model>.json');
  }
  const modelInfoFile = infoFiles[0];
  const modelRaw = await window.electron.readFile(
    `${vehiclePath}/info.json`
  );
  const modelInfo = JSON.parse(modelRaw);

  // folder name for non-engine parts (e.g., '80b97')
  const modelFolder = modelInfoFile.replace(/^info_/, '').replace(/\.json$/, '');

  // ————— Discover folders —————
  // engine folder: always starts with 'eng_'
  const entries = dirEntries; // just names
  const engineFolder = entries.find(name => name.startsWith('eng_') && !name.includes('.'));

  // build array of folders to load
  const partFolders = [engineFolder, modelFolder].filter(Boolean);

  // ————— Load only engine & fueltank JBEAMs —————
  const parts = {};
  for (const folder of partFolders) {
    const folderPath = `${vehiclePath}/${folder}`;
    const files = await window.electron.readDirectory(folderPath);
    let jbeamFile;
    // engine always lives in the eng_* folder:
    if (folder === engineFolder) {
      jbeamFile = files.find(f => f.startsWith('camso_engine_') && f.endsWith('.jbeam'));
    }
    // modelFolder holds the fuel tank (and other junk we ignore):
    else if (folder === modelFolder) {
      jbeamFile = files.find(f => f.startsWith('camso_fueltank_') && f.endsWith('.jbeam'));
    }
    if (!jbeamFile) continue;

    const raw = await window.electron.readFile(`${folderPath}/${jbeamFile}`);
    const parsed = parseJbeam2(raw);
    if (!parsed) {
      console.warn(`Skipping ${jbeamFile}: parseJbeam2 returned null`);
      continue;
    }

    // derive a clean partKey (e.g., 'engine', 'fueltank')
    const base = jbeamFile.replace(/^camso_/, '').replace(/\.jbeam$/, '');
    const segments = base.split('_');
    let partKey = segments.slice(0, -1).join('_');
    // normalize fuel tank
    if (partKey === 'fueltank') partKey = 'fueltank';

    parts[partKey] = {
      fileName: jbeamFile,
      filePath: `${folderPath}/${jbeamFile}`,
      raw,
      parsed,
      extracted: parsed.extracted
    };
  }

  return {
    directoryPath,
    modelName: modelInfo.Name,
    parts
  };
}
