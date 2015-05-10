var myMap;
var myLocationMarkers;
var myDirectionsService;
var myDirectionsRenderer;
var myRequestedTravelMode;
var msgNotFound = '見つかりません';
$(document).ready(function() {
    hideMoveToList();
    $("#place").keypress(function(e) {
        if (e.keyCode == 13) {
            mapMoveTo()
        }
    });
    $("#placeGo").click(mapMoveTo);
    $('html').click(function() {
        hideMoveToList()
    });
    myDirectionsService = new google.maps.DirectionsService();
    myLocationMarkers = new Array();
    myDirectionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true
    });
    $('#journey-km').css('text-align', 'right');
    $('#distance-km').css('text-align', 'right');
    $('#allClear').click(init);
    $('#fitBounds').click(function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i in myLocationMarkers) {
            bounds.extend(myLocationMarkers[i].getPosition())
        }
        if (!bounds.isEmpty()) {
            myMap.fitBounds(bounds)
        }
    });
    $('#showURL').click(function() {
        var data = '?z=' + myMap.getZoom() + '&pos=' + myMap.getCenter().toUrlValue();
        if (myLocationMarkers.length > 0) {
            var wps = new Array();
            for (var i in myLocationMarkers) {
                wps.push(myLocationMarkers[i].getPosition())
            }
            data += '&wp=' + encodeURIComponent(google.maps.geometry.encoding.encodePath(wps))
        }
        data += '&tm=' + myRequestedTravelMode;
        $('#url').val(location.protocol + '//' + location.host + location.pathname + data);
        $('#shorturl').val('取得中…');
        if ($('#url').val().length < 2048) {
            $.ajax({
                type: "POST",
                url: "s.cgi",
                data: {
                    longUrl: $("#url").val()
                },
                dataType: "json",
                success: function(obj) {
                    if (obj.id) {
                        $('#shorturl').val(obj.id)
                    }
                },
                error: function() {
                    $('#shorturl').val('取得できませんでした。')
                }
            })
        } else {
            $('#shorturl').val('goo.glで短縮できません')
        }
    });
    $('#go').click(function() {
        if ($('#url').val().length > 0) {
            window.open($('#url').val())
        }
    });
    init()
});
$(window).load(function() {
    var mPos = new Array();
    var param = new Array();
    var x = window.location.search.substring(1);
    var xx = x.split('&');
    var items = new Array();
    for (var i in xx) {
        var vals = xx[i].split('=', 2);
        if (vals[0] == 'm') {
            var latlng = vals[1].split(',');
            if (latlng[0].match(/^-?\d+\.?\d*$/) && latlng[1].match(/^-?\d+\.?\d*$/)) {
                mPos.push(new google.maps.LatLng(latlng[0], latlng[1]))
            }
        } else {
            param[vals[0]] = vals[1]
        }
    }
    delete xx;
    delete x;
    delete i;
    if ('z' in param) {
        param.z = parseInt(param.z);
        if ((param.z < 0)) {
            param.z = 1
        }
    } else {
        param.z = 12
    }
    if ('tm' in param) {
        if (param.tm != $('#TravelMode').val()) {
            $('#TravelMode').val(param.tm)
        }
    }
    if ('wp' in param) {
        var wps = google.maps.geometry.encoding.decodePath(decodeURIComponent(param.wp));
        for (var i in wps) {
            mPos.push(wps[i])
        }
    } {
        var latlng = new Array();
        if ('pos' in param) {
            latlng = param.pos.split(',')
        } else {
            latlng[1] = latlng[0] = ''
        }
        param.pos = (latlng[0].match(/^-?\d+\.?\d*$/) && latlng[1].match(/^-?\d+\.?\d*$/)) ? new google.maps.LatLng(latlng[0], latlng[1]) : new google.maps.LatLng(35.68, 139.76)
    }
    myMap = new google.maps.Map(document.getElementById('map'), {
        zoom: param.z,
        center: param.pos,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true,
        mapTypeControl: true,
        navigationControlOptions: true,
        scaleControl: true
    });
    google.maps.event.addListener(myMap, 'click', function(mouseEvent) {
        myLocationMarkers.push(new classLocationMarker(mouseEvent.latLng));
        reRender()
    });
    for (var i in mPos) {
        myLocationMarkers.push(new classLocationMarker(mPos[i]))
    }
    myRequestedTravelMode = $('#TravelMode').val();
    reRender()
});

