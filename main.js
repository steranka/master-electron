// Modules
const {app, BrowserWindow, session} = require('electron');
const windowStateKeeper = require('electron-window-state');
require('console-stamp')(console, 'HH:MM:ss.l');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondaryWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {


  let getCookies = () => {
    ses.cookies.get({})
    .then( cookies => {
      console.log("Cookies are: ");
      console.log(cookies);
    })
    .catch( errors => {
      console.log(errors)
    })
  }

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
  });


  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');
  // mainWindow.loadURL('http://httpbin.org/basic-auth/user/passwd');

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    console.log('EVENT: closed');
    mainWindow = null
  });

  winState.manage(mainWindow);

  let wc = mainWindow.webContents;
  console.log('webContents is\n', wc);

  wc.on('did-finish-load', () => {
    console.log('EVENT: did-finish-load fired');
  });

  wc.on('login', (e, request, authInfo, callback) => {
    console.log('logging in authInfo', authInfo);
    callback('user', 'passwd');
  });

  wc.on('did-navigate', (e, url, statusCode, message) => {
    console.log(`EVENT: did-navigate ${url} ${statusCode}`);
  });

  wc.on('dom-ready', () => {
    console.log('EVENT: dom-ready fired');
  });

  wc.on('before-input-event', (e, input) => {
    console.log(`${input.key} => ${input.type}`);
    // console.log('e', e);
    // console.log('input', input );
  });

  wc.on('media-started-playing', () => {
    console.log(`EVENT: media-started-playing`);
  });

  wc.on('media-paused', () => {
    console.log(`EVENT: media-paused`);
  });

  wc.on('context-menu', (e, params) => {
    console.log(`EVENT: context-menu on ${params.mediaType} (x,y)=(${params.x}, ${params.y}) text=${params.selectionText} canCopy=${params.editFlags.canCopy}`);
    wc.executeJavaScript('alert("Running");');
  });

  // 15
  let ses = mainWindow.webContents.session;
  console.log("Session is ", ses);

  secondaryWindow = new BrowserWindow({
    parent: mainWindow,
    width: 200, height: 250,
    webPreferences: {
      nodeIntegration: true,
      partition: 'persist:part1'
    },

  });
  secondaryWindow.webContents.openDevTools();
  secondaryWindow.on('closed',  () => {
    console.log('EVENT: closed (secondaryWindow)');
    secondaryWindow = null
  });
  secondaryWindow.loadFile('index2.html');

  let ses2 = secondaryWindow.webContents.session;
  console.log("Session secondaryWindow is ", ses2);
  let defaultSession = session.defaultSession;
  console.log('userAgent = ' + ses2.getUserAgent());
  console.log("ses === ses2: " + Object.is(ses, ses2));
  console.log("ses === defaultSession: " + Object.is(ses, defaultSession));


  let win = new BrowserWindow({ width: 800, height: 600 })
  win.loadURL('http://github.com')
  win.webContents.on('did-finish-load', (e) => {
    getCookies();
  });

  // ses = win.webContents.session
  // console.log(ses.getUserAgent())

  ses = session.defaultSession
  let cookie = { url:'https://myappdomain.com', name:'cookie1', value:'electron', expirationDate:1688692384 }

  ses.cookies.set(cookie)
    .then( () => {
      console.log('cookie1 set')
      getCookies()
    })


} // end of createWindow - main app

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
  console.log(`EVENT: activate`);

  if (mainWindow === null) {
    console.log(`Calling createWindow because mainWindow is null`);
    createWindow();
  }
})
