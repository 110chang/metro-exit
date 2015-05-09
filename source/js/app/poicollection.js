/*
*
*   POICollectionVM
*
*   @author Yuji Ito @110chang
*
*/

define([
  'knockout',
  'mod/extend',
  'app/condition',
  'app/poi',
  'app/map'
], function(ko, extend, ConditionVM, POIVM, Map) {
  // Tokyo Metro API and my proxy settings
  var PROXY_URL = window.__PROXY_URL;
  var API_BASE = 'https://api.tokyometroapp.jp/api/v2/places&rdf:type=ug:Poi&';

  function POICollectionVM() {
    this.points = ko.observableArray([]);
    this.map = new Map('#gmap');
  }
  extend(POICollectionVM.prototype, {
    update: function(data) {
      var points = [];
      ko.utils.arrayForEach(data, function(e) {
        var poi = new POIVM(e);
        points.push(poi);
      }, this);
      this.points(points);
    },
    searchPOI: function(params) {
      console.log(PROXY_URL + '?url=' + API_BASE + params);
      $.getJSON(PROXY_URL + '?url=' + API_BASE + params, $.proxy(this.onAPISuccess, this));
    },
    onAPISuccess: function(results) {
      console.log(results);
      this.update(results);
      this.map.update(this.points());
    }
  });
  
  return POICollectionVM;
});
