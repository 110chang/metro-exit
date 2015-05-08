/*
*
*   Mod/Router r1
*
*   @author Yuji Ito @110chang
*
*/

define([
  'mod/inherit',
  'mod/pubsub',
  'mod/screen'
], function(inherit, PubSub, Screen) {
  var _instance = null,
    sp = 1,
    HASH_SEPERATOR = '#/',

    Router = inherit(PubSub, {
      $header: $('#masthead'),
      $a: null,
      hashlist: [],
      current: 0,
      duration: 1000,
      easing: 'easeInOutExpo',
      usePushState: true,

      init: function() {
        PubSub.init.call(this);

        var hashlist = [];

        this.$a = this.$header.find('a[href*=#]').each(function(i) {
          hashlist[i] = '' + this.href.split(HASH_SEPERATOR)[1];
        });

        this.hashlist = hashlist;
        this.$a.on('click', $.proxy(this._onClick, this));
        this.enableScrollDetect();

        return this;
      },
      goto: function(hash) {
        this.usePushState = false;
        this.scrollTo(hash);
      },
      next: function() {
        var hash = location.hash.replace(HASH_SEPERATOR, ''),
          next = this.hashlist[$.inArray(hash, this.hashlist) + 1];

        if (next) {
          this.scrollTo(next);
        }
      },
      prev: function() {
        var hash = location.hash.replace(HASH_SEPERATOR, ''),
          prev = this.hashlist[$.inArray(hash, this.hashlist) - 1];
        if (prev) {
          this.scrollTo(prev);
        }
      },
      exist: function(hash) {
        var isExist = false;

        hash = hash && hash.replace(HASH_SEPERATOR, '');

        $.each(this.hashlist, function(i) {
          if (hash === this.toString()) {
            isExist = true;
          }
        });

        return isExist;
      },
      hashRewrite: function(href) {
        //console.log('Router#hashRewrite');
        var hash = href.split(HASH_SEPERATOR)[1],
          top = HASH_SEPERATOR + this.hashlist[0];

        if (!hash || !this.exist(hash)) {
          href = top;
        }
        if (window.history && window.history.pushState && this.usePushState) {
          history.pushState('' + hash, document.title, href);
        } else {
          location.hash = '/' + href.split(HASH_SEPERATOR)[1];
        }
        this.updateNav(href);
        this.usePushState = true;
        this.enableScrollDetect();
        this.publish('onHashRewrited');
      },
      updateNav: function(href) {
        //console.log(Router#updateNav);
        this.$a.each(function(i) {
          if (this.href.match(href)) {
            $(this).addClass('on');
          } else {
            $(this).removeClass('on');
          }
        });
      },
      scrollTo: function(hash, duration, easing) {
        hash = hash.replace(HASH_SEPERATOR, '');
        duration = duration || this.duration;
        easing = easing || this.easing;

        var $body, $target,
          targetOffsetX,
          targetOffsetY,
          scrollWidth,
          scrollHeight,
          clientWidth,
          clientHeight;

        $body = $('html,body');
        $target = $('#' + hash) || $('[name=' + hash +']');
        //console.log($target);
        if ($target.size() > 0) {
          targetOffsetX = $target.offset().left;
          targetOffsetY = $target.offset().top;
          scrollWidth = Screen.scrollWidth();
          scrollHeight = Screen.scrollHeight();
          clientWidth = Screen.clientWidth();
          clientHeight = Screen.clientHeight();

          if ((targetOffsetX + clientWidth) > scrollWidth) {
            targetOffsetX = scrollWidth - clientWidth;
          }
          if ((targetOffsetY + clientHeight) > scrollHeight) {
            targetOffsetY = scrollHeight - clientHeight;
          }
          this.disableScrollDetect();
          $body.stop().animate({
            scrollTop: targetOffsetY//,
            //scrollLeft: targetOffsetX
          }, duration, easing).promise().done(
            $.proxy(this._onScrollFinished, this, {current: hash})
          );

          return false;
        }
      },
      enableScrollDetect: function() {
        $(window).on('scroll.detector', $.proxy(this._onScroll, this));
      },
      disableScrollDetect: function() {
        $(window).off('scroll.detector', $.proxy(this._onScroll, this));
      },
      _onClick: function(e) {
        e.preventDefault();
        this.scrollTo(e.currentTarget.href.split(HASH_SEPERATOR)[1]);
        return false;
      },
      _onScroll: function(e) {
        //console.log('Router#_onScroll');
        var hashRewrite = $.proxy(this.hashRewrite, this),
          hash, $e, leftIn, topIn, scrLeft, srcTop;

        scrLeft = Screen.scrollLeft();
        srcTop = Screen.scrollTop();

        $.each(this.hashlist, function(i) {
          hash = this.toString();
          $e = $('#' + hash);
          leftIn = $e.offset().left - sp <= scrLeft && scrLeft < $e.offset().left + $e.outerWidth() - sp;
          topIn = $e.offset().top - sp <= srcTop && srcTop < $e.offset().top + $e.outerHeight() - sp;

          if (topIn) {
            if (hash !== location.hash.replace(HASH_SEPERATOR, '')) {
              hashRewrite(HASH_SEPERATOR + hash);
            }
          }
        });
      },
      _onScrollFinished: function(data) {
        //console.log('Router#onScrollFinished');
        this.hashRewrite(HASH_SEPERATOR + data.current);
        this.publish('onScrollFinished');
      }
    });

  if (_instance === null) {
    _instance = Router;
  }

  return _instance;
});
