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
      console.log('POICollectionVM#update');
      var points = [];
      ko.utils.arrayForEach(data, function(e) {
        var poi = new POIVM(e);
        points.push(poi);
      }, this);
      this.points(points);
    },
    search: function(params) {
      console.log('POICollectionVM#search');
      //console.log(PROXY_URL + '?url=' + API_BASE + params);
      var url = PROXY_URL + '?url=' + API_BASE + params;
      $.getJSON(url, $.proxy(this.onAPISuccess, this)).fail($.proxy(this.onAPIError, this));
    },
    onAPISuccess: function(results) {
      console.log('POICollectionVM#onAPISuccess');
      //console.log(results);
      this.update(results);
      this.map.update(this.points());

      if (results.length > 0) {
        $.notify('出入口情報を取得しました', 'info');
      } else {
        $.notify('出入口情報はありません', 'warn');
      }
    },
    onAPIError: function(results) {
      console.log('POICollectionVM#onAPIError');
      $.notify('出入口情報を取得できませんでした', 'error');
    }
  });
  
  return POICollectionVM;
});
