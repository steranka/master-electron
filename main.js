// Modules
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondaryWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    },
    show: false,
    frame: false
  })

  secondaryWindow = new BrowserWindow({ parent: mainWindow,
    width: 300, height: 300,
    frame: false
  } );
  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')

  // Load index.html into the new BrowserWindow
  secondaryWindow.loadFile('index2.html')


  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

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
