// src/components/Header/Header.jsx
import React from 'react';
import { loadVehicleData } from '../../utils/loadVehicleData';

const Header = ({ isReady, setIsReady, setVehicleData, vehicleData }) => {
  const handleSelectDirectory = async () => {
    const directoryPath = await window.electron.openDirectory();
    if (!directoryPath) return;

    const data = await loadVehicleData(directoryPath);
    if (!data) return;

    setVehicleData(data);
    setIsReady(true);
  };

  return (
    <div className="header" style={styles.header}>
      <div style={styles.left}>
        <button onClick={handleSelectDirectory} style={styles.button}>Select Export Directory</button>
      </div>
      <div style={styles.center}>
        {isReady ? (
          <>
            <div>Car: <strong>{vehicleData?.modelName || 'Unknown'}</strong></div>
            <div>Engine: <strong>{vehicleData?.engineFileName || 'Unknown'}</strong></div>
          </>
        ) : (
          <div style={styles.dimmed}>No vehicle loaded</div>
        )}
      </div>
      <div style={styles.right}>
        <button style={styles.button}>Load Quick Config</button>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    borderBottom: '2px solid black',
    background: 'linear-gradient(to right, #007F7F, #009F9F)',
    color: 'white',
  },
  left: { flex: 1 },
  center: { flex: 2, textAlign: 'center' },
  right: { flex: 1, textAlign: 'right' },
  button: {
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  dimmed: {
    color: '#ccc',
    fontStyle: 'italic',
  }
};

export default Header;
