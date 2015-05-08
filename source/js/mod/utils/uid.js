/*
*
*   Utils.UniqueID r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
  var UniqueID = (function() {
    var id = 0;
    
    return function() {
      return id++;
    };
  }());
  
  return UniqueID;
});