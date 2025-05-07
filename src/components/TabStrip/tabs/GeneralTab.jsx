// src/components/Tabs/GeneralTab.jsx
import React, { useState, useEffect } from 'react';
import engineSchema from '../../../schemas/camso_engine.schema';

const GeneralTab = ({ extractedData, onFieldChange }) => {
  const [checked, setChecked] = useState({});
  const [values, setValues] = useState({});

  useEffect(() => {
    if (!extractedData) return;

    const initialChecked = {};
    const initialValues = {};

    for (const [key, def] of Object.entries(engineSchema.fields)) {
      initialChecked[key] = false;
      initialValues[key] = extractedData[key] ?? def.default;
    }

    setChecked(initialChecked);
    setValues(initialValues);
  }, [extractedData]);

  const handleCheckboxChange = (key) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    onFieldChange(key, !checked[key] ? values[key] : null);
  };

  const handleValueChange = (key, value) => {
    const updated = { ...values, [key]: value };
    setValues(updated);
    if (checked[key]) {
      onFieldChange(key, value);
    }
  };

  if (!extractedData) return <div>Loading engine data...</div>;

  return (
    <div>
      {Object.entries(engineSchema.fields).map(([key, { type, tip }]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={checked[key] || false}
            onChange={() => handleCheckboxChange(key)}
            style={{ marginRight: '8px' }}
          />
          <label title={tip} style={{ width: '200px', fontWeight: 'bold' }}>
            {key}
          </label>
          {type === 'boolean' ? (
            <select
              disabled={!checked[key]}
              value={
                values[key] === true
                  ? 'true'
                  : values[key] === false
                  ? 'false'
                  : ''
              }
              onChange={(e) => handleValueChange(key, e.target.value === 'true')}
            >
              <option value="">--</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <input
              type="number"
              disabled={!checked[key]}
              value={values[key] ?? ''}
              onChange={(e) => handleValueChange(key, parseFloat(e.target.value) || 0)}
              style={{ width: '100px', marginLeft: '10px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default GeneralTab;
