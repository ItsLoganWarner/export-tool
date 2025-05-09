// src/components/Tabs/TabStrip.jsx
import React, { useState } from 'react';
import GeneralTab from './tabs/GeneralTab';
import AfterFireTab from './tabs/AfterFire/AfterFireTab';
import ExhaustTab from './tabs/ExhaustTab';
import ForcedInductionTab from './tabs/ForcedInduction/ForcedInductionTab';

const tabs = ['General', 'Exhaust', 'AfterFire', 'Forced Induction', 'Fuel', 'ESC', 'Sound Inject'];

const TabStrip = ({ extractedData, onFieldChange, pendingChanges }) => {
    const [selectedTab, setSelectedTab] = useState('General');

    const renderTab = () => {
        switch (selectedTab) {
            case 'General':
                return (
                    <GeneralTab
                        extractedData={extractedData}
                        onFieldChange={onFieldChange}
                        pendingChanges={pendingChanges}
                    />
                );
            case 'AfterFire':
                return (
                    <AfterFireTab
                        extractedData={extractedData}
                        onFieldChange={onFieldChange}
                        pendingChanges={pendingChanges}
                    />
                );
            case 'Exhaust':
                return (
                    <ExhaustTab
                        extractedData={extractedData}
                        onFieldChange={onFieldChange}
                        pendingChanges={pendingChanges}
                    />
                );
            case 'Forced Induction':
                return (
                    <ForcedInductionTab
                        extractedData={extractedData}
                        onFieldChange={onFieldChange}
                        pendingChanges={pendingChanges}
                    />
                );
            default:
                return <div>{selectedTab} tab coming soon...</div>;
        }
    };

    return (
        <div>
            <div style={styles.tabStrip}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        style={{
                            ...styles.tabButton,
                            backgroundColor: tab === selectedTab ? '#007F7F' : '#ccc',
                            color: tab === selectedTab ? 'white' : 'black',
                        }}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div style={styles.tabContent}>
                {renderTab()}
            </div>
        </div>
    );
};

const styles = {
    tabStrip: {
        display: 'flex',
        borderBottom: '2px solid black',
    },
    tabButton: {
        padding: '0.5rem 1rem',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        flex: 1,
    },
    tabContent: {
        padding: '1rem',
    },
};

export default TabStrip;
