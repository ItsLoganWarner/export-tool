// src/components/TabStrip/tabs/ESCTab.jsx
import React, { useMemo, useState, useEffect } from 'react';
import '../../../styles/Tabs.css';

export default function ESCTab({
  raw = '',
  pending: pendingChanges = {},
  onFieldChange,       // (partKey, key, value)
}) {
  // 1) parse driveModes once
  const driveObj = useMemo(() => {
    try {
      const big = JSON.parse(raw);
      const slotKey = Object.keys(big).find(k => big[k].driveModes?.modes);
      return slotKey
        ? big[slotKey].driveModes
        : { modes: {}, enabledModes: [], defaultMode: '' };
    } catch {
      return { modes: {}, enabledModes: [], defaultMode: '' };
    }
  }, [raw]);

  // 2) build all editable fields
  const fields = useMemo(() => {
    const out = [];
    const modes = Object.keys(driveObj.modes).filter(m => m !== 'off');

    // top‐level
    out.push({
      key: 'enabledModes', label: 'Enabled Modes',
      path: ['driveModes','enabledModes'],
      type: 'multi', options: modes,
      get: () => driveObj.enabledModes
    });
    out.push({
      key: 'defaultMode',  label: 'Default Mode',
      path: ['driveModes','defaultMode'],
      type: 'single', options: modes,
      get: () => driveObj.defaultMode
    });

    // per‐mode props
    Object.entries(driveObj.modes).forEach(([modeKey,{settings=[]}]) => {
      if (modeKey==='off') return;
      settings.forEach(([ctrlType,data], idx) => {
        if (ctrlType!=='controller' || typeof data!=='object') return;
        const ctrlName = data.controllerName;
        Object.entries(data).forEach(([prop,val]) => {
          if (prop==='controllerName') return;
          if (modeKey==='off2wd' && !prop.endsWith('Color')) return;
          const path = ['driveModes','modes',modeKey,'settings',idx,prop];
          out.push({
            key: `${modeKey}@${ctrlName}@${prop}`,
            label: `${ctrlName}.${prop}`,
            modeKey,
            path,
            type: typeof val==='boolean' 
                  ? 'boolean' 
                  : typeof val==='number' 
                  ? 'number' 
                  : prop.endsWith('Color') 
                  ? 'color' 
                  : 'text',
            get: () => driveObj.modes[modeKey].settings[idx][1][prop]
          });
        });
      });
    });
    return out;
  }, [driveObj]);

  // 3) local checked + values
  const [checked, setChecked] = useState({});
  const [values,  setValues]  = useState({});

  // init from pending + extracted
  useEffect(() => {
    const c={}, v={};
    fields.forEach(f => {
      const pend = pendingChanges[f.key];
      const on = pend!==undefined;
      c[f.key]=on;
      v[f.key]= on ? pend : f.get();
    });
    setChecked(c);
    setValues(v);
  }, [pendingChanges, fields]);

  // toggle
  const handleToggle = f => {
    const on = !checked[f.key];
    setChecked(ch=>({...ch,[f.key]:on}));
    if (on) onFieldChange('esc', f.key, values[f.key]);
    else {
      onFieldChange('esc', f.key, null);
      setValues(v=>({...v, [f.key]:f.get()}));
    }
  };

  // change in control
  const handleChange = (f, raw) => {
    let val = raw;
    if (f.type==='number')  val=parseFloat(raw)||0;
    if (f.type==='boolean') val= raw==='true';
    setValues(v=>({...v,[f.key]:val}));
    if (checked[f.key]) onFieldChange('esc', f.key, val);
  };

  // split
  const topFields   = fields.filter(f=>f.path.length===2);
  const modeFields  = fields.filter(f=>f.path.length>2);

  // available modes from the multi-select
  const availableModes = values.enabledModes||[];

  // --- NEW: only clear selMode if it becomes invalid ---
  const [selMode, setSelMode] = useState('');
  useEffect(() => {
    if (selMode && !availableModes.includes(selMode)) {
      setSelMode('');
    }
  }, [availableModes, selMode]);

  const thisModeFields = modeFields.filter(f=>f.modeKey===selMode);

  return (
    <div className="card esc-card">
      <h3>ESC / Drive Modes</h3>

      {/* Top-level */}
      {topFields.map(f=>(
        <div key={f.key} className="field-row esc-field-row">
          <input
            type="checkbox"
            checked={!!checked[f.key]}
            onChange={()=>handleToggle(f)}
          />
          <label className="esc-label">{f.label}</label>

          {f.type==='single' && (
            <select
              disabled={!checked[f.key]}
              value={values[f.key]||''}
              onChange={e=>handleChange(f,e.target.value)}
            >
              <option value="">—</option>
              {f.options.map(o=>(
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}
          {f.type==='multi' && (
            <div className="esc-multi">
              {f.options.map(o=>{
                const sel = (values[f.key]||[]).includes(o);
                return (
                  <label key={o}>
                    <input
                      type="checkbox"
                      disabled={!checked[f.key]}
                      checked={sel}
                      onChange={()=>{
                        const base=values[f.key]||[];
                        const next=sel
                          ? base.filter(x=>x!==o)
                          : [...base,o];
                        handleChange(f,next);
                      }}
                    />
                    <span>{o}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Mode selector stays at “—” until user picks */}
      <div className="esc-mode-select">
        <label>Select Drive Mode to Edit:</label>
        <select
          value={selMode}
          onChange={e=>setSelMode(e.target.value)}
          disabled={availableModes.length===0}
        >
          <option value="">—</option>
          {availableModes.map(m=>(
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Only show settings when selMode is non-empty */}
      {selMode && (
        <fieldset className="esc-fieldset">
          <legend style={{ textTransform:'capitalize' }}>{selMode} Settings</legend>
          {thisModeFields.map(f=>(
            <div key={f.key} className="field-row esc-field-row">
              <input
                type="checkbox"
                checked={!!checked[f.key]}
                onChange={()=>handleToggle(f)}
              />
              <label className="esc-label">{f.label}</label>

              {f.type==='boolean' && (
                <select
                  disabled={!checked[f.key]}
                  value={values[f.key]?'true':'false'}
                  onChange={e=>handleChange(f,e.target.value)}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              )}
              {f.type==='number' && (
                <input
                  type="number"
                  disabled={!checked[f.key]}
                  value={values[f.key]}
                  onChange={e=>handleChange(f,e.target.value)}
                />
              )}
              {f.type==='text' && (
                <input
                  type="text"
                  disabled={!checked[f.key]}
                  value={values[f.key]}
                  onChange={e=>handleChange(f,e.target.value)}
                />
              )}
              {f.type==='color' && (
                <input
                  type="color"
                  disabled={!checked[f.key]}
                  value={'#'+values[f.key]}
                  onChange={e=>handleChange(f,e.target.value.slice(1))}
                />
              )}
            </div>
          ))}
        </fieldset>
      )}
    </div>
  );
}
