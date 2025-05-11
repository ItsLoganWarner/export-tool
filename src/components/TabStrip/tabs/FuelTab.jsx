import React, { useState, useEffect } from 'react';
import fuelSchema from '../../../schemas/engine/fuel.schema';

export default function FuelTab({
  // assume vehicleData.parts = { engine: {...}, tank: {...} }
  extractedParts,     // { engine: {...}, tank: {...} }
  pendingChanges = {},// { engine: {...}, tank: {...} }
  onFieldChange       // (partKey, fieldKey, value) => void
}) {
  const fields = fuelSchema.fields;
  const [checked, setChecked] = useState({});
  const [values,  setValues]  = useState({});

  // initialize state from both parts
  useEffect(() => {
    const initChecked = {};
    const initValues  = {};

    Object.entries(fields).forEach(([key, def]) => {
      // if either part has a change for this key
      const isEngineChanged = pendingChanges.engine?.hasOwnProperty(key);
      const isTankChanged   = pendingChanges.tank?.hasOwnProperty(key);
      const hasChange = isEngineChanged || isTankChanged;
      initChecked[key] = hasChange;

      // display value prefers engine change, then tank change, then engine extracted, then tank extracted, then default
      let val = def.default;
      if (isEngineChanged) val = pendingChanges.engine[key];
      else if (isTankChanged) val = pendingChanges.tank[key];
      else if (extractedParts.engine[key] != null) val = extractedParts.engine[key];
      else if (extractedParts.tank[key] != null) val = extractedParts.tank[key];

      // strip quotes for dropdown display
      initValues[key] = typeof val === 'string' ? val.replace(/"/g,'') : val;
    });

    setChecked(initChecked);
    setValues(initValues);
  }, [extractedParts, pendingChanges]);

  // toggle a field on/off
  const handleCheckbox = (key) => {
    const now = !checked[key];
    setChecked(c => ({ ...c, [key]: now }));
    if (!now) {
      // clearing both parts
      onFieldChange('engine', key, null);
      onFieldChange('tank',   key, null);
    } else {
      // turning on: emit current value to both
      const val = values[key];
      onFieldChange('engine', key, `"${val}"`);
      onFieldChange('tank',   key, `"${val}"`);
    }
  };

  // value changed in the dropdown
  const handleValueChange = (key, raw) => {
    setValues(v => ({ ...v, [key]: raw }));
    if (checked[key]) {
      onFieldChange('engine', key, `"${raw}"`);
      onFieldChange('tank',   key, `"${raw}"`);
    }
  };

  return (
    <div className="card">
      {Object.entries(fields).map(([key, def]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={checked[key] || false}
            onChange={() => handleCheckbox(key)}
            style={{ marginRight: 8 }}
          />
          <label title={def.tip} style={{ width: 180, fontWeight: 'bold' }}>{key}</label>
          <select
            disabled={!checked[key]}
            value={values[key]}
            onChange={e => handleValueChange(key, e.target.value)}
            style={{ marginLeft: 10, width: 200 }}
          >
            {def.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
