// src/schemas/chassis/wheels.schema.js
export default {
    fields: {
      hubWidth: {
        type: 'number',
        default: 0.215,
        tip: 'Width of the rim (m)',
        locations: {
          wheels_front: {
            regex: /"hubWidth"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"hubWidth"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      tireWidth: {
        type: 'number',
        default: 0.215,
        tip: 'Width of the tire (m)',
        locations: {
          wheels_front: {
            regex: /"tireWidth"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"tireWidth"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      dragCoef: {
        type: 'number',
        default: 1,
        tip: 'Air drag coefficient',
        locations: {
          wheels_front: {
            regex: /"dragCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"dragCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      frictionCoef: {
        type: 'number',
        default: 1.0,
        tip: 'Ground-model max friction multiplier',
        locations: {
          wheels_front: {
            regex: /"frictionCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"frictionCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      slidingFrictionCoef: {
        type: 'number',
        default: 1.2,
        tip: 'Ground-model min friction multiplier',
        locations: {
          wheels_front: {
            regex: /"slidingFrictionCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"slidingFrictionCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      treadCoef: {
        type: 'number',
        default: 0.5,
        tip: 'Grip loss on rough surfaces (0–1)',
        locations: {
          wheels_front: {
            regex: /"treadCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"treadCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      stribeckExponent: {
        type: 'number',
        default: 2.16,
        tip: 'Stribeck friction exponent',
        locations: {
          wheels_front: {
            regex: /"stribeckExponent"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"stribeckExponent"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      stribeckVelMult: {
        type: 'number',
        default: 2.0,
        tip: 'Stribeck velocity multiplier',
        locations: {
          wheels_front: {
            regex: /"stribeckVelMult"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"stribeckVelMult"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      noLoadCoef: {
        type: 'number',
        default: 1.346439,
        tip: 'Friction coefficient at zero load',
        locations: {
          wheels_front: {
            regex: /"noLoadCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"noLoadCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      loadSensitivitySlope: {
        type: 'number',
        default: 0.000152,
        tip: 'Slope of friction drop vs load',
        locations: {
          wheels_front: {
            regex: /"loadSensitivitySlope"\s*:\s*([0-9.eE+-]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"loadSensitivitySlope"\s*:\s*([0-9.eE+-]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      fullLoadCoef: {
        type: 'number',
        default: 0.1092,
        tip: 'Min friction coefficient at full load',
        locations: {
          wheels_front: {
            regex: /"fullLoadCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"fullLoadCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      },
      softnessCoef: {
        type: 'number',
        default: 0.6,
        tip: 'Time-variant friction softness (0–1)',
        locations: {
          wheels_front: {
            regex: /"softnessCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          },
          wheels_rear: {
            regex: /"softnessCoef"\s*:\s*([0-9.]+)/,
            insertUnder: 'pressureWheels'
          }
        }
      }
    }
  };
  