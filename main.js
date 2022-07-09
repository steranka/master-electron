// Modules
const {app, BrowserWindow, globalShortcut} = require('electron')
const windowStateKeeper = require('electron-window-state');
const crypto = require('crypto');
const fs = require('fs');

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

function getHashFor(path){
  const sha1 = new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1')
    const rs = fs.createReadStream(path)
    rs.on('error', reject)
    rs.on('data', chunk => hash.update(chunk))
    rs.on('end', () => resolve(hash.digest('hex')))
  });
  return sha1;

}

// Add the functionality of the lesson in this function
function runLesson(){
  let waitingFor = new Array();
  // Get a list of files (max 22)
  const directoryPath = __dirname; /* path.join(__dirname, 'Documents'); */

//passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      let isFile = fs.lstatSync(file).isFile();
      if (isFile){
        getHashFor(file).then((hash) => {
          console.log('File: ' + file + '\t\tHash: ' + hash);
        })
      }
    });
  });
  console.log('EXIT runLesson');
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
