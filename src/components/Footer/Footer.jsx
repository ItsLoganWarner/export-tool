// src/components/Footer/Footer.jsx
import React from 'react';
import './Footer.css';
import pkg from '../../../package.json';
const { version } = pkg;

const Footer = ({
    onApplyChanges,
    onSavePreset,
    onOpenPresetFolder,
    isApplied 
}) => (
    <footer className="footer">
        <div className="footer-credit">
            <a
                href="https://github.com/ItsLoganWarner/exportomation"
                className="footer-link"
                target="_blank"
                rel="noopener"
            >
                {/* show version first, then your name as a link */}
                v{version} — Created by{' '}
                Logan Warner
                {' '}(Monster Energy Zero Ultra)
            </a>
        </div>
        <div className="footer-right">
            <button
                className={`footer-button-apply${isApplied ? ' revert' : ''}`}
                onClick={onApplyChanges}
            >
                {isApplied ? 'Revert' : 'Apply Changes'}
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
