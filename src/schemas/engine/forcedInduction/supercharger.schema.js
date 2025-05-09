export default {
    block: "supercharger",
    fields: {
      gearRatio: {
        regex: /"gearRatio"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 2.35,
        insertUnder: "supercharger"
      },
      clutchEngageRPM: {
        regex: /"clutchEngageRPM"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0,
        insertUnder: "supercharger"
      },
      clutchDisengageRPM: {
        regex: /"clutchDisengageRPM"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 24000,
        insertUnder: "supercharger"
      },
      type: {
        regex: /"type"\s*:\s*"([^"]+)"/,
        type: "string",
        default: "screw",
        insertUnder: "supercharger"
      },
      lobes: {
        regex: /"lobes"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 2,
        insertUnder: "supercharger"
      },
      twistedLobes: {
        regex: /"twistedLobes"\s*:\s*(true|false)/,
        type: "boolean",
        default: false,
        insertUnder: "supercharger"
      },
      whineLoopEvent: {
        regex: /"whineLoopEvent"\s*:\s*"([^"]+)"/,
        type: "dropdown",
        category: "whine",
        default: "Supercharger_03>supercharger",
        insertUnder: "supercharger"
      },
      whineVolumePerPSI: {
        regex: /"whineVolumePerPSI"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.53,
        insertUnder: "supercharger"
      },
      whinePitchPer10kRPM: {
        regex: /"whinePitchPer10kRPM"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.85,
        insertUnder: "supercharger"
      },
      whineVolumePer10kRPM: {
        regex: /"whineVolumePer10kRPM"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.13,
        insertUnder: "supercharger"
      }
    }
  };
  