// src/utils/jbeamParser2.js
import { getSchemasForPart } from './getSchema.js';

export function parseJbeam2(rawContent) {
    // 1) Strip out all single‐line comments (// …) so none of our regexes see them
    const content = rawContent.replace(/\/\/.*$/gm, '');

    // 2) Determine full JBEAM key, e.g. "camso_engine_b420f"
    const fullKeyMatch = content.match(/"camso_[^"]+"/i);
    if (!fullKeyMatch) {
        console.warn('Unable to determine part type');
        return null;
    }
    const fullKey = fullKeyMatch[0].slice(1, -1).toLowerCase();          // strip quotes
    // derive short partType: remove "camso_" and trailing ID → "engine" or "fuel_tank"
    const partsArr = fullKey.replace(/^camso_/, '').split('_');
    const partType = partsArr.slice(0, -1).join('_');

    const schemas = getSchemasForPart(fullKey, content);
    if (!schemas || !Array.isArray(schemas)) {
        console.warn(`No schema array returned for part key: ${fullKey}`);
        return null;
    }
    console.log('parseJbeam2 → fullKey=', fullKey, 'partType=', partType, 
        'using schemas=', schemas.map(s => Object.keys(s.fields)));
    // 3) Run each schema’s regex against the **cleaned** content, per partType
    const extracted = {};
    for (const schema of schemas) {
        for (const [key, def] of Object.entries(schema.fields)) {
            // select only if this schema field applies to our partType
            const loc = def.locations?.[partType];
            if (!loc) continue;
            const m = content.match(loc.regex);
            if (m) {
                let v = m[1];
                if (def.type === 'boolean') v = v === 'true';
                if (def.type === 'number') v = parseFloat(v);
                // strip any dropdown prefix (e.g. AfterFireTab)
                if (def.prefix && typeof v === 'string' && v.startsWith(def.prefix)) {
                    v = v.slice(def.prefix.length);
                }
                extracted[key] = v;
            } else {
                extracted[key] = def.canBeMissing ? def.default : null;
                if (!def.canBeMissing) console.warn(`Missing required field: ${key}`);
            }
        }
    }

    return {
        sourceKey: fullKey,
        extracted,
        raw: rawContent
    };
}
