export default {
  fields: {
    mainGain: {
      type: "number",
      default: 0,
      tip: "Main volume gain (dB)",
      locations: {
        engine: {
          regex: /"mainGain"\s*:\s*([-0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    maxLoadMix: {
      type: "number",
      default: 1,
      tip: "Maximum load mix",
      locations: {
        engine: {
          regex: /"maxLoadMix"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    minLoadMix: {
      type: "number",
      default: 0,
      tip: "Minimum load mix",
      locations: {
        engine: {
          regex: /"minLoadMix"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    onLoadGain: {
      type: "number",
      default: 1,
      tip: "Gain when under load",
      locations: {
        engine: {
          regex: /"onLoadGain"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    offLoadGain: {
      type: "number",
      default: 0.8,
      tip: "Gain when off load",
      locations: {
        engine: {
          regex: /"offLoadGain"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    eqLowGain: {
      type: "number",
      default: 0,
      tip: "Low EQ gain (dB)",
      locations: {
        engine: {
          regex: /"eqLowGain"\s*:\s*([-0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    eqLowFreq: {
      type: "number",
      default: 400,
      tip: "Low EQ frequency (Hz)",
      locations: {
        engine: {
          regex: /"eqLowFreq"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    eqLowWidth: {
      type: "number",
      default: 1,
      tip: "Low EQ width",
      locations: {
        engine: {
          regex: /"eqLowWidth"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    eqHighGain: {
      type: "number",
      default: 1.21,
      tip: "High EQ gain (dB)",
      locations: {
        engine: {
          regex: /"eqHighGain"\s*:\s*([-0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    eqHighFreq: {
      type: "number",
      default: 6000,
      tip: "High EQ frequency (Hz)",
      locations: {
        engine: {
          regex: /"eqHighFreq"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    eqHighWidth: {
      type: "number",
      default: 0.5,
      tip: "High EQ width",
      locations: {
        engine: {
          regex: /"eqHighWidth"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    },
    lowCutFreq: {
      type: "number",
      default: 80,
      tip: "Low cut frequency (Hz)",
      locations: {
        engine: {
          regex: /"lowCutFreq"\s*:\s*([0-9.]+)/,
          insertUnder: "soundConfigExhaust",
        }
      }
    }
  }
};