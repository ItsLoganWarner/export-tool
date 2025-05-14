// compnents/TabStrip/tabs/AfterFire/AfterFireTab.jsx
import React, { useState, useEffect } from 'react';
import afterfireSchema from '../../../../schemas/engine/afterfire.schema';
import { afterfireSounds } from './afterfireOptions';
import "../../../../styles/Tabs.css";

export default function AfterFireTab({
  rawContent,
  extractedData,
  pendingChanges = {},
  onFieldChange
}) {
  const { prefix, fields } = afterfireSchema;
  const [checked, setChecked] = useState({});
  const [values, setValues] = useState({});

  // 1) Re-init whenever the file or your pendingChanges change
  useEffect(() => {
    const initChecked = {};
    const initValues = {};

    Object.entries(fields).forEach(([key, def]) => {
      const hasChange = pendingChanges.hasOwnProperty(key);
      initChecked[key] = hasChange;

      // prefer pending → extracted (which includes def.default if canBeMissing) → schema default
      let rawVal = hasChange
        ? pendingChanges[key]
        : (extractedData[key] != null ? extractedData[key] : def.default);

      // strip prefix for dropdown display
      if (
        def.type === 'dropdown' &&
        typeof rawVal === 'string' &&
        rawVal.startsWith(prefix)
      ) {
        rawVal = rawVal.slice(prefix.length);
      }
      initValues[key] = rawVal;
    });

    setChecked(initChecked);
    setValues(initValues);
  }, [extractedData, pendingChanges, prefix, fields]);

  // 2) Toggling a checkbox
  const handleCheckboxChange = (key) => {
    const def = fields[key];
    const now = !checked[key];
    setChecked(prev => ({ ...prev, [key]: now }));

    if (!now) {
      // uncheck → clear pending, reset display
      const original = extractedData[key] != null
        ? extractedData[key]
        : def.default;
      const display = (def.type === 'dropdown' && typeof original === 'string' && original.startsWith(prefix))
        ? original.slice(prefix.length)
        : original;
      setValues(v => ({ ...v, [key]: display }));
      onFieldChange(key, null);
      return;
    }

    // now === checked on
    // only emit if it's not the literal Default
    if (!(def.type === 'dropdown' && values[key] === def.default)) {
      const toSend = def.type === 'dropdown'
        ? prefix + values[key]
        : values[key];
      onFieldChange(key, toSend);
    }
  };

  // 3) Changing a field
  const handleFieldChange = (key, raw) => {
    const def = fields[key];
    let val = raw;

    if (def.type === 'number') {
      const n = parseFloat(raw);
      val = isNaN(n) ? def.default : n;
    }

    // if they pick “Default” from the dropdown, we treat that as clearing
    if (def.type === 'dropdown' && val === def.default) {
      // we clear any previous pending, but leave the box checked so they can re-pick
      onFieldChange(key, null);
      setValues(v => ({ ...v, [key]: val }));
      return;
    }

    setValues(prev => ({ ...prev, [key]: val }));

    if (checked[key]) {
      const toSend = def.type === 'dropdown'
        ? prefix + val
        : val;
      onFieldChange(key, toSend);
    }
  };

  // 4) Render
  return (
    <div className="card">
      {Object.entries(fields).map(([key, def]) => (
        <div key={key} className="field-row">
          <input
            type="checkbox"
            checked={checked[key] || false}
            onChange={() => handleCheckboxChange(key)}
            style={{ marginRight: 8 }}
          />
          <label title={def.tip} style={{ width: 220, fontWeight: 'bold' }}>{key}</label>

          {def.type === 'dropdown' ? (
            <select
              disabled={!checked[key]}
              value={values[key] ?? ''}
              onChange={e => handleFieldChange(key, e.target.value)}
              style={{ marginLeft: 10, width: 220, }}
            >
              <option value={def.default}>{def.default}</option>
              {(afterfireSounds[def.category] || []).map(opt => (
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
          <div className="tooltip">{def.tip}</div>
        </div>
      ))}
    </div>
  );
}
