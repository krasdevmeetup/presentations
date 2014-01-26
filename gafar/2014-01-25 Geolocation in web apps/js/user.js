var defaultLatLng = new google.maps.LatLng(56.0167, 93.0667);
var defaultMapOptions = {
  zoom:      16,
  center:    defaultLatLng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};



var map1 = new google.maps.Map($('#map-1')[0], defaultMapOptions);

navigator.geolocation.getCurrentPosition(function(position) {
    setup_map(map1, position.coords.latitude, position.coords.longitude)    
});



var map2 = new google.maps.Map($('#map-2')[0], defaultMapOptions);

// for more about 'myip' see http://l2.io/
$.get('http://freegeoip.net/json/' + myip, function(response) {
    setup_map(map2, response.latitude, response.longitude)
}, 'jsonp');



var map3 = new google.maps.Map($('#map-3')[0], defaultMapOptions);
new google.maps.Marker({position: defaultLatLng, map: map3});

$('#cities-selector').on('change', function() {
    var value = this.value.split(',');
    setup_map(map3, value[0], value[1])
});


function setup_map (map, latitude, longitude) {
	var latlng = new google.maps.LatLng(latitude, longitude);

    map.setCenter(latlng);

    new google.maps.Marker({
    	position: latlng,
    	map:      map
    });
};