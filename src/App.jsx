// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header/Header';
import TabStrip from './components/TabStrip/TabStrip';
import Footer from './components/Footer/Footer';
import GeneralTab from './components/TabStrip/tabs/GeneralTab'; // example
// import other tabs as needed

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [selectedTab, setSelectedTab] = useState('General');
  const [vehicleData, setVehicleData] = useState(null); // parsed export data

  const renderTab = () => {
    switch (selectedTab) {
      case 'General': return <GeneralTab data={vehicleData} isReady={isReady} />;
      // Add other tabs here
      default: return null;
    }
  };

  return (
    <div className="app-wrapper">
      <Header
        isReady={isReady}
        setIsReady={setIsReady}
        setVehicleData={setVehicleData}
      />
      <TabStrip selectedTab={selectedTab} setSelectedTab={setSelectedTab} isReady={isReady} />
      {renderTab()}
      <Footer isReady={isReady} />
    </div>
  );
};

export default App;
