var defaultMapOptions = {
  zoom:      12,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};

map5 = new google.maps.Map($('#map-5')[0], defaultMapOptions);

// for more about 'myip' see http://l2.io/
$.get('http://freegeoip.net/json/' + myip, function(response) {
    setup_map(map5, response.latitude, response.longitude)
}, 'jsonp');

var places = [
  'Красноярск, проспект Мира, 54',
  'Красноярск, проспект Мира, 85',
  'Красноярск, ул. Карла Маркса, 135',
];

for (var i = 0; i < places.length; ++i) {
    $.get('http://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + places[i], function(success) {
        var point  =  success
                        .response
                        .GeoObjectCollection
                        .featureMember[0]
                        .GeoObject
                        .Point
                        .pos
                        .split(' '),
            latlng = new google.maps.LatLng(point[1], point[0]);
        

        new google.maps.Marker({
          position: latlng,
          map:      map5
        });
        
    }, 'jsonp');
};

function setup_map (map, latitude, longitude) {
  var latlng = new google.maps.LatLng(latitude, longitude),
      bluePinImage  = new google.maps.MarkerImage('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');

    map.setCenter(latlng);
    

    new google.maps.Marker({
      position: latlng,
      icon:     bluePinImage,
      map:      map
    });
};