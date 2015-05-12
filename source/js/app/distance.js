/*
*
*   DistanceVM
*
*   @author Yuji Ito @110chang
*
*/

/*
address_components: Array[3]
formatted_address: "日本, 仙台駅（宮城）"
geometry: Object
  location: Object
    lat: 38.260297
    lng: 140.882049
location_type: "APPROXIMATE"
viewport: Object
place_id: "ChIJT7K2iBgoil8Rz4HxlRk2pJs"
types: Array[3]
*/

define([
  'knockout',
  'mod/extend'
], function(ko, extend) {
  var _instance = null;
  var floor = Math.floor;

  function DistanceVM() {
    if (_instance !== null) {
      return _instance;
    }
    if (!(this instanceof DistanceVM)) {
      return new DistanceVM();
    }
    this.x = ko.observable(0);
    this.y = ko.observable(0);
    this.visibility = ko.observable(false);
    this.duration = ko.observable('');
    this.distance = ko.observable('');

    _instance = this;
  }
  extend(DistanceVM.prototype, {
    show: function() {
      this.visibility(true);
    },
    hide: function() {
      this.visibility(false);
    },
    update: function(x, y, dur, dist) {
      this.x(floor(x));
      this.y(floor(y));
      this.duration(dur);
      this.distance(dist);
    }
  });
  
  return DistanceVM;
});
