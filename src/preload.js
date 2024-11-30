const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  readDirectory: (directoryPath) => ipcRenderer.invoke('fs:readDirectory', directoryPath),
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
});
