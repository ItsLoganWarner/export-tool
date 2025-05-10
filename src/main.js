import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'; // Updated to include `shell`
import path from 'node:path';
import fs from 'fs';
import { updateJbeam } from './utils/updateJbeam.js'; 

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  // Handlers to open dialogs and read folders/files
  ipcMain.handle('dialog:openDirectory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (!result.canceled) {
      return result.filePaths[0];
    }
    return null;
  });

  ipcMain.handle('fs:readDirectory', async (event, directoryPath) => {
    try {
      const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
      return files.map((file) => file.name);
    } catch (err) {
      console.error('Error reading directory:', err);
      return [];
    }
  });

  ipcMain.handle('fs:readFile', async (event, filePath) => {
    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      return data;
    } catch (err) {
      console.error('Error reading file:', err);
      return null;
    }
  });

  // Add the jbeam:applyChanges IPC channel
  ipcMain.handle('jbeam:applyChanges', async (event, { filePath, pendingChanges }) => {
    try {
      let raw = await fs.promises.readFile(filePath, 'utf-8');
      const updated = updateJbeam(raw, pendingChanges);
      await fs.promises.writeFile(filePath, updated, 'utf-8');
      return { success: true };
    } catch (err) {
      console.error("applyChanges error:", err);
      return { success: false, message: err.message };
    }
  });

  //
  // PRESETS FOLDERS (make user folder writable)
  //
  const isDev = !app.isPackaged;
  const builtInPresetsDir = isDev
  ? path.join(process.cwd(), 'src', 'resources', 'presets')
  : path.join(process.resourcesPath, 'presets');

  // 2) User folder always under appData
  const userPresetsDir = path.join(app.getPath('userData'), 'presets');

  // 3) Ensure both exist
  fs.mkdirSync(builtInPresetsDir, { recursive: true });
  fs.mkdirSync(userPresetsDir,    { recursive: true });

  // List all .json in both dirs
  ipcMain.handle('presets:list', async () => {
    const builtIn = await fs.promises.readdir(builtInPresetsDir);
    const custom = await fs.promises.readdir(userPresetsDir);
    return {
      builtIn: builtIn.filter(f => f.endsWith('.json')),
      custom: custom.filter(f => f.endsWith('.json')),
    };
  });

  // Load one preset
  ipcMain.handle('presets:load', async (_evt, which, name) => {
    const dir = which === 'custom' ? userPresetsDir : builtInPresetsDir;
    const raw = await fs.promises.readFile(path.join(dir, name), 'utf-8');
    return JSON.parse(raw);
  });

  // Save user preset
  ipcMain.handle('presets:save', async (_evt, data) => {
    // 1) Ask the user where (and under what name) to save:
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save your preset',
      defaultPath: path.join(userPresetsDir, 'my-preset.json'),
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    if (canceled || !filePath) return null;
    // 2) Write the file:
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return path.basename(filePath);
  });

  // Optionally “Show folder”:
  ipcMain.handle('presets:openFolder', () => {
    shell.openPath(userPresetsDir);
  });

    // Let the user pick a .json file from either folder, read & parse it
  ipcMain.handle('presets:pick', async () => {
    // allow browsing both built-ins and custom
    const defaultPath = builtInPresetsDir; // or userPresetsDir
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Select a preset to load',
      defaultPath,
      filters: [{ name: 'JSON Preset', extensions: ['json'] }],
      properties: ['openFile']
    });
    if (canceled || filePaths.length === 0) return null;
    const raw = await fs.promises.readFile(filePaths[0], 'utf-8');
    return JSON.parse(raw);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
