import React, { useState } from 'react';
import {
    FaGasPump,
    FaCarCrash
} from 'react-icons/fa';
import {
    PiEngineFill,
    PiSpeakerSimpleLowFill
} from "react-icons/pi";
import { BsSoundwave } from "react-icons/bs";
import { GiCrownedExplosion } from "react-icons/gi";
import { SiTurbo } from "react-icons/si";

import GeneralTab from './tabs/GeneralTab';
import AfterFireTab from './tabs/AfterFire/AfterFireTab';
import ExhaustTab from './tabs/ExhaustTab';
import ForcedInductionTab from './tabs/ForcedInduction/ForcedInductionTab';
import './TabStrip.css';
import FuelTab from './tabs/FuelTab';

const tabDefinitions = [
    { key: 'General', icon: <PiEngineFill /> },
    { key: 'Exhaust', icon: <PiSpeakerSimpleLowFill /> },
    { key: 'AfterFire', icon: <GiCrownedExplosion /> },
    { key: 'Forced Induction', icon: <SiTurbo /> },
    { key: 'Fuel', icon: <FaGasPump /> },
    { key: 'ESC', icon: <FaCarCrash /> },
    { key: 'Sound Inject', icon: <BsSoundwave /> }
];

export default function TabStrip({
    parts,               // { engine, fuel_tank, … }
    onFieldChange,       // (partKey, fieldKey, value)
    pendingChanges       // { engine: {...}, fuel_tank: {...}, … }
}) {
    const [active, setActive] = useState('General');
    const enginePart = parts.engine     || { extracted:{}, raw: '' };
    const fuelPart   = parts.fuel_tank  || { extracted:{}, raw: '' };

    const renderPanel = () => {
        switch (active) {
            case 'General':
                return <GeneralTab
                    extractedData={enginePart.extracted}
                    onFieldChange={(key, val) => onFieldChange('engine', key, val)}
                    pendingChanges={pendingChanges.engine || {}}
                />;

            case 'Exhaust':
                return <ExhaustTab
                    extractedData={enginePart.extracted}
                    onFieldChange={(key, val) => onFieldChange('engine', key, val)}
                    pendingChanges={pendingChanges.engine || {}}
                />;

            case 'AfterFire':
                return <AfterFireTab
                    extractedData={enginePart.extracted}
                    rawContent={enginePart.raw}
                    onFieldChange={(key, val) => onFieldChange('engine', key, val)}
                    pendingChanges={pendingChanges.engine || {}}
                />;

            case 'Forced Induction':
                return <ForcedInductionTab
                    extractedData={enginePart.extracted}
                    onFieldChange={(key, val) => onFieldChange('engine', key, val)}
                    pendingChanges={pendingChanges.engine || {}}
                />;

            case 'Fuel':
                return <FuelTab
                    extractedParts={{
                        engine: enginePart.extracted,
                        tank: fuelPart.extracted
                    }}
                    pendingChanges={{
                        engine: pendingChanges.engine || {},
                        tank: pendingChanges.fuel_tank || {}
                    }}
                    onFieldChange={onFieldChange}
                />;

            default:
                return <div className="card" style={{ fontWeight: 'bold' }}>{active} tab coming soon…</div>;
        }
    };

    return (
        <div className="app-container">
            <nav className="sidebar">
                {tabDefinitions.map(({ key, icon }) => (
                    <button
                        key={key}
                        className={`sidebar-tab${active === key ? ' active' : ''}`}
                        onClick={() => setActive(key)}
                    >
                        {icon}
                        <span className="sidebar-label">{key}</span>
                    </button>
                ))}
            </nav>
            <div className="content">
                {renderPanel()}
            </div>
        </div>
    );
}
