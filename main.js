// Modules
const {app, BrowserWindow, session} = require('electron')
const windowStateKeeper = require('electron-window-state');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  let ses = session.defaultSession
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
  mainWindow.loadFile('index.html')

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  ses.on('will-download', (e, downloadItem, webContents) => {

    let fileName = downloadItem.getFilename()
    let fileSize = downloadItem.getTotalBytes()
    let fakeProgress = 0;  // if fileSize is zero we fake it

    // Save to desktop
    // downloadItem.setSavePath(app.getPath('desktop') + `/${fileName}`)

    downloadItem.on('updated', (e, state) => {

      let received = downloadItem.getReceivedBytes()
      console.log('received: ' + received + ', from file: ' + fileName + ', fileSize: ' + fileSize + ', fakeProgress: ' + fakeProgress);

      if (state === 'progressing' && received) {
        if (fileSize === 0) {
          fakeProgress += 5;
          webContents.executeJavaScript(`window.progress.value = ${fakeProgress}`)
        } else {
          let progress = Math.round((received/fileSize)*100)
          webContents.executeJavaScript(`window.progress.value = ${progress}`)

        }
      }
    })
  })

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
