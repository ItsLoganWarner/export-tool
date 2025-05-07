// src/components/FileBrowser.jsx
import React from 'react';
import { parseJbeam2 } from '../utils/jbeamParser2';
import camsoEngineSchema from './schemas/camso_engine.schema'; // Example schema

const FileBrowser = ({ onVehicleLoaded }) => {
  const handleSelectDirectory = async () => {
    const directoryPath = await window.electron.openDirectory();
    if (!directoryPath) return;

    const vehiclesPath = `${directoryPath}/vehicles`;
    const folders = await window.electron.readDirectory(vehiclesPath);
    if (!folders.length) return;

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
    console.log("parsed data:", parsed);

    // Extract fields based on schema
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

    onVehicleLoaded({
      modelName: modelInfo.Name,
      engineFileName: engineFile,
      jbeamFiles: {
        engine: {
          fileName: engineFile,
          raw: engineRaw,
          parsed,
          extracted,
        }
      }
    });
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={handleSelectDirectory}>Select Export Directory</button>
    </div>
  );
};

export default FileBrowser;






































// import React, { useState } from 'react';
// import { parseJbeam } from './utils/old/jbeamParser'; // Import the custom parser
// import { parseJbeam2 } from './utils/jbeamParser2';

// const FileBrowser = () => {
//   const [selectedPath, setSelectedPath] = useState('');
//   const [modelName, setModelName] = useState('');
//   const [trimName, setTrimName] = useState('');
//   const [engineFileName, setEngineFileName] = useState('');

//   // Add new state hooks for engine data
//   const [instantAfterFireSound, setInstantAfterFireSound] = useState('');
//   const [sustainedAfterFireSound, setSustainedAfterFireSound] = useState('');
//   const [shiftAfterFireSound, setShiftAfterFireSound] = useState('');
//   const [mainGain, setMainGain] = useState('');

//   const openFileDialog = async () => {
//     const directoryPath = await window.electron.openDirectory();
//     if (directoryPath) {
//       setSelectedPath(directoryPath);
//       await readVehicleInfo(directoryPath);
//     }
//   };

//   const readVehicleInfo = async (directoryPath) => {
//     try {
//       const vehiclesPath = `${directoryPath}/vehicles`;
//       const vehicleFolders = await window.electron.readDirectory(vehiclesPath);

//       if (vehicleFolders.length > 0) {
//         const vehiclePath = `${vehiclesPath}/${vehicleFolders[0]}`;

//         // Read model-level info.json
//         const modelInfoPath = `${vehiclePath}/info.json`;
//         const modelInfoData = await window.electron.readFile(modelInfoPath);
//         const modelInfo = JSON.parse(modelInfoData);
//         setModelName(modelInfo.Name);

//         // Read trim-level info_<trimnumberidentifier>.json
//         const vehicleFiles = await window.electron.readDirectory(vehiclePath);
//         const trimFile = vehicleFiles.find(file => file.startsWith('info_') && file.endsWith('.json') && file !== 'info.json');

//         if (trimFile) {
//           const trimInfoPath = `${vehiclePath}/${trimFile}`;
//           const trimInfoData = await window.electron.readFile(trimInfoPath);
//           const trimInfo = JSON.parse(trimInfoData);
//           setTrimName(trimInfo.Configuration);
//         }

//         // Navigate to engine folder and read engine data
//         const engineFolders = vehicleFiles.filter(folder => folder.startsWith('eng_') && !folder.includes('.'));
//         if (engineFolders.length > 0) {
//           const enginePath = `${vehiclePath}/${engineFolders[0]}`;
//           const engineFiles = await window.electron.readDirectory(enginePath);
//           const engineFile = engineFiles.find(file => file.startsWith('camso_engine_') && file.endsWith('.jbeam'));

//           if (engineFile) {
//             setEngineFileName(engineFile);

//             // Read the engine `.jbeam` file and extract data using the custom parser
//             const engineFilePath = `${enginePath}/${engineFile}`;
//             const engineDataRaw = await window.electron.readFile(engineFilePath);
//             console.log("Raw JBeam Data:", engineDataRaw); // Log the raw data for debugging

//             const engineData = parseJbeam2(engineDataRaw);
//             console.log("Parsed JBeam Data:", engineData); // Log the parsed data for better insight

//             // Accessing parsed data properly based on the new structure
//             if (engineData && engineData.object_0) {
//               // Dynamically determine the engine object inside "object_0"
//               const engineObjectKeys = Object.keys(engineData.object_0);
//               if (engineObjectKeys.length > 0) {
//                 const engineKey = engineObjectKeys[0];
//                 const engineObject = engineData.object_0[engineKey];

//                 // Extract and set the desired engine properties
//                 if (engineObject && engineObject.mainEngine) {
//                   setInstantAfterFireSound(engineObject.mainEngine.instantAfterFireSound);
//                   setSustainedAfterFireSound(engineObject.mainEngine.sustainedAfterFireSound);
//                   setShiftAfterFireSound(engineObject.mainEngine.shiftAfterFireSound);
//                 }

//                 if (engineObject && engineObject.soundConfigExhaust) {
//                   setMainGain(engineObject.soundConfigExhaust.mainGain);
//                 }
//               }
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error reading vehicle info:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={openFileDialog}>Select Directory</button>
//       {selectedPath && (
//         <div>
//           <p>Selected Directory: {selectedPath}</p>
//           <h3>Model Details:</h3>
//           <p>Model Name: {modelName}</p>
//           <p>Trim: {trimName}</p>
//           <p>Engine File: {engineFileName}</p>

//           <h3>Engine Details:</h3>
//           <p>Instant AfterFire Sound: {instantAfterFireSound}</p>
//           <p>Sustained AfterFire Sound: {sustainedAfterFireSound}</p>
//           <p>Shift AfterFire Sound: {shiftAfterFireSound}</p>
//           <p>Main Gain: {mainGain}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileBrowser;
