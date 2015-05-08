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
  'app/poi'
], function(ko, extend, ConditionVM, POIVM) {
  // Tokyo Metro API and my proxy settings
  var PROXY_URL = window.__PROXY_URL;
  var API_BASE = 'https://api.tokyometroapp.jp/api/v2/places&rdf:type=ug:Poi&';

  function POICollectionVM() {
    this.points = ko.observableArray([]);
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
      var markers = [];
      this.points().forEach(function(p) {
        markers.push({
          latLng: [p.lat(), p.lon()],
          data: p.title()
        });
      }, this);
      markers.push({
        latLng: [ConditionVM().lat(), ConditionVM().lon()],
        data: ConditionVM().address(),
        options: {
          fillColor: "#330000"
        }
      });
      $('#gmap').gmap3('destroy').empty().gmap3({
        marker: {
          values: markers
        },
        circle:{
          options:{
            center: [ConditionVM().lat(), ConditionVM().lon()],
            radius: ConditionVM().radius() * 1,
            fillColor: "transparent",
            strokeColor: "#005BB7",
            strokeWeight: 1
          }
        },
        autofit: {}
      });
    }
  });
  
  return POICollectionVM;
});
