// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header/Header';
import TabStrip from './components/TabStrip/TabStrip';
import { loadVehicleData } from './utils/loadVehicleData'; // Assuming this is a utility function to load vehicle data
import Footer from './components/Footer/Footer';

const App = () => {
    const [vehicleData, setVehicleData] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({});
    const [isApplied, setIsApplied] = useState(false);

    // 1) Field edits (remove key if null/undefined)
    const handleFieldChange = (partKey, key, value) => {
        setPendingChanges(prev => {
            const part = { ...(prev[partKey] || {}) };
            if (value == null) delete part[key];
            else part[key] = value;
            return { ...prev, [partKey]: part };
        });
    };

    // 2) Write to disk
    const handleApplyChanges = async () => {
        for (const [part, changes] of Object.entries(pendingChanges)) {
            if (!Object.keys(changes).length) continue;
            const path = vehicleData.parts[part].filePath;
            const res = await window.electron.applyChanges(path, changes);
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
    //    but patch in the raw textarea string for burnEfficiency
    const handleSavePreset = async () => {
        // Make a shallow copy
        const toSave = { ...pendingChanges };
        // If the engine has burnEfficiency, pull it from the FuelTab's values
        const fuelTab = document.querySelector('textarea[name="burnEfficiency"]');
        if (toSave.engine?.burnEfficiency && fuelTab) {
            toSave.engine.burnEfficiency = fuelTab.value
                .split('\n')
                .map(line => line.trim().replace(/,$/, ''));
            // now it's an array of strings like "[0.00, 1.00]"
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
        // Write each part's original raw text back to its file
        for (const [partKey, part] of Object.entries(vehicleData.parts)) {
            const original = part.raw || part.parsed.raw;
            const { success, message } = await window.electron.writeFile(part.filePath, original);
            if (!success) {
                return alert(`Failed to revert ${partKey}: ${message}`);
            }
        }
        // Clear UI diffs & flip back
        setPendingChanges({});
        setIsApplied(false);
    };

    return (
        <div className="app-root">
            <Header
                isReady={isReady}
                setIsReady={setIsReady}
                setVehicleData={handleNewVehicle}
                vehicleData={vehicleData}
                onLoadBuiltIn={handleLoadBuiltIn}
                onAppendBuiltIn={handleAppendBuiltIn}
                onLoadUser={handleLoadUser}
                onAppendUser={handleAppendUser}
            />

            {isReady && vehicleData && (
                <>
                    <TabStrip
                        parts={vehicleData.parts}
                        onFieldChange={handleFieldChange}
                        pendingChanges={pendingChanges}
                    />
                    <Footer
                        onApplyChanges={isApplied ? handleRevert : handleApplyChanges}
                        onSavePreset={handleSavePreset}
                        onOpenPresetFolder={handleOpenPresetFolder}
                        isApplied={isApplied}
                    />
                </>
            )}
        </div>
    );
};

export default App;
