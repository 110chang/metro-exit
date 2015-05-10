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
  'app/poi',
  'app/directions'
], function(ko, extend, ConditionVM, POIVM, Directions) {

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
    this.elevIcon = {
      url: '../img/ico_elev.png',
      scaledSize : new google.maps.Size(22, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(11, 40)
    };

    // initialize map
    this.map = new google.maps.Map(this.$el.get(0), {
      zoom: 14,
      center: this.center,
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

    // initialize direction service
    this.directions = new Directions(this.map);

    google.maps.event.addListener(this.map, "center_changed", $.proxy(this.onCenterChanged, this));
  }
  extend(Map.prototype, {
    onCenterChanged: function() {
      console.log('map dragged');
      this.directions.clear();
    },
    latLng: function(lat, lng) {
      //console.log('Map#latLng');
      return new google.maps.LatLng(lat, lng);
    },
    createMarker: function(latLng, title, content, icon) {
      //console.log('Map#createMarker');
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
      var _self = this;

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
        google.maps.event.addListener(marker, 'click', function() {
          _self.findRoute(this.getPosition());
        });
      }
      return marker;
    },
    createInfoContent: function(lat, lng, title) {
      //console.log('Map#createInfoContent');
      var content = '';
      content += title;
      return content;
    },
    findRoute: function(to) {
      console.log('Map#findRoute');
      this.directions.update(this.center, to);
    },
    update: function(points) {
      console.log('Map#update');
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
        var title = p.title();
        var icon = this.exitIcon;
        var content = this.createInfoContent(p.lat(), p.lon(), title);

        // エレベーター判定
        if (/エレベーター?/.test(title)) {
          icon = this.elevIcon;
        }
        this.markers.push(this.createMarker(latLng, title, content, icon));
        bounds.extend(latLng);
      }, this);

      // update range circle
      this.rangeCircle.setCenter(this.center);
      this.rangeCircle.setRadius(ConditionVM().radius() * 1);

      //this.map.fitBounds(this.rangeCircle.getBounds());
      this.map.fitBounds(bounds);
    }
  });
  
  return Map;
});
