/*
*
*   MarkerFactory
*
*   @author Yuji Ito @110chang
*
*/

define([
  'mod/extend',
  'mod/inherit',
  'mod/pubsub',
  'app/condition'
], function(extend, inherit, PubSub, ConditionVM) {
  var exitIcon = {
    url: '../img/ico_exit.png',
    scaledSize : new google.maps.Size(22, 40),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(11, 40)
  };
  var elevIcon = {
    url: '../img/ico_elev.png',
    scaledSize : new google.maps.Size(22, 40),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(11, 40)
  };
  var options = {
    normal: {
      name: 'normal',
      icon: exitIcon
    },
    elevator: {
      name: 'elevator',
      icon: elevIcon
    },
    center: {
      name: 'center'
    }
  };
  function MarkerFactory(map) {
    if (!(this instanceof MarkerFactory)) {
      return new MarkerFactory(map);
    }
    PubSub.call(this);

    this.map = map;
  }
  inherit(MarkerFactory, PubSub);
  extend(MarkerFactory.prototype, {
    create: function(/* [type, ]latLng, title, content */) {
      var type = 'normal';
      if (typeof arguments[0] === 'string') {
        type = Array.prototype.shift.call(arguments);
      }
      var latLng = arguments[0];
      var title = arguments[1];
      var content = arguments[2];
      var draggable = false;
      if (type === 'center') {
        draggable = true;
      }
      // create marker option
      var opt = $.extend(options[type], {
        position: latLng,
        map: this.map,
        title: title,
        draggable: draggable
      });

      // create marker
      var marker = new google.maps.Marker(opt);
      var _self = this;

      // create infowindow if specified content
      if (content) {
        var infoWindow = new google.maps.InfoWindow({
          content: content
        });
        if (draggable) {
          google.maps.event.addListener(marker, 'dragend', function(e) {
            //this.map.setCenter(e.latLng);
            ConditionVM().setLatLng(e.latLng.lat(), e.latLng.lng());
          });
        } else {
          google.maps.event.addListener(marker, 'mouseover', function() {
            infoWindow.open(this.map, marker);
          });
          google.maps.event.addListener(marker, 'mouseout', function() {
            infoWindow.close(this.map, marker);
          });
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(this.map, marker);
            _self.publish('markerClick', this.getPosition());
          });
        }
      }
      return marker;
    }  
  });

  return MarkerFactory;
});
