// src/components/Footer/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = ({
  onApplyChanges,
  onSavePreset,
  onOpenPresetFolder
}) => (
  <footer className="footer">
    <div className="footer-credit">
      Created by Logan Warner&nbsp;(Monster Energy Zero Ultra)
    </div>
    <div className="footer-right">
      <button className="footer-button-apply" onClick={onApplyChanges}>
        Apply Changes
      </button>
      <button className="footer-button" onClick={onSavePreset}>
        Save Preset
      </button>
      <button
        className="footer-button"
        onClick={onOpenPresetFolder}
        title="Open Preset Folder"
      >
        📂
      </button>
    </div>
  </footer>
);

export default Footer;
