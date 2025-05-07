// src/components/Header/Header.jsx
import React from 'react';

const Header = ({ isReady, setIsReady, setVehicleData }) => {
    const [modelName, setModelName] = React.useState('');
    const [engineFileName, setEngineFileName] = React.useState('');

    const handleSelectDirectory = async () => {
        const directoryPath = await window.electron.openDirectory();
        if (!directoryPath) return;

        const vehiclesPath = `${directoryPath}/vehicles`;
        const folders = await window.electron.readDirectory(vehiclesPath);
        if (!folders.length) return;

        const vehicleFolder = folders[0];
        const vehiclePath = `${vehiclesPath}/${vehicleFolder}`;

        const infoRaw = await window.electron.readFile(`${vehiclePath}/info.json`);
        const engineFolders = await window.electron.readDirectory(vehiclePath);
        const engineFolder = engineFolders.find(f => f.startsWith('eng_') && !f.includes('.'));
        const enginePath = `${vehiclePath}/${engineFolder}`;
        const engineFiles = await window.electron.readDirectory(enginePath);
        const engineFile = engineFiles.find(f => f.startsWith('camso_engine_') && f.endsWith('.jbeam'));
        const engineRaw = await window.electron.readFile(`${enginePath}/${engineFile}`);
        const parsedModelName = JSON.parse(infoRaw).Name;


        setModelName(parsedModelName);
        setEngineFileName(engineFile);
        setVehicleData({
            directoryPath,
            modelName: JSON.parse(infoRaw).Name,
            engineFileName: engineFile,
            engineRaw,
        });

        setIsReady(true);
    };

    return (
        <div className="header" style={styles.header}>
            <div style={styles.left}>
                <button onClick={handleSelectDirectory} style={styles.button}>Select Export Directory</button>
            </div>
            <div style={styles.center}>
                {isReady ? (
                    <>
                        <div>Car: <strong>{modelName}</strong></div>
                        <div>Engine: <strong>{engineFileName}</strong></div>
                    </>
                ) : (
                    <div style={styles.dimmed}>No vehicle loaded</div>
                )}
            </div>
            <div style={styles.right}>
                <button style={styles.button}>Load Quick Config</button>
            </div>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        borderBottom: '2px solid black',
        background: 'linear-gradient(to right, #007F7F, #009F9F)',
        color: 'white',
    },
    left: { flex: 1 },
    center: { flex: 2, textAlign: 'center' },
    right: { flex: 1, textAlign: 'right' },
    button: {
        padding: '0.5rem 1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    dimmed: {
        color: '#ccc',
        fontStyle: 'italic',
    }
};

export default Header;
