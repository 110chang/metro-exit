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
  'app/geolocation',
  'mod/utils/reducedresize'
], function(ko, ConditionVM, POICollectionVM, Geolocation) {
  function initializeNotifyPos() {
    $.notify.defaults({
      globalPosition: 'top left',
      elementPosition: 'top left'
    });
  }
  $(function() {
    //console.log('DOM ready.');
    if (navigator.userAgent.match(/(iPad|iPod|iPhone);.*CPU.*OS 7_\d/i)) {
      console.log(navigator.userAgent);
      $(window).on('reducedResize', function(e) {
        window.scrollTo(0,1);
      });
      window.scrollTo(0,1);
    }
    initializeNotifyPos();

    var initConditions = {
      lat: 35.658517,
      lon: 139.701334,
      address: '日本, 渋谷駅（東京）',
      radius: 500
    };

    // manage search condition
    var conditionVM = new ConditionVM(initConditions);
    ko.applyBindings(conditionVM, $('#masthead').get(0));

    // POI collection
    var collectionVM = new POICollectionVM();
    ko.applyBindings(collectionVM, $('#poi-list').get(0));

    // geolocation
    var geolocation = new Geolocation();

    var savedAddress = '';
    $('#param-address-input').on('focus', function(e) {
      savedAddress = $(this).val();
      $(this).val('');
    }).on('blur', function(e) {
      if ($(this).val() === '') {
        $(this).val(savedAddress);
      }
    });

    var savedRange = '';
    $('#param-radius-input').on('focus', function(e) {
      savedRange = $(this).val();
      $(this).val('');
    }).on('blur', function(e) {
      if ($(this).val() === '') {
        $(this).val(savedRange);
      }
    });

    $('#start-search').on('click', function(e) {
      collectionVM.search(conditionVM.getAPIParams());
    });

    $('#toggle-range').on('mouseup', function(e) {
      conditionVM.toggleRange();
    });

    $('#current-location').on('mouseup', function(e) {
      $.notify('現在地を確認しています', 'info');
      geolocation.getCurrent();
    });

    $(window).on('onGeolocationSuccess', function(e) {
      conditionVM.setLatLng(geolocation.lat, geolocation.lon);
      collectionVM.search(conditionVM.getAPIParams());
      $.notify('現在地を取得しました', 'info');
    });

    $(window).on('onGeolocationFail', function(e) {
      conditionVM.setLatLng(geolocation.lat, geolocation.lon);
      collectionVM.search(conditionVM.getAPIParams());
      $.notify('現在地を取得できませんでした', 'error');
    });

    collectionVM.search(conditionVM.getAPIParams());
  });
});

