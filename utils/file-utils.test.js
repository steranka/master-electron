
// readFile('../ex-filexnames.data', handleLine, handleEof, handleError);

function handleLine(line, lineCount, byteCount, stopReadingFunc){
  // if (byteCount > 100){
  //   console.log('calling stop reading');
  //   stopReadingFunc();
  // }
  console.log(`READ: (${lineCount}): ` + line);
}

function handleError(err){
  console.log('aDate ERROR: ', err);
  console.log('err.message: ' + err.message);
  console.log('err.errno: ' + err.errno);
  console.log('err.code: ' + err.code);
  console.log('err.stack: ' + err.stack);
  console.log('stringify: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));

  // interesting that the message is not included!
}

function handleEof(err){
  console.log('JUST GOT EOF');
}

test("place-holder", () => {
  // TODO: Learn how to test event driven functions
  // Maybe this: https://borzecki.github.io/blog/jest-event-emitters/
});