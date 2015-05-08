/*
*
*   Cookie r1
*
*   @author Yuji Ito @110chang
*
*/

define([
  'mod/extend'
], function(extend) {
  var _instance = null;

  function Cookie() {
     //
  }
  extend(Cookie.prototype, {
    set: function(data, duration) {
      var str = '';
      var expire = new Date();

      for (var key in data) {
        str += key + '=' + encodeURIComponent(data[key]) + '; ';
      }
      expire.setTime(
        expire.getTime() + 1000 * 60 * 60 * 24 * duration
      );
      console.log(expire);

      str += 'expires=' + expire.toUTCString() + ';';
      console.log(str);

      document.cookie = str;
    },
    get: function() {
      var str = document.cookie;
      var i = 0;
      var a, b;
      var data = {};

      if (str !== '') {
        a = str.split(';');
        for (i = 0; i < a.length; i++) {
          b = a[i].split('=');
          data[b[0]] = decodeURIComponent(b[1]);
        }
      }
      return data;
    }
  });

  if (_instance == null) {
    _instance = new Cookie();
  }
  
  return _instance;
});
