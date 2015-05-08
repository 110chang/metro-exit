/*
*
*   ConditionVM
*
*   @author Yuji Ito @110chang
*
*/

//http://maps.googleapis.com/maps/api/geocode/json?address=%E7%9A%87%E5%B1%85&sensor=true

define([
  'knockout',
  'mod/extend',
  'app/suggestion',
  'mod/fallbacks/array/foreach'
], function(ko, extend, SuggestionVM) {
  var _instance = null;
  var GEOC_API_BASE = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
  var GEOC_POSTFIX = '&sensor=true';

  function ConditionVM(data) {
    if (_instance !== null) {
      return _instance;
    }
    if (!(this instanceof ConditionVM)) {
      return new ConditionVM(data);
    }
    this.lat = ko.observable(data.lat);
    this.lon = ko.observable(data.lon);
    this.address = ko.observable(data.address);
    this.radius = ko.observable(data.radius);
    this.suggestion = ko.observableArray([]);

    this.address.subscribe(this.getLatLng, this);

    _instance = this;
  }
  extend(ConditionVM.prototype, {
    startSearch: function() {
      console.log('ConditionVM#startSearch');
    },
    getLatLng: function() {
      console.log('ConditionVM#getLatLng');
      var address = encodeURIComponent(this.address());
      console.log(GEOC_API_BASE + address + GEOC_POSTFIX);
      $.getJSON(GEOC_API_BASE + address + GEOC_POSTFIX, $.proxy(this.onGeocodingSuccess, this));
    },
    onGeocodingSuccess: function(data, status, xhr) {
      console.log('ConditionVM#onGeocodingSuccess');
      if (data.status === 'OK') {
        var sgst = [];
        data.results.forEach(function(e) {
          sgst.push(new SuggestionVM(e));
        }, this);
        this.suggestion(sgst);
      } else {

      }
    },
    selectLocation: function(v) {
      console.log('ConditionVM#selectLocation');
      this.address(v.address());
      this.lat(v.lat());
      this.lon(v.lon());
    },
    getAPIParams: function() {
      return ['lat=' + this.lat(), 'lon=' + this.lon(), 'radius=' + this.radius()].join('&');
    }
  });
  
  return ConditionVM;
});
