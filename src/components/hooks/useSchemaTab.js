//this dogshit doesn't even work
import { useState, useEffect, useRef } from 'react';

export function useSchemaTab({ schema, extractedData, pendingChanges }) {
  const prefix = schema.prefix || '';
  const fields = schema.fields;

  const [checked, setChecked] = useState({});
  const [values, setValues] = useState({});
  const [original, setOriginal] = useState({});

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!extractedData || Object.keys(extractedData).length === 0) return;

    const initChecked = {};
    const initValues = {};
    const baseValues = {};

    for (const [key, def] of Object.entries(fields)) {
      const raw = extractedData[key];
      const fromFile =
        def.type === 'dropdown' && typeof raw === 'string' && raw.startsWith(prefix)
          ? raw.replace(prefix, '')
          : raw;

      const originalVal = fromFile ?? def.default;
      const hasPending = pendingChanges?.hasOwnProperty(key);

      baseValues[key] = originalVal;
      initChecked[key] = hasPending;
      initValues[key] = hasPending ? pendingChanges[key] : originalVal;
    }

    setOriginal(baseValues);
    setChecked(initChecked);
    setValues(initValues);
    isFirstLoad.current = false;
  }, [extractedData, pendingChanges]);

  const handleCheckboxChange = (key, onFieldChange) => {
    setChecked(prev => {
      const isNowChecked = !prev[key];

      if (!isNowChecked) {
        setValues(prevVals => ({
          ...prevVals,
          [key]: original[key]
        }));
        // delay onFieldChange(null) after unchecking
        setTimeout(() => onFieldChange(key, null), 0);
      } else {
        setTimeout(() => onFieldChange(key, values[key]), 0);
      }

      return { ...prev, [key]: isNowChecked };
    });
  };

  const handleFieldChange = (key, rawValue, onFieldChange) => {
    const def = fields[key];
    const type = def.type;
    let value = rawValue;

    if (type === 'boolean') {
      value = rawValue === 'true';
    } else if (type === 'number') {
      const parsed = parseFloat(rawValue);
      value = isNaN(parsed) ? '' : parsed;
    }

    setValues(prev => ({ ...prev, [key]: value }));

    if (checked[key]) {
      const send = type === 'dropdown' ? `${prefix}${value}` : value;
      setTimeout(() => onFieldChange(key, send), 0);
    }
  };

  return {
    checked,
    values,
    original,
    handleCheckboxChange,
    handleFieldChange
  };
}
