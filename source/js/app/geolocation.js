/*
*
*   Geolocation
*
*   @author Yuji Ito @110chang
*
*/

/*
Coordinates
accuracy: 63
altitude: null
altitudeAccuracy: null
heading: null
latitude: 35.502371499999995
longitude: 139.6259765
speed: null
*/
define([
  'mod/extend'
], function(extend) {
  var _instance = null;

  function Geolocation() {
    if (!(this instanceof Geolocation)) {
      return new Geolocation();
    }
    if (_instance instanceof Geolocation) {
      return _instance;
    }
    _instance = this;
  }
  extend(Geolocation.prototype, {
    getCurrent: function() {
      console.log('Geolocation#getCurrent');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($.proxy(this.success, this), $.proxy(this.error, this));
      } else {

      }
    },
    success: function(pos) {
      console.log('Geolocation#success');
      this.lat = pos.coords.latitude;//35.684378;//test code
      this.lon = pos.coords.longitude;//139.738338;//test code
      $(window).trigger('onGeolocationSuccess');
    },
    error: function(error) {
      console.log('Geolocation#error');
      console.log(error.code);
      $(window).trigger('onGeolocationFail');
    }
  });
  
  return Geolocation;
});
