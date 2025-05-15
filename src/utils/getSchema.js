// src/utils/getSchema.js
import general from '../schemas/engine/general.schema';
import exhaust from '../schemas/engine/exhaust.schema';
import afterfire from '../schemas/engine/afterfire.schema';
import turbo from '../schemas/engine/forcedInduction/turbocharger.schema';
import superchrg from '../schemas/engine/forcedInduction/supercharger.schema';
import fuelSchema from '../schemas/engine/fuel.schema';
import wheelsSchema from '../schemas/chassis/wheels.schema';
import infoModelSchema from '../schemas/infoModel.schema';
import infoTrimSchema from '../schemas/infoTrim.schema';
import escTopLevelSchema from '../schemas/esc/topLevel.schema';

// const allSchemas = { general, exhaust, afterfire, turbo, superchrg, fuelSchema };

export function getSchemasForPart(partKey, rawContent) {
    const normalized = partKey.toLowerCase();
    const out = [];

    if (normalized.startsWith('camso_engine')) {
        out.push(general, exhaust, afterfire, fuelSchema);
        if (rawContent.includes('"turbocharger"')) out.push(turbo);
        if (rawContent.includes('"supercharger"')) out.push(superchrg);
    }
    if (normalized.startsWith('camso_fueltank')) {
        out.push(fuelSchema);
    }
    if (
        normalized.startsWith('camso_wheels_front') ||
        normalized.startsWith('camso_wheels_rear')
    ) {
        out.push(wheelsSchema);
    }
    if (normalized === 'infomodel') out.push(infoModelSchema);
    if (normalized === 'infotrim') out.push(infoTrimSchema);
    if (normalized.includes('camso_dse_drivemodes') &&
        !normalized.includes('_default_') &&
        !normalized.includes('_ev_')
    ) {
        out.push(escTopLevelSchema);
    }
    return out;
}
