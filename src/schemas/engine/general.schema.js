export default {
  fields: {
    thermalsEnabled: {
      type: 'boolean',
      default: false,
      tip: 'Enabled Thermals',
      // where/how to parse & insert in the engine JBEAM:
      locations: {
        engine: {
          regex: /"thermalsEnabled"\s*:\s*(true|false)/,
          insertUnder: 'mainEngine',
        }
      }
    },
    idleRPM: {
      type: 'number',
      default: 700,
      tip: 'Might not work',
      locations: {
        engine: {
          regex: /"idleRPM"\s*:\s*([0-9.]+)/,
          insertUnder: 'mainEngine',
        }
      }
    },
    idleRPMRoughness: {
      type: 'number',
      default: 0,
      tip: 'Higher is rougher',
      locations: {
        engine: {
          regex: /"idleRPMRoughness"\s*:\s*([0-9.]+)/,
          insertUnder: 'mainEngine',
        }
      }
    },
    inertia: {
      type: 'number',
      default: 0,
      tip: 'kg*m/s^2',
      locations: {
        engine: {
          regex: /"inertia"\s*:\s*([0-9.]+)/,
          insertUnder: 'mainEngine',
        }
      }
    },
    friction: {
      type: 'number',
      default: 0,
      tip: 'Constant friction torque (Nm)',
      locations: {
        engine: {
          regex: /"friction"\s*:\s*([0-9.]+)/,
          insertUnder: 'mainEngine',
        }
      }
    },
    dynamicFriction: {
      type: 'number',
      default: 0,
      tip: 'Friction torque that increases with engine speed (Nm/rad/s)',
      locations: {
        engine: {
          regex: /"dynamicFriction"\s*:\s*([0-9.]+)/,
          insertUnder: 'mainEngine',
        }
      }
    },
    engineBrakeTorque: {
      type: 'number',
      default: 0,
      tip: 'Constant friction torque (Nm)',
      locations: {
        engine: {
          regex: /"engineBrakeTorque"\s*:\s*([0-9.]+)/,
          insertUnder: 'mainEngine',
        }
      }
    }
  }
};