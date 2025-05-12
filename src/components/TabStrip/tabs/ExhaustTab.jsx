// src/components/Tabs/tabs/ExhaustTab.jsx
import React, { useState, useEffect } from 'react';
import exhaustSchema from '../../../schemas/engine/exhaust.schema';
import "../../../styles/Tabs.css";


const ExhaustTab = ({ extractedData, onFieldChange, pendingChanges= {} }) => {
  const [checked, setChecked] = useState({});
  const [values,  setValues]  = useState({});

  // 1) Re-init from extractedData & pendingChanges
  useEffect(() => {
    if (!extractedData) return;
    const initChecked = {};
    const initValues  = {};

    for (const [key, def] of Object.entries(exhaustSchema.fields)) {
      const hasChange = pendingChanges.hasOwnProperty(key);
      initChecked[key] = hasChange;
      initValues[key]  = hasChange
        ? pendingChanges[key]
        : (extractedData[key] ?? def.default);
    }

    setChecked(initChecked);
    setValues(initValues);
  }, [extractedData, pendingChanges]);

  // 2) Checkbox toggle
  const handleCheckboxChange = (key) => {
    const now = !checked[key];
    setChecked(prev => ({ ...prev, [key]: now }));

    if (now) {
      // checked → send current value
      onFieldChange(key, values[key]);
    } else {
      // unchecked → revert to original + clear
      const original = extractedData[key] ?? exhaustSchema.fields[key].default;
      setValues(prev => ({ ...prev, [key]: original }));
      onFieldChange(key, null);
    }
  };

  // 3) Value edits
  const handleFieldChange = (key, raw) => {
    const def = exhaustSchema.fields[key];
    let val = raw;

    if (def.type === 'number') {
      const n = parseFloat(raw);
      val = isNaN(n) ? 0 : n;
    } else if (def.type === 'boolean') {
      val = raw === 'true';
    }

    setValues(prev => ({ ...prev, [key]: val }));

    if (checked[key]) {
      onFieldChange(key, val);
    }
  };

  // 4) Render
  return (
    <div className="card">
      {Object.entries(exhaustSchema.fields).map(([key, { type, tip }]) => (
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
              onChange={e => handleFieldChange(key, e.target.value)}
              style={{ width: 100, marginLeft: 10 }}
            />
          ) : type === 'boolean' ? (
            <select
              disabled={!checked[key]}
              value={values[key] ? 'true' : 'false'}
              onChange={e => handleFieldChange(key, e.target.value)}
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
              onChange={e => handleFieldChange(key, e.target.value)}
              style={{ width: 200, marginLeft: 10 }}
            />
          )}
          <div className="tooltip">{tip}</div>
        </div>
      ))}
    </div>
  );
};

export default ExhaustTab;
