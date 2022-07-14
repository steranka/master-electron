// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { shell } = require('electron');

const splashFile = `${__dirname}/splash.png`;
function openSplash(){
  console.log('opening: ' + splashFile);
  shell.openPath(splashFile);
}

window.openSplash = openSplash;
