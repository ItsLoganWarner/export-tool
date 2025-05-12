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
import { GiCarWheel, GiCartwheel } from "react-icons/gi";

import GeneralTab from './tabs/GeneralTab';
import AfterFireTab from './tabs/AfterFire/AfterFireTab';
import ExhaustTab from './tabs/ExhaustTab';
import ForcedInductionTab from './tabs/ForcedInduction/ForcedInductionTab';
import './TabStrip.css';
import FuelTab from './tabs/FuelTab';
import TiresTab from './tabs/TiresTab';

const tabDefinitions = [
    { key: 'General', icon: <PiEngineFill /> },
    { key: 'Exhaust', icon: <PiSpeakerSimpleLowFill /> },
    { key: 'AfterFire', icon: <GiCrownedExplosion /> },
    { key: 'Forced Induction', icon: <SiTurbo /> },
    { key: 'Fuel', icon: <FaGasPump /> },
    { key: 'Front Tires', icon: <GiCartwheel /> },
    { key: 'Rear Tires', icon: <GiCarWheel /> },
    { key: 'ESC', icon: <FaCarCrash /> },
    { key: 'Sound Inject', icon: <BsSoundwave /> }
];

export default function TabStrip({
    parts,               // { engine, fueltank, wheels_front, wheels_rear, … }
    onFieldChange,       // (partKey, fieldKey, value)
    pendingChanges       // { engine: {...}, fueltank: {...}, wheels_front: {...}, wheels_rear: {...}, … }
}) {
    const [active, setActive] = useState('General');
    const enginePart = parts.engine || { extracted: {}, raw: '' };
    const fuelPart = parts.fueltank || { extracted: {}, raw: '' };
    const frontTirePart = parts.wheels_front || { extracted: {}, raw: '' };
    const rearTirePart = parts.wheels_rear || { extracted: {}, raw: '' };

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
                        fueltank: fuelPart.extracted
                    }}
                    pendingChanges={{
                        engine: pendingChanges.engine || {},
                        fueltank: pendingChanges.fueltank || {}
                    }}
                    onFieldChange={onFieldChange}
                />;

            case 'Front Tires':
                return <TiresTab
                    extractedData={frontTirePart.extracted}
                    pendingChanges={pendingChanges.wheels_front || {}}
                    onFieldChange={(key, val) => onFieldChange('wheels_front', key, val)}
                />;

            case 'Rear Tires':
                return <TiresTab
                    extractedData={rearTirePart.extracted}
                    pendingChanges={pendingChanges.wheels_rear || {}}
                    onFieldChange={(key, val) => onFieldChange('wheels_rear', key, val)}
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
