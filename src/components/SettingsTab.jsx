// src/components/SettingsTab.jsx
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

export default function SettingsTab({
  exportPath = '',
  onExportPathChange,
  darkMode,
  onDarkModeChange,
  onExit
}) {
  return (
    <div className="card" style={{ maxWidth: '80%', margin: '2rem auto' }}>
      <button className="btn back-btn" onClick={onExit}>
        <FaArrowLeft style={{ marginRight: 8 }}/> Back
      </button>

      <div className="field-row">
        <label style={{ width: 200, fontWeight: 'bold' }}>
          Default export location
        </label>
        <span style={{ flex: 1 }}>{exportPath || '(not set)'}</span>
        <button
          className="btn presets-btn"
          onClick={async () => {
            const dir = await window.electron.openDirectory(exportPath);
            if (dir) onExportPathChange(dir);
          }}
        >
          Browse…
        </button>
      </div>

      <div className="field-row">
        <label style={{ width: 200, fontWeight: 'bold' }}>Dark Mode</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={e => onDarkModeChange(e.target.checked)}
        />
      </div>
    </div>
  );
}
