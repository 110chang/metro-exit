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
  'mod/fallbacks/array/foreach',
  'mod/fallbacks/array/indexof',
  'mod/fallbacks/object/keys'
], function(ko, extend, SuggestionVM) {
  var _instance = null;
  var componentObj = {
    'country': 'JP'//,
    //'administrative_area': encodeURIComponent('東京都')
  };
  var GEOC_API_BASE = 'http://maps.googleapis.com/maps/api/geocode/json?';
  var GEOC_PREFIX_ADDRESS = 'address=';
  var GEOC_PREFIX_LATLNG = 'latlng=';
  var GEOC_POSTFIX = '&sensor=true';
  var GEOC_FILTER = '&components=' + createComponentStr(componentObj);

  var targetRanges = [100, 250, 500, 1000, 2000, 3000, 5000, 10000];

  function createComponentStr(obj) {
    var tmp = [];
    Object.keys(obj).forEach(function(key) {
      tmp.push(key + ':' + obj[key]);
    });
    return tmp.join('|');
  }

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
    this.isSearchByParams = ko.observable(false);
    this.isSearchByGeo = ko.observable(false);

    this.addressSubscription = this.address.subscribe(this.getLatLng, this);

    _instance = this;
  }
  extend(ConditionVM.prototype, {
    startSearch: function() {
      console.log('ConditionVM#startSearch');
    },
    clearStats: function() {
      this.isSearchByParams(false);
      this.isSearchByGeo(false);
    },
    setLatLng: function(lat, lon) {
      console.log('ConditionVM#setLatLng');
      this.lat(lat);
      this.lon(lon);
      this.getAddress();
    },
    getLatLng: function() {
      console.log('ConditionVM#getLatLng');
      var params = GEOC_PREFIX_ADDRESS + encodeURIComponent(this.address());
      $.getJSON(GEOC_API_BASE + params + GEOC_FILTER + GEOC_POSTFIX, $.proxy(this.onGeocodingSuccess, this));
    },
    onGeocodingSuccess: function(data, status, xhr) {
      console.log('ConditionVM#onGeocodingSuccess');
      if (data.status === 'OK') {
        //console.log(data.results);
        var sgst = [];
        data.results.forEach(function(e) {
          sgst.push(new SuggestionVM(e));
        }, this);
        this.suggestion(sgst.slice(0, 10));
        this.lat(sgst[0].lat);
        this.lon(sgst[0].lon);
      } else {

      }
    },
    getAddress: function(lat, lon) {
      console.log('ConditionVM#getAddress');
      this.lat(lat);
      this.lon(lon);
      var params = GEOC_PREFIX_LATLNG + this.lat() + ',' + this.lon();
      $.getJSON(GEOC_API_BASE + params + GEOC_POSTFIX, $.proxy(this.onReverseGeocodingSuccess, this));
    },
    onReverseGeocodingSuccess: function(data, status, xhr) {
      console.log('ConditionVM#onReverseGeocodingSuccess');
      if (data.status === 'OK') {
        //console.log(data.results);
        this.selectLocation(new SuggestionVM(data.results[0]));
      } else {

      }
    },
    selectLocation: function(v) {
      console.log('ConditionVM#selectLocation');
      //this.addressSubscription.dispose();
      this.address(v.address);
      //this.addressSubscription = this.address.subscribe(this.getLatLng, this);
      this.lat(v.lat);
      this.lon(v.lon);
      this.suggestion([]);
      $('#start-search').trigger('click');
    },
    getAPIParams: function() {
      return ['lat=' + this.lat(), 'lon=' + this.lon(), 'radius=' + this.radius()].join('&');
    },
    toggleRange: function() {
      console.log('ConditionVM#toggleRange');
      var tmp = this.radius();
      var idx = targetRanges.indexOf(tmp);
      if (targetRanges[idx + 1]) {
        tmp = targetRanges[idx + 1];
      } else {
        tmp = targetRanges[0];
      }
      this.radius(tmp);
    },
    hideSuggestion: function() {
      this.suggestion([]);
    }
  });
  
  return ConditionVM;
});
