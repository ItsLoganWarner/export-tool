// add canBeMissing and insertUnder to drive both parseJbeam2 and updateJbeam
export default {
    prefix: "event:>Vehicle>Afterfire>",
    fields: {
      instantAfterFireVolumeCoef: {
        regex: /"instantAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.6,
        tip: "",
        canBeMissing: false,
        insertUnder: "mainEngine"
      },
      sustainedAfterFireVolumeCoef: {
        regex: /"sustainedAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.55,
        tip: "",
        canBeMissing: false,
        insertUnder: "mainEngine"
      },
      shiftAfterFireVolumeCoef: {
        regex: /"shiftAfterFireVolumeCoef"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.8,
        tip: "",
        canBeMissing: false,
        insertUnder: "mainEngine"
      },
      instantAfterFireSound: {
        regex: /"instantAfterFireSound"\s*:\s*"([^"]+)"/,
        type: "dropdown",
        category: "single",
        default: "Default",
        tip: "",
        canBeMissing: true,
        insertUnder: "shiftAfterFireVolumeCoef"
      },
      sustainedAfterFireSound: {
        regex: /"sustainedAfterFireSound"\s*:\s*"([^"]+)"/,
        type: "dropdown",
        category: "multi",
        default: "Default",
        tip: "",
        canBeMissing: true,
        insertUnder: "shiftAfterFireVolumeCoef"
      },
      shiftAfterFireSound: {
        regex: /"shiftAfterFireSound"\s*:\s*"([^"]+)"/,
        type: "dropdown",
        category: "shift",
        default: "Default",
        tip: "",
        canBeMissing: true,
        insertUnder: "shiftAfterFireVolumeCoef"
      },
    }
  };
  