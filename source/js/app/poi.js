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

define([], function() {
  function POIVM(data) {
    this.context = data['@context'];
    this.id = data['@id'];
    this.type = data['@type'];
    this.title = data['dc:title'];
    this.lat = data['geo:lat'];
    this.lon = data['geo:long'];
    this.floor = data['ug:floor'];
    this.region = data['ug:region'];
    this.ucode = data['urn:ucode'];
    this.category = data['ugsrv:categoryName'];
  }

  return POIVM;
});
