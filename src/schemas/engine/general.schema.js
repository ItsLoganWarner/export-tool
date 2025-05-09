export default {
  fields: {
    thermalsEnabled: {
      regex: /"thermalsEnabled"\s*:\s*(true|false)/,
      type: 'boolean',
      tip: 'Enabled Thermals',
      default: false,
      insertUnder: 'mainEngine'
    },
    idleRPM: {
      regex: /"idleRPM"\s*:\s*([0-9.]+)/,
      type: 'number',
      tip: 'Might not work',
      default: 700,
      insertUnder: 'mainEngine'
    },
    idleRPMRoughness: {
      regex: /"idleRPMRoughness"\s*:\s*([0-9.]+)/,
      type: 'number',
      tip: 'Higher is rougher',
      default: 0,
      insertUnder: 'mainEngine'
    },
    inertia: {
      regex: /"inertia"\s*:\s*([0-9.]+)/,
      type: 'number',
      tip: 'kg*m/s^2',
      default: 0,
      insertUnder: 'mainEngine'
    },
    friction: {
      regex: /"friction"\s*:\s*([0-9.]+)/,
      type: 'number',
      tip: 'Constant friction torque (Nm)',
      default: 0,
      insertUnder: 'mainEngine'
    },
    dynamicFriction: {
      regex: /"dynamicFriction"\s*:\s*([0-9.]+)/,
      type: 'number',
      tip: 'Friction torque that increases with engine speed (Nm/rad/s)',
      default: 0,
      insertUnder: 'mainEngine'
    },
    engineBrakeTorque: {
      regex: /"engineBrakeTorque"\s*:\s*([0-9.]+)/,
      type: 'number',
      tip: 'Constant friction torque (Nm)',
      default: 0,
      insertUnder: 'mainEngine'
    }
  }
};