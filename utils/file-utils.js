const fs = require('fs');
const linebyline = require('linebyline');

/**
 * Read the file specified and for each line call the function provided
 * at the end of file, a null will be passed to indicate the file is closed.
 * The lineReadCallback is called for each line.
 *
 * @param filename
 * @param lineReadCallback - called with (lineRead, stopReadingFunc, lineNum)
 * lineRead - the line that was read
 * stopReadingFunc - can be called to tell this function to stop reading the file
 * lineNum starts at 1 and is incremented for each line of the file
 * @param endCallback - called when EOF has been reached on file.  Called with no arguments.
 * @param errorCallback - called if an error occurs with the file.  Called with: (Error)
 * where Error is an Error object (see new Error() at See https://nodejs.org/api/errors.html#class-error)
 * This callback is called if the filename specified can't be read.
 * */
function readFile(filename, lineReadCallback, endCallback, errorCallback){

  let lineReader = linebyline(filename);

  function onLineCb(line, lineCount, byteCount) {
    lineReadCallback(line, lineCount, byteCount, stopReading);
  }

  function onErrorCb(err){
    if (errorCallback){
      errorCallback(err);
    }
  }
  function onEndCb(err){
    if (endCallback){
      endCallback();
    }
  }

  lineReader.on('line', onLineCb);
  lineReader.on('error', onErrorCb);
  lineReader.on('end', onEndCb);

  function stopReading(){
    lineReader.removeAllListeners('line');
    lineReader.removeAllListeners('error');
  }

} // end of readFile function

module.exports = {
  readFile
}

