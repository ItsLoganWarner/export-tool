// require all JSON files from ../presets
const req = require.context(
    '../presets',  // relative to this file
    false,         // do not recurse
    /\.json$/      // only .json
  );
  
  export const builtInPresets = req.keys().reduce((map, filepath) => {
    // filepath === "./myPreset.json"
    const name = filepath.replace(/^\.\//, '');      // "myPreset.json"
    map[name] = req(filepath);                       // parsed JSON
    return map;
  }, {});