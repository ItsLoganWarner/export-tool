// src/components/TabStrip/TabStrip.jsx
import React from 'react';

const tabs = ['General', 'AfterFire', 'Forced Induction', 'Fuel', 'ESC', 'Sound Inject'];

const TabStrip = ({ selectedTab, setSelectedTab, isReady }) => {
  return (
    <div style={styles.container}>
      {tabs.map(tab => (
        <button
          key={tab}
          disabled={!isReady}
          onClick={() => setSelectedTab(tab)}
          style={{
            ...styles.button,
            ...(selectedTab === tab ? styles.active : {}),
            ...(isReady ? {} : styles.disabled),
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '1rem 0',
    borderBottom: '1px solid black',
    paddingBottom: '0.5rem',
  },
  button: {
    padding: '0.5rem 1rem',
    background: '#2d468c',
    color: 'white',
    border: '1px solid black',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  active: {
    background: '#4f5b93',
    borderBottom: '3px solid white',
  },
  disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  }
};

export default TabStrip;
