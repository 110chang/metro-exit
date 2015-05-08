/*
*
*   Utils.requestAnimationFrame r1.1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
  var requestAnimationFrame;
  var cancelAnimationFrame;
  
  requestAnimationFrame = window.requestAnimationFrame || 
  window.oRequestAnimationFrame || 
  window.msRequestAnimationFrame || 
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
  
  cancelAnimationFrame = window.cancelAnimationFrame ||
  window.oCancelAnimationFrame || 
  window.msCancelAnimationFrame || 
  function(id) {
    window.clearTimeout(id);
    id = null;
  };
  
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = requestAnimationFrame;
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = cancelAnimationFrame;
  }
  
  return requestAnimationFrame;
});
