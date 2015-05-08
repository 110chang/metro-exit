/*
*
*   Screen r2
*
*   @author Yuji Ito @110chang
*
*/

define('mod/screen',[], function() {
  var Screen = {
    width: function() {
      return Screen.clientWidth();
    },
    height: function() {
      return Screen.clientHeight();
    },
    scrollWidth: function() {
      return Math.max.apply(null, [
        document.body.clientWidth,
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth
      ]);
    },
    scrollHeight: function() {
      // Ref. http://css-eblog.com/javascript/javascript-contents-height.html
      return Math.max.apply(null, [
        document.body.clientHeight,
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight
      ]);
    },
    scrollTop: function() {
      return document.documentElement.scrollTop || document.body.scrollTop;
    },
    scrollLeft: function() {
      return document.documentElement.scrollLeft || document.body.scrollLeft;
    },
    clientWidth: function() {
      return document.clientWidth || document.documentElement.clientWidth;
    },
    clientHeight: function() {
      return document.clientHeight || document.documentElement.clientHeight;
    }
  };
  
  return Screen;
});

/*
*
*   Nav.SmoothScroll r1
*
*   @author Yuji Ito @110chang
*
*/

define('mod/nav/smoothscroll',[
  'mod/screen'
], function(Screen) {
  var SmoothScroll = function(duration, easing) {
    duration = duration || 1000;
    easing = easing || 'easeInOutExpo';
    
    $('a[href*=#]').click(function (e) {
      var target,
        targetOffset,
        scrollHeight,
        clientHeight;
      
      if (this.hash.match(/^#\W/)) {
        return;
      }
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') 
      && location.hostname === this.hostname) {
        $target = $(this.hash);
        $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
        if ($target.length) {
          targetOffset = $target.offset().top;
          scrollHeight = Screen.scrollHeight();
          clientHeight = Screen.clientHeight();
          //console.log((targetOffset + clientHeight) +','+ scrollHeight);
          if ((targetOffset + clientHeight) > scrollHeight) {
            targetOffset = scrollHeight - clientHeight;
          }
          $('html,body').animate({scrollTop: targetOffset}, duration, easing);
          return false;
        }
      }
    });
  };
  
  return SmoothScroll;
});
/*
*
*   Utils.Boundary r1
*
*   @author Yuji Ito @110chang
*
*/

define('mod/utils/boundary',[], function() {
	var Boundary = {
		scrollHeight: function() {
			// Ref. http://css-eblog.com/javascript/javascript-contents-height.html
			return Math.max.apply(null, [
				document.body.clientHeight,
				document.body.scrollHeight,
				document.documentElement.scrollHeight,
				document.documentElement.clientHeight
			]);
		},
		scrollTop: function() {
			return document.documentElement.scrollTop || document.body.scrollTop;
		},
		clientWidth: function() {
			return document.clientWidth || document.documentElement.clientWidth;
		},
		clientHeight: function() {
			return document.clientHeight || document.documentElement.clientHeight;
		}
	};
	
	return Boundary;
});

/*
*
*   Utils.Browser r1
*
*   @author Yuji Ito @110chang
*
*/

define('mod/utils/browser',[], function() {
	var _userAgent	 = navigator.userAgent,
		_is_IE		 = /MSIE/.test(_userAgent),
		_is_iPhone	 = /iPhone/.test(_userAgent),
		_is_iPad	 = /iPad/.test(_userAgent),
		_is_Android	 = /Android/.test(_userAgent),
		_is_Mobile	 = /Mobile/.test(_userAgent), // Android only
		_is_windows	 = /Win/.test(navigator.platform),
		_is_mac		 = /Mac/.test(navigator.platform),
		_is_WebKit	 = /Chrome|Safari/.test(_userAgent),
// Detect IE in JS using conditional comments (lt IE10)
// via http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
		_ie = (function() { 
			var undef, v = 3, div = document.createElement('div');
			while (
				div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
				div.getElementsByTagName('i')[0]
			);
			return v > 4 ? v : undef;
		}()),
		
		Browser = {
			IE			 : _is_IE,
			iPhone		 : _is_iPhone,
			iPad		 : _is_iPad,
			Android		 : _is_Android,
			WebKit		 : _is_WebKit,
			platform	 : {
				windows	 : _is_windows,
				mac		 : _is_mac
			},
			ie			 : _ie,
			mobile		 : _is_iPhone || _is_iPad || _is_Android,
			smallScreen	 : _is_iPhone || (_is_Android && _is_Mobile),
			tablet		 : _is_iPad || (_is_Android && !_is_Mobile),
			
			__test__: function(userAgent) {
				if (!userAgent) {
					throw new Error('Require test string.');
				}
				_userAgent = userAgent;
				_is_IE = /MSIE/.test(_userAgent);
				_is_iPhone = /iPhone/.test(_userAgent);
				_is_iPad = /iPad/.test(_userAgent);
				_is_Android = /Android/.test(_userAgent);
				_is_Mobile = /Mobile/.test(_userAgent); // Android only
				_is_windows = /Win/.test(navigator.platform);
				_is_mac = /Mac/.test(navigator.platform);
				_is_WebKit = /Chrome|Safari/.test(_userAgent);
				
				this.IE			 = _is_IE;
				this.iPhone		 = _is_iPhone;
				this.iPad		 = _is_iPad;
				this.Android	 = _is_Android;
				this.WebKit		 = _is_WebKit;
				this.platform	 = {
					windows	 : _is_windows,
					mac		 : _is_mac
				};
				this.mobile		 = _is_iPhone || _is_iPad || _is_Android;
				this.smallScreen = _is_iPhone || (_is_Android && _is_Mobile);
				this.tablet		 = _is_iPad || (_is_Android && !_is_Mobile);
				
				return this;
			}
		};
	
	return Browser;
});

/*
 *
 *   Main 
 *
 */

requirejs.config({
  baseUrl: '/js',
  urlArgs: 'bust=' + (new Date()).getTime(),
  paths: {
    'mod' : 'mod'
  }
});

require([
  'mod/nav/smoothscroll',
  'mod/utils/boundary',
  'mod/utils/browser'
], function(smoothScroll, Boundary, Browser) {
  $(function() {
    console.log('DOM ready.');
    
  });
});


define("main", function(){});

