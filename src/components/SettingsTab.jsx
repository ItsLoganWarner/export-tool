// src/components/SettingsTab.jsx
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

export default function SettingsTab({ onExit }) {
  const [exportPath] = useState('C:/path/to/exports');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="card">
      <button className="btn back-btn" onClick={onExit}>
        <FaArrowLeft style={{ marginRight: 8 }}/> Back
      </button>
      <div className="field-row">
        <label style={{ width: 200, fontWeight: 'bold' }}>Default export location</label>
        <span>{exportPath}</span>
      </div>
      <div className="field-row">
        <label style={{ width: 200, fontWeight: 'bold' }}>Dark Mode</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={e => setDarkMode(e.target.checked)}
        />
      </div>
    </div>
  );
}
