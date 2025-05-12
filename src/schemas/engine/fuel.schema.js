// src/schemas/engine/fuel.schema.js
export default {
    fields: {
        requiredEnergyType: {
            type: 'dropdown',
            default: 'gasoline',
            tip: 'Type of fuel',
            options: ['gasoline', 'diesel', 'ethanol', 'methanol', 'nitromethane'],
            locations: {
                engine: { regex: /"requiredEnergyType"\s*:\s*"([^"]+)"/, insertUnder: 'mainEngine' },
                fueltank: { regex: /"energyType"\s*:\s*"([^"]+)"/, insertUnder: 'mainTank' }
            }
        },
        fuelLiquidDensity: {
            type: 'number',
            default: 0.76,
            tip: 'Liquid density (kg/L)',
            locations: {
                engine: { regex: /"fuelLiquidDensity"\s*:\s*([0-9.]+)/, insertUnder: 'mainEngine' },
                fueltank: { regex: /"fuelLiquidDensity"\s*:\s*([0-9.]+)/, insertUnder: 'mainTank' }
            }
        },
        energyDensity: {
            type: 'number',
            default: 4.64e7,
            tip: 'Energy density (J/kg)',
            locations: {
                engine: { regex: /"energyDensity"\s*:\s*([0-9.]+)/, insertUnder: 'mainEngine' },
                fueltank: { regex: /"energyDensity"\s*:\s*([0-9.]+)/, insertUnder: 'mainTank' }
            }
        },
        burnEfficiency: {
            type: 'textarea',
            default: '[]',
            tip: 'Burn efficiency table (JSON array)',
            locations: {
                engine: { regex: /"burnEfficiency"\s*:/, insertUnder: 'burnEfficiency' }
                // no fueltank entry here
            }
        },
        fuelCapacity: {
            type: 'number',
            default: 55,
            tip: 'Fuel capacity (L)',
            locations: {
                fueltank: { regex: /"fuelCapacity"\s*:\s*([0-9.]+)/, insertUnder: 'mainTank' }
            },
            postUpdate: (lines, newValue) => {
                const fc = newValue;
                const varRow = /(\["\$fuel",\s*"range",\s*"L",\s*"Engine",\s*)([0-9.]+)(,\s*[0-9.]+)(,\s*[0-9.]+)(.*\])/;
                for (let i = 0; i < lines.length; i++) {
                    const m = lines[i].match(varRow);
                    if (m) {
                        // rebuild so default = 0 = max = fuelCapacity
                        lines[i] = `${m[1]}${fc}, 0, ${fc}${m[5]}`;
                        break;
                    }
                }
            }
        }
    }
};
