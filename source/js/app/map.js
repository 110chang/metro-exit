/*
*
*   Map
*
*   @author Yuji Ito @110chang
*
*/

define([
  'mod/extend',
  'app/config',
  'app/condition',
  'app/markerfactory',
  'app/directions'
], function(extend, CFG, ConditionVM, MarkerFactory, Directions) {
  var markerFactory;

  function latLng(lat, lng) {
    return new google.maps.LatLng(lat, lng);
  }

  function Map(qID) {
    this.$el = $(qID);

    // set center;
    this.center = latLng(ConditionVM().lat(), ConditionVM().lon());

    // merker array
    this.markers = new google.maps.MVCArray();

    // initialize map
    this.map = new google.maps.Map(this.$el.get(0), {
      zoom: 14,
      center: this.center,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      // https://snazzymaps.com/style/39/paper
      //styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"},{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]}]
    });

    // show subway lines
    this.transitLayer = new google.maps.TransitLayer();
    this.transitLayer.setMap(this.map);

    // initialize range circle
    this.rangeCircle = new google.maps.Circle({
      strokeColor: CFG.color.key,
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0,
      map: this.map,
      center: this.center,
      radius: ConditionVM().radius() * 1
    });

    // initialize direction service
    this.directions = new Directions(this.map);

    markerFactory = new MarkerFactory(this.map);
    markerFactory.subscribe('markerClick', $.proxy(this.onMarkerClick, this));

    //google.maps.event.addListener(this.map, 'click', $.proxy(this.onClick, this));
    google.maps.event.addListener(this.map, 'center_changed', $.proxy(this.onCenterChanged, this));
  }
  extend(Map.prototype, {
    onCenterChanged: function() {
      //console.log('Map#onCenterChanged');
      //console.log('center changed');
      //this.clearRoute();
    },
    onClick: function(e) {
      //console.log('Map#onClick');
      //console.log(e.latLng);
    },
    onMarkerClick: function(e, data) {
      //console.log('Map#onMarkerClick');
      this.findRoute(data);
    },
    clearRoute: function() {
      //console.log('Map#clearRoute');
      this.directions.clear();
    },
    createInfoContent: function(latLng, title) {
      //console.log('Map#createInfoContent');
      var content = '';
      content += title;
      return content;
    },
    findRoute: function(to) {
      //console.log('Map#findRoute');
      this.directions.update(this.center, to);
    },
    update: function(points) {
      //console.log('Map#update');
      points = points || [];
      this.clearRoute();
      // remove existing markers
      this.markers.forEach(function(marker, i) {
        google.maps.event.clearListeners(marker, 'mouseover');
        google.maps.event.clearListeners(marker, 'mouseout');
        marker.setMap(null);
      });
      // set center
      this.center = latLng(ConditionVM().lat(), ConditionVM().lon());
      this.map.panTo(this.center);
      
      // create center marker
      this.markers.push(markerFactory.create('center', this.center, ConditionVM().address(), ConditionVM().address()));

      // initialize bounds
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(this.center);

      // operation each POI
      points.forEach(function(p) {
        var title = p.title;
        var coords = latLng(p.lat, p.lon);
        var type = /エレベーター?/.test(title) ? 'elevator' : 'normal';// エレベーター判定
        var content = this.createInfoContent(coords, title);

        this.markers.push(markerFactory.create(type, coords, title, content));
        bounds.extend(coords);
      }, this);

      // update range circle
      this.rangeCircle.setCenter(this.center);
      this.rangeCircle.setRadius(ConditionVM().radius() * 1);

      //this.map.fitBounds(this.rangeCircle.getBounds());
      if (points.length === 0) {
        bounds = this.rangeCircle.getBounds();
      }
      this.map.fitBounds(bounds);
    }
  });
  
  return Map;
});
