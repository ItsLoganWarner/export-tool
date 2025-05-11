export default {
  prefix: "event:>Vehicle>Afterfire>",
  fields: {
    instantAfterFireVolumeCoef: {
      type: "number",
      default: 0.6,
      tip: "",
      canBeMissing: false,
      locations: {
        engine: {
          regex: /"instantAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
          insertUnder: "mainEngine",
        }
      }
    },
    sustainedAfterFireVolumeCoef: {
      type: "number",
      default: 0.55,
      tip: "",
      canBeMissing: false,
      locations: {
        engine: {
          regex: /"sustainedAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
          insertUnder: "mainEngine",
        }
      }
    },
    shiftAfterFireVolumeCoef: {
      type: "number",
      default: 0.8,
      tip: "",
      canBeMissing: false,
      locations: {
        engine: {
          regex: /"shiftAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
          insertUnder: "mainEngine",
        }
      }
    },
    instantAfterFireSound: {
      type: "dropdown",
      category: "single",
      default: "Default",
      tip: "",
      canBeMissing: true,
      locations: {
        engine: {
          regex: /"instantAfterFireSound"\s*:\s*"([^"]+)"/,
          insertUnder: "shiftAfterFireVolumeCoef",
        }
      }
    },
    sustainedAfterFireSound: {
      type: "dropdown",
      category: "multi",
      default: "Default",
      tip: "",
      canBeMissing: true,
      locations: {
        engine: {
          regex: /"sustainedAfterFireSound"\s*:\s*"([^"]+)"/,
          insertUnder: "shiftAfterFireVolumeCoef",
        }
      }
    },
    shiftAfterFireSound: {
      type: "dropdown",
      category: "shift",
      default: "Default",
      tip: "",
      canBeMissing: true,
      locations: {
        engine: {
          regex: /"shiftAfterFireSound"\s*:\s*"([^"]+)"/,
          insertUnder: "shiftAfterFireVolumeCoef",
        }
      }
    },
  }
};
