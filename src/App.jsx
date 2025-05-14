// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import TabStrip from './components/TabStrip/TabStrip';
import MetaTab from './components/MetaTab';
import Footer from './components/Footer/Footer';
import SettingsTab from './components/SettingsTab';

export default function App() {
    const [defaultExportLocation, setDefaultExportLocation] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [vehicleData, setVehicleData] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({});
    const [isApplied, setIsApplied] = useState(false);
    const [activeView, setActiveView] = useState('General');

    // load settings.json on startup
    useEffect(() => {
        window.settings.get().then(s => {
            if (s.exportPath) setDefaultExportLocation(s.exportPath);
            if (s.darkMode != null) setDarkMode(s.darkMode);
        });
    }, []);

    // save settings.json whenever either piece changes
    useEffect(() => {
        window.settings.set({
            exportPath: defaultExportLocation,
            darkMode: darkMode,
        });
    }, [defaultExportLocation, darkMode]);

    const handleOpenSettings = () => setActiveView('Settings');

    // 1) Field edits (remove key if null/undefined)
    const handleFieldChange = (partKey, key, value) => {
        setPendingChanges(prev => {
            const part = { ...(prev[partKey] || {}) };
            if (value == null) delete part[key];
            else part[key] = value;
            return { ...prev, [partKey]: part };
        });
        console.log('Pending changes:', pendingChanges);
    };

    // 2) Write to disk
    const handleApplyChanges = async () => {
        for (const [part, changes] of Object.entries(pendingChanges)) {
            if (!Object.keys(changes).length) continue;
            const path = vehicleData.parts[part].filePath;
            const res = await window.electron.applyChanges(path, part, changes);
            if (!res.success) {
                return alert(`Failed on ${part}: ${res.message}`);
            }
        }
        alert('✓ All changes applied!');
        setIsApplied(true);
    };

    // 3) When you pick a new car export
    const handleNewVehicle = (data) => {
        setVehicleData(data);
        setPendingChanges({});
        setIsApplied(false);
        setActiveView('General');
        setIsReady(true);
    };

    // 4a) Load (replace) a built-in preset
    const handleLoadBuiltIn = async () => {
        const preset = await window.presets.pick('builtIn');
        if (preset) setPendingChanges(preset);
    };

    // 4b) Append (merge) a built-in preset
    const handleAppendBuiltIn = async () => {
        const preset = await window.presets.pick('builtIn');
        if (preset) setPendingChanges(prev => ({ ...prev, ...preset }));
    };

    // 5a) Load (replace) a user preset
    const handleLoadUser = async () => {
        const preset = await window.presets.pick('custom');
        if (preset) setPendingChanges(preset);
    };

    // 5b) Append (merge) a user preset
    const handleAppendUser = async () => {
        const preset = await window.presets.pick('custom');
        if (preset) setPendingChanges(prev => ({ ...prev, ...preset }));
    };

    // 6) Save the current pendingChanges as a custom preset
    const handleSavePreset = async () => {
        const toSave = { ...pendingChanges };
        const fuelTab = document.querySelector('textarea[name="burnEfficiency"]');
        if (toSave.engine?.burnEfficiency && fuelTab) {
            toSave.engine.burnEfficiency = fuelTab.value
                .split('\n')
                .map(line => line.trim().replace(/,$/, ''));
        }

        const fileName = await window.presets.save(toSave);
        if (fileName) alert(`✓ Saved as ${fileName}`);
    };

    // 7) Reveal the user-preset folder in Explorer/Finder
    const handleOpenPresetFolder = () => {
        window.presets.openFolder();
    };

    // Revert changes by writing original raw text back to files
    const handleRevert = async () => {
        for (const [partKey, part] of Object.entries(vehicleData.parts)) {
            const original = part.raw || part.parsed.raw;
            const { success, message } = await window.electron.writeFile(part.filePath, original);
            if (!success) {
                return alert(`Failed to revert ${partKey}: ${message}`);
            }
        }
        setPendingChanges({});
        setIsApplied(false);
    };

    return (
        <div className="app-root">
            <Header
                isReady={isReady}
                setIsReady={setIsReady}
                setVehicleData={data => {
                    setVehicleData(data);
                    setPendingChanges({});
                    setActiveView('General');
                }}
                vehicleData={vehicleData}
                pendingChanges={pendingChanges}
                onLoadBuiltIn={handleLoadBuiltIn}
                onAppendBuiltIn={handleAppendBuiltIn}
                onLoadUser={handleLoadUser}
                onAppendUser={handleAppendUser}
                onEditMetadata={() => setActiveView('Meta')}
                onOpenSettings={handleOpenSettings}
                defaultExportLocation={defaultExportLocation}
            />

            {activeView === 'Settings' ? (
                <SettingsTab
                    exportPath={defaultExportLocation}
                    onExportPathChange={setDefaultExportLocation}
                    onExit={() => setActiveView('General')}
                />
            ) : (
                isReady && vehicleData && (
                    <>
                        {activeView === 'Meta' ? (
                            <MetaTab
                                modelExtracted={vehicleData.parts.infoModel.extracted}
                                modelPending={pendingChanges.infoModel || {}}
                                trimExtracted={vehicleData.parts.infoTrim.extracted}
                                trimPending={pendingChanges.infoTrim || {}}
                                onFieldChange={handleFieldChange}
                                onExit={() => setActiveView('General')} // ← back to tabs
                            />
                        ) : (
                            <TabStrip
                                parts={vehicleData.parts}
                                onFieldChange={handleFieldChange}
                                pendingChanges={pendingChanges}
                                active={activeView} // ← controlled
                                onTabChange={setActiveView} // ← controlled
                            />
                        )}
                        <Footer
                            onApply={handleApplyChanges}
                            onRevert={handleRevert}
                            onSavePreset={handleSavePreset}
                            onOpenPresetFolder={handleOpenPresetFolder}
                            isApplied={isApplied}
                        />
                    </>
                )
            )}
        </div>
    );
}
