export default {
    block: "turbocharger",
    fields: {
      bovSoundFileName: {
        regex: /"bovSoundFileName"\s*:\s*"([^"]+)"/,
        type: "dropdown",
        category: "bov",
        default: "Turbo_02>turbo_bov_tuned_rear",
        insertUnder: "turbocharger"
      },
      hissLoopEvent: {
        regex: /"hissLoopEvent"\s*:\s*"([^"]+)"/,
        type: "dropdown",
        category: "hiss",
        default: "Turbo_02>turbo_hiss_tuned",
        insertUnder: "turbocharger"
      },
      whineLoopEvent: {
        regex: /"whineLoopEvent"\s*:\s*"([^"]+)"/,
        type: "dropdown",
        category: "whine",
        default: "Turbo_02>turbo_spin_tuned",
        insertUnder: "turbocharger"
      },
      bovSoundVolumeCoef: {
        regex: /"bovSoundVolumeCoef"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.4,
        insertUnder: "turbocharger"
      },
      hissVolumePerPSI: {
        regex: /"hissVolumePerPSI"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.015,
        insertUnder: "turbocharger"
      },
      whineVolumePer10kRPM: {
        regex: /"whineVolumePer10kRPM"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.006,
        insertUnder: "turbocharger"
      },
      whinePitchPer10kRPM: {
        regex: /"whinePitchPer10kRPM"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.054,
        insertUnder: "turbocharger"
      },
      turboSizeCoef: {
        regex: /"turboSizeCoef"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 1.0,
        insertUnder: "turbocharger"
      },
      maxExhaustPower: {
        regex: /"maxExhaustPower"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 40000,
        insertUnder: "turbocharger"
      },
      backPressureCoef: {
        regex: /"backPressureCoef"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 0.0001,
        insertUnder: "turbocharger"
      },
      pressureRatePSI: {
        regex: /"pressureRatePSI"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 30,
        insertUnder: "turbocharger"
      },
      frictionCoef: {
        regex: /"frictionCoef"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 16,
        insertUnder: "turbocharger"
      },
      damageThresholdTemperature: {
        regex: /"damageThresholdTemperature"\s*:\s*([0-9.]+)/,
        type: "number",
        default: 900,
        insertUnder: "turbocharger"
      }
    }
  };
  