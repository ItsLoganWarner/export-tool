export default {
  fields: {
    mainGain: {
      regex: /"mainGain"\s*:\s*([-0-9.]+)/,
      type: "number",
      default: 0,
      tip: "Main volume gain (dB)",
      insertUnder: "soundConfigExhaust"
    },
    maxLoadMix: {
      regex: /"maxLoadMix"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 1,
      tip: "Maximum load mix",
      insertUnder: "soundConfigExhaust"
    },
    minLoadMix: {
      regex: /"minLoadMix"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 0,
      tip: "Minimum load mix",
      insertUnder: "soundConfigExhaust"
    },
    onLoadGain: {
      regex: /"onLoadGain"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 1,
      tip: "Gain when under load",
      insertUnder: "soundConfigExhaust"
    },
    offLoadGain: {
      regex: /"offLoadGain"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 0.8,
      tip: "Gain when off load",
      insertUnder: "soundConfigExhaust"
    },
    eqLowGain: {
      regex: /"eqLowGain"\s*:\s*([-0-9.]+)/,
      type: "number",
      default: 0,
      tip: "Low EQ gain (dB)",
      insertUnder: "soundConfigExhaust"
    },
    eqLowFreq: {
      regex: /"eqLowFreq"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 400,
      tip: "Low EQ frequency (Hz)",
      insertUnder: "soundConfigExhaust"
    },
    eqLowWidth: {
      regex: /"eqLowWidth"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 1,
      tip: "Low EQ width",
      insertUnder: "soundConfigExhaust"
    },
    eqHighGain: {
      regex: /"eqHighGain"\s*:\s*([-0-9.]+)/,
      type: "number",
      default: 1.21,
      tip: "High EQ gain (dB)",
      insertUnder: "soundConfigExhaust"
    },
    eqHighFreq: {
      regex: /"eqHighFreq"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 6000,
      tip: "High EQ frequency (Hz)",
      insertUnder: "soundConfigExhaust"
    },
    eqHighWidth: {
      regex: /"eqHighWidth"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 0.5,
      tip: "High EQ width",
      insertUnder: "soundConfigExhaust"
    },
    lowCutFreq: {
      regex: /"lowCutFreq"\s*:\s*([0-9.]+)/,
      type: "number",
      default: 80,
      tip: "Low cut frequency (Hz)",
      insertUnder: "soundConfigExhaust"
    }
  }
};