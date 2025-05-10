// src/utils/builtInPresets.js
// — no original snippet here, just a new helper file
const requireContext = require.context('../presets', false, /\.json$/);
const builtInPresets = requireContext.keys().map(key => ({
  name: key.replace('./', '').replace(/\.json$/, ''),
  data: requireContext(key),
}));
export default builtInPresets;
