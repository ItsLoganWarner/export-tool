// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header/Header';
import TabStrip from './components/TabStrip/TabStrip';
import Footer from './components/Footer/Footer';

const App = () => {
  const [vehicleData, setVehicleData] = useState(null);       // Full vehicle object
  const [isReady, setIsReady] = useState(false);              // Flag for UI display
  const [pendingChanges, setPendingChanges] = useState({});   // Editable user changes

  const handleFieldChange = (key, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }));
    console.log("✏️ Pending field change:", key, value);
  };

  const handleApplyChanges = () => {
    console.log("🛠️ Applied Changes:", pendingChanges);
  };

  return (
    <div>
      <Header
        isReady={isReady}
        setIsReady={setIsReady}
        setVehicleData={setVehicleData}
        vehicleData={vehicleData}
      />

      {isReady && vehicleData && (
        <>
          <TabStrip
            extractedData={vehicleData.jbeamFiles.engine.extracted}
            onFieldChange={handleFieldChange}
            pendingChanges= {pendingChanges}
          />
          <Footer onApplyChanges={handleApplyChanges} />
        </>
      )}
    </div>
  );
};

export default App;
