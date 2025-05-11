export default {
  block: "supercharger",
  fields: {
    gearRatio: {
      type: "number",
      default: 2.35,
      tip: "",
      locations: {
        engine: {
          regex: /"gearRatio"\s*:\s*([0-9.]+)/,
          insertUnder: "supercharger",
        }
      }
    },
    clutchEngageRPM: {
      type: "number",
      default: 0,
      tip: "",
      locations: {
        engine: {
          regex: /"clutchEngageRPM"\s*:\s*([0-9.]+)/,
          insertUnder: "supercharger",
        }
      }
    },
    clutchDisengageRPM: {
      type: "number",
      default: 24000,
      tip: "",
      locations: {
        engine: {
          regex: /"clutchDisengageRPM"\s*:\s*([0-9.]+)/,
          insertUnder: "supercharger",
        }
      }
    },
    type: {
      type: "string",
      default: "screw",
      tip: "",
      locations: {
        engine: {
          regex: /"type"\s*:\s*"([^"]+)"/,
          insertUnder: "supercharger",
        }
      }
    },
    lobes: {
      type: "number",
      default: 2,
      tip: "",
      locations: {
        engine: {
          regex: /"lobes"\s*:\s*([0-9.]+)/,
          insertUnder: "supercharger",
        }
      }
    },
    twistedLobes: {
      type: "boolean",
      default: false,
      tip: "",
      locations: {
        engine: {
          regex: /"twistedLobes"\s*:\s*(true|false)/,
          insertUnder: "supercharger",
        }
      }
    },
    whineLoopEvent: {
      type: "dropdown",
      default: "Supercharger_03>supercharger",
      category: "whine",
      tip: "",
      locations: {
        engine: {
          regex: /"whineLoopEvent"\s*:\s*"([^"]+)"/,
          insertUnder: "supercharger",
        }
      }
    },
    whineVolumePerPSI: {
      type: "number",
      default: 0.53,
      tip: "",
      locations: {
        engine: {
          regex: /"whineVolumePerPSI"\s*:\s*([0-9.]+)/,
          insertUnder: "supercharger",
        }
      }
    },
    whinePitchPer10kRPM: {
      type: "number",
      default: 0.85,
      tip: "",
      locations: {
        engine: {
          regex: /"whinePitchPer10kRPM"\s*:\s*([0-9.]+)/,
          insertUnder: "supercharger",
        }
      }
    },
    whineVolumePer10kRPM: {
      type: "number",
      default: 0.13,
      tip: "",
      locations: {
        engine: {
          regex: /"whineVolumePer10kRPM"\s*:\s*([0-9.]+)/,
          insertUnder: "supercharger",
        }
      }
    }
  }
};
