
var map;

function initMap() 
{
    //alert(Object.entries(addtionalSpots).length === 0);
    var towsonu = new google.maps.LatLng(39.3938317, -76.6074833);
    
    var mapOptions = {
        center: towsonu,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

}

var normal = "redfeather.png";
var starred = "goldfeather.png";

function addMarker(resturant, type) {
    //var image = 'img/flagred.png';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(resturant.lat, resturant.lon),
        // position: neighborhoods[iterator],
        map: map,
        icon: {                             
            url: type                      
        },
        title:resturant.name,
        // title:"Hello World!",
        draggable: false,
        animation: google.maps.Animation.DROP,
        visible: true
    });
    //markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        // your magic goes here
        //alert(marker.title);
        map.setCenter(marker.getPosition());
        // map.setZoom(18);
        smoothZoom(map, 18, map.getZoom()); // call smoothZoom, parameters map, final zoomLevel, and starting zoom level
        document.getElementById("term").value = resturant.name;
        document.getElementById("location").value = resturant.loc;
        // $scope.zoom();
        angular.element(document.getElementById('peace')).scope().zoom(type);
    });

    marker.setMap(map);

}


// the smooth zoom function
function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}  