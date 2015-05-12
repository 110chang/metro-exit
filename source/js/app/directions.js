/*
*
*   Directions
*
*   @author Yuji Ito @110chang
*
*/

define([
  'knockout',
  'mod/extend',
  'app/distance'
], function(ko, extend, DistanceVM) {
  var renderOpt = {
    preserveViewport: true,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#005BB7',
      strokeOpacity: 0.8,
      strokeWeight: 4
    }
  };

  function Directions(map) {
    this.map = map;
    this.service = new google.maps.DirectionsService();
    //this.display = new google.maps.DirectionsRenderer(renderOpt);
    //this.display.setMap(map);

    // distance circle
    this.distCircle = new google.maps.Circle({
      fillColor: "#005BB7",
      strokeOpacity: 0,
      strokeWeight: 0,
      fillOpacity: 1,
      map: map,
      radius: 10
    });

    // distance VM
    this.distanceVM = DistanceVM();

    this.from = null;
    this.to = null;
  }
  extend(Directions.prototype, {
    update: function(from, to) {
      console.log('Directions#update');
      this.from = from;
      this.to = to;
      var opt = {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.WALKING
      };
      this.clear();

      // create route renderer
      this.display = new google.maps.DirectionsRenderer(renderOpt);
      this.display.setMap(this.map);

      this.service.route(opt, $.proxy(this.onRouteSuccess, this));
    },
    onRouteSuccess: function(result, status) {
      console.log('Directions#success');
      if (status == google.maps.DirectionsStatus.OK) {
        this.display.setDirections(result);
        var pos = this.fromLatLngToPixel(this.to);
        var leg = result.routes[0].legs[0];
        var dur = leg.duration.text;
        var dist = leg.distance.value > 999 ? leg.distance.text : leg.distance.value + ' m';
        this.distanceVM.show();
        this.distanceVM.update(pos.x, pos.y, dur, dist);
        $(window).trigger('onDirectionsFind');
      } else {
        $(window).trigger('onNoDirectionsFind');
      }
    },
    clear: function() {
      console.log('Directions#clear');
      if (this.display != null) {
        this.display.setMap(null);
        this.display = null;
      }
      this.distanceVM.hide();
    },
    fromLatLngToPixel: function (position) {
      // via http://stackoverflow.com/questions/1538681/how-to-call-fromlatlngtodivpixel-in-google-maps-api-v3
      var scale = Math.pow(2, this.map.getZoom());
      var proj = this.map.getProjection();
      var bounds = this.map.getBounds();

      var nw = proj.fromLatLngToPoint(
        new google.maps.LatLng(
          bounds.getNorthEast().lat(),
          bounds.getSouthWest().lng()
        )
      );
      var point = proj.fromLatLngToPoint(position);

      return new google.maps.Point(
        Math.floor((point.x - nw.x) * scale),
        Math.floor((point.y - nw.y) * scale)
      );
    }
  });
  
  return Directions;
});
