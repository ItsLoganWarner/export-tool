// src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaCar, FaSyncAlt, FaPlus, FaEdit } from 'react-icons/fa';
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
  onAppendUser,
  onEditMetadata
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
    console.log('Loaded vehicle data:', data);
    if (!data) return;
    setVehicleData(data);
    setIsReady(true);
  };

  // pull out your extracted trim info
  const trimInfo = vehicleData?.parts?.infoTrim?.extracted || {};
  const year      = trimInfo.year || '';
  const trimName  = trimInfo.configuration || '';        // your schema’s “configuration” field

  // get the raw modelName
  let model = vehicleData?.modelName || '';

  // if modelName contains the trimName as substring, strip it out
  if (trimName && model.toLowerCase().includes(trimName.toLowerCase())) {
    model = model.replace(new RegExp(trimName, 'i'), '').trim();
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="btn select-car" onClick={handleSelectDirectory}>
          <FaCar className="icon-car" />
          <span className="label">Select Car Export</span>
        </button>
      </div>

      <div className="header-center">
        {isReady ? (
          <>
            <div className="title-line">
              {year} <strong>{model}</strong> {trimName}
            </div>
            <button className="btn edit-meta" onClick={onEditMetadata}>
              <FaEdit style={{ marginRight: 4 }} /> Edit Metadata
            </button>
          </>
        ) : (
          <div className="dimmed">No vehicle loaded</div>
        )}
      </div>

      <div className="header-right" ref={dropdownRef}>
        <button className="btn presets-btn" onClick={() => setOpen(o => !o)}>
          Presets ▾
        </button>
        {open && (
          <div className="preset-dropdown">
            {/* … your existing presets rows … */}
          </div>
        )}
      </div>
    </header>
  );
}
