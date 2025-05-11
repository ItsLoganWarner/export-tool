import React, { useState, useRef, useEffect } from 'react';
import { FaCar, FaSyncAlt, FaPlus } from 'react-icons/fa';
import { loadVehicleData } from '../../utils/loadVehicleData';
import './Header.css';

export default function Header({
  isReady,
  setIsReady,
  setVehicleData,
  vehicleData,
  onLoadBuiltIn,
  onAppendBuiltIn,
  onLoadUser,
  onAppendUser
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // close dropdown on outside click
  useEffect(() => {
    const onBodyClick = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.body.addEventListener('click', onBodyClick);
    return () => document.body.removeEventListener('click', onBodyClick);
  }, []);

  const handleSelectDirectory = async () => {
    const dir = await window.electron.openDirectory();
    if (!dir) return;
    const data = await loadVehicleData(dir);
    if (!data) return;
    setVehicleData(data);
    console.log('Loaded vehicle data:', data);
    setIsReady(true);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="btn select-car"
          onClick={handleSelectDirectory}
        >
          <FaCar className="icon-car" />
          <span className="label">Select Car Export</span>
        </button>
      </div>

      <div className="header-center">
        {isReady ? (
          <>
            <div className="title-line">
              Car: <strong>{vehicleData.modelName}</strong>
            </div>
            <div className="title-line">
              Engine: <strong>{vehicleData.parts.engine?.fileName}</strong>
            </div>
          </>
        ) : (
          <div className="dimmed">No vehicle loaded</div>
        )}
      </div>

      <div className="header-right" ref={dropdownRef}>
        <button
          className="btn presets-btn"
          onClick={() => setOpen(o => !o)}
        >
          Presets ▾
        </button>
        {open && (
          <div className="preset-dropdown">
            <div className="preset-row">
              <span className="preset-label">Built-In</span>
              <FaSyncAlt
                className="preset-action"
                title="Load Built-In Preset"
                onClick={() => { setOpen(false); onLoadBuiltIn(); }}
              />
              <FaPlus
                className="preset-action"
                title="Add Built-In Preset"
                onClick={() => { setOpen(false); onAppendBuiltIn(); }}
              />
            </div>
            <div className="preset-row">
              <span className="preset-label">User</span>
              <FaSyncAlt
                className="preset-action"
                title="Load User Preset"
                onClick={() => { setOpen(false); onLoadUser(); }}
              />
              <FaPlus
                className="preset-action"
                title="Add User Preset"
                onClick={() => { setOpen(false); onAppendUser(); }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
