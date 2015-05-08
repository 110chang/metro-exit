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
  'app/poicollection'
], function(ko, ConditionVM, POICollectionVM) {
  $(function() {
    //console.log('DOM ready.');
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

    $('#start-search').on('click', function() {
      collectionVM.searchPOI(conditionVM.getAPIParams());
    });

    collectionVM.searchPOI(conditionVM.getAPIParams());
  });
});

