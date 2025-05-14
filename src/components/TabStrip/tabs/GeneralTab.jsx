// src/components/TabStrip/tabs/GeneralTab.jsx
import React, { useState, useEffect } from 'react';
import generalSchema from '../../../schemas/engine/general.schema';
import "../../../styles/Tabs.css";

const GeneralTab = ({ extractedData, onFieldChange, pendingChanges = {}}) => {
  const [checked, setChecked] = useState({});
  const [values,  setValues]  = useState({});

  // Re-init whenever extractedData or pendingChanges changes
  useEffect(() => {
    if (!extractedData) return;
    const initChecked = {};
    const initValues  = {};

    for (const [key, def] of Object.entries(generalSchema.fields)) {
      const hasChange = pendingChanges.hasOwnProperty(key);
      initChecked[key] = hasChange;
      initValues[key]  = hasChange
        ? pendingChanges[key]
        : (extractedData[key] ?? def.default);
    }

    setChecked(initChecked);
    setValues(initValues);
  }, [extractedData, pendingChanges]);

  const handleCheckboxChange = (key) => {
    const now = !checked[key];
    setChecked(prev => ({ ...prev, [key]: now }));

    if (now) {
      // checked → emit current value
      onFieldChange(key, values[key]);
    } else {
      // unchecked → revert + clear
      const original = extractedData[key] ?? generalSchema.fields[key].default;
      setValues(prev => ({ ...prev, [key]: original }));
      onFieldChange(key, null);
    }
  };

  const handleValueChange = (key, raw) => {
    let val = raw;
    const type = generalSchema.fields[key].type;

    if (type === 'number') {
      const n = parseFloat(raw);
      val = isNaN(n) ? 0 : n;
    } else if (type === 'boolean') {
      val = raw === 'true';
    }

    setValues(prev => ({ ...prev, [key]: val }));
    if (checked[key]) {
      onFieldChange(key, val);
    }
  };

  return (
    <div className="card">
      {Object.entries(generalSchema.fields).map(([key, { type, tip }]) => (
        <div key={key} className="field-row">
          <input
            type="checkbox"
            checked={checked[key] || false}
            onChange={() => handleCheckboxChange(key)}
            style={{ marginRight: 8 }}
          />
          <label title={tip} style={{ width: 200, fontWeight: 'bold' }}>{key}</label>
          {type === 'number' ? (
            <input
              type="number"
              disabled={!checked[key]}
              value={values[key]}
              onChange={e => handleValueChange(key, e.target.value)}
              style={{ width: 100, marginLeft: 10 }}
            />
          ) : type === 'boolean' ? (
            <select
              disabled={!checked[key]}
              value={values[key] ? 'true' : 'false'}
              onChange={e => handleValueChange(key, e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <input
              type="text"
              disabled={!checked[key]}
              value={values[key]}
              onChange={e => handleValueChange(key, e.target.value)}
              style={{ width: 200, marginLeft: 10 }}
            />
          )}
          <div className="tooltip">{tip}</div>
        </div>
      ))}
    </div>
  );
};

export default GeneralTab;