function init() {
    for (var i in myLocationMarkers) {
        myLocationMarkers[i].setMap(null);
        delete myLocationMarkers[i]
    }
    $('#journey-m').val('');
    $('#journey-km').val('');
    $('#distance-m').val('');
    $('#distance-km').val('');
    $('#TravelMode').val('WALKING');
    reRender()
}

function reRender() {
    var posWayPoints = new Array();
    for (var i in myLocationMarkers) {
        posWayPoints.push({
            location: myLocationMarkers[i].getPosition(),
            stopover: false
        })
    }
    if (posWayPoints.length < 2) {
        myDirectionsRenderer.setMap(null);
        return
    }
    var posOrigin = (posWayPoints.shift()).location;
    var posDistination = (posWayPoints.pop()).location;
    myDirectionsService.route({
        origin: posOrigin,
        destination: posDistination,
        waypoints: posWayPoints,
        travelMode: $('#TravelMode').val() == 'WALKING' ? google.maps.DirectionsTravelMode.WALKING : google.maps.DirectionsTravelMode.DRIVING,
        avoidTolls: $('#TravelMode').val().indexOf('avoidTolls') < 0 ? false : true
    }, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            myDirectionsRenderer.setMap(myMap);
            myDirectionsRenderer.setDirections(result);
            var journey = 0;
            for (var i in result.routes[0].legs) {
                journey += result.routes[0].legs[i].distance.value
            }
            $('#journey-m').val(journey % 1000);
            $('#journey-km').val(Math.floor(journey / 1000));
            var distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(posOrigin, posDistination));
            $('#distance-m').val(distance % 1000);
            $('#distance-km').val(Math.floor(distance / 1000));
            myRequestedTravelMode = $('#TravelMode').val()
        }
    })
}

function classLocationMarker(pos) {
    var locationMarker = new google.maps.Marker({
        position: pos,
        map: myMap,
        draggable: true
    });
    var infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(locationMarker, 'dragend', function(mouseEvent) {
        reRender()
    });
    google.maps.event.addListener(locationMarker, 'rightclick', function(mouseEvent) {
        locationMarker.setMap(null);
        for (var i in myLocationMarkers) {
            if (myLocationMarkers[i].getMarker() == locationMarker) {
                delete myLocationMarkers[i]
            }
        }
        reRender()
    });
    this.setMap = function(state) {
        locationMarker.setMap(state)
    };
    this.getMarker = function() {
        return locationMarker
    };
    this.getPosition = function() {
        return locationMarker.getPosition()
    }
}

function mapMoveTo() {
    hideMoveToList();
    new google.maps.Geocoder().geocode({
        address: $('#place').val()
    }, function(results, status) {
        if ((status != google.maps.GeocoderStatus.OK) || (results.length == 0)) {
            alert(msgNotFound + ": " + status)
        } else {
            if (results.length > 1) {
                for (var i in results) {
                    var address = results[i].formatted_address;
                    if (address.match(/^日本,(.*)/)) {
                        address = RegExp.$1
                    }
                    $('#moveToList_in').append('<div class="results" title="' + results[i].geometry.location.lat() + ',' + results[i].geometry.location.lng() + '">' + address + '</div>');
                    $("#moveToList_in > *:last").hover(function() {
                        $(this).css("cursor", "pointer")
                    }, function() {
                        $(this).css("cursor", "default")
                    });
                    $('#moveToList_in > *:last').click(function() {
                        var ll = $(this).attr('title').split(/,/);
                        myMap.setCenter(new google.maps.LatLng(ll[0], ll[1]));
                        myMap.setZoom(12);
                        hideMoveToList()
                    })
                }
                $('#moveToList_in > *:odd').css('background-color', '#cfc');
                $('#moveToList').css('top', $('#map').offset().top + (parseInt($('#map').css('height')) - parseInt($('#moveToList').css('height'))));
                $('#moveToList').css('left', $('#map').offset().left + (parseInt($('#map').css('width')) - parseInt($('#moveToList').css('width'))));
                $('#moveToList').fadeIn()
            } else {
                myMap.setCenter(results[0].geometry.location);
                if (myMap.getZoom() < 12) {
                    myMap.setZoom(12)
                }
            }
        }
    })
}

function hideMoveToList() {
    $('#moveToList_in').empty();
    $('#moveToList').hide()
}
;
