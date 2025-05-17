// src/components/Footer/Footer.jsx
import React, { useEffect, useState } from 'react';
import semver from 'semver';
import './Footer.css';
import pkg from '../../../package.json';

export default function Footer({ onApply, onRevert, onSavePreset, onOpenPresetFolder, isApplied }) {
  const { version } = pkg;         // e.g. "1.4.1"
  const [latest, setLatest] = useState(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    window.electron
      .checkForUpdate()
      .then(tag => setLatest(tag.replace(/^v/, '')))
      .catch(() => setError(true));
  }, []);

  const behind = latest && semver.valid(latest) && semver.lt(version, latest);

  return (
    <footer className="footer">
      <div className="footer-credit">
        <a href="https://github.com/ItsLoganWarner/exportomation" className="footer-link" target="_blank" rel="noopener">
          v{version} — Created by Logan Warner
          {error && <span style={{ marginLeft: 8, color: '#e64a57' }}>(couldn’t check updates)</span>}
          {behind && <span style={{ marginLeft: 8, color: '#e64a57', fontWeight: 'bold' }}>New version {latest} available!</span>}
        </a>
      </div>
      <div className="footer-right">
        {isApplied && <button className="footer-button-revert" onClick={onRevert}>Revert</button>}
        <button className="footer-button-apply" onClick={onApply}>Apply Changes</button>
        <button className="footer-button" onClick={onSavePreset}>Save Preset</button>
        <button className="footer-button" onClick={onOpenPresetFolder} title="Open Preset Folder">📂</button>
      </div>
    </footer>
  );
}
