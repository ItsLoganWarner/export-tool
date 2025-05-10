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

const tabDefinitions = [
  { key: 'General',     icon: <PiEngineFill /> },
  { key: 'Exhaust',     icon: <PiSpeakerSimpleLowFill /> },
  { key: 'AfterFire',   icon: <GiCrownedExplosion  /> },
  { key: 'Forced Induction', icon: <SiTurbo  /> },
  { key: 'Fuel',        icon: <FaGasPump /> },
  { key: 'ESC',         icon: <FaCarCrash /> },
  { key: 'Sound Inject',icon: <BsSoundwave   /> }
];

export default function TabStrip({
  extractedData,
  rawContent,
  onFieldChange,
  pendingChanges
}) {
  const [active, setActive] = useState('General');

  const renderPanel = () => {
    switch (active) {
      case 'General':
        return <GeneralTab
          extractedData={extractedData}
          onFieldChange={onFieldChange}
          pendingChanges={pendingChanges}
        />;
      case 'Exhaust':
        return <ExhaustTab
          extractedData={extractedData}
          onFieldChange={onFieldChange}
          pendingChanges={pendingChanges}
        />;
      case 'AfterFire':
        return <AfterFireTab
          extractedData={extractedData}
          rawContent={rawContent}
          onFieldChange={onFieldChange}
          pendingChanges={pendingChanges}
        />;
      case 'Forced Induction':
        return <ForcedInductionTab
          extractedData={extractedData}
          onFieldChange={onFieldChange}
          pendingChanges={pendingChanges}
        />;
      default:
        return <div  className="card" style={{fontWeight: 'bold' }}>{active} tab coming soon…</div>;
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
