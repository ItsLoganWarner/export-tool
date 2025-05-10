// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header/Header';
import TabStrip from './components/TabStrip/TabStrip';
import Footer from './components/Footer/Footer';

const App = () => {
  const [vehicleData,       setVehicleData]       = useState(null);
  const [isReady,           setIsReady]           = useState(false);
  const [pendingChanges,    setPendingChanges]    = useState({});

  // 1) Field edits (with removal when null)
  const handleFieldChange = (key, value) => {
    setPendingChanges(prev => {
      if (value === null || value === undefined) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
    console.log("✏️ Pending field change:", key, value);
  };

  // 2) Apply to disk
  const handleApplyChanges = async () => {
    if (!vehicleData?.engineFilePath) {
      return alert("No engine file loaded!");
    }
    const res = await window.electron.applyChanges(
      vehicleData.engineFilePath,
      pendingChanges
    );
    if (res.success) {
      alert("✓ Changes applied to disk");
    } else {
      alert("✗ Failed to write file: " + res.message);
    }
  };

  // 3) Load a brand‐new vehicle → clear out all old changes
  const handleNewVehicle = (data) => {
    setVehicleData(data);
    setPendingChanges({});
    setIsReady(true);
  };

  // 4) Load *replace* preset
  const handleLoadPreset = async () => {
    const preset = await window.presets.pick();
    if (preset) {
      setPendingChanges(preset);
      console.log('Loaded preset:', preset);
    }
  };

  // 5) Append on top of existing
  const handleAppendPreset = async () => {
    const preset = await window.presets.pick();
    if (preset) {
      setPendingChanges(prev => ({ ...prev, ...preset }));
      console.log('Appended preset:', preset);
    }
  };

  // 6) Save current pendingChanges as a new custom preset
  const handleSavePreset = async () => {
    const fileName = await window.presets.save(pendingChanges);
    if (fileName) alert(`✓ Saved as ${fileName}`);
  };
  

  // 7) Open the user‐preset folder in the OS file explorer
  const handleOpenPresetFolder = () => {
    window.presets.openFolder();
  };

  return (
    <div>
      <Header
        isReady={isReady}
        setIsReady={setIsReady}
        setVehicleData={handleNewVehicle}
        vehicleData={vehicleData}
        onLoadPreset={handleLoadPreset}
        onAppendPreset={handleAppendPreset}
      />

      {isReady && vehicleData && (
        <>
          <TabStrip
            extractedData={vehicleData.jbeamFiles.engine.extracted}
            onFieldChange={handleFieldChange}
            pendingChanges={pendingChanges}
          />
          <Footer
            onApplyChanges={handleApplyChanges}
            onSavePreset={handleSavePreset}
            onOpenPresetFolder={handleOpenPresetFolder}
          />
        </>
      )}
    </div>
  );
};

export default App;
