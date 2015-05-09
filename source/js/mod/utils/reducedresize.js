/*
*
*   Utils/ReducedResize r1
*
*   @author Yuji Ito @110chang
*
*/

define([
  'mod/browser'
], function(Browser) {
  // reduce fireing resize event
  var resizeEvent = Browser.nonPC ? 'orientationchange' : 'resize';
  var timer = false;
  var event = new $.Event('reducedResize');
  $(window).on(resizeEvent, function(e) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      $(window).trigger(event);
    }, 125);
  });

  return event;
});
