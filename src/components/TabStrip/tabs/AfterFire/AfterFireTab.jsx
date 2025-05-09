// src/components/Tabs/tabs/AfterFireTab.jsx
import React, { useState, useEffect } from 'react';
import { afterfireSounds } from './afterfireOptions';

const schema = {
  prefix: "event:>Vehicle>Afterfire>",
  fields: {
    instantAfterFireVolumeCoef:   { type: "number",   default: 0.6,    tip: "" },
    sustainedAfterFireVolumeCoef: { type: "number",   default: 0.55,   tip: "" },
    shiftAfterFireVolumeCoef:     { type: "number",   default: 0.8,    tip: "" },
    instantAfterFireSound:        { type: "dropdown", default: "Default", category: "single", tip: "" },
    sustainedAfterFireSound:      { type: "dropdown", default: "Default", category: "multi",  tip: "" },
    shiftAfterFireSound:          { type: "dropdown", default: "Default", category: "shift",  tip: "" },
  }
};

const AfterFireTab = ({ extractedData, onFieldChange, pendingChanges }) => {
  const [checked, setChecked] = useState({});
  const [values,  setValues]  = useState({});

  // 1) Init from extractedData & pendingChanges
  useEffect(() => {
    const initChecked = {};
    const initValues  = {};

    for (const [key, def] of Object.entries(schema.fields)) {
      const hasChange = pendingChanges.hasOwnProperty(key);
      initChecked[key] = hasChange;

      let raw = hasChange
        ? pendingChanges[key]
        : (extractedData?.[key] ?? def.default);

      // strip off prefix for dropdown display
      if (def.type === 'dropdown' && typeof raw === 'string' && raw.startsWith(schema.prefix)) {
        raw = raw.slice(schema.prefix.length);
      }
      initValues[key] = raw;
    }

    setChecked(initChecked);
    setValues(initValues);
  }, [extractedData, pendingChanges]);

  // 2) Checkbox toggle
  const handleCheckboxChange = (key) => {
    const now = !checked[key];
    setChecked(prev => ({ ...prev, [key]: now }));

    if (now) {
      // check → send value (only prefix if dropdown)
      const def = schema.fields[key];
      const send = def.type === 'dropdown'
        ? schema.prefix + values[key]
        : values[key];
      onFieldChange(key, send);
    } else {
      // uncheck → revert + clear
      const def = schema.fields[key];
      let orig = extractedData?.[key] ?? def.default;
      if (def.type === 'dropdown' && typeof orig === 'string' && orig.startsWith(schema.prefix)) {
        orig = orig.slice(schema.prefix.length);
      }
      setValues(prev => ({ ...prev, [key]: orig }));
      onFieldChange(key, null);
    }
  };

  // 3) Value edits
  const handleFieldChange = (key, raw) => {
    const def = schema.fields[key];
    let val = raw;

    if (def.type === 'number') {
      const n = parseFloat(raw);
      val = isNaN(n) ? 0 : n;
    }

    setValues(prev => ({ ...prev, [key]: val }));
    if (checked[key]) {
      const send = def.type === 'dropdown'
        ? schema.prefix + val
        : val;
      onFieldChange(key, send);
    }
  };

  // 4) Render
  return (
    <div>
      {Object.entries(schema.fields).map(([key, def]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={checked[key] || false}
            onChange={() => handleCheckboxChange(key)}
            style={{ marginRight: 8 }}
          />
          <label title={def.tip} style={{ width: 220 }}>{key}</label>

          {def.type === 'dropdown' ? (
            <select
              disabled={!checked[key]}
              value={values[key] ?? ''}
              onChange={e => handleFieldChange(key, e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="Default">Default</option>
              {(afterfireSounds[def.category]||[]).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              step="0.01"
              disabled={!checked[key]}
              value={values[key]}
              onChange={e => handleFieldChange(key, e.target.value)}
              style={{ width: 100, marginLeft: 10 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AfterFireTab;
