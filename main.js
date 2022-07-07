// Modules
const {app, BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');
require('console-stamp')(console, 'HH:MM:ss.l');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondaryWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  let winState = windowStateKeeper( {
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  mainWindow = new BrowserWindow({
    width: winState.width, height: winState.height,
    x: winState.x,
    y: winState.y,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    },
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');

  winState.manage(mainWindow);

  let wc = mainWindow.webContents;
  console.log('webContents is\n', wc);

  wc.on('did-finish-load', () => {
    console.log('EVENT: did-finish-load fired');
  })

  wc.on('dom-ready', () => {
    console.log('EVENT: dom-ready fired');
  })

  wc.on('before-input-event', (e, input) => {
    console.log(`${input.key} => ${input.type}`);
    // console.log('e', e);
    // console.log('input', input );
  });

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', () => {
  console.log('app is ready, path = ' + app.getAppPath());
  console.log('home = ' + app.getPath("home"));
  console.log('music = ' + app.getPath("music"));
  console.log('temp = ' + app.getPath("temp"));
  console.log('userData = ' + app.getPath("userData"));
  createWindow();
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', (e) => {
  console.log('app is quiting');
})

app.on('browser-window-blur', (e) => {
  console.log('app lost focus!');
})

app.on('browser-window-focus', (e) => {
  console.log('app now has focus');
})


// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
