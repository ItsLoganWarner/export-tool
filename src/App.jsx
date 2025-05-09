// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header/Header';
import TabStrip from './components/TabStrip/TabStrip';
import Footer from './components/Footer/Footer';

const App = () => {
  const [vehicleData, setVehicleData]       = useState(null);
  const [isReady, setIsReady]               = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  const handleFieldChange = (key, value) => {
    setPendingChanges(prev => {
      if (value === null || value === undefined) {
        // remove the key completely
        const { [key]: _, ...rest } = prev;
        return rest;
      } else {
        // set or overwrite
        return { ...prev, [key]: value };
      }
    });
    console.log("✏️ Pending field change:", key, value);
  };

  const handleApplyChanges = async () => {
    if (!vehicleData?.engineFilePath) {
      return alert("No engine file loaded!");
    }
    const res = await window.electron.applyChanges(
      vehicleData.engineFilePath,
      pendingChanges
    );
    if (res.success) {
      console.log("JBeam file updated successfully");
      alert("✓ Changes applied to disk");
    } else {
      console.error("JBeam update failed:", res.message);
      alert("✗ Failed to write file: " + res.message);
    }
  };

    const handleNewVehicle = (data) => {
        setVehicleData(data);
        setPendingChanges({});   // << clear everything
        setIsReady(true);
    };

  return (
    <div>
      <Header
        isReady={isReady}
        setIsReady={setIsReady}
        setVehicleData={handleNewVehicle}
        vehicleData={vehicleData}
      />

      {isReady && vehicleData && (
        <>
          <TabStrip
            extractedData={vehicleData.jbeamFiles.engine.extracted}
            onFieldChange={handleFieldChange}
            pendingChanges={pendingChanges}
          />
          <Footer onApplyChanges={handleApplyChanges} />
        </>
      )}
    </div>
  );
};

export default App;
