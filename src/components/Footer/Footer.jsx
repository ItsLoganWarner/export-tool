// src/components/Footer/Footer.jsx
import React from 'react';

const Footer = ({
    onApplyChanges,
    onSavePreset,        // new
    onOpenPresetFolder   // new
}) => {
    return (
        <div style={styles.container}>
            <div style={styles.right}>
                <button style={styles.button} onClick={onApplyChanges}>
                    Apply Changes
                </button>
                <button style={styles.button} onClick={onSavePreset}>
                    Save Preset
                </button>
                <button
                    style={styles.button}
                    onClick={onOpenPresetFolder}
                    title="Open Preset Folder"
                >
                    📂
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginTop: 'auto',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: '1px solid #333',
    },
    right: {
        display: 'flex',
        gap: '1rem',
    },
    button: {
        padding: '0.5rem 1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    }
};

export default Footer;
