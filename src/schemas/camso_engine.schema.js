export default {
  fields: {
    instantAfterFireSound: {
      regex: /"instantAfterFireSound"\s*:\s*"([^"]+)"/,
      type: "string",
      canBeMissing: true,
      default: "Default",
      insertUnder: "mainEngine"
    },
    sustainedAfterFireSound: {
      regex: /"sustainedAfterFireSound"\s*:\s*"([^"]+)"/,
      type: "string",
      canBeMissing: true,
      default: "Default",
      insertUnder: "mainEngine"
    },
    shiftAfterFireSound: {
      regex: /"shiftAfterFireSound"\s*:\s*"([^"]+)"/,
      type: "string",
      canBeMissing: true,
      default: "Default",
      insertUnder: "mainEngine"
    },
    thermalsEnabled: {
      regex: /"thermalsEnabled"\s*:\s*(true|false)/,
      type: "boolean",
      canBeMissing: false,
      default: false
    },
    mainGain: {
      regex: /"mainGain"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 0.0,
      insertUnder: "soundConfigExhaust"
    }
  }
};
