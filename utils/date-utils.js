const dateTimePattern = /(\d{4}[-/]?(0[1-9]|1[0-2])[-/]?(0[1-9]|[12][0-9]|3[01])|(0[1-9]|1[0-2])[-/]?(0[1-9]|[12][0-9]|3[01])[-/]?\d{4})([ _T]?([0-1]?[0-9]|2[0-3])[:-]?[0-5][0-9]([:-]?)([0-5][0-9](\.\d{3}[Z])?)?)?/;

/**
 * RegExp to test for a date in YYYY-MM-DD format (with or without separators)
 * where year has to be 1900-9999, MM = 01-12, DD = 01 - 31
 * YYYYMMDD
 * YYYY-MM-DD
 * YYYY/MM/DD
 * These also match but I'm not thrilled with it
 * YYYY-MM/DD
 * YYYY/MMDD (also matches YYYY-MMDD)
 * YYYYMM-DD  (also matches YYYYMM/DD)
 *  @type {RegExp}
 */
const patternYYYYMMDD = /\d{4}[-\/]?(0[1-9]|1[0-2])[-\/]?(0[1-9]|[12][0-9]|3[01])/;

/**
 * Builds on patternYYYYMMDD and adds a timestamp of format HHMMDD, HH:MM:DD, or HH-MM-DD
 * The last date is called stupid ACDSEE date because ACDSEE renamed files that way
 * before I realized how to make it better. :-)
 *
 * @type {RegExp}
 */
const multiYYYYMMDD_HHMMSS = /\d{4}[-\/]?(0[1-9]|1[0-2])[-\/]?(0[1-9]|[12][0-9]|3[01])[ _T](0[0-9]|1[0-9]|2[0-3])[\:\-]?[0-5][0-9][\:\-]?[0-5][0-9]/;

/**
 * RegExp to test a string for a ISO 8601 Date spec
 *  YYYY
 *  YYYY-MM
 *  YYYY-MM-DD
 *  YYYY-MM-DDThh:mmTZD
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see: https://www.w3.org/TR/NOTE-datetime
 * @type {RegExp}
 */
var ISO_8601 = /\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?/i;



/**
 * RegExp to test a string for a full ISO 8601 Date
 * Does not do any sort of date validation, only checks if the string is according to the ISO 8601 spec.
 *  YYYY-MM-DDThh:mm:ss
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see: https://www.w3.org/TR/NOTE-datetime
 * @type {RegExp}
 */
var ISO_8601_FULL = /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?/i;


/**
 * Parse aDateString and return a Date that was found.  The date can be anywhere within the string
 * but only one date is expected to be on the string.
 * After calling this routine, you can replace the text of the date/time that was found with
 * a formatted date that you want (because a Date object is returned).
 *
 * @param aDateString
 * @returns { date, input, matchedString, matchedIndex, name }
 * date - is a Java Date object
 * input - the original input that was passed into the function (aka aDateString)
 * matchedString - is the portion of the string that was matched by some Date pattern
 * matchedIndex - is the index into the original input.  Used so you could replace the original
 *   input with another date format of your choosing.
 * name - the name of the pattern that was used to match the string
 */
function parseStringToDate(aDateString){
  let rtn = null;
  let newDateString = null;

  let datePatterns = [
    { name: "ISO_8601_FULL", pattern: ISO_8601_FULL, toDateFunc: _genericToDate },
    { name: "YYYYMMDD_HHMMSS", pattern: multiYYYYMMDD_HHMMSS, toDateFunc: _multiYYYYMMDD_HHMMSS },
    { name: "YYYYMMDD", pattern: patternYYYYMMDD, toDateFunc: _multiYYYYMMDD_HHMMSS }
  ];

  // Check for longest match first, Date Time (e.g., 2022-07-09T19:12:13.023Z)
  for (const patternInfo of datePatterns){
    let match = aDateString.match(patternInfo.pattern);

    if (match){
      let matchedString = match[0];
      let theDate = patternInfo.toDateFunc(matchedString, patternInfo.name);
      if (isValidDate(theDate)){
        rtn = { date: theDate, input: aDateString, matchedString: matchedString, matchedIndex: match.index, name: patternInfo.name }
        break;
      }
      // else keep looking
    }
  }
  // console.log('Returning: ' + JSON.stringify(rtn));
  return rtn;
}

/**
 * Convert YYYYMMDD_HHMMSS to a valid string that can be converted to a date
 * @param strDate
 * @param datePatternName
 * @private
 */
function _stupidCameraDateYYYYMMDD_HHMMSS(strDate, datePatternName){
  let newDateString = strDate.substring(0,4)
    + "-"
    + strDate.substring(4,6)
    + "-"
    + strDate.substring(6,8)
    + " "
    + strDate.substring(9,11)
    + ":"
    + strDate.substring(11,13)
    + ":"
    + strDate.substring(13,15);
  let rtn = new Date(newDateString);
  return rtn;
}

