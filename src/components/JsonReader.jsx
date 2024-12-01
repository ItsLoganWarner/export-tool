// components/JsonReader.jsx
import React from 'react';

const JsonReader = ({ filePath, onRead }) => {
  const readJsonFile = async () => {
    try {
      const fileData = await window.electron.readFile(filePath);
      const jsonData = JSON.parse(fileData);
      onRead(jsonData);
    } catch (error) {
      console.error('Error reading JSON file:', error);
    }
  };

  return <button onClick={readJsonFile}>Read JSON File</button>;
};

export default JsonReader;
