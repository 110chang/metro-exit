/*
*
*   Fallbacks/String/Pad
*
*   via: http://sajjadhossain.com/2008/10/31/javascript-string-trimming-and-padding/
*
*/

define([], function() {
  if (!String.prototype.pad) {
    String.prototype.pad = function(padString, length) {
      var str = this;
      while (str.length < length)
          str = padString + str;
      return str;
    };
  }
  return String.prototype.pad;
});
