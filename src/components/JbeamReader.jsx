// components/JbeamReader.jsx
import React from 'react';
import { cleanJbeamJson } from '../utils/cleanJbeamJson';

const JbeamReader = ({ filePath, onRead }) => {
  const readJbeamFile = async () => {
    try {
      const fileData = await window.electron.readFile(filePath);
      const cleanedData = cleanJbeamJson(fileData);
      const jbeamData = JSON.parse(cleanedData);

      // Find the key that matches the pattern "Camso_Engine_"
      const engineKey = Object.keys(jbeamData).find(key => key.startsWith('Camso_Engine_'));
      
      if (engineKey) {
        onRead(jbeamData[engineKey]);
      } else {
        console.error('Engine key not found in JBEAM file.');
      }
    } catch (error) {
      console.error('Error reading JBEAM file:', error);
    }
  };

  return <button onClick={readJbeamFile}>Read JBEAM File</button>;
};

export default JbeamReader;
