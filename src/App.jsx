// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header/Header';
import TabStrip from './components/TabStrip/TabStrip';
import Footer from './components/Footer/Footer';

const App = () => {
  const [vehicleData,    setVehicleData]    = useState(null);
  const [isReady,        setIsReady]        = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  // 1) Field edits (remove key if null/undefined)
  const handleFieldChange = (key, value) => {
    setPendingChanges(prev => {
      if (value == null) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  // 2) Write to disk
  const handleApplyChanges = async () => {
    if (!vehicleData?.engineFilePath) {
      return alert("No engine file loaded!");
    }
    const res = await window.electron.applyChanges(
      vehicleData.engineFilePath,
      pendingChanges
    );
    if (res.success) {
      alert("✓ Changes applied to car export");
    } else {
      alert("✗ Failed to write file: " + res.message);
    }
  };

  // 3) When you pick a new car export
  const handleNewVehicle = (data) => {
    setVehicleData(data);
    setPendingChanges({});
    setIsReady(true);
  };

  // 4a) Load (replace) a built-in preset
  const handleLoadBuiltIn = async () => {
    const preset = await window.presets.pick('builtIn');
    if (preset) setPendingChanges(preset);
  };

  // 4b) Append (merge) a built-in preset
  const handleAppendBuiltIn = async () => {
    const preset = await window.presets.pick('builtIn');
    if (preset) setPendingChanges(prev => ({ ...prev, ...preset }));
  };

  // 5a) Load (replace) a user preset
  const handleLoadUser = async () => {
    const preset = await window.presets.pick('custom');
    if (preset) setPendingChanges(preset);
  };

  // 5b) Append (merge) a user preset
  const handleAppendUser = async () => {
    const preset = await window.presets.pick('custom');
    if (preset) setPendingChanges(prev => ({ ...prev, ...preset }));
  };

  // 6) Save the current pendingChanges as a custom preset
  const handleSavePreset = async () => {
    const fileName = await window.presets.save(pendingChanges);
    if (fileName) alert(`✓ Saved as ${fileName}`);
  };

  // 7) Reveal the user-preset folder in Explorer/Finder
  const handleOpenPresetFolder = () => {
    window.presets.openFolder();
  };

  return (
    <div className="app-root">
      <Header
        isReady={isReady}
        setIsReady={setIsReady}
        setVehicleData={handleNewVehicle}
        vehicleData={vehicleData}
        onLoadBuiltIn={handleLoadBuiltIn}
        onAppendBuiltIn={handleAppendBuiltIn}
        onLoadUser={handleLoadUser}
        onAppendUser={handleAppendUser}
      />

      {isReady && vehicleData && (
        <>
          <TabStrip
            extractedData={vehicleData.jbeamFiles.engine.extracted}
            rawContent={vehicleData.jbeamFiles.engine.raw}
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
