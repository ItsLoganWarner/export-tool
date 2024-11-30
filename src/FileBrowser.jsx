import React, { useState } from 'react';

const FileBrowser = () => {
  const [selectedPath, setSelectedPath] = useState('');
  const [modelName, setModelName] = useState('');
  const [trimName, setTrimName] = useState('');
  const [engineFileName, setEngineFileName] = useState('');

  // Function to handle folder selection and read the necessary information
  const openFileDialog = async () => {
    const directoryPath = await window.electron.openDirectory();
    if (directoryPath) {
      setSelectedPath(directoryPath);
      // Start navigating and reading the specific values
      await readVehicleInfo(directoryPath);
    }
  };

  // Function to read vehicle information based on the given folder structure
  const readVehicleInfo = async (directoryPath) => {
    try {
      // Navigate to the vehicles directory
      console.log('Reading vehicles directory...');
      const vehiclesPath = `${directoryPath}/vehicles`;
      const vehicleFolders = await window.electron.readDirectory(vehiclesPath);
      console.log('Vehicle folders:', vehicleFolders);
      
      if (vehicleFolders.length > 0) {
        const vehiclePath = `${vehiclesPath}/${vehicleFolders[0]}`;
        console.log('Vehicle path:', vehiclePath);
  
        // Read the model-level info.json file
        const modelInfoPath = `${vehiclePath}/info.json`;
        const modelInfoData = await window.electron.readFile(modelInfoPath);
        console.log('Model Info Data:', modelInfoData);
        const modelInfo = JSON.parse(modelInfoData);
        setModelName(modelInfo.Name);
  
        // Read the trim-level info_<trimnumberidentifier>.json file
        const vehicleFiles = await window.electron.readDirectory(vehiclePath); // Correcting this part
        console.log('Vehicle Files:', vehicleFiles);
        const trimFile = vehicleFiles.find(file => file.startsWith('info_') && file.endsWith('.json') && file !== 'info.json');
  
        if (trimFile) {
          console.log('Trim File Found:', trimFile);
          const trimInfoPath = `${vehiclePath}/${trimFile}`;
          const trimInfoData = await window.electron.readFile(trimInfoPath);
          console.log('Trim Info Data:', trimInfoData);
          const trimInfo = JSON.parse(trimInfoData);
          setTrimName(trimInfo.Configuration);
        }
  
        // Navigate to the engine folder (eng_<enginenumberidentifier>)
        const engineFolders = vehicleFiles.filter(folder => folder.startsWith('eng_') && !folder.includes('.'));
        console.log('Engine Folders:', engineFolders);
        if (engineFolders.length > 0) {
          const enginePath = `${vehiclePath}/${engineFolders[0]}`;
          const engineFiles = await window.electron.readDirectory(enginePath);
          console.log('Engine Files:', engineFiles);
          const engineFile = engineFiles.find(file => file.startsWith('camso_engine_') && file.endsWith('.jbeam'));

          if (engineFile) {
            console.log('Engine File Found:', engineFile);
            setEngineFileName(engineFile);
          }
        }
      }
    } catch (error) {
      console.error('Error reading vehicle info:', error);
    }
  };
  

  return (
    <div>
      <button onClick={openFileDialog}>Select Directory</button>
      {selectedPath && (
        <div>
          <p>Selected Directory: {selectedPath}</p>
          <h3>Model Details:</h3>
          <p>Model Name: {modelName}</p>
          <p>Trim: {trimName}</p>
          <p>Engine File: {engineFileName}</p>
        </div>
      )}
    </div>
  );
};

export default FileBrowser;
