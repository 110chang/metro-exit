/*
*
*   SuggestionVM
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
  'knockout'
], function(ko) {
  function SuggestionVM(data) {
    this.address = data.formatted_address;
    this.lat = data.geometry.location.lat;
    this.lon = data.geometry.location.lng;
    this.focused = ko.observable(false);
  }

  return SuggestionVM;
});
