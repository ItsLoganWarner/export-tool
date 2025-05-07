// src/components/Tabs/TabStrip.jsx
import React, { useState } from 'react';
import GeneralTab from './tabs/GeneralTab';
// import AfterFireTab from './AfterFireTab'; // for future tabs

const tabs = ['General', 'AfterFire', 'Forced Induction', 'Fuel', 'ESC', 'Sound Inject'];

const TabStrip = ({ extractedData, onFieldChange }) => {
  const [selectedTab, setSelectedTab] = useState('General');

  const renderTab = () => {
    switch (selectedTab) {
      case 'General':
        return <GeneralTab extractedData={extractedData} onFieldChange={onFieldChange} />;
      // case 'AfterFire':
      //   return <AfterFireTab ... />;
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <div>
      <div style={styles.tabStrip}>
        {tabs.map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tabButton,
              backgroundColor: tab === selectedTab ? '#007F7F' : '#ccc',
              color: tab === selectedTab ? 'white' : 'black',
            }}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={styles.tabContent}>
        {renderTab()}
      </div>
    </div>
  );
};

const styles = {
  tabStrip: {
    display: 'flex',
    borderBottom: '2px solid black',
  },
  tabButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    flex: 1,
  },
  tabContent: {
    padding: '1rem',
  },
};

export default TabStrip;
