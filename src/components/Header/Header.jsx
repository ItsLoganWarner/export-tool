// src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaCar, FaSyncAlt, FaPlus, FaEdit, FaCog } from 'react-icons/fa';
import { loadVehicleData } from '../../utils/loadVehicleData';
import './Header.css';

export default function Header({
    isReady,
    setIsReady,
    setVehicleData,
    vehicleData,
    pendingChanges,   // ← now passed from App.jsx
    onLoadBuiltIn,
    onAppendBuiltIn,
    onLoadUser,
    onAppendUser,
    onEditMetadata,
    onOpenSettings,
    defaultExportLocation,
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    // Close dropdown on outside click
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
        const dir = await window.electron.openDirectory(defaultExportLocation);
        if (!dir) return;
        const data = await loadVehicleData(dir);
        if (!data) return;
        setVehicleData(data);
        setIsReady(true);
    };

    // ——— Model override (if you added `modelName` to your infoModel.schema) ———
    const defaultModel = vehicleData?.modelName || '';
    const modelPending = pendingChanges.infoModel?.modelName;
    let displayModel = modelPending ?? defaultModel;

    // ——— Trim & Year override ———
    const infoTrim = vehicleData?.parts?.infoTrim?.extracted || {};
    const defaultTrim = infoTrim.configuration || '';
    const defaultYear = infoTrim.year || '';

    const trimPending = pendingChanges.infoTrim || {};
    const displayTrim = trimPending.configuration ?? defaultTrim;
    const displayYear = (trimPending.year != null ? trimPending.year : defaultYear);

    // strip duplicate trim name out of model
    if (displayTrim && displayModel.toLowerCase().includes(displayTrim.toLowerCase())) {
        displayModel = displayModel.replace(
            new RegExp(displayTrim, 'i'),
            ''
        ).trim();
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
                            {displayYear} <strong>{displayModel}</strong> {displayTrim}
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
                {/* Settings button, to the left of Presets */}
                <button className="btn settings-btn" onClick={onOpenSettings}>
                <span className="label">Settings</span>
                <FaCog />
                </button>
                <button className="btn presets-btn" onClick={() => setOpen(o => !o)}>
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
