// src/components/Tabs/tabs/FuelTab.jsx
import React, { useState, useEffect } from 'react';
import fuelSchema from '../../../schemas/engine/fuel.schema';
import "../../../styles/Tabs.css";


export default function FuelTab({
  extractedParts: { engine, fueltank },
  pendingChanges: { engine: pendEng = {}, fueltank: pendTank = {} },
  onFieldChange // (partKey, key, value)
}) {
  const fields = fuelSchema.fields;

  // local checkbox + input state
  const [checked, setChecked] = useState({});
  const [values, setValues]   = useState({});

  // whenever engine/fueltank or pendingChanges change, re‐init the form
  useEffect(() => {
    const initChecked = {};
    const initValues  = {};

    Object.entries(fields).forEach(([key, def]) => {
      const hasE = Object.prototype.hasOwnProperty.call(pendEng, key);
      const hasT = Object.prototype.hasOwnProperty.call(pendTank, key);
      initChecked[key] = hasE || hasT;

      let val;
      if (hasE)       val = pendEng[key];
      else if (hasT)  val = pendTank[key];
      else if (def.locations.engine)   val = engine[key] ?? def.default;
      else if (def.locations.fueltank) val = fueltank[key] ?? def.default;
      else                             val = def.default;

      // format textarea inner lines
      if (def.type === 'textarea') {
        try {
          val = val.map(pair => {
            const [a, b] = pair;
            const fa = typeof a === 'number' ? a.toFixed(2) : a;
            const fb = typeof b === 'number' ? b.toFixed(2) : b;
            return `[${fa}, ${fb}],`;
          }).join('\n');
        } catch {
          val = def.default;
        }
      }

      initValues[key] = val;
    });

    setChecked(initChecked);
    setValues(initValues);
  }, [engine, fueltank, pendEng, pendTank]);

  // toggle a field on/off
  const handleCheckbox = key => {
    const now = !checked[key];
    setChecked(c => ({ ...c, [key]: now }));

    if (!now) {
      Object.keys(fields[key].locations).forEach(partKey =>
        onFieldChange(partKey, key, null)
      );
    } else {
      const def = fields[key];
      let raw = values[key];
      if (def.type === 'textarea') {
        try {
          const text = values[key].trim().replace(/,\s*$/, '');
          raw = JSON.parse(`[${text}]`);
        } catch {
          raw = def.default;
        }
      }
      Object.keys(def.locations).forEach(partKey =>
        onFieldChange(partKey, key, raw)
      );
    }
  };

  // handle value edits
  const handleValueChange = (key, newRaw) => {
    const def = fields[key];
    setValues(v => ({ ...v, [key]: newRaw }));
    if (!checked[key]) return;

    let out;
    if (def.type === 'number') {
      const n = parseFloat(newRaw);
      out = isNaN(n) ? def.default : n;
    } else if (def.type === 'textarea') {
      try {
        const txt = newRaw.trim().replace(/,\s*$/, '');
        out = JSON.parse(`[${txt}]`);
      } catch {
        out = def.default;
      }
    } else {
      out = newRaw;
    }

    Object.keys(def.locations).forEach(partKey =>
      onFieldChange(partKey, key, out)
    );
  };

  return (
    <div className="card">
      {Object.entries(fields).map(([key, def]) => (
        <div key={key} className="field-row">
          <input
            type="checkbox"
            checked={checked[key] || false}
            onChange={() => handleCheckbox(key)}
            style={{ marginRight: 8 }}
          />
          <label title={def.tip} style={{ width: 180, fontWeight: 'bold' }}>{key}</label>

          {def.type === 'dropdown' ? (
            <>
              <select
                disabled={!checked[key]}
                value={values[key]}
                onChange={e => handleValueChange(key, e.target.value)}
                style={{ marginLeft: 10, width: 160 }}
              >
                <option value="">--</option>
                {def.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              {key === 'requiredEnergyType' && checked[key] && (
                <span style={{ color: 'red', marginLeft: 12 }}>
                  Note: If you want to fully change fuel types (updating densities and burn efficiency), there's probably already a Built-In Preset that does this for you.
                </span>
              )}
            </>
          ) : def.type === 'textarea' ? (
            <textarea
              disabled={!checked[key]}
              value={values[key]}
              onChange={e => handleValueChange(key, e.target.value)}
              style={{ marginLeft: 10, width: '100%', height: 120 }}
            />
          ) : (
            <input
              type={def.type === 'number' ? 'number' : 'text'}
              step={def.type === 'number' ? 'any' : undefined}
              disabled={!checked[key]}
              value={values[key]}
              onChange={e => handleValueChange(key, e.target.value)}
              style={{ marginLeft: 10, width: def.type === 'number' ? 100 : 200 }}
            />
          )}
          <div className="tooltip">{def.tip}</div>
        </div>
      ))}
    </div>
  );
}
