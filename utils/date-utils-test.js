const assert = require('node:assert/strict');
const { parseStringToDate, replaceParseWithDate, formatAsYYYYMMDD_HHMMSS, formatAsYYYY_MM_DD_HHMMSS, fixDate } = require('./date-utils');
const { readFile } = require('./file-utils');
let inputStr, outputStr;
inputStr = "test 2015/11/12 19-23-22 Fall Sports Banquet IMG_9343.jpg";
let result = parseStringToDate(inputStr);
let newString;
if (result){
  let newStringFormat = formatAsYYYYMMDD_HHMMSS(result.date);
  newString = replaceParseWithDate(inputStr, result, newStringFormat);
}
console.log('ORIG: ' + inputStr)
console.log(' NEW: ' + newString);

// inputStr = "20220709 21:13:14 is a test";
// assert(fixDate(inputStr,formatAsYYYY_MM_DD_HHMMSS) === "2022-07-09 211314 is a test");
// assert(fixDate(inputStr,formatAsISO) === "2022-07-10T01:13:14.000Z is a test");
//
// inputStr = "2022-07-09T21:13:14.000-04:00 is a test";
// assert(fixDate(inputStr,formatAsISO) === "2022-07-10T01:13:14.000Z is a test");
//
// inputStr = "IMG 20220709_211314 is a great pict";
// assert(fixDate(inputStr,formatAsYYYY_MM_DD_HHMMSS) === "IMG 2022-07-09 211314 is a great pict");

inputStr = "2015-11-12 Fall Sports Banquet IMG_9343.jpg";
// outputStr = fixDate(inputStr,formatAsYYYY_MM_DD_HHMMSS);
// console.log('ORIG: ' + inputStr)
// console.log(' NEW: ' + outputStr);
assert(fixDate(inputStr,formatAsYYYY_MM_DD_HHMMSS) === "2015-11-12 Fall Sports Banquet IMG_9343.jpg");

// inputStr = "20151112T192322 Fall Sports Banquet IMG_9343.jpg";
// assert(fixDate(inputStr,formatAsYYYY_MM_DD_HHMMSS) === "2015-11-12 192322 Fall Sports Banquet IMG_9343.jpg");
//
// // parseStringToDate("2022-07-09 21-13-14")
// // parseStringToDate("2022-07-09T21:13:14.156Z")
// // ISO_8601_FULL.test( "2016-05-24T15:54:14.876Z" )  // true
// // ISO_8601_FULL.test( "2002-12-31T23:00:00+01:00" ) // true
// // ISO_8601_FULL.test( "2016-02-01" )                // false
// // ISO_8601_FULL.test( "2016" )                      // false
// //
// // ISO_8601.test( "2016-02-01" )                     // true
// // ISO_8601.test( "2016" )                           // true
// // ISO_8601.test( "2002-12-31T23:00:00+01:00" )      // true


// const p = (msg) => console.log(msg);
// p(patternYYYYMMDD.test("20220102"))
// p(patternYYYYMMDD.test("2022-01-02"))
// p(patternYYYYMMDD.test("2022/01/02"))
// p(patternYYYYMMDD.test("2022/0102"))
// p(patternYYYYMMDD.test("202201/02"))
// p(patternYYYYMMDD.test("2022/01-02"))

// Read all of the example file names and process them
readFile('../ex-filenames.data', (line, lineCount, byteCount, stopReadingFunc  ) => {
  let result = fixDate(line,formatAsYYYY_MM_DD_HHMMSS)
  console.log(' INPUT: ' + line);
  console.log('OUTPUT: ' + result);
});

