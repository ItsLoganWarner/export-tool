const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  readDirectory: (directoryPath) => ipcRenderer.invoke('fs:readDirectory', directoryPath),
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
  applyChanges: (filePath, pendingChanges) =>
    ipcRenderer.invoke('jbeam:applyChanges', { filePath, pendingChanges }),
  writeFile: (filePath, contents) => ipcRenderer.invoke('fs:writeFile', filePath, contents),
});

contextBridge.exposeInMainWorld('presets', {
  list:       () => ipcRenderer.invoke('presets:list'),
  load:       (which,name) => ipcRenderer.invoke('presets:load', which, name),
  save:       (data)       => ipcRenderer.invoke('presets:save', data),
  openFolder: () => ipcRenderer.invoke('presets:openFolder'),
  pick:       (which)        => ipcRenderer.invoke('presets:pick', which),
});