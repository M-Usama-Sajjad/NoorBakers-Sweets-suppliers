const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const serve = require('electron-serve');

const loadURL = serve({
  directory: path.join(__dirname, '../.next'),
  scheme: 'app'
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling
let squirrelStartup = false;
try {
  if (require('electron-squirrel-startup')) {
    squirrelStartup = true;
  }
} catch (e) {
  console.log('electron-squirrel-startup not available');
}

if (squirrelStartup) {
  app.quit();
}

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // Enable DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Log any load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  try {
    if (isDev) {
      await mainWindow.loadURL('http://localhost:3001');
    } else {
      await loadURL(mainWindow);
    }
  } catch (err) {
    console.error('Failed to load the app:', err);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 
