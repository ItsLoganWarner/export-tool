// src/components/MetaTab.jsx
import React, { useState, useEffect } from 'react';
import { getSchemasForPart } from '../utils/getSchema';
import { FaArrowLeft }       from 'react-icons/fa';
import '../styles/MetaTab.css';

export default function MetaTab({
  modelExtracted,
  modelPending,
  trimExtracted,
  trimPending,
  onFieldChange,
  onExit
}) {
  // — the two parsed JSON blobs you pass down —
  const xsModel = modelExtracted;
  const xsTrim  = trimExtracted;

  // — grab & flatten each schema —
  const schemaM = getSchemasForPart('infoModel') || [];
  const schemaT = getSchemasForPart('infoTrim')  || [];
  const fieldsM = Object.assign({}, ...schemaM.map(s => s.fields));
  const fieldsT = Object.assign({}, ...schemaT.map(s => s.fields));

  // unify into a single list: [ [fieldKey, def, partKey], … ]
  const allFields = [
    ...Object.entries(fieldsM).map(([k,def]) => [k, def, 'infoModel']),
    ...Object.entries(fieldsT).map(([k,def]) => [k, def, 'infoTrim'])
  ];

  // helpers for local state keys
  const mk = (part, key) => `${part}::${key}`;
  const [checked, setChecked] = useState({});
  const [values,  setValues]  = useState({});

  // re-init whenever any of our inputs change
  useEffect(() => {
    const c = {}, v = {};
    allFields.forEach(([key, def, part]) => {
      const pend = part === 'infoModel' ? modelPending : trimPending;
      const ex   = part === 'infoModel' ? xsModel      : xsTrim;
      const has  = Object.prototype.hasOwnProperty.call(pend, key);
      c[mk(part, key)] = has;
      v[mk(part, key)] = has
        ? pend[key]
        : (ex[key] != null ? ex[key] : def.default);
    });
    setChecked(c);
    setValues(v);
  }, [modelExtracted, trimExtracted, modelPending, trimPending]);

  // toggle a checkbox on/off
  function toggle(part, key) {
    const id = mk(part, key);
    const now = !checked[id];
    setChecked(ch => ({ ...ch, [id]: now }));
    onFieldChange(part, key, now ? values[id] : null);
  }

  // change a field value
  function change(part, key, raw) {
    const id  = mk(part, key);
    const def = part === 'infoModel' ? fieldsM[key] : fieldsT[key];
    let v;
    if (def.type === 'number')   v = parseFloat(raw) || def.default;
    else if (def.type === 'boolean') v = (raw === 'true');
    else                           v = raw;
    setValues(vs => ({ ...vs, [id]: v }));
    if (checked[id]) onFieldChange(part, key, v);
  }

  return (
    <div className="meta-container">
      <button className="btn back-btn" onClick={onExit}>
        <FaArrowLeft style={{ marginRight: 8 }}/> Back to Parts
      </button>

      <div className="card">
        {allFields.map(([key, def, part]) => {
          const id = mk(part, key);
          return (
            <div className="field-row" key={id}>
              <input
                type="checkbox"
                checked={checked[id] || false}
                onChange={() => toggle(part, key)}
              />
              <label title={def.tip} className="field-label">
                {key} <small>({part === 'infoModel' ? 'Model' : 'Config'})</small>
              </label>
              {def.type === 'number' ? (
                <input
                  type="number"
                  disabled={!checked[id]}
                  value={values[id] ?? ''}
                  onChange={e => change(part, key, e.target.value)}
                />
              ) : def.type === 'boolean' ? (
                <select
                  disabled={!checked[id]}
                  value={checked[id] ? (values[id] ? 'true' : 'false') : ''}
                  onChange={e => change(part, key, e.target.value)}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : (
                <input
                  type="text"
                  disabled={!checked[id]}
                  value={values[id] ?? ''}
                  onChange={e => change(part, key, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
