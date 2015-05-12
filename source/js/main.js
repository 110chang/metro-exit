/*
 *
 *   Main 
 *
 */

requirejs.config({
  baseUrl: '/js',
  urlArgs: 'bust=' + (new Date()).getTime(),
  paths: {
    'mod' : 'mod',
    'knockout' : 'lib/knockout'
  }
});

require([
  'knockout',
  'app/condition',
  'app/poicollection',
  'app/distance',
  'app/map',
  'app/geolocation',
  'mod/utils/reducedresize'
], function(ko, ConditionVM, POICollectionVM, DistanceVM, Map, Geolocation) {

  var initConditions = {
    lat: 35.658517,
    lon: 139.701334,
    address: '日本, 渋谷駅（東京）',
    radius: 500
  };

  function initializeNotifyPos() {
    $.notify.defaults({
      globalPosition: 'top left',
      elementPosition: 'top left'
    });
  }
  function stashInputValue($el) {
    if ($el.size() > 0) {
      $el.on('focus.stash', function(e) {
        $el.data('stash', $el.val());
        $el.val('');
      }).on('blur.stash', function(e) {
        if ($el.val() === '') {
          $el.val($el.data('stash'));
        }
      });
    }
  }

  $(function() {
    //console.log('DOM ready.');
    initializeNotifyPos();

    //
    // initialize ViewModels and Objects
    //

    // manage search condition
    var conditionVM = new ConditionVM(initConditions);
    ko.applyBindings(conditionVM, $('#masthead').get(0));

    // POI collection
    var collectionVM = new POICollectionVM();
    ko.applyBindings(collectionVM, $('#poi-list').get(0));

    var map = new Map('#gmap');

    var distanceVM = new DistanceVM();
    ko.applyBindings(distanceVM, $('#distance').get(0));

    // geolocation
    var geolocation = new Geolocation();

    //
    // add DOM events
    //

    // stash values when focus input element
    stashInputValue($('#param-address-input'));
    stashInputValue($('#param-radius-input'));

    $('#start-search').on('click', function(e) {
      collectionVM.search(conditionVM.getAPIParams());
    });

    $('#toggle-range').on('click', function(e) {
      conditionVM.toggleRange();
    });

    $('#current-location').on('mouseup', function(e) {
      $.notify('現在地を確認しています', 'info');
      geolocation.getCurrent();
    });

    $('#distance').on('click', function(e) {
      distanceVM.hide();
      map.clearRoute();
    });

    // Gray area visible using iOS 7.1 minimal-ui
    // via http://stackoverflow.com/questions/22391157/gray-area-visible-when-switching-from-portrait-to-landscape-using-ios-7-1-minima
    if (navigator.userAgent.match(/(iPad|iPod|iPhone);.*CPU.*OS 7_\d/i)) {
      console.log(navigator.userAgent);
      $(window).on('reducedResize', function(e) {
        window.scrollTo(0,1);
      });
      window.scrollTo(0,1);
    }

    //
    // callback list
    //

    // Tokyo Metro API
    $(window).on('onMetroAPISuccess', function(e, data) {
      if (data.results.length > 0) {
        map.update(collectionVM.points());
        $.notify('出入口情報を取得しました', 'info');
      } else {
        $.notify('出入口情報はありません', 'warn');
      }
    });
    $(window).on('onMetroAPIFail', function(e) {
      $.notify('出入口情報を取得できませんでした', 'error');
    });

    // Googlemap Directions API
    $(window).on('onDirectionsFind', function(e) {
      //$.notify('経路を取得しました', 'info');
    });
    $(window).on('onNoDirectionsFind', function(e) {
      $.notify('経路を取得できませんでした', 'error');
    });

    // HTML5 Geolocation API
    $(window).on('onGeolocationSuccess', function(e) {
      conditionVM.getAddress(geolocation.lat, geolocation.lon);
      collectionVM.search(conditionVM.getAPIParams());
      $.notify('現在地を取得しました', 'info');
    });
    $(window).on('onGeolocationFail', function(e) {
      $.notify('現在地を取得できませんでした', 'error');
    });

    // initialize POI
    collectionVM.search(conditionVM.getAPIParams());
  });
});

