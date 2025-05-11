
export default {
    fields: {
        requiredEnergyType: {
            type: 'dropdown',
            default: 'gasoline',
            tip: 'Fuel type',
            options: ['gasoline', 'diesel', 'ethanol'],
            locations: {
                engine: {
                    regex: /"requiredEnergyType"\s*:\s*"([^"]+)"/,
                    insertUnder: 'fuelLiquidDensity',
                },
                fuel_tank: {
                    regex: /"energyType"\s*:\s*"([^"]+)"/,
                    insertUnder: 'energyType',
                }
            }
        }
    }
};
