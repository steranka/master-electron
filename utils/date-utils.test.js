const { parseStringToDate, replaceParseWithDate, formatAsYYYYMMDD_HHMMSS, formatAsYYYY_MM_DD_HHMMSS, fixDate } = require('./date-utils');
const { readFile } = require('./file-utils');

test('Test formatting', () => {
  let dateStr = "2022-07-12 17:36:00";
  let expectedStr = "2022-07-12 173600";
  let oDate = new Date(dateStr);
  expect(formatAsYYYYMMDD_HHMMSS(oDate)).toBe(expectedStr);
});

// test('Read file and process each line', () => {
//   // Rea d all of the example file names and process them
//   await readFile('../ex-filenames.data', (line, lineCount, byteCount, stopReadingFunc  ) => {
//     let result = fixDate(line,formatAsYYYY_MM_DD_HHMMSS)
//     console.log(' INPUT: ' + line);
//     console.log('OUTPUT: ' + result);
//   });
//
//   setTimeout(() => {
//     console.log('Hopefully all lines have been read');
//   }, 1250);
// });