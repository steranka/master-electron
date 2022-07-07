// Modules
const {app, BrowserWindow, globalShortcut, screen} = require('electron')
const windowStateKeeper = require('electron-window-state');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // When creating Browser window use the window state data
  let winState = windowStateKeeper( {
    defaultWidth: 1000,
    defaultHeight: 800,
  });



  mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    x: winState.x,
    y: winState.y,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  winState.manage(mainWindow);

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');

  // Allow Ctrl+F12 to open or close devtools, NOTE: I tried using F12 and that failed to register
  let registerSuccess = globalShortcut.register('Ctrl+F12', () => {
    if (mainWindow.webContents.isDevToolsOpened()){
      mainWindow.webContents.closeDevTools();
    } else {
      mainWindow.webContents.openDevTools();
    }
  })
  if (!registerSuccess) {
    console.log('Registration of Ctrl+F12 failed');
  }

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Add the functionality of the lesson in this function
function runLesson(){
  let displays = screen.getAllDisplays()
  console.log('All displays: ', displays);

  let primaryDisplay = screen.getPrimaryDisplay()

  console.log(`${displays[0].size.width} x ${displays[0].size.height}`)
  console.log(`${displays[0].bounds.x}, ${displays[0].bounds.y}`)
  // console.log(`${displays[1].size.width} x ${displays[1].size.height}`)
  // console.log(`${displays[1].bounds.x}, ${displays[1].bounds.y}`)

  screen.on( 'display-metrics-changed', (e, display, metricsChanged) => {
    console.log('display-metrics-changed', metricsChanged);
  })

  // let counter = 0;
  // let cancelInterval = setInterval( () => {
  //   console.log( screen.getCursorScreenPoint() )
  //   if (++counter > 60) {
  //     clearInterval(cancelInterval);
  //   }
  // }, 500)

}

// Electron `app` is ready
app.on('ready', () => {
  createWindow();
  runLesson();
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
