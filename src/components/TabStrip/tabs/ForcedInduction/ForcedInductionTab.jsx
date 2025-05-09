// src/components/Tabs/tabs/ForcedInductionTab.jsx
import React, { useState, useEffect } from 'react';
import turboSchema from '../../../../schemas/engine/forcedInduction/turbocharger.schema.js';
import superSchema from '../../../../schemas/engine/forcedInduction/supercharger.schema.js';
import { forcedInductionSounds } from './forcedInductionOptions.js';

const ForcedInductionTab = ({ extractedData, onFieldChange, pendingChanges }) => {
  const hasTurbo = 'bovSoundFileName' in extractedData;
  const hasSuper = 'twistedLobes'     in extractedData;
  if (!hasTurbo && !hasSuper) return <div>No forced induction detected.</div>;
  if (hasTurbo && hasSuper) return <div>Twin-Charging not currently supported its too much of a pain in the ass with the current shit ass parsing technique sorry.</div>;

  const schema    = hasTurbo ? turboSchema : superSchema;
  const label     = hasTurbo ? 'Turbocharger' : 'Supercharger';
  const soundKey  = hasTurbo ? 'turbo' : 'supercharger';
  const prefix    = 'event:>Vehicle>Forced_Induction>';
  const { fields } = schema;

  const [checked, setChecked] = useState({});
  const [values,  setValues]  = useState({});

  useEffect(() => {
    const initChecked = {};
    const initValues  = {};

    for (const [key, def] of Object.entries(fields)) {
      const hasChange = pendingChanges.hasOwnProperty(key);
      initChecked[key] = hasChange;

      let raw = hasChange
        ? pendingChanges[key]
        : (extractedData[key] ?? def.default);

      if (def.type === 'dropdown' && typeof raw === 'string' && raw.startsWith(prefix)) {
        raw = raw.slice(prefix.length);
      }
      initValues[key] = raw;
    }

    setChecked(initChecked);
    setValues(initValues);
  }, [extractedData, pendingChanges, fields, prefix]);

  const toggleField = (key) => {
    const now = !checked[key];
    setChecked(prev => ({ ...prev, [key]: now }));

    if (now) {
      onFieldChange(key, 
        fields[key].type === 'dropdown'
          ? prefix + values[key]
          : values[key]
      );
    } else {
      let orig = extractedData[key] ?? fields[key].default;
      if (fields[key].type === 'dropdown' && typeof orig === 'string' && orig.startsWith(prefix)) {
        orig = orig.slice(prefix.length);
      }
      setValues(prev => ({ ...prev, [key]: orig }));
      onFieldChange(key, null);
    }
  };

  const changeField = (key, raw) => {
    let val = raw;
    if (fields[key].type === 'number') {
      const n = parseFloat(raw);
      val = isNaN(n) ? 0 : n;
    }
    setValues(prev => ({ ...prev, [key]: val }));

    if (checked[key]) {
      onFieldChange(key, 
        fields[key].type === 'dropdown'
          ? prefix + val
          : val
      );
    }
  };

  return (
    <div>
      <h3 style={{ marginTop: 20, borderBottom: '1px solid #333' }}>{label}</h3>
      {Object.entries(fields).map(([key, def]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={checked[key] || false}
            onChange={() => toggleField(key)}
            style={{ marginRight: 8 }}
          />
          <label title={def.tip} style={{ width: 240, fontWeight: 'bold' }}>{key}</label>
          {def.type === 'dropdown' ? (
            <select
              disabled={!checked[key]}
              value={values[key] ?? ''}
              onChange={e => changeField(key, e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="">--</option>
              {(forcedInductionSounds[soundKey][def.category] || []).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={def.type === 'number' ? 'number' : 'text'}
              step={def.type === 'number' ? '0.01' : undefined}
              disabled={!checked[key]}
              value={values[key]}
              onChange={e => changeField(key, e.target.value)}
              style={{
                marginLeft: 10,
                width: def.type === 'number' ? 100 : 200
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ForcedInductionTab;