/**
 * Convert format YYYY-MM-DD HH-MM-SS to YYYY-MM-DD HH:MM:SS so it can be converted to a date
 * @param strDate
 * @param datePatternName
 * @private
 */
function _multiYYYYMMDD_HHMMSS(strDate, datePatternName){
  let parts = strDate.split(/[_ T]/);
  let datePart = parts[0];
  let timePart = parts.length > 1 && parts[1];
  let newDateString = "";
  // Handle YYYYMMDD
  if (datePart.match(/^\d+$/)){
    newDateString += datePart.substring(0,4) + '-' + datePart.substring(4,6) + '-' + datePart.substring(6,8);
  } else {
    newDateString += datePart; // Date part is ok, it's either 2022-07-09 or 2022/07/09
  }
  // Handle HHMMSS
  if (timePart){
    if (timePart.match(/^\d+$/)){
      newDateString += " " + timePart.substring(0,2) + ":" + timePart.substring(2,4) + ":" + timePart.substring(4,6);
    } else {
      // time part might have dashes as delim due to ACDSEE screwup on changing dates, so fix it
      newDateString += " " + timePart.replace('-',':'); // Does nothing if string already has colons
    }
  } else {
    newDateString += " 00:00:00"; // when time is missing use midnight as time
  }
  let rtn = new Date(newDateString);
  return rtn;
}

function _genericToDate(strDate, datePatternName){
  let rtn = new Date(strDate);
  // Test that a Date object was created and if so return it, otherwise return null
  if (!isValidDate(rtn)){
    rtn = null;
  }
  return rtn;
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

/**
 * Add leading zeros (if necessary) to the number passed in.  For example, 1 becomes string "01".
 * @param numOrString
 * @returns {string}
 */
function addz(numOrString){
  return numOrString.toString().padStart(2, '0');
}

/**
 * Format a Javascript Date object as YYYY-MM-DD HHMMSS
 */
function formatAsYYYY_MM_DD_HHMMSS(oDate, parseResult){
  return formatAsYYYYMMDD_HHMMSS(oDate, parseResult, "-", "");
}

function formatAsISO(oDate){
  return oDate.toISOString();
}

/**
 * Format a Javascript Date object as YYYY-MM-DD HH:MM:SS where the delimiters
 * between the delimiter used in the date (aka yearDelim) and delimiter used
 * in the time (aka timeDelim) can be specified.
 * By default, milliseconds are not included.  Set includeMilli to true to
 * include the milliseconds.
 *
 * @param oDate
 * @param yearDelim - defaults to "-" if not specified
 * @param timeDelim - defaults to "" if not specified
 * @param includeMilli - defaults to false
 * @returns {string} a formatted string
 */
function formatAsYYYYMMDD_HHMMSS(oDate, parseResult, yearDelim, timeDelim, includeMilli){
  if (!yearDelim){
    yearDelim = "-";
  }
  if (!timeDelim){
    timeDelim = "";
  }
  if (!parseResult) {
    parseResult = { name: 'unknown'};
  }

  let rtn = oDate.getFullYear() + yearDelim + addz((oDate.getMonth() + 1)) + yearDelim + addz(oDate.getDate());
  if (parseResult.name === 'YYYYMMDD'){
    rtn; // if there is no timestamp, don't add one
  } else {
    rtn += " " + addz(oDate.getHours()) + timeDelim + addz(oDate.getMinutes()) + timeDelim + addz(oDate.getSeconds());
  }
  if (includeMilli){
    rtn = "." + oDate.getMilliseconds();
  }
  return rtn;
}

function replaceParseWithDate(inputStr, parseResult, withDateString){
  let updatedString = inputStr.substring(0,parseResult.matchedIndex) + withDateString
    + inputStr.substring(parseResult.matchedIndex + parseResult.matchedString.length);
  return updatedString;
}

function fixDate(inputStr, formatDateFunc){
  let updatedStr = inputStr; // return original string if no date is found
  if (!formatDateFunc){
    formatDateFunc = formatAsYYYY_MM_DD_HHMMSS;
  }
  let result = parseStringToDate(inputStr);
  if (result){
    let newStringFormat = formatDateFunc(result.date, result);
    updatedStr = replaceParseWithDate(inputStr, result, newStringFormat);
  }
  return updatedStr;
}

module.exports = {
  fixDate,
  formatAsYYYYMMDD_HHMMSS,
  formatAsYYYY_MM_DD_HHMMSS,
  parseStringToDate,
  replaceParseWithDate
}
