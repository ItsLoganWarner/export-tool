import { parseJbeam2 } from './jbeamParser2';
import camsoEngineSchema from '../schemas/camso_engine.schema';

export async function loadVehicleData(directoryPath) {
  const vehiclesPath = `${directoryPath}/vehicles`;
  const folders = await window.electron.readDirectory(vehiclesPath);
  if (!folders.length) return null;

  const vehicleFolder = folders[0];
  const vehiclePath = `${vehiclesPath}/${vehicleFolder}`;

  const modelInfoRaw = await window.electron.readFile(`${vehiclePath}/info.json`);
  const modelInfo = JSON.parse(modelInfoRaw);

  const vehicleFiles = await window.electron.readDirectory(vehiclePath);
  const engineFolder = vehicleFiles.find(f => f.startsWith('eng_') && !f.includes('.'));
  const enginePath = `${vehiclePath}/${engineFolder}`;

  const engineFiles = await window.electron.readDirectory(enginePath);
  const engineFile = engineFiles.find(f => f.startsWith('camso_engine_') && f.endsWith('.jbeam'));
  const engineFilePath = `${enginePath}/${engineFile}`;
  const engineRaw = await window.electron.readFile(engineFilePath);

  const parsed = parseJbeam2(engineRaw);

  const extracted = {};
  for (const [key, { regex, type, default: def }] of Object.entries(camsoEngineSchema.fields)) {
    const match = engineRaw.match(regex);
    if (match) {
      let value = match[1];
      if (type === 'boolean') value = value === 'true';
      if (type === 'number') value = parseFloat(value);
      extracted[key] = value;
    } else {
      extracted[key] = def;
    }
  }

  return {
    directoryPath,
    modelName: modelInfo.Name,
    engineFileName: engineFile,
    jbeamFiles: {
      engine: {
        fileName: engineFile,
        raw: engineRaw,
        parsed,
        extracted
      }
    }
  };
}
