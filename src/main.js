import { app, BrowserWindow, ipcMain, dialog } from 'electron';
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
      // 1) Read the raw file content
      let raw = await fs.promises.readFile(filePath, 'utf-8');
      // 2) Produce the updated text using the updateJbeam utility
      const updated = updateJbeam(raw, pendingChanges);
      // 3) Write the updated content back to the file
      await fs.promises.writeFile(filePath, updated, 'utf-8');
      return { success: true };
    } catch (err) {
      console.error("applyChanges error:", err);
      return { success: false, message: err.message };
    }
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
