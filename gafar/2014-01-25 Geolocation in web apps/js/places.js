var defaultMapOptions = {
  zoom:      12,
  center:    new google.maps.LatLng(56.0167, 93.0667),
  mapTypeId: google.maps.MapTypeId.ROADMAP
};

map4 = new google.maps.Map($('#map-4')[0], defaultMapOptions);

var places = [
  'Красноярск, проспект Мира, 54',
  'Красноярск, проспект Мира, 85',
  'Красноярск, ул. Карла Маркса, 135',
  'Красноярск, улица 78 Добровольческой бригады, 28'
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
        
        map4.setZoom(11);

        new google.maps.Marker({
          position: latlng,
          map:      map4
        });
        
    }, 'jsonp');
};