import React, { useState, useEffect } from 'react';
import wheelsSchema from '../../../schemas/engine/wheels.schema';
import "../../../styles/Tabs.css";


export default function TiresTab({
  extractedData,
  pendingChanges = {},
  onFieldChange  // (key, value) under the current partKey
}) {
  const fields = wheelsSchema.fields;
  const [checked, setChecked] = useState({});
  const [values,  setValues]  = useState({});

  // initialize whenever extractedData or pendingChanges change
  useEffect(() => {
    const initChecked = {};
    const initValues  = {};
    for (const [key, def] of Object.entries(fields)) {
      const has = Object.prototype.hasOwnProperty.call(pendingChanges, key);
      initChecked[key] = has;
      initValues[key]  = has
        ? pendingChanges[key]
        : (extractedData[key] ?? def.default);
    }
    setChecked(initChecked);
    setValues(initValues);
  }, [extractedData, pendingChanges]);

  const toggleField = (key) => {
    const now = !checked[key];
    setChecked(c => ({ ...c, [key]: now }));
    if (!now) {
      // uncheck → clear pending & reset
      const original = extractedData[key] ?? fields[key].default;
      setValues(v => ({ ...v, [key]: original }));
      onFieldChange(key, null);
    } else {
      // check → emit current value
      onFieldChange(key, values[key]);
    }
  };

  const changeValue = (key, raw) => {
    const def = fields[key];
    let val = raw;
    if (def.type === 'number') {
      const n = parseFloat(raw);
      val = isNaN(n) ? def.default : n;
    }
    setValues(v => ({ ...v, [key]: val }));
    if (checked[key]) {
      onFieldChange(key, val);
    }
  };

  return (
    <div className="card">
      {Object.entries(fields).map(([key, def]) => (
        <div key={key} className="field-row">
          <input
            type="checkbox"
            checked={checked[key]||false}
            onChange={() => toggleField(key)}
            style={{ marginRight:8 }}
          />
          <label title={def.tip} style={{ width:200, fontWeight:'bold' }}>
            {key}
          </label>
          <input
            type="number"
            disabled={!checked[key]}
            value={values[key]}
            onChange={e => changeValue(key, e.target.value)}
            style={{ width:100, marginLeft:10 }}
          />
          <div className="tooltip">{def.tip}</div>
        </div>
      ))}
    </div>
  );
}
