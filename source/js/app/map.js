/*
*
*   Map
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

  function Map(qID) {
    this.$el = $(qID);

    // set center;
    this.center = this.latLng(ConditionVM().lat(), ConditionVM().lon());

    // merker array
    this.markers = new google.maps.MVCArray();

    // custom icons
    this.exitIcon = {
      url: '../img/ico_exit.png',
      scaledSize : new google.maps.Size(22, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(11, 40)
    };

    // initialize map
    this.map = new google.maps.Map(this.$el.get(0), {
      zoom: 14,
      center: this.center,
      panControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      }
    });

    // initialize range circle
    this.rangeCircle = new google.maps.Circle({
      strokeColor: "#005BB7",
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillOpacity: 0,
      map: this.map,
      center: this.center,
      radius: ConditionVM().radius() * 1
    });
  }
  extend(Map.prototype, {
    latLng: function(lat, lng) {
      return new google.maps.LatLng(lat, lng);
    },
    createMarker: function(latLng, title, content, icon) {
      // create marker option
      var opt = {
        position: latLng,
        map: this.map,
        title: title
      };
      if (icon) {
        opt.icon = icon;
      }

      // create marker
      var marker = new google.maps.Marker(opt);

      // create infowindow if specified content
      if (content) {
        var infoWindow = new google.maps.InfoWindow({
          content: content
        });
        google.maps.event.addListener(marker, 'mouseover', function() {
          infoWindow.open(this.map, marker);
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
          infoWindow.close(this.map, marker);
        });
      }
      return marker;
    },
    update: function(points) {
      // remove existing markers
      this.markers.forEach(function(marker, i) {
        google.maps.event.clearListeners(marker, 'mouseover');
        google.maps.event.clearListeners(marker, 'mouseout');
        marker.setMap(null);
      });
      // set center
      this.center = this.latLng(ConditionVM().lat(), ConditionVM().lon());
      this.map.panTo(this.center);
      
      // create center marker
      this.markers.push(this.createMarker(this.center, ConditionVM().address(), ConditionVM().address()));

      // initialize bounds
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(this.center);

      // operation each POI
      points.forEach(function(p) {
        var latLng = this.latLng(p.lat(), p.lon());
        this.markers.push(this.createMarker(latLng, p.title(), p.title(), this.exitIcon));
        bounds.extend(latLng);
      }, this);

      this.rangeCircle.setCenter(this.center);
      this.rangeCircle.setRadius(ConditionVM().radius() * 1);

      //this.map.fitBounds(this.rangeCircle.getBounds());
      this.map.fitBounds(bounds);
    }
  });
  
  return Map;
});
