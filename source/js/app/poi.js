/*
*
*   POIVM
*
*   @author Yuji Ito @110chang
*
*/

/*
@context: "http://vocab.tokyometroapp.jp/context_ug_Poi.jsonld"
@id: "urn:ucode:_00001C000000000000010000030C44FB"
@type: "ug:Poi"
dc:title: "北参道出入口2"
geo:lat: 35.677697957679
geo:long: 139.70615692221
ug:floor: 1
ug:region: "https://api.tokyometroapp.jp/api/v2/places/urn:ucode:_00001C000000000000010000030C44FB.geojson"
ugsrv:categoryName: "出入口"
*/

define([
  'knockout',
  'mod/extend'
], function(ko, extend) {
  function POIVM(data) {
    this.context = ko.observable(data['@context']);
    this.id = ko.observable(data['@id']);
    this.type = ko.observable(data['@type']);
    this.title = ko.observable(data['dc:title']);
    this.lat = ko.observable(data['geo:lat']);
    this.lon = ko.observable(data['geo:long']);
    this.floor = ko.observable(data['ug:floor']);
    this.region = ko.observable(data['ug:region']);
    this.ucode = ko.observable(data['urn:ucode']);
    this.category = ko.observable(data['ugsrv:categoryName']);
  }
  extend(POIVM.prototype, {});
  
  return POIVM;
});
