/*
*
*   Fallbacks/Object/Values
*
*   via: http://stackoverflow.com/questions/7306669/how-to-get-all-properties-values-of-a-javascript-object-without-knowing-the-key
*
*/

define([], function() {
  if (!Object.values) {
    Object.values = function(obj) {
      var vals = [];
      for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
          vals.push(obj[key]);
        }
      }
      return vals;
    };
  }
  return Object.values;
});
