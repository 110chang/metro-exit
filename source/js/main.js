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
  'mod/utils/reducedresize'
], function(ko, ConditionVM, POICollectionVM) {
  $(function() {
    //console.log('DOM ready.');
    if (navigator.userAgent.match(/(iPad|iPod|iPhone);.*CPU.*OS 7_\d/i)) {
      console.log(navigator.userAgent);
      $(window).on('reducedResize', function(e) {
        window.scrollTo(0,1);
      });
      window.scrollTo(0,1);
    }
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

    $('#param-address-input').on('focus', function(e) {
      $(this).val('');
    });

    $('#start-search').on('click', function(e) {
      collectionVM.searchPOI(conditionVM.getAPIParams());
    });

    $('#toggle-range').on('mouseup', function(e) {
      e.stopPropagation();
      e.preventDefault();
      conditionVM.toggleRange();
    });

    collectionVM.searchPOI(conditionVM.getAPIParams());
  });
});

