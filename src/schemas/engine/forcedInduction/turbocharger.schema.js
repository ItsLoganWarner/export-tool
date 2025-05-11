export default {
  block: "turbocharger",
  fields: {
    bovSoundFileName: {
      type: "dropdown",
      default: "Turbo_02>turbo_bov_tuned_rear",
      category: "bov",
      tip: "",
      locations: {
        engine: {
          regex: /"bovSoundFileName"\s*:\s*"([^"]+)"/,
          insertUnder: "turbocharger",
        }
      }
    },
    hissLoopEvent: {
      type: "dropdown",
      default: "Turbo_02>turbo_hiss_tuned",
      category: "hiss",
      tip: "",
      locations: {
        engine: {
          regex: /"hissLoopEvent"\s*:\s*"([^"]+)"/,
          insertUnder: "turbocharger",
        }
      }
    },
    whineLoopEvent: {
      type: "dropdown",
      default: "Turbo_02>turbo_spin_tuned",
      category: "whine",
      tip: "",
      locations: {
        engine: {
          regex: /"whineLoopEvent"\s*:\s*"([^"]+)"/,
          insertUnder: "turbocharger",
        }
      }
    },
    bovSoundVolumeCoef: {
      type: "number",
      default: 0.4,
      tip: "",
      locations: {
        engine: {
          regex: /"bovSoundVolumeCoef"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    hissVolumePerPSI: {
      type: "number",
      default: 0.015,
      tip: "",
      locations: {
        engine: {
          regex: /"hissVolumePerPSI"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    whineVolumePer10kRPM: {
      type: "number",
      default: 0.006,
      tip: "",
      locations: {
        engine: {
          regex: /"whineVolumePer10kRPM"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    whinePitchPer10kRPM: {
      type: "number",
      default: 0.054,
      tip: "",
      locations: {
        engine: {
          regex: /"whinePitchPer10kRPM"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    turboSizeCoef: {
      type: "number",
      default: 1.0,
      tip: "",
      locations: {
        engine: {
          regex: /"turboSizeCoef"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    maxExhaustPower: {
      type: "number",
      default: 40000,
      tip: "",
      locations: {
        engine: {
          regex: /"maxExhaustPower"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    backPressureCoef: {
      type: "number",
      default: 0.0001,
      tip: "",
      locations: {
        engine: {
          regex: /"backPressureCoef"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    pressureRatePSI: {
      type: "number",
      default: 30,
      tip: "",
      locations: {
        engine: {
          regex: /"pressureRatePSI"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    frictionCoef: {
      type: "number",
      default: 16,
      tip: "",
      locations: {
        engine: {
          regex: /"frictionCoef"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    },
    damageThresholdTemperature: {
      type: "number",
      default: 900,
      tip: "",
      locations: {
        engine: {
          regex: /"damageThresholdTemperature"\s*:\s*([0-9.]+)/,
          insertUnder: "turbocharger",
        }
      }
    }
  }
};
