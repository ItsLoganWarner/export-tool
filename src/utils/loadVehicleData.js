// src/utils/loadVehicleData.js
import { parsePart }   from './parserRegistry';
import { parseJsonPart } from './jsonParser.js';

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

  // ————— Load parts (engine, fuel tank, wheels) —————
  const parts = {};
  for (const folder of partFolders) {
    const folderPath = `${vehiclePath}/${folder}`;
    const files = await window.electron.readDirectory(folderPath);

    // —— engine JBEAM (one file) ——
    if (folder === engineFolder) {
      const jbeamFile = files.find(f => f.startsWith('camso_engine_') && f.endsWith('.jbeam'));
      if (jbeamFile) {
        const raw = await window.electron.readFile(`${folderPath}/${jbeamFile}`);
        const parsed = parsePart(raw, jbeamFile);;
        if (parsed) {
          parts.engine = {
            fileName: jbeamFile,
            filePath: `${folderPath}/${jbeamFile}`,
            raw,
            parsed,
            extracted: parsed.extracted
          };
        }
      }
      continue;
    }

    // —— modelFolder: fuel tank + front & rear wheels ——
    if (folder === modelFolder) {
      const jbeamFiles = files.filter(f =>
        f.endsWith('.jbeam') &&
        (f.startsWith('camso_fueltank_') ||
         f.startsWith('camso_wheels_F_') ||
         f.startsWith('camso_wheels_R_'))
      );

      for (const jbeamFile of jbeamFiles) {
        const raw = await window.electron.readFile(`${folderPath}/${jbeamFile}`);
        const parsed = parsePart(raw, jbeamFile);
        if (!parsed) continue;

        // determine partKey:
        const base = jbeamFile.replace(/^camso_/, '').replace(/\.jbeam$/, '');
        const seg = base.split('_');
        let partKey;
        if (seg[0] === 'fueltank') {
          partKey = 'fueltank';
        } else if (seg[0] === 'wheels' && seg[1] === 'F') {
          partKey = 'wheels_front';
        } else if (seg[0] === 'wheels' && seg[1] === 'R') {
          partKey = 'wheels_rear';
        } else {
          partKey = seg.slice(0, -1).join('_');
        }

        parts[partKey] = {
          fileName: jbeamFile,
          filePath: `${folderPath}/${jbeamFile}`,
          raw,
          parsed,
          extracted: parsed.extracted
        };
      }
    }
  }
    // ————— Load info.json as “infoModel” —————
    const infoRaw = await window.electron.readFile(`${vehiclePath}/info.json`);
    const infoPart = parseJsonPart(infoRaw, 'infoModel');
    parts.infoModel = {
      ...infoPart,
      fileName: 'info.json',
      filePath: `${vehiclePath}/info.json`
    };
  
    // ————— Load info_<modelFolder>.json as “infoTrim” —————
    const trimRaw = await window.electron.readFile(
      `${vehiclePath}/info_${modelFolder}.json`
    );
    const trimPart = parseJsonPart(trimRaw, 'infoTrim');
    parts.infoTrim = {
      ...trimPart,
      fileName: `info_${modelFolder}.json`,
      filePath: `${vehiclePath}/info_${modelFolder}.json`
    };

  return {
    directoryPath,
    modelName: modelInfo.Name,
    parts
  };
}
