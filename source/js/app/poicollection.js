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
  'app/poi',
  'app/map'
], function(ko, extend, POIVM) {
  // Tokyo Metro API and my proxy settings
  var PROXY_URL = window.__PROXY_URL;
  var API_BASE = 'https://api.tokyometroapp.jp/api/v2/places&rdf:type=ug:Poi&';

  function POICollectionVM() {
    this.points = ko.observableArray([]);
  }
  extend(POICollectionVM.prototype, {
    update: function(data) {
      //console.log('POICollectionVM#update');
      var points = [];
      ko.utils.arrayForEach(data, function(e) {
        var poi = new POIVM(e);
        points.push(poi);
      }, this);
      this.points(points);
    },
    size: function() {
      return this.points().length;
    },
    search: function(params) {
      //console.log('POICollectionVM#search');
      //console.log(PROXY_URL + '?url=' + API_BASE + params);
      var url = PROXY_URL + '?url=' + API_BASE + params;
      $.getJSON(url, $.proxy(this.onAPISuccess, this)).fail($.proxy(this.onAPIError, this));
    },
    onAPISuccess: function(results) {
      //console.log('POICollectionVM#onAPISuccess');
      this.update(results);
      $(window).trigger('onMetroAPISuccess', { results: results });
    },
    onAPIError: function(results) {
      //console.log('POICollectionVM#onAPIError');
      //console.log(results)
      $(window).trigger('onMetroAPIFail');
    }
  });
  
  return POICollectionVM;
});
