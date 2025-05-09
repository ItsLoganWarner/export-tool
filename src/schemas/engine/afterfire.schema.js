export default {
  fields: {
    instantAfterFireVolumeCoef: {
      regex: /"instantAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 0.6,
      canBeMissing: true,
      tip: "",
      insertUnder: 'mainEngine'
    },
    sustainedAfterFireVolumeCoef: {
      regex: /"sustainedAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 0.55,
      canBeMissing: true,
      tip: "",
      insertUnder: 'mainEngine'
    },
    shiftAfterFireVolumeCoef: {
      regex: /"shiftAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 0.8,
      canBeMissing: true,
      tip: "",
      insertUnder: 'mainEngine'
    },
    instantAfterFireSound: {
      regex: /"instantAfterFireSound"\s*:\s*"([^"]+)"/,
      type: "string",
      default: "v6_01>single",
      canBeMissing: true,
      tip: "",
      insertUnder: 'mainEngine'
    },
    sustainedAfterFireSound: {
      regex: /"sustainedAfterFireSound"\s*:\s*"([^"]+)"/,
      type: "string",
      default: "v6_01>multi",
      canBeMissing: true,
      tip: "",
      insertUnder: 'mainEngine'
    },
    shiftAfterFireSound: {
      regex: /"shiftAfterFireSound"\s*:\s*"([^"]+)"/,
      type: "string",
      default: "v6_01>shift",
      canBeMissing: true,
      tip: "",
      insertUnder: 'mainEngine'
    }
  }
};